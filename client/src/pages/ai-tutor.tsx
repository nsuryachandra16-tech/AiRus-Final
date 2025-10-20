import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";
import type { ChatMessage } from "@shared/schema";
import { format } from "date-fns";

export default function AITutor() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studyMode, setStudyMode] = useState<"general" | "focused">("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat"],
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const userMessage = message;
    setMessage("");

    try {
      const { apiRequest } = await import("@/lib/queryClient");
      const { queryClient } = await import("@/lib/queryClient");
      
      await apiRequest("POST", "/api/chat", {
        role: "user",
        content: userMessage,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
    } catch (error) {
      console.error("Error sending message:", error);
      const { toast } = await import("@/hooks/use-toast");
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12 pt-6">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        {/* Premium Header */}
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 blur-3xl -z-10 animate-pulse"></div>
          
          <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 px-6 py-3 border border-accent/30 shadow-lg shadow-accent/20">
            <div className="relative">
              <div className="absolute inset-0 bg-accent blur-md rounded-full"></div>
              <svg className="w-6 h-6 relative z-10 text-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-80"/>
              </svg>
            </div>
            <span className="font-bold text-accent text-lg tracking-wide">PREMIUM AI STUDY TUTOR</span>
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-accent via-yellow-300 to-accent bg-clip-text text-transparent animate-gradient-text" data-testid="text-page-title">
            Master Any Subject
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your personal AI companion powered by advanced Gemini AI - Get instant help, explanations, and study strategies for any topic
          </p>
          
          {/* Study Mode Toggle */}
          <div className="mt-6 inline-flex gap-2 p-1 rounded-xl bg-black/40 border border-accent/20">
            <button
              onClick={() => setStudyMode("general")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                studyMode === "general"
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              General Help
            </button>
            <button
              onClick={() => setStudyMode("focused")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                studyMode === "focused"
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Deep Focus Mode
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <GlassCard className="flex h-[650px] flex-col p-0 border-2 border-accent/20 shadow-2xl shadow-accent/10">
          {/* Chat Header */}
          <div className="border-b border-accent/10 bg-gradient-to-r from-accent/5 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-xl border border-accent/30">
                  <Bot className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">AI Study Assistant</h3>
                  <p className="text-xs text-muted-foreground">Always ready to help you learn</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">Online</span>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" data-testid="messages-container">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bot className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  Start a Conversation
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Ask me anything about your coursework, assignments, or study topics. I'm here to help!
                </p>
                <div className="mt-6 grid gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Explain quantum mechanics principles in simple terms")}
                    className="justify-start text-left border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                    data-testid="button-sample-1"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Explain quantum mechanics principles in simple terms
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Help me master calculus derivatives step by step")}
                    className="justify-start text-left border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                    data-testid="button-sample-2"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Help me master calculus derivatives step by step
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Create a study plan for my upcoming exams")}
                    className="justify-start text-left border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                    data-testid="button-sample-3"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Create a study plan for my upcoming exams
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Explain the theory of relativity and its applications")}
                    className="justify-start text-left border-accent/20 hover:bg-accent/10 hover:border-accent/40 transition-all duration-300"
                    data-testid="button-sample-4"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Explain the theory of relativity and its applications
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${msg.role}-${msg.id}`}
                >
                  <div className={`flex max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        msg.role === "user"
                          ? "bg-accent text-accent-foreground"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl border p-4 transition-all duration-300 ${
                        msg.role === "user"
                          ? "border-accent/30 bg-gradient-to-br from-accent/20 to-accent/10 shadow-lg shadow-accent/10"
                          : "border-white/10 bg-gradient-to-br from-black/30 to-black/20 backdrop-blur-sm"
                      }`}
                    >
                      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                        {format(new Date(msg.createdAt), "h:mm a")}
                        {msg.role === "assistant" && (
                          <>
                            <span className="mx-1">•</span>
                            <span className="text-accent">AI Response</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex max-w-[80%] gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                    <div className="flex gap-2">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.1s" }} />
                      <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-accent/10 bg-gradient-to-r from-transparent via-accent/5 to-transparent p-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={studyMode === "focused" ? "Ask your study question for deep analysis..." : "Ask me anything about your studies..."}
                  className="pr-12 border-accent/20 bg-black/40 focus:border-accent focus:ring-accent/20 placeholder:text-muted-foreground/50"
                  disabled={isLoading}
                  data-testid="input-message"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-accent/50 animate-pulse" />
                </div>
              </div>
              <Button
                type="submit"
                size="icon"
                className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all duration-300 hover:scale-110"
                disabled={isLoading || !message.trim()}
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-3 flex items-center justify-between text-xs">
              <p className="text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
                Powered by Advanced Gemini AI
              </p>
              <p className="text-muted-foreground">
                {studyMode === "focused" ? "Deep Focus Mode Active" : "General Study Mode"}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
