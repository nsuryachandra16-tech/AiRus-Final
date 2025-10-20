import {
  assignments,
  scheduleEvents,
  studySessions,
  chatMessages,
  type Assignment,
  type InsertAssignment,
  type ScheduleEvent,
  type InsertScheduleEvent,
  type StudySession,
  type InsertStudySession,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Assignments
  getAssignments(): Promise<Assignment[]>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: string, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: string): Promise<boolean>;

  // Schedule Events
  getScheduleEvents(): Promise<ScheduleEvent[]>;
  getScheduleEvent(id: string): Promise<ScheduleEvent | undefined>;
  createScheduleEvent(event: InsertScheduleEvent): Promise<ScheduleEvent>;
  updateScheduleEvent(id: string, event: Partial<InsertScheduleEvent>): Promise<ScheduleEvent | undefined>;
  deleteScheduleEvent(id: string): Promise<boolean>;

  // Study Sessions
  getStudySessions(): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;

  // Chat Messages
  getChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  clearChatHistory(): Promise<boolean>;

  // Timetable Data
  getTimetableData(): Promise<any>;
  saveTimetableData(data: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    const allAssignments = await db.select().from(assignments).orderBy(desc(assignments.createdAt));
    // Filter out any sample/initial data if it exists
    return allAssignments;
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const [assignment] = await db
      .insert(assignments)
      .values(insertAssignment)
      .returning();
    return assignment;
  }

  async updateAssignment(
    id: string,
    updateData: Partial<InsertAssignment>
  ): Promise<Assignment | undefined> {
    const [assignment] = await db
      .update(assignments)
      .set(updateData)
      .where(eq(assignments.id, id))
      .returning();
    return assignment || undefined;
  }

  async deleteAssignment(id: string): Promise<boolean> {
    const result = await db.delete(assignments).where(eq(assignments.id, id)).returning();
    return result.length > 0;
  }

  // Schedule Events
  async getScheduleEvents(): Promise<ScheduleEvent[]> {
    return await db.select().from(scheduleEvents).orderBy(scheduleEvents.dayOfWeek);
  }

  async getScheduleEvent(id: string): Promise<ScheduleEvent | undefined> {
    const [event] = await db.select().from(scheduleEvents).where(eq(scheduleEvents.id, id));
    return event || undefined;
  }

  async createScheduleEvent(insertEvent: InsertScheduleEvent): Promise<ScheduleEvent> {
    const [event] = await db
      .insert(scheduleEvents)
      .values(insertEvent)
      .returning();
    return event;
  }

  async updateScheduleEvent(
    id: string,
    updateData: Partial<InsertScheduleEvent>
  ): Promise<ScheduleEvent | undefined> {
    const [event] = await db
      .update(scheduleEvents)
      .set(updateData)
      .where(eq(scheduleEvents.id, id))
      .returning();
    return event || undefined;
  }

  async deleteScheduleEvent(id: string): Promise<boolean> {
    const result = await db.delete(scheduleEvents).where(eq(scheduleEvents.id, id)).returning();
    return result.length > 0;
  }

  // Study Sessions
  async getStudySessions(): Promise<StudySession[]> {
    return await db.select().from(studySessions).orderBy(desc(studySessions.completedAt));
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const [session] = await db
      .insert(studySessions)
      .values(insertSession)
      .returning();
    return session;
  }

  // Chat Messages
  async getChatMessages(): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).orderBy(chatMessages.createdAt);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async clearChatHistory(): Promise<boolean> {
    await db.delete(chatMessages);
    return true;
  }

  // Timetable Data (stored in memory for now, can be moved to DB if needed)
  private timetableData: any = null;

  async getTimetableData(): Promise<any> {
    return this.timetableData;
  }

  async saveTimetableData(data: any): Promise<any> {
    this.timetableData = data;
    return this.timetableData;
  }
}

export const storage = new DatabaseStorage();