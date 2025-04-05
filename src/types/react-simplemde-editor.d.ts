// types/react-simplemde-editor.d.ts
declare module "react-simplemde-editor" {
  import { ComponentType } from "react";
  interface ReactSimpleMDEProps {
    value?: string;
    onChange?: (value: string) => void;
    options?: Record<string, any>;
    // ...any other props
  }
  const ReactSimpleMDE: ComponentType<ReactSimpleMDEProps>;
  export default ReactSimpleMDE;
}
