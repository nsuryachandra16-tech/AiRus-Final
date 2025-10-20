import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateTutorResponse } from "./gemini";
import {
  insertAssignmentSchema,
  insertScheduleEventSchema,
  insertStudySessionSchema,
  insertChatMessageSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ Assignments Routes ============
  
  // GET all assignments
  app.get("/api/assignments", async (req, res) => {
    try {
      const assignments = await storage.getAssignments();
      res.json(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  // GET single assignment
  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const assignment = await storage.getAssignment(req.params.id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      res.status(500).json({ error: "Failed to fetch assignment" });
    }
  });

  // POST create assignment
  app.post("/api/assignments", async (req, res) => {
    try {
      const validated = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(validated);
      res.status(201).json(assignment);
    } catch (error: any) {
      console.error("Error creating assignment:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid assignment data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  // PATCH update assignment
  app.patch("/api/assignments/:id", async (req, res) => {
    try {
      // Validate and coerce the update data
      const updateData: Partial<typeof req.body> = {};
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.course !== undefined) updateData.course = req.body.course;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.dueDate !== undefined) updateData.dueDate = new Date(req.body.dueDate);
      if (req.body.priority !== undefined) updateData.priority = req.body.priority;
      if (req.body.completed !== undefined) updateData.completed = req.body.completed;
      
      const assignment = await storage.updateAssignment(req.params.id, updateData);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error("Error updating assignment:", error);
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  // DELETE assignment
  app.delete("/api/assignments/:id", async (req, res) => {
    try {
      const success = await storage.deleteAssignment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // ============ Schedule Events Routes ============
  
  // GET all schedule events
  app.get("/api/schedule", async (req, res) => {
    try {
      const events = await storage.getScheduleEvents();
      res.json(events);
    } catch (error) {
      console.error("Error fetching schedule events:", error);
      res.status(500).json({ error: "Failed to fetch schedule events" });
    }
  });

  // GET single schedule event
  app.get("/api/schedule/:id", async (req, res) => {
    try {
      const event = await storage.getScheduleEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Schedule event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching schedule event:", error);
      res.status(500).json({ error: "Failed to fetch schedule event" });
    }
  });

  // POST create schedule event
  app.post("/api/schedule", async (req, res) => {
    try {
      const validated = insertScheduleEventSchema.parse(req.body);
      const event = await storage.createScheduleEvent(validated);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Error creating schedule event:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid schedule event data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create schedule event" });
    }
  });

  // PATCH update schedule event
  app.patch("/api/schedule/:id", async (req, res) => {
    try {
      // Validate and coerce the update data
      const updateData: Partial<typeof req.body> = {};
      if (req.body.courseName !== undefined) updateData.courseName = req.body.courseName;
      if (req.body.dayOfWeek !== undefined) updateData.dayOfWeek = parseInt(req.body.dayOfWeek);
      if (req.body.startTime !== undefined) updateData.startTime = req.body.startTime;
      if (req.body.endTime !== undefined) updateData.endTime = req.body.endTime;
      if (req.body.location !== undefined) updateData.location = req.body.location;
      if (req.body.color !== undefined) updateData.color = req.body.color;
      
      const event = await storage.updateScheduleEvent(req.params.id, updateData);
      if (!event) {
        return res.status(404).json({ error: "Schedule event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error updating schedule event:", error);
      res.status(500).json({ error: "Failed to update schedule event" });
    }
  });

  // DELETE schedule event
  app.delete("/api/schedule/:id", async (req, res) => {
    try {
      const success = await storage.deleteScheduleEvent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Schedule event not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting schedule event:", error);
      res.status(500).json({ error: "Failed to delete schedule event" });
    }
  });

  // ============ Study Sessions Routes ============
  
  // GET all study sessions
  app.get("/api/study-sessions", async (req, res) => {
    try {
      const sessions = await storage.getStudySessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ error: "Failed to fetch study sessions" });
    }
  });

  // POST create study session
  app.post("/api/study-sessions", async (req, res) => {
    try {
      const validated = insertStudySessionSchema.parse(req.body);
      const session = await storage.createStudySession(validated);
      res.status(201).json(session);
    } catch (error: any) {
      console.error("Error creating study session:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid study session data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create study session" });
    }
  });

  // ============ Chat Messages Routes ============
  
  // GET all chat messages
  app.get("/api/chat", async (req, res) => {
    try {
      const messages = await storage.getChatMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  // POST send message and get AI response
  app.post("/api/chat", async (req, res) => {
    try {
      const validated = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createChatMessage(validated);
      
      // Get conversation history for context
      const allMessages = await storage.getChatMessages();
      const conversationHistory = allMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      
      // Generate AI response
      const aiResponse = await generateTutorResponse(conversationHistory);
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        role: "assistant",
        content: aiResponse,
      });
      
      res.status(201).json({ userMessage, aiMessage });
    } catch (error: any) {
      console.error("Error in chat:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid message data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // DELETE clear chat history
  app.delete("/api/chat", async (req, res) => {
    try {
      await storage.clearChatHistory();
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ error: "Failed to clear chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
