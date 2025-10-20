import { Link, useLocation } from "wouter";
import { LayoutDashboard, ClipboardList, Calendar, Timer, MessageSquare, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/assignments", label: "Assignments", icon: ClipboardList },
  { path: "/schedule", label: "Schedule", icon: Calendar },
  { path: "/study", label: "Study", icon: Timer },
  { path: "/tutor", label: "AI Tutor", icon: MessageSquare },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav
      className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-[12px]"
      style={{ background: "rgba(10, 10, 10, 0.25)" }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-foreground"
            data-testid="link-home"
          >
            <div className="rounded-lg bg-accent p-2">
              <span className="text-accent-foreground">AI</span>
            </div>
            <span>AiRus</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    "hover-elevate active-elevate-2",
                    isActive
                      ? "border-b-2 border-accent text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
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
