import { Link, useLocation } from "wouter";
import { LayoutDashboard, ClipboardList, Calendar, Timer, MessageSquare, Menu, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/assignments", label: "Assignments", icon: ClipboardList },
  { path: "/schedule", label: "Schedule", icon: Calendar },
  { path: "/study", label: "Study", icon: Timer },
  { path: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { path: "/timetable", label: "Timetable", icon: Upload },
];

interface NavigationProps {
  userName: string;
}

export function Navigation({ userName }: NavigationProps) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b border-accent/10 backdrop-blur-[12px] shadow-lg shadow-accent/5"
      style={{ background: "rgba(10, 10, 10, 0.8)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button - Left Side */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group"
                data-testid="button-menu"
              >
                <div className="absolute inset-0 bg-accent/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Menu className="h-5 w-5 text-accent relative z-10" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-80 bg-gradient-to-br from-black via-background to-black border-r border-accent/20 p-0"
            >
              {/* Premium Drawer Header */}
              <div className="p-6 border-b border-accent/20 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-pulse"></div>
                    <div className="rounded-xl bg-gradient-to-br from-accent via-yellow-400 to-accent p-2 shadow-2xl shadow-accent/40 relative overflow-hidden border border-accent/30">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" className="text-accent-foreground"/>
                        <circle cx="12" cy="12" r="3" fill="currentColor" className="text-accent-foreground opacity-80"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-accent font-bold text-lg tracking-tight">AiRus</span>
                    <span className="text-[10px] text-accent/70 tracking-wider">YOUR AI COMPANION</span>
                  </div>
                </div>
                
                {/* User Greeting */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                    <span className="text-xs text-muted-foreground">Welcome back,</span>
                  </div>
                  <span className="text-lg font-bold text-accent">{userName}</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-5 py-4 text-base font-medium transition-all duration-300 relative overflow-hidden group",
                        isActive
                          ? "bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30 shadow-lg shadow-accent/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/5 border border-transparent hover:border-accent/20"
                      )}
                      data-testid={`mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent animate-shimmer"></div>
                      )}
                      <Icon className={cn(
                        "h-6 w-6 transition-transform duration-300 relative z-10",
                        isActive ? "text-accent scale-110" : "group-hover:scale-110"
                      )} />
                      <span className="relative z-10">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse relative z-10"></div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-accent/20 bg-gradient-to-t from-black/50 to-transparent">
                <p className="text-xs text-muted-foreground text-center">
                  Crafted with ❤️ by Surya
                </p>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo - Center on Mobile, Left on Desktop */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground group md:flex-none absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0"
            data-testid="link-home"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-pulse"></div>
              <div className="rounded-2xl bg-gradient-to-br from-accent via-yellow-400 to-accent p-3 shadow-2xl shadow-accent/40 group-hover:shadow-accent/60 transition-all duration-300 group-hover:scale-110 relative overflow-hidden border-2 border-accent/30">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-shimmer"></div>
                <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" className="text-accent-foreground"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor" className="text-accent-foreground opacity-80"/>
                  <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-background"/>
                </svg>
              </div>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-accent group-hover:text-accent/90 transition-colors duration-300 tracking-tight">AiRus</span>
              <span className="text-[10px] text-accent/70 -mt-1 tracking-wider">YOUR AI COMPANION</span>
            </div>
          </Link>

          {/* User Greeting - Desktop Only */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20">
            <span className="text-sm text-muted-foreground">Hey,</span>
            <span className="text-sm font-semibold text-accent">{userName}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                    isActive
                      ? "text-accent bg-accent/10 border border-accent/30 shadow-lg shadow-accent/10"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/5 border border-transparent hover:border-accent/20"
                  )}
                  data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-transparent animate-shimmer"></div>
                  )}
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300 relative z-10",
                    isActive ? "text-accent scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Spacer for Mobile to Balance Layout */}
          <div className="w-10 md:hidden"></div>
        </div>
      </div>
    </nav>
  );
}