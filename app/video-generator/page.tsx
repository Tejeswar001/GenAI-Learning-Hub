"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-provider"
import { useGeminiApi } from "@/lib/gemini-api-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Info, Loader2, Video } from "lucide-react"
import { motion } from "framer-motion"
import { GeminiApiKeyPrompt } from "@/components/gemini-api-key-prompt"
import { saveGeneratedVideo, incrementUserStat } from "@/lib/firestore"

type VideoGenerationState =
  | "idle"
  | "generating-script"
  | "generating-images"
  | "generating-video"
  | "complete"
  | "error"

type VideoData = {
  topic: string
  script: string
  images: string[]
  videoUrl: string
}

export default function VideoGeneratorPage() {
  const { user, loading } = useAuth()
  const { hasApiKey } = useGeminiApi()
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [generationState, setGenerationState] = useState<VideoGenerationState>("idle")
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, loading, router])

  const handleGenerateVideo = async () => {
    if (!topic.trim() || !user) return

    setError(null)
    setGenerationState("generating-script")

    try {
      // Step 1: Generate script
      // TODO: Replace with actual Gemini API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const script = generateMockScript(topic)
      setVideoData({
        topic,
        script,
        images: [],
        videoUrl: "",
      })

      // Step 2: Generate images
      setGenerationState("generating-images")
      // TODO: Replace with actual image generation API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const images = generateMockImages()
      setVideoData((prev) => (prev ? { ...prev, images } : null))

      // Step 3: Generate video
      setGenerationState("generating-video")
      // TODO: Replace with actual video generation API call
      await new Promise((resolve) => setTimeout(resolve, 4000))

      // Final video
      const videoUrl = "/placeholder.svg?height=720&width=1280"
      setVideoData((prev) => (prev ? { ...prev, videoUrl } : null))

      setGenerationState("complete")

      // Save to Firestore - but continue even if it fails
      if (videoData) {
        try {
          await saveGeneratedVideo({
            userId: user.uid,
            title: topic,
            script,
            images,
            videoUrl,
          })

          // Increment user's video count
          await incrementUserStat(user.uid, "totalVideosGenerated")
        } catch (firestoreError) {
          console.error("Error saving to Firestore:", firestoreError)
          // Continue with local functionality even if Firestore fails
        }
      }
    } catch (error) {
      console.error("Error generating video:", error)
      setError("An error occurred while generating your video. Please try again.")
      setGenerationState("error")
    }
  }

  // Mock functions to simulate AI generation
  const generateMockScript = (topic: string): string => {
    const scripts = {
      ai: "Welcome to this educational video about Artificial Intelligence. AI is a branch of computer science that aims to create systems capable of performing tasks that would normally require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. In this video, we'll explore the fundamentals of AI, its applications, and its impact on society.",
      programming:
        "In this video, we'll dive into the world of programming. Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions can be written in various programming languages, each with its own syntax and capabilities. We'll cover the basics of programming concepts, popular languages, and how to get started on your coding journey.",
      history:
        "Today, we're exploring world history. History is the study of past events, particularly human affairs. It helps us understand how societies, cultures, and civilizations have evolved over time. In this video, we'll take a journey through key historical periods, significant events, and the people who shaped our world.",
      science:
        "Welcome to our science educational video. Science is the systematic study of the structure and behavior of the physical and natural world through observation and experiment. In this video, we'll explore fundamental scientific concepts, recent discoveries, and how science impacts our daily lives.",
      default: `In this educational video, we'll explore the fascinating topic of ${topic}. This subject has gained significant attention in recent years due to its impact on various fields. We'll cover the fundamental concepts, key developments, and practical applications that make ${topic} such an important area of study.`,
    }

    const lowerCaseTopic = topic.toLowerCase()
    if (lowerCaseTopic.includes("ai") || lowerCaseTopic.includes("artificial intelligence")) {
      return scripts.ai
    } else if (lowerCaseTopic.includes("programming") || lowerCaseTopic.includes("coding")) {
      return scripts.programming
    } else if (lowerCaseTopic.includes("history")) {
      return scripts.history
    } else if (lowerCaseTopic.includes("science")) {
      return scripts.science
    }
    return scripts.default
  }

  const generateMockImages = (): string[] => {
    return [
      "/placeholder.svg?height=480&width=640",
      "/placeholder.svg?height=480&width=640",
      "/placeholder.svg?height=480&width=640",
      "/placeholder.svg?height=480&width=640",
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show API key prompt if no API key is set
  if (!hasApiKey) {
    return <GeminiApiKeyPrompt />
  }

  return (
    <div className="container max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">AI Video Generator</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Educational Video</CardTitle>
          <CardDescription>Enter a topic and our AI will generate a complete educational video</CardDescription>
        </CardHeader>
        <CardContent>
          {generationState === "idle" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium mb-1">
                  Video Topic
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Artificial Intelligence, Climate Change, Quantum Physics"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How it works</AlertTitle>
                <AlertDescription>
                  Our AI will generate a script, create images, and compile them into an educational video based on your
                  topic.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {generationState !== "idle" && videoData && (
            <Tabs
              defaultValue={
                generationState === "generating-script"
                  ? "script"
                  : generationState === "generating-images"
                    ? "images"
                    : generationState === "generating-video" || generationState === "complete"
                      ? "video"
                      : "script"
              }
            >
              <TabsList className="mb-4">
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="images" disabled={generationState === "generating-script"}>
                  Images
                </TabsTrigger>
                <TabsTrigger
                  value="video"
                  disabled={generationState === "generating-script" || generationState === "generating-images"}
                >
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="script">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Generated Script</h3>
                    {generationState === "generating-script" ? (
                      <div className="h-40 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Textarea value={videoData.script} readOnly className="h-40 resize-none" />
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="images">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Generated Images</h3>
                  {generationState === "generating-images" ? (
                    <div className="h-40 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {videoData.images.map((image, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Generated image ${index + 1}`}
                            className="rounded-md w-full h-auto"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="video">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">Final Video</h3>
                  {generationState === "generating-video" ? (
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Compiling video...</p>
                      </div>
                    </div>
                  ) : generationState === "complete" ? (
                    <div>
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <img
                          src={videoData.videoUrl || "/placeholder.svg"}
                          alt="Generated video preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Video className="h-16 w-16 text-primary opacity-70" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Video
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {generationState === "error" && error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {generationState === "idle" || generationState === "error" ? (
            <Button onClick={handleGenerateVideo} disabled={!topic.trim()} className="w-full">
              Generate Video
            </Button>
          ) : generationState === "complete" ? (
            <Button
              onClick={() => {
                setGenerationState("idle")
                setVideoData(null)
                setTopic("")
              }}
              variant="outline"
              className="w-full"
            >
              Create Another Video
            </Button>
          ) : (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {generationState === "generating-script"
                ? "Generating Script..."
                : generationState === "generating-images"
                  ? "Generating Images..."
                  : "Compiling Video..."}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

