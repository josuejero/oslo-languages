
declare module "react-simplemde-editor" {
  import { ComponentType } from "react";
  interface ReactSimpleMDEProps {
    value?: string;
    onChange?: (value: string) => void;
    options?: Record<string, any>;
    
  }
  const ReactSimpleMDE: ComponentType<ReactSimpleMDEProps>;
  export default ReactSimpleMDE;
}
