"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MessageContentProps {
  text: string;
  role: "ai" | "user";
}

export function MessageContent({ text, role }: MessageContentProps) {
  if (role === "user") {
    return <p className="whitespace-pre-wrap break-words">{text}</p>;
  }

  return (
    <div className={cn("chat-markdown break-words")}>
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4 space-y-1 list-disc">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 last:mb-0 pl-4 space-y-1 list-decimal">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-900 underline underline-offset-2 hover:text-black"
          >
            {children}
          </a>
        ),
        h1: ({ children }) => <p className="mb-2 font-semibold text-gray-900">{children}</p>,
        h2: ({ children }) => <p className="mb-2 font-semibold text-gray-900">{children}</p>,
        h3: ({ children }) => <p className="mb-1.5 font-semibold text-gray-900">{children}</p>,
        code: ({ children }) => (
          <code className="rounded bg-gray-200/70 px-1 py-0.5 text-[0.85em] font-mono">{children}</code>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-gray-300 pl-3 text-gray-600 last:mb-0">
            {children}
          </blockquote>
        ),
      }}
    >
      {text}
    </ReactMarkdown>
    </div>
  );
}
