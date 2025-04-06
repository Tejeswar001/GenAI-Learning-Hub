"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "./firebase"

type AuthContextType = {
  user: FirebaseUser | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      if (user) {
        // Set the auth cookie with the current token
        const token = await user.getIdToken()
        document.cookie = `firebase-auth-token=${token}; path=/; max-age=3600; SameSite=Strict`

        // Set up a timer to refresh the token every 55 minutes (token expires after 1 hour)
        const refreshTimer = setInterval(
          async () => {
            try {
              const newToken = await user.getIdToken(true)
              document.cookie = `firebase-auth-token=${newToken}; path=/; max-age=3600; SameSite=Strict`
            } catch (error) {
              console.error("Error refreshing token:", error)
            }
          },
          55 * 60 * 1000,
        ) // 55 minutes

        return () => clearInterval(refreshTimer)
      } else {
        // Remove the auth cookie if the user is not logged in
        document.cookie = "firebase-auth-token=; path=/; max-age=0; SameSite=Strict"
      }
    })

    return () => unsubscribe()
  }, [router])

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Set a cookie to indicate the user is logged in
      document.cookie = `firebase-auth-token=${await userCredential.user.getIdToken()}; path=/; max-age=3600; SameSite=Strict`
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      // Set a cookie to indicate the user is logged in
      document.cookie = `firebase-auth-token=${await userCredential.user.getIdToken()}; path=/; max-age=3600; SameSite=Strict`
      router.push("/dashboard")
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      // Remove the auth cookie
      document.cookie = "firebase-auth-token=; path=/; max-age=0; SameSite=Strict"
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

