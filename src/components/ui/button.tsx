import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-light" | "ghost-pit" | "solid-white";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  trailingIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-pit text-white hover:bg-[#8f5523]",
  secondary:
    "border-2 border-avocado-skin text-avocado-skin hover:bg-avocado-skin hover:text-white",
  "ghost-light":
    "border-2 border-[#F4F0E4] text-[#F4F0E4] hover:bg-[#F4F0E4] hover:text-avocado-skin",
  "ghost-pit":
    "border-2 border-pit text-pit hover:bg-pit hover:text-white",
  "solid-white":
    "bg-white text-pit hover:bg-white/90",
};

export function Button({ variant = "primary", className = "", children, trailingIcon, ...props }: ButtonProps) {
  return (
    <button
      className={`group relative inline-flex items-center justify-center min-h-[44px] px-6 py-2 rounded-lg font-sans font-semibold text-sm transition-premium enabled:hover:-translate-y-0.5 magnetic-push disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {children}
        {trailingIcon && (
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5" style={{ transitionTimingFunction: "var(--bezier-spring)" }}>
            {trailingIcon}
          </span>
        )}
      </span>
    </button>
  );
}
