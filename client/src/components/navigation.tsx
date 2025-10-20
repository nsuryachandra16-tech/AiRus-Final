import { useLocation } from "wouter";
import { Home, Calendar, ClipboardList, Clock, MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/timetable", icon: Calendar, label: "Timetable" },
    { href: "/assignments", icon: ClipboardList, label: "Assignments" },
    { href: "/schedule", icon: Calendar, label: "Schedule" },
    { href: "/study-timer", icon: Clock, label: "Study Timer" },
    { href: "/ai-tutor", icon: MessageSquare, label: "AI Tutor" },
  ];

  const handleNavigation = (href: string) => {
    setLocation(href);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-accent/10 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-all duration-300">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="hidden md:block">
              <span className="text-xl font-bold text-accent">AiRus</span>
              <p className="text-xs text-muted-foreground">Your AI Companion</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-accent" />
            ) : (
              <Menu className="h-6 w-6 text-accent" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-accent/10 animate-slide-down">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}