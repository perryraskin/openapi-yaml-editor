import { useState, useEffect } from "react";
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
import { dump, load } from "js-yaml";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

interface OpenAPIFormProps {
  onYamlChange: (yaml: string) => void;
  initialYaml?: string;
  yaml: string; // Add this prop to receive current YAML
}

interface SchemaProperty {
  name: string;
  type: string;
  format?: string;
}

interface Schema {
  name: string;
  properties: SchemaProperty[];
}

const OpenAPIForm = ({ onYamlChange, initialYaml, yaml }: OpenAPIFormProps) => {
  const [info, setInfo] = useState({
    title: "Sample API",
    description: "Optional multiline or single-line description",
    version: "0.1.0",
  });
  const [server, setServer] = useState({
    url: "http://api.example.com/v1",
    description: "Production server",
  });
  const [schemas, setSchemas] = useState<Schema[]>([
    {
      name: "User",
      properties: [
        { name: "id", type: "integer", format: "int64" },
        { name: "name", type: "string" },
        { name: "email", type: "string", format: "email" },
      ],
    },
  ]);
  const [expandedSchemas, setExpandedSchemas] = useState<string[]>([]);

  // Add effect to update form state when YAML changes
  useEffect(() => {
    try {
      const parsedYaml = load(yaml) as any;
      
      // Update info
      if (parsedYaml.info) {
        setInfo({
          title: parsedYaml.info.title || "Sample API",
          description: parsedYaml.info.description || "Optional multiline or single-line description",
          version: parsedYaml.info.version || "0.1.0",
        });
      }

      // Update server
      if (parsedYaml.servers?.[0]) {
        setServer({
          url: parsedYaml.servers[0].url || "http://api.example.com/v1",
          description: parsedYaml.servers[0].description || "Production server",
        });
      }

      // Update schemas
      if (parsedYaml.components?.schemas) {
        const newSchemas: Schema[] = Object.entries(parsedYaml.components.schemas).map(
          ([name, schema]: [string, any]) => ({
            name,
            properties: Object.entries(schema.properties || {}).map(
              ([propName, propDetails]: [string, any]) => ({
                name: propName,
                type: propDetails.type || "string",
                ...(propDetails.format && { format: propDetails.format }),
              })
            ),
          })
        );
        setSchemas(newSchemas);
      }
    } catch (error) {
      console.error("Error parsing YAML:", error);
    }
  }, [yaml]);

  const toggleSchemaExpansion = (schemaName: string) => {
    setExpandedSchemas((prev) =>
      prev.includes(schemaName)
        ? prev.filter((name) => name !== schemaName)
        : [...prev, schemaName]
    );
  };

  const addSchema = () => {
    const newSchema: Schema = {
      name: `NewSchema${schemas.length + 1}`,
      properties: [],
    };
    setSchemas([...schemas, newSchema]);
    setExpandedSchemas([...expandedSchemas, newSchema.name]);
    updateYAML();
  };

  const removeSchema = (index: number) => {
    const newSchemas = schemas.filter((_, i) => i !== index);
    setSchemas(newSchemas);
    updateYAML();
  };

  const addProperty = (schemaIndex: number) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties.push({
      name: `newProperty${newSchemas[schemaIndex].properties.length + 1}`,
      type: "string",
    });
    setSchemas(newSchemas);
    updateYAML();
  };

  const removeProperty = (schemaIndex: number, propertyIndex: number) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties = newSchemas[
      schemaIndex
    ].properties.filter((_, i) => i !== propertyIndex);
    setSchemas(newSchemas);
    updateYAML();
  };

  const updateSchemaName = (index: number, newName: string) => {
    const newSchemas = [...schemas];
    newSchemas[index].name = newName;
    setSchemas(newSchemas);
    updateYAML();
  };

  const updatePropertyField = (
    schemaIndex: number,
    propertyIndex: number,
    field: keyof SchemaProperty,
    value: string
  ) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties[propertyIndex] = {
      ...newSchemas[schemaIndex].properties[propertyIndex],
      [field]: value,
    };
    setSchemas(newSchemas);
    updateYAML();
  };

  const updateYAML = () => {
    const schemasObject: { [key: string]: any } = {};
    schemas.forEach((schema) => {
      const properties: { [key: string]: any } = {};
      schema.properties.forEach((prop) => {
        properties[prop.name] = {
          type: prop.type,
          ...(prop.format && { format: prop.format }),
        };
      });
      schemasObject[schema.name] = {
        type: "object",
        properties,
      };
    });

    const newYaml = {
      openapi: "3.0.0",
      info,
      servers: [server],
      components: {
        schemas: schemasObject,
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

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Schemas</h3>
          <Button onClick={addSchema} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Schema
          </Button>
        </div>
        <div className="space-y-4">
          {schemas.map((schema, schemaIndex) => (
            <div
              key={schemaIndex}
              className="border rounded-lg p-4 space-y-4 bg-background"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSchemaExpansion(schema.name)}
                    className="p-1 hover:bg-accent rounded"
                  >
                    {expandedSchemas.includes(schema.name) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  <Input
                    value={schema.name}
                    onChange={(e) => updateSchemaName(schemaIndex, e.target.value)}
                    className="w-48"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSchema(schemaIndex)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>

              {expandedSchemas.includes(schema.name) && (
                <div className="space-y-4 pl-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Properties</h4>
                    <Button
                      onClick={() => addProperty(schemaIndex)}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                  {schema.properties.map((property, propertyIndex) => (
                    <div
                      key={propertyIndex}
                      className="grid grid-cols-[1fr,1fr,auto] gap-4 items-center"
                    >
                      <Input
                        value={property.name}
                        onChange={(e) =>
                          updatePropertyField(
                            schemaIndex,
                            propertyIndex,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Property name"
                      />
                      <Select
                        value={property.type}
                        onValueChange={(value) =>
                          updatePropertyField(
                            schemaIndex,
                            propertyIndex,
                            "type",
                            value
                          )
                        }
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProperty(schemaIndex, propertyIndex)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OpenAPIForm;
