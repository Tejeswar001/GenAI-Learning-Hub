import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore"

// Types
export type ChatMessage = {
  id?: string
  userId: string
  content: string
  role: "user" | "assistant"
  timestamp: Timestamp | Date
}

export type ChatSession = {
  id?: string
  userId: string
  title: string
  lastMessage: string
  timestamp: Timestamp | Date
  messageCount: number
}

export type GeneratedVideo = {
  id?: string
  userId: string
  title: string
  script: string
  images: string[]
  videoUrl: string
  timestamp: Timestamp | Date
}

export type UserStats = {
  totalChatSessions: number
  totalVideosGenerated: number
  lastActive: Timestamp | Date
}

// Chat functions
export async function createChatSession(userId: string, title: string): Promise<string> {
  try {
    const chatSessionRef = await addDoc(collection(db, "chatSessions"), {
      userId,
      title,
      lastMessage: "",
      timestamp: serverTimestamp(),
      messageCount: 0,
    })
    return chatSessionRef.id
  } catch (error) {
    console.error("Firestore error creating chat session:", error)
    // Return a local fallback ID
    return `local-${Date.now()}`
  }
}

export async function addChatMessage(
  sessionId: string,
  message: Omit<ChatMessage, "id" | "timestamp">,
): Promise<string> {
  try {
    // Add the message
    const messageRef = await addDoc(collection(db, "chatMessages"), {
      ...message,
      sessionId, // Make sure sessionId is included
      timestamp: serverTimestamp(),
    })

    // Update the session with last message and count
    if (!sessionId.startsWith("local-")) {
      // Only try to update if it's a real Firestore session
      try {
        const sessionRef = doc(db, "chatSessions", sessionId)
        const sessionDoc = await getDoc(sessionRef)

        if (sessionDoc.exists()) {
          await setDoc(
            sessionRef,
            {
              lastMessage: message.content,
              timestamp: serverTimestamp(),
              messageCount: (sessionDoc.data().messageCount || 0) + 1,
            },
            { merge: true },
          )
        }
      } catch (sessionError) {
        console.error("Error updating session data:", sessionError)
        // Continue even if session update fails
      }
    }

    return messageRef.id
  } catch (error) {
    console.error("Firestore error adding chat message:", error)
    // Return a local fallback ID
    return `local-msg-${Date.now()}`
  }
}

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const q = query(
    collection(db, "chatSessions"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(10),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ChatSession, "id">),
  }))
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const q = query(collection(db, "chatMessages"), where("sessionId", "==", sessionId), orderBy("timestamp", "asc"))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<ChatMessage, "id">),
  }))
}

// Video functions
export async function saveGeneratedVideo(video: Omit<GeneratedVideo, "id" | "timestamp">): Promise<string> {
  const videoRef = await addDoc(collection(db, "generatedVideos"), {
    ...video,
    timestamp: serverTimestamp(),
  })
  return videoRef.id
}

export async function getGeneratedVideos(userId: string): Promise<GeneratedVideo[]> {
  const q = query(
    collection(db, "generatedVideos"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc"),
    limit(10),
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<GeneratedVideo, "id">),
  }))
}

// User stats functions
export async function updateUserStats(userId: string, stats: Partial<UserStats>): Promise<void> {
  const userStatsRef = doc(db, "userStats", userId)
  const userStatsDoc = await getDoc(userStatsRef)

  if (userStatsDoc.exists()) {
    await setDoc(
      userStatsRef,
      {
        ...stats,
        lastActive: serverTimestamp(),
      },
      { merge: true },
    )
  } else {
    await setDoc(userStatsRef, {
      userId,
      totalChatSessions: stats.totalChatSessions || 0,
      totalVideosGenerated: stats.totalVideosGenerated || 0,
      lastActive: serverTimestamp(),
    })
  }
}

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const userStatsRef = doc(db, "userStats", userId)
  const userStatsDoc = await getDoc(userStatsRef)

  if (userStatsDoc.exists()) {
    return userStatsDoc.data() as UserStats
  }

  return null
}

// Helper function to increment specific stat
export async function incrementUserStat(
  userId: string,
  statName: "totalChatSessions" | "totalVideosGenerated",
): Promise<void> {
  try {
    const userStatsRef = doc(db, "userStats", userId)
    const userStatsDoc = await getDoc(userStatsRef)

    if (userStatsDoc.exists()) {
      const currentValue = userStatsDoc.data()[statName] || 0
      await setDoc(
        userStatsRef,
        {
          [statName]: currentValue + 1,
          lastActive: serverTimestamp(),
        },
        { merge: true },
      )
    } else {
      await setDoc(userStatsRef, {
        userId,
        [statName]: 1,
        lastActive: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error(`Error incrementing ${statName}:`, error)
    // Silently fail but log the error
  }
}

