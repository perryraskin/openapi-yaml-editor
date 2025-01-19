import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface APIInfoProps {
  info: {
    title: string;
    description: string;
    version: string;
  };
  onChange: (info: { title: string; description: string; version: string }) => void;
}

const APIInfo = ({ info, onChange }: APIInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">API Information</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={info.title}
            onChange={(e) => onChange({ ...info, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={info.description}
            onChange={(e) => onChange({ ...info, description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input
            id="version"
            value={info.version}
            onChange={(e) => onChange({ ...info, version: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default APIInfo;