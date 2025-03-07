"use client";

import { useEffect, useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import { TreeDataNode } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Copy, Download, File, Folder } from "lucide-react";
import Preview from "./preview";
import toast, { Toaster } from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { finalJsonLDMaker, finalJsonMaker } from "./helper";

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
    title: "Credential subject",
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

  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(
      JSON.stringify(
        isViewJson
          ? finalJsonMaker(treeData[0], formData)
          : finalJsonLDMaker(treeData[0], formData),
        null,
        2
      )
    );
  }, [formData, treeData, isViewJson]);

  return (
    <div className="h-[calc(100vh-104px)] py-4">
      <div><Toaster /></div>
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
        <div className="overflow-hidden flex flex-col" id="right">
          <div className="flex justify-between items-center pb-3">
            <h1 className="text-md font-bold pb-4">Preview</h1>
            <div className="flex gap-2">
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

              <Button variant="outline" disabled={
                formData.title === ""
              } onClick={() => {
                navigator.clipboard.writeText(
                  code
                ).then(() => {
                  toast.success("Copied to clipboard");
                });

              }}>
                Copy
                <Copy size={15} className="ml-2" />
              </Button>
              <Button
                disabled={
                  formData.title === ""
                }
                onClick={() => {
                  const element = document.createElement("a");
                  const file = new Blob(
                    [
                      code
                    ],
                    { type: "application/json" }
                  );
                  element.href = URL.createObjectURL(file);
                  element.download = isViewJson ? `${formData.title}_json.json` : `${formData.title}_json-ld.jsonld`;
                  document.body.appendChild(element);
                  element.click()
                  toast.success("Downloaded");
                }}>
                Download
                <Download size={15} className="ml-2" />
              </Button>
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
