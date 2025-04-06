"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, MessageSquare, Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getUserStats,
  getChatSessions,
  getGeneratedVideos,
  type ChatSession,
  type GeneratedVideo,
} from "@/lib/firestore"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalChatSessions: 0,
    totalVideosGenerated: 0,
  })
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
  const [savedVideos, setSavedVideos] = useState<GeneratedVideo[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      try {
        setIsLoading(true)

        // Fetch user stats
        try {
          const userStats = await getUserStats(user.uid)
          if (userStats) {
            setStats({
              totalChatSessions: userStats.totalChatSessions || 0,
              totalVideosGenerated: userStats.totalVideosGenerated || 0,
            })
          }
        } catch (statsError) {
          console.error("Error fetching user stats:", statsError)
          // Continue with default values
        }

        // Fetch chat history
        try {
          const sessions = await getChatSessions(user.uid)
          setChatHistory(sessions)
        } catch (chatError) {
          console.error("Error fetching chat sessions:", chatError)
          setChatHistory([])
        }

        // Fetch saved videos
        try {
          const videos = await getGeneratedVideos(user.uid)
          setSavedVideos(videos)
        } catch (videoError) {
          console.error("Error fetching videos:", videoError)
          setSavedVideos([])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email?.split("@")[0] || "User"}!</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatsCard
              title="Learning Progress"
              value={isLoading ? <Skeleton className="h-7 w-16" /> : "42%"}
              description="Average course completion"
              icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Chat Sessions"
              value={isLoading ? <Skeleton className="h-7 w-16" /> : stats.totalChatSessions.toString()}
              description="Total AI conversations"
              icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
            />
            <StatsCard
              title="Generated Videos"
              value={isLoading ? <Skeleton className="h-7 w-16" /> : stats.totalVideosGenerated.toString()}
              description="AI videos created"
              icon={<Video className="h-4 w-4 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Chat History</CardTitle>
                <CardDescription>Your latest AI conversations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : chatHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {chatHistory.map((chat) => (
                      <li key={chat.id} className="flex justify-between border-b pb-2">
                        <div className="flex items-center">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>{chat.title || "Chat Session"}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {chat.timestamp instanceof Date
                            ? chat.timestamp.toLocaleDateString()
                            : new Date(chat.timestamp.seconds * 1000).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No chat history yet. Start a conversation in the Chatbot section.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saved Videos</CardTitle>
                <CardDescription>Your generated AI videos</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : savedVideos.length > 0 ? (
                  <ul className="space-y-2">
                    {savedVideos.map((video) => (
                      <li key={video.id} className="flex justify-between border-b pb-2">
                        <div className="flex items-center">
                          <Video className="mr-2 h-4 w-4" />
                          <span>{video.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {video.timestamp instanceof Date
                            ? video.timestamp.toLocaleDateString()
                            : new Date(video.timestamp.seconds * 1000).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No videos generated yet. Create one in the Video Generator section.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mock courses data - would be fetched from Firestore in a real app */}
              {[
                { id: 1, title: "AI Fundamentals", progress: 75, totalLessons: 12, completedLessons: 9 },
                { id: 2, title: "Machine Learning in Practice", progress: 30, totalLessons: 10, completedLessons: 3 },
                { id: 3, title: "Natural Language Processing", progress: 10, totalLessons: 8, completedLessons: 1 },
              ].map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {course.completedLessons} of {course.totalLessons} lessons completed
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-2 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{course.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 w-full bg-secondary">
                      <div className="h-2 bg-primary" style={{ width: `${course.progress}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  <ActivityItem
                    icon={<BookOpen className="h-4 w-4" />}
                    title="Completed lesson"
                    description="Neural Networks Basics"
                    timestamp="Today at 10:30 AM"
                  />
                  <ActivityItem
                    icon={<MessageSquare className="h-4 w-4" />}
                    title="New chat session"
                    description="Discussed reinforcement learning concepts"
                    timestamp="Yesterday at 2:15 PM"
                  />
                  <ActivityItem
                    icon={<Video className="h-4 w-4" />}
                    title="Generated new video"
                    description="Introduction to Deep Learning"
                    timestamp="Apr 5, 2023 at 9:45 AM"
                  />
                  <ActivityItem
                    icon={<BookOpen className="h-4 w-4" />}
                    title="Started new course"
                    description="Natural Language Processing"
                    timestamp="Apr 3, 2023 at 11:20 AM"
                  />
                </ul>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: React.ReactNode
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="rounded-full bg-secondary p-2">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  icon,
  title,
  description,
  timestamp,
}: {
  icon: React.ReactNode
  title: string
  description: string
  timestamp: string
}) {
  return (
    <li className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="rounded-full bg-secondary p-2">{icon}</div>
      <div className="flex-1 space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-xs text-muted-foreground">{timestamp}</div>
    </li>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}

