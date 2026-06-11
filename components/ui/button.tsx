"use client";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        default:
          "bg-black text-white hover:bg-gray-800 active:bg-gray-900 focus-visible:ring-black",
        outline:
          "border-2 border-black bg-white text-black hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-black",
        ghost:
          "text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus-visible:ring-gray-400",
        gold:
          "bg-amber-500 text-black hover:bg-amber-400 active:bg-amber-600 focus-visible:ring-amber-500 shadow-sm",
        teal:
          "bg-teal-600 text-white hover:bg-teal-500 active:bg-teal-700 focus-visible:ring-teal-600",
        destructive:
          "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-600",
        link: "text-black underline-offset-4 hover:underline p-0 h-auto font-medium",
        muted:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 focus-visible:ring-gray-400",
      },
      size: {
        xs: "h-7 px-3 text-xs rounded-full gap-1",
        sm: "h-9 px-4 text-sm rounded-full gap-1.5",
        md: "h-11 px-6 text-sm rounded-full gap-2",
        lg: "h-11 px-8 text-sm rounded-full gap-2",
        xl: "h-14 px-10 text-lg rounded-full gap-2.5",
        icon: "h-10 w-10 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
