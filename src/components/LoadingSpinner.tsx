// src/components/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-accent-primary animate-spin"></div>
        <div className="mt-4 text-center text-text-secondary">Loading...</div>
      </div>
    </div>
  );
}