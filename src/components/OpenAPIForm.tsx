import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultOpenAPI } from "@/lib/defaultOpenAPI";
import { dump } from "js-yaml";

interface OpenAPIFormProps {
  onYamlChange: (yaml: string) => void;
  initialYaml?: string;
}

const OpenAPIForm = ({ onYamlChange, initialYaml }: OpenAPIFormProps) => {
  const [info, setInfo] = useState({
    title: "Sample API",
    description: "Optional multiline or single-line description",
    version: "0.1.0",
  });
  const [server, setServer] = useState({
    url: "http://api.example.com/v1",
    description: "Production server",
  });

  const updateYAML = () => {
    const newYaml = {
      openapi: "3.0.0",
      info,
      servers: [server],
      components: {
        schemas: {
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                format: "int64",
              },
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
            },
          },
        },
      },
    };
    onYamlChange(dump(newYaml));
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">API Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={info.title}
              onChange={(e) => {
                setInfo({ ...info, title: e.target.value });
                updateYAML();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={info.description}
              onChange={(e) => {
                setInfo({ ...info, description: e.target.value });
                updateYAML();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="version">Version</Label>
            <Input
              id="version"
              value={info.version}
              onChange={(e) => {
                setInfo({ ...info, version: e.target.value });
                updateYAML();
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Server Configuration</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="serverUrl">URL</Label>
            <Input
              id="serverUrl"
              value={server.url}
              onChange={(e) => {
                setServer({ ...server, url: e.target.value });
                updateYAML();
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serverDescription">Description</Label>
            <Input
              id="serverDescription"
              value={server.description}
              onChange={(e) => {
                setServer({ ...server, description: e.target.value });
                updateYAML();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAPIForm;