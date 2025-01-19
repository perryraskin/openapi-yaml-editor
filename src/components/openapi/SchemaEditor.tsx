import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import SchemaProperty from "./SchemaProperty";

interface Schema {
  name: string;
  properties: {
    name: string;
    type: string;
    format?: string;
  }[];
}

interface SchemaEditorProps {
  schemas: Schema[];
  expandedSchemas: string[];
  onSchemasChange: (schemas: Schema[]) => void;
  onExpandedSchemasChange: (expandedSchemas: string[]) => void;
}

const SchemaEditor = ({
  schemas,
  expandedSchemas,
  onSchemasChange,
  onExpandedSchemasChange,
}: SchemaEditorProps) => {
  const toggleSchemaExpansion = (schemaName: string) => {
    onExpandedSchemasChange(
      expandedSchemas.includes(schemaName)
        ? expandedSchemas.filter((name) => name !== schemaName)
        : [...expandedSchemas, schemaName]
    );
  };

  const addSchema = () => {
    const newSchema: Schema = {
      name: `NewSchema${schemas.length + 1}`,
      properties: [],
    };
    onSchemasChange([...schemas, newSchema]);
    onExpandedSchemasChange([...expandedSchemas, newSchema.name]);
  };

  const removeSchema = (index: number) => {
    onSchemasChange(schemas.filter((_, i) => i !== index));
  };

  const updateSchemaName = (index: number, newName: string) => {
    const newSchemas = [...schemas];
    newSchemas[index] = { ...newSchemas[index], name: newName };
    onSchemasChange(newSchemas);
  };

  const addProperty = (schemaIndex: number) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties.push({
      name: `newProperty${newSchemas[schemaIndex].properties.length + 1}`,
      type: "string",
    });
    onSchemasChange(newSchemas);
  };

  const updateProperty = (
    schemaIndex: number,
    propertyIndex: number,
    field: "name" | "type" | "format",
    value: string
  ) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties[propertyIndex] = {
      ...newSchemas[schemaIndex].properties[propertyIndex],
      [field]: value,
    };
    onSchemasChange(newSchemas);
  };

  const removeProperty = (schemaIndex: number, propertyIndex: number) => {
    const newSchemas = [...schemas];
    newSchemas[schemaIndex].properties = newSchemas[
      schemaIndex
    ].properties.filter((_, i) => i !== propertyIndex);
    onSchemasChange(newSchemas);
  };

  return (
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
                  onChange={(e) =>
                    updateSchemaName(schemaIndex, e.target.value)
                  }
                  className="w-96"
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
                  <SchemaProperty
                    key={propertyIndex}
                    property={property}
                    onUpdate={(field, value) =>
                      updateProperty(schemaIndex, propertyIndex, field, value)
                    }
                    onRemove={() => removeProperty(schemaIndex, propertyIndex)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaEditor;
