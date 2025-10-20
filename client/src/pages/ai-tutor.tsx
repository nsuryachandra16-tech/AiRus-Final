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
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="font-medium text-accent">Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground" data-testid="text-page-title">
            AI Tutor
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get help with your coursework anytime
          </p>
        </div>

        {/* Chat Container */}
        <GlassCard className="flex h-[600px] flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="messages-container">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bot className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  Start a Conversation
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Ask me anything about your coursework, assignments, or study topics. I'm here to help!
                </p>
                <div className="mt-6 grid gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Explain the concept of recursion in programming")}
                    className="justify-start text-left"
                    data-testid="button-sample-1"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Explain the concept of recursion in programming
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessage("Help me understand quadratic equations")}
                    className="justify-start text-left"
                    data-testid="button-sample-2"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    Help me understand quadratic equations
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMessage("What are the main causes of World War I?")}
                    className="justify-start text-left"
                    data-testid="button-sample-3"
                  >
                    <Sparkles className="mr-2 h-4 w-4 text-accent" />
                    What are the main causes of World War I?
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
                      className={`rounded-2xl border p-4 ${
                        msg.role === "user"
                          ? "border-accent/20 bg-accent/10"
                          : "border-white/5 bg-black/20"
                      }`}
                    >
                      <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {format(new Date(msg.createdAt), "h:mm a")}
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
          <div className="border-t border-white/5 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isLoading}
                data-testid="input-message"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                disabled={isLoading || !message.trim()}
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI responses may contain errors. Always verify important information.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
