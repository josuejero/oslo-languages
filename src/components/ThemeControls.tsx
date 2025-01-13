// src/components/ThemeControls.tsx
import { useTheme } from '@/context/ThemeContext';
import { useId } from 'react';

export default function ThemeControls() {
  const { colorScheme, setColorScheme, toggleHighContrast, isHighContrast } = useTheme();
  const id = useId();

  return (
    <div className="space-y-4" role="group" aria-label="Theme settings">
      {/* Color Scheme Controls */}
      <div role="radiogroup" aria-labelledby={`${id}-color-scheme`}>
        <h2 id={`${id}-color-scheme`} className="text-sm font-medium mb-2">
          Color Scheme
        </h2>
        <div className="space-y-2">
          {['light', 'dark', 'system'].map((scheme) => (
            <label
              key={scheme}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="color-scheme"
                value={scheme}
                checked={colorScheme === scheme}
                onChange={(e) => setColorScheme(e.target.value as never)}
                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm capitalize">{scheme}</span>
            </label>
          ))}
        </div>
      </div>

      {/* High Contrast Toggle */}
      <div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isHighContrast}
            onChange={toggleHighContrast}
            className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm">High contrast mode</span>
        </label>
      </div>

      {/* Theme Preview */}
      <div className="p-4 rounded-lg border space-y-4">
        <h3 className="text-lg font-semibold">Theme Preview</h3>
        <div className="space-y-2">
          <p className="text-sm">Primary text</p>
          <p className="text-sm text-gray-600">Secondary text</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Primary Button
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md">
            Secondary Button
          </button>
          <div className="p-2 bg-green-100 text-green-800 rounded">
            Success message
          </div>
          <div className="p-2 bg-red-100 text-red-800 rounded">
            Error message
          </div>
        </div>
      </div>
    </div>
  );
}