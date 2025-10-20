import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAssignmentSchema, type Assignment, type InsertAssignment } from "@shared/schema";
import { Plus, Check, Trash2, Edit, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow, isBefore, addDays } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

export default function Assignments() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { data: assignments = [], isLoading } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  const form = useForm<InsertAssignment>({
    resolver: zodResolver(insertAssignmentSchema),
    defaultValues: {
      title: "",
      course: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
      completed: false,
    },
  });

  const onSubmit = async (data: InsertAssignment) => {
    try {
      const { apiRequest } = await import("@/lib/queryClient");
      await apiRequest("POST", "/api/assignments", data);
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      setIsCreateOpen(false);
      form.reset();
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
    } catch (error) {
      console.error("Error creating assignment:", error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive",
      });
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "active") return !a.completed;
    if (filter === "completed") return a.completed;
    return true;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  const getDueDateColor = (dueDate: string, completed: boolean) => {
    if (completed) return "text-muted-foreground";
    const date = new Date(dueDate);
    const now = new Date();
    const threeDaysFromNow = addDays(now, 3);

    if (isBefore(date, now)) return "text-red-400";
    if (isBefore(date, threeDaysFromNow)) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
              Assignments
            </h1>
            <p className="mt-2 text-muted-foreground">
              Track and manage your coursework
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-create-assignment">
                <Plus className="h-4 w-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-card-border sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Assignment</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...form.register("title")}
                    placeholder="Assignment title"
                    data-testid="input-title"
                  />
                  {form.formState.errors.title && (
                    <p className="mt-1 text-sm text-red-400">{form.formState.errors.title.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="course">Course</Label>
                  <Input
                    id="course"
                    {...form.register("course")}
                    placeholder="Course name"
                    data-testid="input-course"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    placeholder="Assignment details..."
                    rows={3}
                    data-testid="input-description"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    {...form.register("dueDate", {
                      setValueAs: (v) => (v ? new Date(v) : new Date()),
                    })}
                    data-testid="input-due-date"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    onValueChange={(value) => form.setValue("priority", value)}
                    defaultValue="medium"
                  >
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
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
                    Create Assignment
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            data-testid="button-filter-all"
          >
            All
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            onClick={() => setFilter("active")}
            data-testid="button-filter-active"
          >
            Active
          </Button>
          <Button
            variant={filter === "completed" ? "default" : "outline"}
            onClick={() => setFilter("completed")}
            data-testid="button-filter-completed"
          >
            Completed
          </Button>
        </div>

        {/* Assignments List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted/10" />
            ))}
          </div>
        ) : sortedAssignments.length === 0 ? (
          <GlassCard>
            <div className="py-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg text-muted-foreground">
                {filter === "all" ? "No assignments yet" : `No ${filter} assignments`}
              </p>
              <Button
                className="mt-4"
                onClick={() => setIsCreateOpen(true)}
                data-testid="button-create-first"
              >
                Create Your First Assignment
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {sortedAssignments.map((assignment) => (
              <GlassCard
                key={assignment.id}
                className={`${assignment.completed ? "opacity-60" : ""}`}
                hover
              >
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={assignment.completed}
                    className="mt-1"
                    onCheckedChange={async (checked) => {
                      try {
                        const { apiRequest } = await import("@/lib/queryClient");
                        await apiRequest("PATCH", `/api/assignments/${assignment.id}`, {
                          completed: checked,
                        });
                        queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
                      } catch (error) {
                        console.error("Error toggling assignment:", error);
                      }
                    }}
                    data-testid={`checkbox-complete-${assignment.id}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3
                            className={`text-lg font-medium ${assignment.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                          >
                            {assignment.title}
                          </h3>
                          <span
                            className={`rounded-md border px-2 py-1 text-xs font-medium ${getPriorityColor(assignment.priority)}`}
                          >
                            {assignment.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{assignment.course}</p>
                        {assignment.description && (
                          <p className="mt-2 text-sm text-muted-foreground">{assignment.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p
                          className={`text-sm font-medium ${getDueDateColor(assignment.dueDate, assignment.completed)}`}
                        >
                          {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(assignment.dueDate), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            data-testid={`button-edit-${assignment.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-400 hover:text-red-300"
                            onClick={async () => {
                              try {
                                const { apiRequest } = await import("@/lib/queryClient");
                                await apiRequest("DELETE", `/api/assignments/${assignment.id}`, undefined);
                                queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
                                const { toast } = await import("@/hooks/use-toast");
                                toast({
                                  title: "Success",
                                  description: "Assignment deleted successfully",
                                });
                              } catch (error) {
                                console.error("Error deleting assignment:", error);
                                const { toast } = await import("@/hooks/use-toast");
                                toast({
                                  title: "Error",
                                  description: "Failed to delete assignment",
                                  variant: "destructive",
                                });
                              }
                            }}
                            data-testid={`button-delete-${assignment.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
