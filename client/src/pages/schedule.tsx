import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScheduleEventSchema, type ScheduleEvent, type InsertScheduleEvent } from "@shared/schema";
import { Plus, MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const courseColors = [
  "#facc15", // yellow
  "#60a5fa", // blue
  "#f87171", // red
  "#34d399", // green
  "#a78bfa", // purple
  "#fb923c", // orange
];

export default function Schedule() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1); // Monday

  const { data: events = [], isLoading } = useQuery<ScheduleEvent[]>({
    queryKey: ["/api/schedule"],
  });

  const form = useForm<InsertScheduleEvent>({
    resolver: zodResolver(insertScheduleEventSchema),
    defaultValues: {
      courseName: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "10:00",
      location: "",
      color: courseColors[0],
    },
  });

  const onSubmit = async (data: InsertScheduleEvent) => {
    try {
      const { apiRequest } = await import("@/lib/queryClient");
      await apiRequest("POST", "/api/schedule", data);
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
      setIsCreateOpen(false);
      form.reset();
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Success",
        description: "Class added successfully",
      });
    } catch (error) {
      console.error("Error creating schedule event:", error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Failed to add class",
        variant: "destructive",
      });
    }
  };

  const filteredEvents = events.filter((e) => e.dayOfWeek === selectedDay);

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
              Schedule
            </h1>
            <p className="mt-2 text-muted-foreground">Manage your weekly course schedule</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-event">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-card-border sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Class Schedule</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    {...form.register("courseName")}
                    placeholder="e.g., Computer Science 101"
                    data-testid="input-course-name"
                  />
                </div>
                <div>
                  <Label htmlFor="dayOfWeek">Day of Week</Label>
                  <Select
                    onValueChange={(value) => form.setValue("dayOfWeek", parseInt(value))}
                    defaultValue="1"
                  >
                    <SelectTrigger data-testid="select-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      {...form.register("startTime")}
                      data-testid="input-start-time"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      {...form.register("endTime")}
                      data-testid="input-end-time"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="e.g., Building A, Room 201"
                    data-testid="input-location"
                  />
                </div>
                <div>
                  <Label>Color</Label>
                  <div className="mt-2 flex gap-2">
                    {courseColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="h-8 w-8 rounded-full border-2 border-white/20 transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        onClick={() => form.setValue("color", color)}
                        data-testid={`button-color-${color}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-submit">
                    Add Class
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Day Selector */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {daysOfWeek.slice(1, 6).map((day, index) => {
            const dayIndex = index + 1;
            const eventCount = events.filter((e) => e.dayOfWeek === dayIndex).length;
            return (
              <Button
                key={dayIndex}
                variant={selectedDay === dayIndex ? "default" : "outline"}
                onClick={() => setSelectedDay(dayIndex)}
                className="min-w-[120px] flex-col gap-1"
                data-testid={`button-day-${day.toLowerCase()}`}
              >
                <span>{day}</span>
                <span className="text-xs opacity-75">{eventCount} classes</span>
              </Button>
            );
          })}
        </div>

        {/* Schedule View */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/10" />
            ))}
          </div>
        ) : sortedEvents.length === 0 ? (
          <GlassCard>
            <div className="py-12 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg text-muted-foreground">
                No classes on {daysOfWeek[selectedDay]}
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsCreateOpen(true)}
                data-testid="button-add-first-class"
              >
                Add First Class
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <GlassCard key={event.id} className="border-l-4" style={{ borderLeftColor: event.color }} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-foreground">{event.courseName}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-mono">
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="h-12 w-12 rounded-lg"
                    style={{ backgroundColor: `${event.color}20`, border: `2px solid ${event.color}40` }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <CalendarIcon className="h-5 w-5" style={{ color: event.color }} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
