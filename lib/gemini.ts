import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!

const genAI = new GoogleGenerativeAI(apiKey)

export const generateGeminiText = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}
