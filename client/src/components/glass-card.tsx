import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 p-6 md:p-8",
        "backdrop-blur-[12px]",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/20",
        className
      )}
      style={{
        background: "rgba(10, 10, 10, 0.25)",
      }}
    >
      {children}
    </div>
  );
}
