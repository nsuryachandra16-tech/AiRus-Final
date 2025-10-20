import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { ClipboardList, Clock, Calendar, TrendingUp, Sparkles } from "lucide-react";
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

  const { data: scheduleEvents = [] } = useQuery({
    queryKey: ["/api/schedule"],
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

  // Real-time class tracking
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const todayClasses = scheduleEvents
    .filter((event: any) => event.dayOfWeek === currentDay)
    .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));

  const currentClass = todayClasses.find((event: any) => 
    currentTime >= event.startTime && currentTime <= event.endTime
  );

  const upcomingClasses = todayClasses.filter((event: any) => 
    currentTime < event.startTime
  );

  const completedClasses = todayClasses.filter((event: any) => 
    currentTime > event.endTime
  );

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
    <div className="min-h-screen bg-background pb-12 pt-6 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        {/* Header with Logo and AI Companion */}
        <header className="mb-12 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm">
            {/* Placeholder for a premium logo */}
            <div className="w-6 h-6 flex items-center justify-center">
              <svg className="w-full h-full text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <span className="text-sm font-medium text-accent">Your #1 Powerful AI Study Companion</span>
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            Meet
          </h1>
          <h1 className="text-6xl md:text-7xl font-bold text-accent mb-4 animate-gradient-text">
            AiRus
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your academic potential with premium, 100% working AI-powered study tools ✨
          </p>
        </header>

        {/* Stats Section */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
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
                <Clock className="h-6 w-6 text-accent" />
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

        {/* Today's Classes Status */}
        {todayClasses.length > 0 && (
          <GlassCard className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Today is {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][currentDay]}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {todayClasses.length} classes scheduled
                </p>
              </div>
            </div>

            {/* Current Class */}
            {currentClass && (
              <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-2 border-green-500/30 animate-pulse-slow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">CLASS IN PROGRESS</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{currentClass.courseName}</h3>
                <p className="text-accent font-mono text-lg">
                  {currentClass.startTime} - {currentClass.endTime}
                </p>
                {currentClass.location && (
                  <p className="text-sm text-muted-foreground mt-2">📍 {currentClass.location}</p>
                )}
              </div>
            )}

            {/* Upcoming Classes */}
            {upcomingClasses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Classes Not Yet Started ({upcomingClasses.length})
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-xl border border-blue-500/20 p-4 bg-gradient-to-r from-blue-500/10 to-transparent hover:border-blue-500/40 transition-all duration-300"
                      style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{event.courseName}</h4>
                        <p className="text-sm text-blue-400 font-mono mt-1">
                          {event.startTime} - {event.endTime}
                        </p>
                        {event.location && (
                          <p className="text-xs text-muted-foreground mt-1">📍 {event.location}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Classes */}
            {completedClasses.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-500/20 flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  Classes Ended ({completedClasses.length})
                </h3>
                <div className="space-y-2">
                  {completedClasses.map((event: any) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 rounded-xl border border-white/5 p-3 bg-white/5 opacity-60"
                      style={{ borderLeftWidth: '3px', borderLeftColor: event.color }}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-muted-foreground line-through">{event.courseName}</h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        )}


        {/* Footer Credit */}
        <div className="text-center mt-16 pb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Crafted with <span className="text-red-500 animate-pulse">❤️</span> by Surya
          </p>
        </div>
      </div>
    </div>
  );
}