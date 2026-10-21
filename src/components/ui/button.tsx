import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A3D8F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#1A3D8F] text-white hover:bg-[#152f6e]",
        secondary:
          "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
        ghost: "text-[#1A3D8F] hover:bg-blue-50",
        cooperadora: "bg-[#C8102E] text-white hover:bg-[#a30d25]",
      },
      size: {
        md: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
