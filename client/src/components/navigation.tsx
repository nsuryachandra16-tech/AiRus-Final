import { Link, useLocation } from "wouter";
import { LayoutDashboard, ClipboardList, Calendar, Timer, MessageSquare, Menu, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/assignments", label: "Assignments", icon: ClipboardList },
  { path: "/schedule", label: "Schedule", icon: Calendar },
  { path: "/study", label: "Study", icon: Timer },
  { path: "/tutor", label: "AI Tutor", icon: MessageSquare },
  { path: "/timetable", label: "Timetable", icon: Upload },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-accent/10 backdrop-blur-[12px] shadow-lg shadow-accent/5"
      style={{ background: "rgba(10, 10, 10, 0.8)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground group"
            data-testid="link-home"
          >
            <div className="rounded-2xl bg-gradient-to-br from-accent to-accent/80 p-2.5 shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              <span className="text-accent-foreground font-bold text-lg relative z-10">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="text-accent group-hover:text-accent/90 transition-colors duration-300">AiRus</span>
              <span className="text-[10px] text-muted-foreground -mt-1">ASSISTANT</span>
            </div>
          </Link>

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

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-card-border">
              <div className="flex flex-col gap-2 pt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        "hover-elevate active-elevate-2",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      data-testid={`mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}