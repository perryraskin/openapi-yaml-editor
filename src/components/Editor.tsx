import { Editor as MonacoEditor } from "@monaco-editor/react";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  className?: string;
}

const Editor = ({ value, onChange, className }: EditorProps) => {
  return (
    <div className={cn("h-full w-full rounded-lg overflow-hidden border border-border", className)}>
      <MonacoEditor
        height="100%"
        defaultLanguage="yaml"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          fontFamily: "JetBrains Mono",
        }}
      />
    </div>
  );
};

export default Editor;