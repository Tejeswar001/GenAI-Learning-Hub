"use client"

import type React from "react"

import { useState } from "react"
import { useGeminiApi } from "@/lib/gemini-api-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Key } from "lucide-react"

export function GeminiApiKeyPrompt() {
  const { setApiKey } = useGeminiApi()
  const [inputKey, setInputKey] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputKey.trim()) {
      setError("Please enter a valid API key")
      return
    }

    // Basic validation - Gemini API keys typically start with "AI" and are long
    if (!inputKey.startsWith("AI") || inputKey.length < 20) {
      setError("This doesn't look like a valid Gemini API key. Please check and try again.")
      return
    }

    setApiKey(inputKey)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Enter Gemini API Key
          </CardTitle>
          <CardDescription>
            To use the AI features, please enter your Gemini API key. This will be stored locally in your browser and
            not sent to our servers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                You can get a Gemini API key from the{" "}
                <a
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            <Button type="submit" className="w-full">
              Save API Key
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Your API key will only be stored in your browser's local storage.
        </CardFooter>
      </Card>
    </div>
  )
}

