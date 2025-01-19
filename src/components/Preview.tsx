import { useEffect, useState } from "react";
import { load } from "js-yaml";
import { cn } from "@/lib/utils";

interface PreviewProps {
  yaml: string;
  className?: string;
}

const Preview = ({ yaml, className }: PreviewProps) => {
  const [parsedYaml, setParsedYaml] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = load(yaml);
      setParsedYaml(parsed);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [yaml]);

  return (
    <div className={cn("h-full w-full rounded-lg border border-border bg-card p-4 overflow-auto", className)}>
      {error ? (
        <div className="text-destructive">{error}</div>
      ) : (
        <pre className="text-sm font-mono">
          {JSON.stringify(parsedYaml, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Preview;