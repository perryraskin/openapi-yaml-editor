import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SchemaPropertyProps {
  property: {
    name: string;
    type: string;
    format?: string;
  };
  onUpdate: (field: "name" | "type" | "format", value: string) => void;
  onRemove: () => void;
}

const SchemaProperty = ({ property, onUpdate, onRemove }: SchemaPropertyProps) => {
  return (
    <div className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center">
      <Input
        value={property.name}
        onChange={(e) => onUpdate("name", e.target.value)}
        placeholder="Property name"
      />
      <Select
        value={property.type}
        onValueChange={(value) => onUpdate("type", value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="string">string</SelectItem>
          <SelectItem value="integer">integer</SelectItem>
          <SelectItem value="number">number</SelectItem>
          <SelectItem value="boolean">boolean</SelectItem>
          <SelectItem value="array">array</SelectItem>
          <SelectItem value="object">object</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <Trash2 className="w-4 h-4 text-destructive" />
      </Button>
    </div>
  );
};

export default SchemaProperty;