// src/types/simplemde.d.ts
declare module 'react-simplemde-editor' {
  import React from 'react';
  import { Options as EasyMDEOptions } from 'easymde';

  export interface SimpleMDEProps {
    value: string;
    onChange: (value: string) => void;
    options?: EasyMDEOptions;
    className?: string;
    events?: Record<string, (instance: any) => void>;
    getMdeInstance?: (instance: any) => void;
    getLineAndCursor?: (position: number | null) => void;
  }

  const SimpleMDE: React.FC<SimpleMDEProps>;

  export default SimpleMDE;
}

declare module 'easymde' {
  export interface Options {
    [key: string]: any;
  }
}