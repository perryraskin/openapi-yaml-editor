/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { dump, load } from "js-yaml";
import APIInfo from "./openapi/APIInfo";
import ServerConfig from "./openapi/ServerConfig";
import SchemaEditor from "./openapi/SchemaEditor";
import PathsEditor, { Path, PathOperation } from "./openapi/PathsEditor";

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

  const [schemas, setSchemas] = useState<Schema[]>([]);
  const [paths, setPaths] = useState<Path[]>([]);

  const [expandedSchemas, setExpandedSchemas] = useState<string[]>([]);

  useEffect(() => {
    try {
      const parsedYaml = load(yaml) as any;

      if (parsedYaml.info) {
        setInfo({
          title: parsedYaml.info.title || "Sample API",
          description:
            parsedYaml.info.description ||
            "Optional multiline or single-line description",
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
        const newSchemas: Schema[] = Object.entries(
          parsedYaml.components.schemas
        ).map(([name, schema]: [string, any]) => ({
          name,
          properties: Object.entries(schema.properties || {}).map(
            ([propName, propDetails]: [string, any]) => ({
              name: propName,
              type: propDetails.type || "string",
              ...(propDetails.format && { format: propDetails.format }),
            })
          ),
        }));
        setSchemas(newSchemas);
      }

      if (parsedYaml.paths) {
        const newPaths: Path[] = Object.entries(parsedYaml.paths).map(
          ([pathName, pathObj]: [string, any]) => {
            const [method, operation] = Object.entries(pathObj)[0];
            return {
              path: pathName,
              method: method as Path["method"],
              operation: operation as PathOperation,
            };
          }
        );
        setPaths(newPaths);
      }
    } catch (error) {
      console.error("Error parsing YAML:", error);
    }
  }, []);

  useEffect(() => {
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

    const pathsObject: { [key: string]: any } = {};
    paths.forEach((path) => {
      pathsObject[path.path] = {
        [path.method]: path.operation,
      };
    });

    const newYaml = {
      openapi: "3.0.0",
      info,
      servers: [server],
      components: {
        schemas: schemasObject,
      },
      paths: pathsObject,
    };

    const yamlString = dump(newYaml);
    onYamlChange(yamlString);
    localStorage.setItem("yaml", yamlString);
  }, [info, server, schemas, paths, onYamlChange]);

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
      <PathsEditor paths={paths} schemas={schemas} onPathsChange={setPaths} />
    </div>
  );
};

export default OpenAPIForm;
