"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  value: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  className?: string;
}

function Accordion({ items, type = "single", className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>([]);

  function toggle(value: string) {
    if (type === "single") {
      setOpen((prev) => (prev[0] === value ? [] : [value]));
    } else {
      setOpen((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  }

  return (
    <div className={cn("divide-y divide-gray-100", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        return (
          <div key={item.value}>
            <button
              onClick={() => toggle(item.value)}
              className="flex w-full items-center justify-between py-5 text-left text-sm font-medium text-gray-900 hover:text-black transition-colors focus-visible:outline-none"
            >
              <span className="pr-4">{item.trigger}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
                  isOpen && "rotate-180 text-black"
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <div className="pb-5 text-sm text-gray-600 leading-relaxed">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
