import { CustomDataNode } from "./renderer";

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

export default convertJsonStructure;
