
"use client";

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autofocus?: boolean;
  className?: string;
}

/**
 * A simple textarea replacement for the markdown editor
 * This can be used as a temporary solution until react-simplemde-editor is installed
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
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autofocus}
        className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        style={{ minHeight: "400px" }}
      />
    </div>
  );
}