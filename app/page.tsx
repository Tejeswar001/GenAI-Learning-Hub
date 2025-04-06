"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, MessageSquare, Video } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to GenAI Learning Hub
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Revolutionize your learning experience with AI-powered tools and interactive courses
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/learning">Explore Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="AI Chatbot"
              description="Get instant answers to your questions with our advanced AI chatbot."
              href="/chatbot"
            />
            <FeatureCard
              icon={<Video className="h-10 w-10" />}
              title="Video Generator"
              description="Create educational videos on any topic with our AI video generator."
              href="/video-generator"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Learning Modules"
              description="Access a wide range of interactive courses and learning materials."
              href="/learning"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
      <div className="text-primary">{icon}</div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button variant="ghost" asChild>
        <Link href={href} className="flex items-center gap-1">
          Learn more <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </motion.div>
  )
}

