"use client";

import dynamic from "next/dynamic";

// Import the type but use dynamic import for the component

// Dynamically import the component to prevent SSR issues
const SimpleMDE = dynamic<any>(
  () => import("react-simplemde-editor") as Promise<any>,
  { ssr: false }
);

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autofocus?: boolean;
  className?: string;
}

/**
 * A reusable markdown editor component that wraps react-simplemde-editor
 * with proper TypeScript typings and SSR handling
 */
export default function MarkdownEditor({
  id = "markdown-editor",
  value,
  onChange,
  placeholder = "Start writing...",
  autofocus = true,
  className = "",
}: MarkdownEditorProps) {
  return (
    <div className={className}>
      <SimpleMDE
        id={id}
        value={value}
        onChange={onChange}
        options={{
          autofocus,
          spellChecker: true,
          placeholder,
          status: ["lines", "words", "cursor"],
          toolbar: [
            "bold",
            "italic",
            "heading",
            "|",
            "quote",
            "unordered-list",
            "ordered-list",
            "|",
            "link",
            "image",
            "|",
            "preview",
            "side-by-side",
            "fullscreen",
            "|",
            "guide",
          ],
        }}
      />
    </div>
  );
}