import { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { StudySession } from "@shared/schema";

const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export default function StudyTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { data: sessions = [] } = useQuery<StudySession[]>({
    queryKey: ["/api/study-sessions"],
  });

  const totalStudyTime = sessions
    .filter((s) => s.sessionType === "work")
    .reduce((sum, s) => sum + s.duration, 0);

  const todaySessions = sessions.filter((s) => {
    const today = new Date().toDateString();
    const sessionDate = new Date(s.completedAt).toDateString();
    return today === sessionDate && s.sessionType === "work";
  }).length;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    if (isWorkSession) {
      setSessionCount((prev) => prev + 1);
      // Save work session to database
      try {
        const { apiRequest } = await import("@/lib/queryClient");
        const { queryClient } = await import("@/lib/queryClient");
        await apiRequest("POST", "/api/study-sessions", {
          duration: 25,
          sessionType: "work",
          completedAt: new Date(),
        });
        queryClient.invalidateQueries({ queryKey: ["/api/study-sessions"] });
      } catch (error) {
        console.error("Error saving study session:", error);
      }
    }
    // Switch to break or work
    setIsWorkSession(!isWorkSession);
    setTimeLeft(isWorkSession ? BREAK_DURATION : WORK_DURATION);
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(isWorkSession ? WORK_DURATION : BREAK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isWorkSession
    ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
            Study Timer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pomodoro technique for focused study sessions
          </p>
        </div>

        {/* Main Timer Card */}
        <GlassCard className="mb-8 p-12">
          <div className="flex flex-col items-center">
            {/* Session Type Indicator */}
            <div className="mb-6 flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
              {isWorkSession ? (
                <>
                  <Brain className="h-5 w-5 text-accent" />
                  <span className="font-medium text-accent">Focus Time</span>
                </>
              ) : (
                <>
                  <Coffee className="h-5 w-5 text-blue-400" />
                  <span className="font-medium text-blue-400">Break Time</span>
                </>
              )}
            </div>

            {/* Timer Display */}
            <div className="relative mb-8">
              <div
                className={`text-8xl font-bold font-mono ${isWorkSession ? "text-accent" : "text-blue-400"} ${isRunning ? "animate-pulse" : ""}`}
                data-testid="text-timer-display"
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 w-full max-w-md">
              <Progress
                value={progress}
                className="h-3"
                data-testid="progress-timer"
              />
            </div>

            {/* Controls */}
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="gap-2 px-8"
                data-testid="button-play-pause"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
                data-testid="button-reset"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>

            {/* Session Counter */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">Sessions Completed Today</p>
              <p className="mt-1 text-2xl font-bold text-foreground" data-testid="text-session-count">
                {todaySessions}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Study Time</p>
                <p className="mt-2 text-3xl font-bold text-accent" data-testid="text-total-time">
                  {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <Brain className="h-8 w-8 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Sessions</p>
                <p className="mt-2 text-3xl font-bold text-blue-400" data-testid="text-today-sessions">
                  {todaySessions}
                </p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Coffee className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
