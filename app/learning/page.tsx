"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Search, Star } from "lucide-react"
import { motion } from "framer-motion"

// Mock data for courses
const courses = [
  {
    id: "ai-fundamentals",
    title: "AI Fundamentals",
    description: "Learn the basics of artificial intelligence and machine learning",
    category: "AI & Machine Learning",
    level: "Beginner",
    duration: "4 hours",
    rating: 4.8,
    students: 1245,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "deep-learning",
    title: "Deep Learning Masterclass",
    description: "Advanced techniques in neural networks and deep learning",
    category: "AI & Machine Learning",
    level: "Advanced",
    duration: "8 hours",
    rating: 4.9,
    students: 892,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "nlp-intro",
    title: "Introduction to NLP",
    description: "Natural Language Processing fundamentals and applications",
    category: "AI & Machine Learning",
    level: "Intermediate",
    duration: "6 hours",
    rating: 4.7,
    students: 756,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "computer-vision",
    title: "Computer Vision Applications",
    description: "Learn to build applications that can see and understand images",
    category: "AI & Machine Learning",
    level: "Intermediate",
    duration: "7 hours",
    rating: 4.6,
    students: 623,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "data-science",
    title: "Data Science Essentials",
    description: "Master the fundamentals of data analysis and visualization",
    category: "Data Science",
    level: "Beginner",
    duration: "5 hours",
    rating: 4.5,
    students: 1089,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "reinforcement-learning",
    title: "Reinforcement Learning",
    description: "Explore the world of autonomous decision-making algorithms",
    category: "AI & Machine Learning",
    level: "Advanced",
    duration: "9 hours",
    rating: 4.9,
    students: 412,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function LearningPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter courses based on search query and category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || course.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Learning Modules</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ai">AI & ML</TabsTrigger>
            <TabsTrigger value="data">Data Science</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

function CourseCard({ course }: { course: (typeof courses)[0] }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
          <Badge className="absolute top-2 right-2">{course.level}</Badge>
        </div>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Clock className="mr-1 h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <Star className="mr-1 h-4 w-4 fill-primary text-primary" />
            <span>
              {course.rating} ({course.students} students)
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href={`/learning/${course.id}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Start Learning
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

