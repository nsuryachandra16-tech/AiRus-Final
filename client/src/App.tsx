import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import Assignments from "@/pages/assignments";
import Schedule from "@/pages/schedule";
import StudyTimer from "@/pages/study-timer";
import AITutor from "@/pages/ai-tutor";
import Timetable from "@/pages/timetable";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navigation />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
