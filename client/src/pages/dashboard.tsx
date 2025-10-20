import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { ClipboardList, Calendar, Timer, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns";
import type { Assignment, StudySession } from "@shared/schema";

export default function Dashboard() {
  const { data: assignments = [], isLoading: loadingAssignments } = useQuery<Assignment[]>({
    queryKey: ["/api/assignments"],
  });

  const { data: studySessions = [], isLoading: loadingSessions } = useQuery<StudySession[]>({
    queryKey: ["/api/study-sessions"],
  });

  const upcomingAssignments = assignments
    .filter((a) => !a.completed && isAfter(new Date(a.dueDate), new Date()))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const overdueCount = assignments.filter(
    (a) => !a.completed && isBefore(new Date(a.dueDate), new Date())
  ).length;

  const completedCount = assignments.filter((a) => a.completed).length;

  const totalStudyMinutes = studySessions
    .filter((s) => s.sessionType === "work")
    .reduce((sum, s) => sum + s.duration, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      default:
        return "text-blue-400";
    }
  };

  const getDueDateColor = (dueDate: string) => {
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
            Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back! Here's your academic overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <GlassCard className="p-6" hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="mt-2 text-3xl font-bold text-foreground" data-testid="text-total-assignments">
                  {assignments.length}
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <ClipboardList className="h-6 w-6 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="mt-2 text-3xl font-bold text-green-400" data-testid="text-completed-count">
                  {completedCount}
                </p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="mt-2 text-3xl font-bold text-red-400" data-testid="text-overdue-count">
                  {overdueCount}
                </p>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3">
                <Calendar className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="mt-2 text-3xl font-bold text-accent" data-testid="text-study-time">
                  {totalStudyMinutes}m
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <Timer className="h-6 w-6 text-accent" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Upcoming Assignments */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Upcoming Assignments</h2>
            <Link href="/assignments">
              <Button variant="ghost" className="text-accent hover:text-accent" data-testid="button-view-all">
                View All
              </Button>
            </Link>
          </div>

          {loadingAssignments ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg bg-muted/10" />
              ))}
            </div>
          ) : upcomingAssignments.length === 0 ? (
            <div className="py-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No upcoming assignments</p>
              <Link href="/assignments">
                <Button className="mt-4" data-testid="button-create-assignment">
                  Create Your First Assignment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-start justify-between rounded-lg border border-white/5 p-4 transition-colors hover-elevate"
                  data-testid={`assignment-card-${assignment.id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-foreground">{assignment.title}</h3>
                      <span
                        className={`text-xs font-medium uppercase ${getPriorityColor(assignment.priority)}`}
                      >
                        {assignment.priority}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getDueDateColor(assignment.dueDate)}`}>
                      {formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true })}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
