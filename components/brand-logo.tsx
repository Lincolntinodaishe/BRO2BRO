import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { cn } from "@/lib/utils";

const sizes = {
  xs: "h-6 w-6",
  sm: "h-7 w-7",
  md: "h-8 w-8",
  lg: "h-9 w-9",
  xl: "h-12 w-12",
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  alt?: string;
}

export function BrandLogo({ size = "md", className, alt = "BRO2BRO" }: BrandLogoProps) {
  return (
    <Image
      src={bro2broLogo}
      alt={alt}
      width={48}
      height={48}
      className={cn(sizes[size], "w-auto object-contain rounded-full shrink-0", className)}
    />
  );
}
