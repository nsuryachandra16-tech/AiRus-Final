// Using the javascript_gemini blueprint
import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTutorResponse(
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  try {
    const systemPrompt = `You are a helpful and supportive AI tutor for college students. 
Your role is to:
- Help students understand concepts clearly and thoroughly
- Provide step-by-step explanations for complex topics
- Encourage critical thinking by asking guiding questions
- Offer study tips and learning strategies
- Be patient, encouraging, and supportive
- Explain concepts in simple terms before diving into technical details
- Use examples and analogies to make concepts relatable

Keep responses concise but comprehensive. Break down complex topics into digestible parts.`;

    const contents = conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contents,
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to generate tutor response: ${error}`);
  }
}
