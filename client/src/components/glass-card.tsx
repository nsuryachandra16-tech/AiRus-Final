import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, hover = false, style }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/5 p-6 md:p-8 relative overflow-hidden",
        "backdrop-blur-[12px]",
        hover && "transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10",
        className
      )}
      style={{
        background: "rgba(10, 10, 10, 0.4)",
        ...style
      }}
    >
      {hover && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/5"></div>
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
