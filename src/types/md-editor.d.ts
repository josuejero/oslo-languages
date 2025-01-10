// src/types/md-editor.d.ts
declare module '@uiw/react-md-editor' {
  import { ComponentType, HTMLAttributes } from 'react';

  interface MDEditorProps extends HTMLAttributes<HTMLDivElement> {
    value?: string;
    onChange?: (value?: string) => void;
    preview?: 'edit' | 'live' | 'preview';
    height?: number;
    highlightEnable?: boolean;
    fullscreen?: boolean;
    hideToolbar?: boolean;
    enableScroll?: boolean;
    visibleDragbar?: boolean;
    textareaProps?: HTMLAttributes<HTMLTextAreaElement>;
  }

  const MDEditor: ComponentType<MDEditorProps>;
  export default MDEditor;
}