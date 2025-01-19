import { useState } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import { defaultOpenAPI } from "@/lib/defaultOpenAPI";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy } from "lucide-react";

const Index = () => {
  const [yaml, setYaml] = useState(defaultOpenAPI);
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
        <h1 className="text-2xl font-bold">OpenAPI Editor</h1>
        <Button onClick={handleCopy} variant="outline">
          <Copy className="w-4 h-4 mr-2" />
          Copy YAML
        </Button>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[calc(100vh-8rem)]">
        <Editor value={yaml} onChange={(value) => setYaml(value || "")} />
        <Preview yaml={yaml} />
      </div>
    </div>
  );
};

export default Index;