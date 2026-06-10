import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-black text-white",
        secondary: "bg-gray-100 text-gray-800",
        outline: "border border-gray-300 text-gray-700 bg-white",
        gold: "bg-amber-100 text-amber-800",
        teal: "bg-teal-100 text-teal-800",
        green: "bg-green-100 text-green-800",
        blue: "bg-blue-100 text-blue-800",
        red: "bg-red-100 text-red-800",
        purple: "bg-purple-100 text-purple-800",
        orange: "bg-orange-100 text-orange-800",
        muted: "bg-gray-50 text-gray-500 border border-gray-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
