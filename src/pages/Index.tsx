import { useState } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import OpenAPIForm from "@/components/OpenAPIForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";
import { defaultOpenAPI } from "@/lib/defaultOpenAPI";

const Index = () => {
  const [yaml, setYaml] = useState(defaultOpenAPI);
  const [view, setView] = useState<"form" | "editor">("form");
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(yaml);
    toast({
      title: "Copied to clipboard",
      description: "Your OpenAPI YAML has been copied to the clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <h1 className="text-2xl font-bold inline-block mr-4">OpenAPI Editor</h1>
          <Button
            variant={view === "form" ? "default" : "outline"}
            onClick={() => setView("form")}
          >
            Form View
          </Button>
          <Button
            variant={view === "editor" ? "default" : "outline"}
            onClick={() => setView("editor")}
          >
            YAML View
          </Button>
        </div>
        <Button onClick={handleCopy} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy YAML
        </Button>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[calc(100vh-8rem)]">
        <div className="h-full">
          {view === "form" ? (
            <div className="h-full border rounded-lg overflow-auto">
              <OpenAPIForm onYamlChange={setYaml} initialYaml={yaml} />
            </div>
          ) : (
            <Editor value={yaml} onChange={(value) => setYaml(value || "")} />
          )}
        </div>
        <Preview yaml={yaml} />
      </div>
    </div>
  );
};

export default Index;