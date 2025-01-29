import { CustomDataNode, FormData } from "./renderer";

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

interface ConvertedJsonLDStructure {
  "@context"?: {
    [key: string]: ConvertedJsonLDStructure;
  }
  "@id": string;
  "@type"?: string;
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
    },
  ],
};

const jsonLDSchemaContext = {
  "@context": {
    "@propagate": true,
    "@protected": true,
    "polygon-vocab": "urn:uuid:8301b386-484d-4845-80cf-8491802bb228#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
  },
  "@id": "urn:uuid:1db8c9be-032e-434c-a193-a64954fa2f4d"
}


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

        // Add special handling for id
        if (child.name === "id") {
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



function convertJsonLDStructure(input: CustomDataNode): ConvertedJsonLDStructure {
  const convertedStructure: ConvertedJsonLDStructure = {
    "@id": `polygon-vocab:${input.name}`,
  };
  if (input.dataType === "object") {
    convertedStructure["@context"] = {};
    if (input.children && input.children.length > 0) {
      input.children.forEach((child) => {
        const nestedObject = convertJsonLDStructure(child);
        convertedStructure["@context"] = {
          ...convertedStructure["@context"],
          [child.name]: nestedObject,
        };
      });
    }
  } else if (input.dataType === "number") {
    convertedStructure["@type"] = "xsd:double";
  }
  else {
    convertedStructure["@type"] = `xsd:${input.dataType}`;
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
    required: [
      "credentialSubject",
      "@context",
      "id",
      "issuanceDate",
      "issuer",
      "type",
      "credentialSchema"
    ]
  };

  return finalJson;
}

function finalJsonLDMaker(input: CustomDataNode, formData: FormData) {
  const tempJsonLDSchemaContext = { ...jsonLDSchemaContext };
  const finalJsonLD = jsonLDTemplate;
  const inputWithout1stChild = { ...input };
  inputWithout1stChild.children = inputWithout1stChild.children?.slice(1);
  tempJsonLDSchemaContext["@context"] = {
    ...tempJsonLDSchemaContext["@context"],
    ...convertJsonLDStructure(inputWithout1stChild)["@context"]
  };
  finalJsonLD["@context"][0] = {
    ...finalJsonLD["@context"][0],
    [formData.schemaType]: tempJsonLDSchemaContext
  }

  return { "@context": [finalJsonLD] };
}
export { finalJsonMaker, finalJsonLDMaker };
