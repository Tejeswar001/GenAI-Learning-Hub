"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type GeminiApiContextType = {
  apiKey: string | null
  setApiKey: (key: string) => void
  hasApiKey: boolean
}

const GeminiApiContext = createContext<GeminiApiContextType | null>(null)

export function GeminiApiProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null)

  // Check for stored API key in localStorage on initial load
  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key")
    if (storedKey) {
      setApiKey(storedKey)
    }
  }, [])

  // Store API key in localStorage when it changes
  const handleSetApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem("gemini-api-key", key)
  }

  return (
    <GeminiApiContext.Provider
      value={{
        apiKey,
        setApiKey: handleSetApiKey,
        hasApiKey: !!apiKey,
      }}
    >
      {children}
    </GeminiApiContext.Provider>
  )
}

export function useGeminiApi() {
  const context = useContext(GeminiApiContext)
  if (!context) {
    throw new Error("useGeminiApi must be used within a GeminiApiProvider")
  }
  return context
}

