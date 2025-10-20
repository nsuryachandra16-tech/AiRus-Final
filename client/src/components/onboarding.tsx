
import { useState } from "react";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Monitor, Smartphone, Sparkles } from "lucide-react";

interface OnboardingProps {
  onComplete: (name: string, deviceType: "desktop" | "mobile") => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"welcome" | "device" | "name">("welcome");
  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile">("desktop");

  const handleDeviceSelect = (type: "desktop" | "mobile") => {
    setDeviceType(type);
    setStep("name");
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim(), deviceType);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-lg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl animate-pulse-slow-delay"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-4">
        {step === "welcome" && (
          <GlassCard className="p-12 text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-sm font-medium text-accent">Welcome to Your AI Assistant</span>
              <Sparkles className="h-5 w-5 text-accent animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              Welcome to
            </h1>
            <h1 className="text-6xl md:text-7xl font-bold text-accent mb-6 animate-gradient-text">
              AiRus
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Your Premium AI-Powered College Companion ✨
            </p>

            <Button
              onClick={() => setStep("device")}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-xl shadow-lg shadow-accent/20 hover-elevate"
            >
              Get Started
            </Button>

            <p className="mt-12 text-sm text-muted-foreground flex items-center justify-center gap-1">
              Crafted with <span className="text-red-500 animate-pulse">❤️</span> by Surya
            </p>
          </GlassCard>
        )}

        {step === "device" && (
          <GlassCard className="p-12 text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choose Your View
            </h2>
            <p className="text-muted-foreground mb-12">
              Select your preferred device type for the best experience
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleDeviceSelect("desktop")}
                className="p-8 rounded-2xl border-2 border-white/5 bg-background/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group hover-elevate"
              >
                <Monitor className="h-16 w-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Desktop</h3>
                <p className="text-sm text-muted-foreground">Full-featured experience</p>
              </button>

              <button
                onClick={() => handleDeviceSelect("mobile")}
                className="p-8 rounded-2xl border-2 border-white/5 bg-background/50 hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group hover-elevate"
              >
                <Smartphone className="h-16 w-16 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Mobile</h3>
                <p className="text-sm text-muted-foreground">Optimized for touch</p>
              </button>
            </div>
          </GlassCard>
        )}

        {step === "name" && (
          <GlassCard className="p-12 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                What's Your Name?
              </h2>
              <p className="text-muted-foreground">
                Let's personalize your experience
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg py-6 bg-background/50 border-white/10 focus:border-accent text-center"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 rounded-xl shadow-lg shadow-accent/20 hover-elevate"
                disabled={!name.trim()}
              >
                Continue to Dashboard
              </Button>
            </form>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
