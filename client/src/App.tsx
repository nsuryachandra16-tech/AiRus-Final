import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import { Onboarding } from "@/components/onboarding";
import Dashboard from "@/pages/dashboard";
import Assignments from "@/pages/assignments";
import Schedule from "@/pages/schedule";
import StudyTimer from "@/pages/study-timer";
import AITutor from "@/pages/ai-tutor";
import Timetable from "@/pages/timetable";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";

interface UserProfile {
  name: string;
  deviceType: "desktop" | "mobile";
}

function Router({ userName }: { userName: string }) {
  return (
    <>
      <Navigation userName={userName} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/assignments" component={Assignments} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/study" component={StudyTimer} />
        <Route path="/tutor" component={AITutor} />
        <Route path="/timetable" component={Timetable} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem("airusUserProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile) as UserProfile;
      setUserProfile(profile);
      
      // Apply device type viewport settings
      if (profile.deviceType === "mobile") {
        document.documentElement.style.maxWidth = "430px";
        document.documentElement.style.margin = "0 auto";
      }
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (name: string, deviceType: "desktop" | "mobile") => {
    const profile: UserProfile = { name, deviceType };
    localStorage.setItem("airusUserProfile", JSON.stringify(profile));
    setUserProfile(profile);

    // Apply device type viewport settings
    if (deviceType === "mobile") {
      document.documentElement.style.maxWidth = "430px";
      document.documentElement.style.margin = "0 auto";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-accent text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {!userProfile ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Router userName={userProfile.name} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
