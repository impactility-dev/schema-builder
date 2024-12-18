"use client";

import { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import { TreeDataNode } from "antd";
import { v4 as uuidv4 } from "uuid";
import { File, Folder } from "lucide-react";
import Preview from "./preview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FormData {
  title: string;
  schemaType: string;
  version: string;
  description: string;
  credentialType: "Merklized" | "Non-merklized";
}

export interface CustomDataNode extends TreeDataNode {
  required: boolean;
  children?: CustomDataNode[];
  name: string;
  title: string;
  dataType: "string" | "number" | "boolean" | "object" | "integer";
  description: string;
}

const seedTreeData: CustomDataNode[] = [
  {
    name: "credentialSubject",
    title: "Credential Subject",
    description: "Stores the data of the credential",
    key: uuidv4(),
    icon: <Folder size={15} className="mt-[0.35rem]" />,
    dataType: "object",
    required: true,
    children: [
      {
        required: false,
        key: uuidv4(),
        icon: <File size={15} className="mt-[0.35rem]" />,
        dataType: "string",
        name: "id",
        title: "Credential subject ID",
        description: "Stores the DID of the subject that owns the credential",
      },
    ],
  },
];

const Renderer = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    schemaType: "",
    version: "",
    description: "",
    credentialType: "Merklized",
  });

  const [treeData, setTreeData] = useState<CustomDataNode[]>(seedTreeData);
  const [isViewJson, setIsViewJson] = useState(true);

  return (
    <div className="h-[calc(100vh-170px)] py-4">
      <div className="grid grid-cols-2 gap-6 h-full">
        <div className="overflow-auto" id="left">
          {step === 1 ? (
            <Step1
              setStep={setStep}
              setFormData={setFormData}
              formData={formData}
            />
          ) : (
            <Step2
              setStep={setStep}
              treeData={treeData}
              setTreeData={setTreeData}
            />
          )}
        </div>
        <div className="overflow-auto max-h-full" id="right">
          <div className="flex justify-between items-center pb-8">
            <h1 className="text-md font-bold pb-4">Preview</h1>
            <div className="pr-4">
              <Select
                value={isViewJson ? "json" : "jsonLD"}
                onValueChange={(value) => setIsViewJson(value === "json")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">Json</SelectItem>
                  <SelectItem value="jsonLD">Json-ld</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Preview
            formData={formData}
            treeData={treeData}
            isViewJson={isViewJson}
          />
        </div>
      </div>
    </div>
  );
};

export default Renderer;
