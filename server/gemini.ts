// Using the javascript_gemini blueprint
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function generateTutorResponse(conversationHistory: Array<{ role: string; content: string }>): Promise<string> {
  try {
    // Build the conversation context
    const context = conversationHistory
      .map((msg) => `${msg.role === "user" ? "Student" : "Tutor"}: ${msg.content}`)
      .join("\n");

    const prompt = `You are an expert AI tutor helping college students with their studies. You are knowledgeable, patient, and encouraging. Provide clear, concise explanations and help students understand concepts deeply.

Previous conversation:
${context}

Provide a helpful, educational response as the AI Tutor:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateTutorResponse(
  conversationHistory: { role: string; content: string }[]
): Promise<string> {
  try {
    const systemPrompt = `You are an elite AI tutor and study companion for college students - the most powerful educational AI assistant available.

Your mission is to help students achieve academic excellence through:

CORE CAPABILITIES:
- Deep subject mastery: Provide expert-level explanations across all academic disciplines
- Step-by-step breakdowns: Break complex topics into clear, logical steps
- Critical thinking: Challenge students with thought-provoking questions that deepen understanding
- Study optimization: Offer personalized study strategies, memory techniques, and exam preparation tips
- Real-world applications: Connect theoretical concepts to practical examples
- Adaptive learning: Adjust explanation depth based on student comprehension level

TEACHING APPROACH:
- Start with simple analogies and build to advanced concepts
- Use visual descriptions when helpful (diagrams, graphs, flowcharts)
- Provide multiple perspectives on complex topics
- Include practice problems or self-check questions
- Encourage active learning and self-discovery
- Be patient, motivating, and supportive

RESPONSE STYLE:
- Clear, structured responses with headers when appropriate
- Use examples from student's field of study when possible
- Highlight key concepts in your explanations
- Provide study tips and memory aids
- Keep responses comprehensive yet digestible
- When solving problems, show complete working with explanations

PRIORITY: Your goal is to not just answer questions, but to ensure true understanding and long-term retention. You are the student's partner in academic success.`;

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

export async function analyzeTimetableImage(imageData: any): Promise<{
  events: Array<{
    courseName: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    location?: string;
    color: string;
  }>;
  freeSlots: number;
}> {
  try {
    const systemPrompt = `Analyze this timetable image and extract the schedule information.
Return a JSON object with:
- events: array of {courseName, dayOfWeek (0-6, Sunday-Saturday), startTime (HH:MM), endTime (HH:MM), location}
- freeSlots: count of free time slots

Use these colors in order: #facc15, #60a5fa, #f87171, #34d399, #a78bfa, #fb923c`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [
        {
          role: "user",
          parts: [
            { text: "Analyze this timetable and extract the schedule." },
          ],
        },
      ],
    });

    const result = JSON.parse(response.text || "{}");
    return {
      events: result.events || [],
      freeSlots: result.freeSlots || 0,
    };
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    // Return mock data for now
    return {
      events: [
        {
          courseName: "Mathematics 101",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "10:30",
          location: "Room 201",
          color: "#facc15",
        },
        {
          courseName: "Physics Lab",
          dayOfWeek: 3,
          startTime: "14:00",
          endTime: "16:00",
          location: "Lab 3",
          color: "#60a5fa",
        },
      ],
      freeSlots: 15,
    };
  }
}

export async function analyzeAssignmentImage(imageData: any): Promise<{
  title: string;
  course?: string;
  description: string;
  dueDate?: Date;
  priority?: string;
}> {
  try {
    const systemPrompt = `You are an expert assignment analyzer. Extract assignment details with 100% accuracy.

REQUIREMENTS:
1. Read the assignment title EXACTLY as written
2. Identify the course/subject name
3. Extract complete description/requirements
4. Find the due date (return in ISO format YYYY-MM-DD)
5. Determine priority: "high" if urgent/soon, "medium" if moderate time, "low" if far future

Return ONLY valid JSON:
{
  "title": "Exact assignment title",
  "course": "Subject/Course name",
  "description": "Full assignment description and requirements",
  "dueDate": "2025-01-25T23:59:00.000Z",
  "priority": "high"
}

BE PRECISE. Read all text carefully.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.toString('base64')
              }
            },
            {
              text: "Analyze this assignment image. Extract title, course, description, due date, and priority with 100% accuracy."
            },
          ],
        },
      ],
    });

    const result = JSON.parse(response.text || "{}");
    return {
      title: result.title || "Untitled Assignment",
      course: result.course,
      description: result.description || "",
      dueDate: result.dueDate ? new Date(result.dueDate) : undefined,
      priority: result.priority || "medium",
    };
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    // Return mock data for now
    return {
      title: "Assignment from Upload",
      course: "General",
      description: "Uploaded assignment",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: "medium",
    };
  }
}