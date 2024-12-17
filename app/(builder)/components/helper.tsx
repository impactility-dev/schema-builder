import { CustomDataNode, FormData } from "./renderer";

// interface OriginalJsonStructure {
//   name: string;
//   title: string;
//   description?: string;
//   key: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   icon?: any;
//   dataType: string;
//   required?: boolean;
//   children?: OriginalJsonStructure[];
// }

interface ConvertedJsonStructure {
  [key: string]: {
    type: string;
    title?: string;
    description?: string;
    properties?: ConvertedJsonStructure;
    required?: string[];
    format?: string;
  };
}

const jsonTemplate = {
  $metadata: {
    uris: {
      jsonLdContext: "https://example.com/path/to/file/context.jsonld",
    },
  },
  $schema: "https://json-schema.org/draft/2020-12/schema",
  properties: {
    "@context": {
      type: ["string", "array", "object"],
    },
    expirationDate: {
      format: "date-time",
      type: "string",
    },
    id: {
      type: "string",
    },
    issuanceDate: {
      format: "date-time",
      type: "string",
    },
    issuer: {
      type: ["string", "object"],
      format: "uri",
      properties: {
        id: {
          format: "uri",
          type: "string",
        },
      },
      required: ["id"],
    },
    type: {
      type: ["string", "array"],
      items: {
        type: "string",
      },
    },
    credentialSchema: {
      properties: {
        id: {
          format: "uri",
          type: "string",
        },
        type: {
          type: "string",
        },
      },
      required: ["id", "type"],
      type: "object",
    },
    credentialStatus: {
      description:
        "Allows the discovery of information about the current status of the credential, such as whether it is suspended or revoked.",
      title: "Credential Status",
      properties: {
        id: {
          description: "Id URL of the credentialStatus.",
          title: "Id",
          format: "uri",
          type: "string",
        },
        type: {
          description:
            "Expresses the credential status type (method). The value should provide enough information to determine the current status of the credential.",
          title: "Type",
          type: "string",
        },
      },
      required: ["id", "type"],
      type: "object",
    },
  },
  required: [
    "credentialSubject",
    "@context",
    "id",
    "issuanceDate",
    "issuer",
    "type",
    "credentialSchema",
  ],
  type: "object",
};

const jsonLDTemplate = {
  "@context": [
    {
      "@protected": true,
      "@version": 1.1,
      id: "@id",
      type: "@type",
      schemaType: {
        "@context": {
          "@propagate": true,
          "@protected": true,
          "polygon-vocab": "urn:uuid:ca85de13-59c7-42cb-80a6-ebaa37df53d7#",
          xsd: "http://www.w3.org/2001/XMLSchema#",
          folder: {
            "@context": {
              string: {
                "@id": "polygon-vocab:string",
                "@type": "xsd:string",
              },
              boolean: {
                "@id": "polygon-vocab:boolean",
                "@type": "xsd:boolean",
              },
            },
            "@id": "polygon-vocab:folder",
          },
          testerNumber: {
            "@id": "polygon-vocab:testerNumber",
            "@type": "xsd:double",
          },
          interger: {
            "@id": "polygon-vocab:interger",
            "@type": "xsd:integer",
          },
        },
        "@id": "urn:uuid:1d6d1c71-67bf-488f-b785-1f46485bdc9b",
      },
    },
  ],
};

function convertJsonStructure(input: CustomDataNode): ConvertedJsonStructure {
  const convertedStructure: ConvertedJsonStructure = {};

  // Main object conversion
  convertedStructure[input.name] = {
    type: input.dataType,
    title: input.title,
    description: input.description,
    properties: {},
    required: [],
  };

  // Process children recursively
  if (input.children && input.children.length > 0) {
    input.children.forEach((child) => {
      // Recursive conversion for nested properties
      if (child.dataType === "object") {
        const nestedObject = convertJsonStructure(child);
        convertedStructure[input.name].properties = {
          ...convertedStructure[input.name].properties,
          ...nestedObject,
        };
      } else {
        // Handle primitive types
        convertedStructure[input.name].properties![child.name] = {
          type: child.dataType === "string" ? "string" : child.dataType,
          title: child.title,
          description: child.description,
        };

        // Add special handling for string type
        if (child.dataType === "string") {
          convertedStructure[input.name].properties![child.name].format = "uri";
        }
      }

      // Add to required array if the child is required
      if (child.required) {
        convertedStructure[input.name].required!.push(child.name);
      }
    });
  }

  return convertedStructure;
}

function finalJsonMaker(input: CustomDataNode, formData: FormData) {
  const convertedStructure = convertJsonStructure(input);
  const finalJson = {
    ...jsonTemplate,
    $metadata: {
      ...jsonTemplate.$metadata,
      version: formData.version,
      type: formData.schemaType,
    },
    title: formData.title,
    description: formData.description,
    properties: {
      ...jsonTemplate.properties,
      ...convertedStructure,
    },
    required: convertedStructure[input.name].required,
  };

  return finalJson;
}

function finalJsonLDMaker(input: CustomDataNode, formData: FormData) {
  const finalJsonLD = {
    ...jsonLDTemplate,
  };

  return finalJsonLD;
}
export { finalJsonMaker, finalJsonLDMaker };
