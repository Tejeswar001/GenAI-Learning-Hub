"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, Play, Star, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/lib/auth-provider"

// Mock course data
const coursesData = {
  "ai-fundamentals": {
    title: "AI Fundamentals",
    description: "Learn the basics of artificial intelligence and machine learning",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 1245,
    duration: "4 hours",
    level: "Beginner",
    image: "/placeholder.svg?height=400&width=800",
    modules: [
      {
        title: "Introduction to AI",
        lessons: [
          { title: "What is Artificial Intelligence?", duration: "10 min", completed: true },
          { title: "History of AI", duration: "15 min", completed: true },
          { title: "Types of AI Systems", duration: "12 min", completed: false },
        ],
      },
      {
        title: "Machine Learning Basics",
        lessons: [
          { title: "Supervised Learning", duration: "18 min", completed: false },
          { title: "Unsupervised Learning", duration: "15 min", completed: false },
          { title: "Reinforcement Learning", duration: "20 min", completed: false },
        ],
      },
      {
        title: "Neural Networks",
        lessons: [
          { title: "Perceptrons and Neurons", duration: "14 min", completed: false },
          { title: "Activation Functions", duration: "12 min", completed: false },
          { title: "Backpropagation", duration: "22 min", completed: false },
        ],
      },
    ],
  },
  "deep-learning": {
    title: "Deep Learning Masterclass",
    description: "Advanced techniques in neural networks and deep learning",
    instructor: "Prof. Michael Chen",
    rating: 4.9,
    students: 892,
    duration: "8 hours",
    level: "Advanced",
    image: "/placeholder.svg?height=400&width=800",
    modules: [
      {
        title: "Advanced Neural Networks",
        lessons: [
          { title: "Convolutional Neural Networks", duration: "25 min", completed: false },
          { title: "Recurrent Neural Networks", duration: "22 min", completed: false },
          { title: "Transformers Architecture", duration: "30 min", completed: false },
        ],
      },
      {
        title: "Deep Learning Frameworks",
        lessons: [
          { title: "TensorFlow Deep Dive", duration: "28 min", completed: false },
          { title: "PyTorch Advanced Usage", duration: "26 min", completed: false },
          { title: "Model Deployment", duration: "20 min", completed: false },
        ],
      },
    ],
  },
  "nlp-intro": {
    title: "Introduction to NLP",
    description: "Natural Language Processing fundamentals and applications",
    instructor: "Dr. Emily Rodriguez",
    rating: 4.7,
    students: 756,
    duration: "6 hours",
    level: "Intermediate",
    image: "/placeholder.svg?height=400&width=800",
    modules: [
      {
        title: "Text Processing Fundamentals",
        lessons: [
          { title: "Tokenization and Stemming", duration: "15 min", completed: false },
          { title: "Part-of-Speech Tagging", duration: "18 min", completed: false },
          { title: "Named Entity Recognition", duration: "20 min", completed: false },
        ],
      },
      {
        title: "Language Models",
        lessons: [
          { title: "N-gram Models", duration: "16 min", completed: false },
          { title: "Word Embeddings", duration: "22 min", completed: false },
          { title: "Transformer-based Models", duration: "25 min", completed: false },
        ],
      },
    ],
  },
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading } = useAuth()
  const [activeLesson, setActiveLesson] = useState<null | { title: string; content: React.ReactNode }>(null)
  const [progress, setProgress] = useState(0)
  const courseId = params.courseId as string

  const course = coursesData[courseId as keyof typeof coursesData]

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/sign-in")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (course) {
      // Calculate progress
      let completedLessons = 0
      let totalLessons = 0

      course.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          totalLessons++
          if (lesson.completed) completedLessons++
        })
      })

      setProgress(totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0)
    }
  }, [course])

  if (!course) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Course not found</h1>
        <Button variant="outline" onClick={() => router.push("/learning")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    )
  }

  const startLesson = (moduleTitle: string, lesson: { title: string; duration: string }) => {
    setActiveLesson({
      title: lesson.title,
      content: (
        <div className="space-y-4">
          <div className="aspect-video bg-muted rounded-md overflow-hidden">
            <img
              src="/placeholder.svg?height=720&width=1280"
              alt="Video placeholder"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="h-16 w-16 text-primary opacity-70" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <p className="text-muted-foreground">Module: {moduleTitle}</p>
          <Separator />
          <div className="prose max-w-none">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
              nisl aliquam nisl, vel aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl
              aliquam nisl, vel aliquam nisl nisl sit amet nisl.
            </p>
            <h3>Key Concepts</h3>
            <ul>
              <li>Understanding the fundamental principles</li>
              <li>Applying theoretical knowledge to practical scenarios</li>
              <li>Analyzing results and drawing conclusions</li>
              <li>Implementing best practices in real-world applications</li>
            </ul>
            <p>
              Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl sit amet nisl. Sed
              euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, vel aliquam nisl nisl sit amet nisl.
            </p>
          </div>
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setActiveLesson(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
            <Button>
              Mark as Completed
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ),
    })
  }

  return (
    <div className="container py-8">
      <AnimatePresence mode="wait">
        {activeLesson ? (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeLesson.content}
          </motion.div>
        ) : (
          <motion.div
            key="course"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="outline" className="mb-6" onClick={() => router.push("/learning")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-muted-foreground mb-4">{course.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
                      <span>
                        {course.rating} ({course.students} students)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>

                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-auto rounded-lg mb-6"
                />

                <Tabs defaultValue="curriculum" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="curriculum" className="space-y-4">
                    {course.modules.map((module, moduleIndex) => (
                      <Card key={moduleIndex}>
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold mb-4">{module.title}</h3>
                          <ul className="space-y-3">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  {lesson.completed ? (
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                                  ) : (
                                    <Circle className="mr-2 h-4 w-4 text-muted-foreground" />
                                  )}
                                  <span>{lesson.title}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm text-muted-foreground mr-3">{lesson.duration}</span>
                                  <Button size="sm" onClick={() => startLesson(module.title, lesson)}>
                                    Start
                                  </Button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="overview">
                    <Card>
                      <CardContent className="p-6 prose max-w-none">
                        <h3>About this course</h3>
                        <p>
                          This comprehensive course will take you through all the essential concepts and techniques
                          needed to master {course.title}. Whether you're a beginner or looking to enhance your skills,
                          this course provides a structured learning path with practical examples and exercises.
                        </p>

                        <h3>What you'll learn</h3>
                        <ul>
                          <li>Understand the fundamental principles and concepts</li>
                          <li>Apply theoretical knowledge to solve real-world problems</li>
                          <li>Develop practical skills through hands-on exercises</li>
                          <li>Build your own projects using industry-standard tools and techniques</li>
                        </ul>

                        <h3>Prerequisites</h3>
                        <p>
                          {course.level === "Beginner"
                            ? "No prior knowledge required. This course is designed for beginners."
                            : course.level === "Intermediate"
                              ? "Basic understanding of the subject matter is recommended."
                              : "Advanced knowledge of the fundamentals is required."}
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="text-4xl font-bold mr-4">{course.rating}</div>
                          <div>
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(course.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                                  />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Based on {course.students} reviews</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Mock reviews */}
                          <div className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                  ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">John D.</span>
                            </div>
                            <p className="text-sm">
                              Excellent course! The content is well-structured and the instructor explains complex
                              concepts in a simple way.
                            </p>
                          </div>

                          <div className="border-b pb-4">
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {Array(4)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                  ))}
                                <Star className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <span className="ml-2 text-sm font-medium">Sarah M.</span>
                            </div>
                            <p className="text-sm">
                              Very informative and practical. I would have liked more exercises, but overall it's a
                              great course.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                  ))}
                              </div>
                              <span className="ml-2 text-sm font-medium">Michael T.</span>
                            </div>
                            <p className="text-sm">
                              This course exceeded my expectations. The instructor is knowledgeable and engaging. Highly
                              recommended!
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
                    <div className="space-y-4">
                      <Progress value={progress} className="h-2" />
                      <p className="text-sm text-center">{Math.round(progress)}% Complete</p>

                      <Button
                        className="w-full"
                        onClick={() => {
                          // Find the first incomplete lesson
                          for (const module of course.modules) {
                            for (const lesson of module.lessons) {
                              if (!lesson.completed) {
                                startLesson(module.title, lesson)
                                return
                              }
                            }
                          }
                          // If all lessons are completed, start the first one
                          if (course.modules[0]?.lessons[0]) {
                            startLesson(course.modules[0].title, course.modules[0].lessons[0])
                          }
                        }}
                      >
                        {progress > 0 ? "Continue Learning" : "Start Learning"}
                      </Button>

                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Total Duration:</span>
                          <span className="font-medium">{course.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Level:</span>
                          <span className="font-medium">{course.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Modules:</span>
                          <span className="font-medium">{course.modules.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lessons:</span>
                          <span className="font-medium">
                            {course.modules.reduce((acc, module) => acc + module.lessons.length, 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

