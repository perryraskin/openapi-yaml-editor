import { useState, useEffect } from "react";
import { dump, load } from "js-yaml";
import APIInfo from "./openapi/APIInfo";
import ServerConfig from "./openapi/ServerConfig";
import SchemaEditor from "./openapi/SchemaEditor";

interface OpenAPIFormProps {
  onYamlChange: (yaml: string) => void;
  initialYaml?: string;
  yaml: string;
}

interface Schema {
  name: string;
  properties: {
    name: string;
    type: string;
    format?: string;
  }[];
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

  useEffect(() => {
    try {
      const parsedYaml = load(yaml) as any;
      
      if (parsedYaml.info) {
        setInfo({
          title: parsedYaml.info.title || "Sample API",
          description: parsedYaml.info.description || "Optional multiline or single-line description",
          version: parsedYaml.info.version || "0.1.0",
        });
      }

      if (parsedYaml.servers?.[0]) {
        setServer({
          url: parsedYaml.servers[0].url || "http://api.example.com/v1",
          description: parsedYaml.servers[0].description || "Production server",
        });
      }

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

  useEffect(() => {
    updateYAML();
  }, [info, server, schemas]);

  return (
    <div className="space-y-6 p-4">
      <APIInfo info={info} onChange={setInfo} />
      <ServerConfig server={server} onChange={setServer} />
      <SchemaEditor
        schemas={schemas}
        expandedSchemas={expandedSchemas}
        onSchemasChange={setSchemas}
        onExpandedSchemasChange={setExpandedSchemas}
      />
    </div>
  );
};

export default OpenAPIForm;