import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface PathResponse {
  description: string;
  content: {
    "application/json": {
      schema: {
        $ref?: string;
        type?: string;
        properties?: Record<
          string,
          {
            type: string;
            format?: string;
          }
        >;
      };
    };
  };
}

export interface PathOperation {
  summary: string;
  operationId: string;
  requestBody?: {
    required: boolean;
    content: {
      "application/json": {
        schema: {
          $ref: string;
        };
      };
    };
  };
  responses: Record<string, PathResponse>;
}

export interface Path {
  path: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  operation: PathOperation;
}

interface PathsEditorProps {
  paths: Path[];
  schemas: { name: string }[];
  onPathsChange: (paths: Path[]) => void;
}

const PathsEditor = ({ paths, schemas, onPathsChange }: PathsEditorProps) => {
  const [expandedPaths, setExpandedPaths] = useState<string[]>([]);

  const addPath = () => {
    const newPath: Path = {
      path: "/new-path",
      method: "get",
      operation: {
        summary: "New Operation",
        operationId: "newOperation",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {},
                },
              },
            },
          },
        },
      },
    };
    onPathsChange([...paths, newPath]);
    setExpandedPaths([...expandedPaths, newPath.path]);
  };

  const updatePath = (index: number, updatedPath: Path) => {
    const newPaths = [...paths];
    newPaths[index] = updatedPath;
    onPathsChange(newPaths);
  };

  const deletePath = (index: number) => {
    const newPaths = paths.filter((_, i) => i !== index);
    onPathsChange(newPaths);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Paths</CardTitle>
        <Button onClick={addPath}>Add Path</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paths.map((path, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={`path-${index}`}>Path</Label>
                    <Input
                      id={`path-${index}`}
                      value={path.path}
                      onChange={(e) =>
                        updatePath(index, { ...path, path: e.target.value })
                      }
                      placeholder="/path"
                    />
                  </div>

                  <div className="w-[200px]">
                    <Label htmlFor={`method-${index}`}>Method</Label>
                    <Select
                      value={path.method}
                      onValueChange={(value) =>
                        updatePath(index, {
                          ...path,
                          method: value as Path["method"],
                        })
                      }
                    >
                      <SelectTrigger id={`method-${index}`}>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="get">GET</SelectItem>
                        <SelectItem value="post">POST</SelectItem>
                        <SelectItem value="put">PUT</SelectItem>
                        <SelectItem value="delete">DELETE</SelectItem>
                        <SelectItem value="patch">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      onClick={() => deletePath(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`summary-${index}`}>Summary</Label>
                    <Input
                      id={`summary-${index}`}
                      value={path.operation.summary}
                      onChange={(e) =>
                        updatePath(index, {
                          ...path,
                          operation: {
                            ...path.operation,
                            summary: e.target.value,
                          },
                        })
                      }
                      placeholder="Summary"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`operationId-${index}`}>Operation ID</Label>
                    <Input
                      id={`operationId-${index}`}
                      value={path.operation.operationId}
                      onChange={(e) =>
                        updatePath(index, {
                          ...path,
                          operation: {
                            ...path.operation,
                            operationId: e.target.value,
                          },
                        })
                      }
                      placeholder="Operation ID"
                    />
                  </div>

                  {["post", "put", "patch"].includes(path.method) && (
                    <div>
                      <Label htmlFor={`schema-${index}`}>
                        Request Body Schema
                      </Label>
                      <Select
                        value={path.operation.requestBody?.content[
                          "application/json"
                        ].schema.$ref
                          ?.split("/")
                          .pop()}
                        onValueChange={(value) =>
                          updatePath(index, {
                            ...path,
                            operation: {
                              ...path.operation,
                              requestBody: {
                                required: true,
                                content: {
                                  "application/json": {
                                    schema: {
                                      $ref: `#/components/schemas/${value}`,
                                    },
                                  },
                                },
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger id={`schema-${index}`}>
                          <SelectValue placeholder="Select schema" />
                        </SelectTrigger>
                        <SelectContent>
                          {schemas.map((schema) => (
                            <SelectItem key={schema.name} value={schema.name}>
                              {schema.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default PathsEditor;
