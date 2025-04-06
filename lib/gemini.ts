export async function generateGeminiResponse(
    prompt: string,
    apiKey: string,
    systemPrompt = "You are an AI learning assistant..."
  ): Promise<string> {
    try {
      const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  
      const response = await fetch(`${url}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Gemini API error response:", data);
        throw new Error(data.error?.message || "Gemini API call failed");
      }
  
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) throw new Error("No text returned from Gemini API");
  
      return generatedText;
    } catch (error: any) {
      console.error("Gemini API call failed:", error);
      throw new Error("Failed to generate response from Gemini API.");
    }
  }
  