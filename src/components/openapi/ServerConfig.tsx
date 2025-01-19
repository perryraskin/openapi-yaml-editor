import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ServerConfigProps {
  server: {
    url: string;
    description: string;
  };
  onChange: (server: { url: string; description: string }) => void;
}

const ServerConfig = ({ server, onChange }: ServerConfigProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Server Configuration</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="serverUrl">URL</Label>
          <Input
            id="serverUrl"
            value={server.url}
            onChange={(e) => onChange({ ...server, url: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serverDescription">Description</Label>
          <Input
            id="serverDescription"
            value={server.description}
            onChange={(e) => onChange({ ...server, description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default ServerConfig;