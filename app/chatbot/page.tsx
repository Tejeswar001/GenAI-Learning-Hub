"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-provider";
import { useGeminiApi } from "@/lib/gemini-api-provider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Send, Bot, User } from "lucide-react";
import { motion } from "framer-motion";
import { GeminiApiKeyPrompt } from "@/components/gemini-api-key-prompt";
import {
  addChatMessage,
  createChatSession,
  incrementUserStat,
} from "@/lib/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { text } from "stream/consumers";
//import { generateGeminiResponse } from "@/lib/gemini";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const suggestedPrompts = [
  "Explain neural networks in simple terms",
  "What are the applications of machine learning?",
  "How does natural language processing work?",
  "What's the difference between AI and machine learning?",
];

export default function ChatbotPage() {
  const { user, loading } = useAuth();
  const { hasApiKey } = useGeminiApi();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm your AI learning assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { apiKey } = useGeminiApi(); // Moved inside the component

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/auth/sign-in");
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Create a new chat session when the component mounts
    const initSession = async () => {
      if (user) {
        try {
          // Try to create a session in Firestore
          const newSessionId = await createChatSession(
            user.uid,
            "New Chat Session"
          );
          setSessionId(newSessionId);

          // Increment the user's chat session count
          await incrementUserStat(user.uid, "totalChatSessions");
        } catch (error) {
          console.error("Error creating chat session:", error);
          // Set a local fallback session ID if Firestore fails
          setSessionId(`local-${Date.now()}`);
        }
      }
    };

    if (user && !sessionId) {
      initSession();
    }
  }, [user, sessionId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update the handleSendMessage function to use the Gemini API
  const handleSendMessage = async (content: string = input) => {
    if (!content.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Try to save user message to Firestore, but continue even if it fails
      if (sessionId) {
        try {
          await addChatMessage(sessionId, {
            userId: user.uid,
            content,
            role: "user",
          });
        } catch (error) {
          console.error("Error saving message to Firestore:", error);
          // Continue with local functionality even if Firestore fails
        }
      }

      // Use the Gemini API to generate a response
      if (!apiKey) {
        throw new Error("API key not found");
      }

      // Call the Gemini API
      //const responseContent = await generateGeminiResponse(content, apiKey);
      // Initialize Gemini SDK (only once, ideally at the top of your file)
      // Initialize Gemini SDK
      const genAI = new GoogleGenerativeAI(apiKey);

      // Function to get Gemini response
      async function getGeminiResponse(content: string): Promise<string> {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const result = await model.generateContent(
            "output must only contain normal text and not bold **** or any also make it brief and short ,so now the question is" +
              content
          );
          const response = await result.response;
          const text = await response.text();
          return text || "No response from Gemini.";
        } catch (error) {
          console.error("Gemini API Error:", error);
          return "Error getting response from Gemini.";
        }
      }

      // Later in your code, when you need to get the response:
      const replyText = await getGeminiResponse(content); // <- this was missing

      // Use replyText in your message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: replyText,
        role: "assistant",
        timestamp: new Date(),
      };

      // Try to save assistant message to Firestore, but continue even if it fails
      if (sessionId) {
        try {
          await addChatMessage(sessionId, {
            userId: user.uid,
            content: replyText,
            role: "assistant",
          });
        } catch (error) {
          console.error("Error saving assistant message to Firestore:", error);
          // Continue with local functionality even if Firestore fails
        }
      }

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add an error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I encountered an error processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show API key prompt if no API key is set
  if (!hasApiKey) {
    return <GeminiApiKeyPrompt />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={user?.photoURL || ""} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <Card
                  className={`p-3 ${
                    message.role === "assistant"
                      ? "bg-secondary"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Card className="p-3 bg-secondary">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <div
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="h-2 w-2 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested prompts */}
      {messages.length <= 2 && (
        <div className="px-4 py-2">
          <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Button variant="outline" size="icon" disabled={isLoading}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
