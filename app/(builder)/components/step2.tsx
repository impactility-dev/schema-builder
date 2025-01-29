import { Tree, TreeProps } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { File, Folder } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDataNode } from "./renderer";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  dataType: z.enum(["string", "number", "boolean", "object", "integer"]),
  description: z.string().min(1, "Description is required"),
  required: z.boolean(),
});

interface Step2Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  treeData: CustomDataNode[];
  setTreeData: React.Dispatch<React.SetStateAction<CustomDataNode[]>>;
}

const Step2: React.FC<Step2Props> = ({ setStep, treeData, setTreeData }) => {
  const [selectedNode, setSelectedNode] = useState<CustomDataNode | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      dataType: "string",
      description: "",
      required: false,
    },
  });

  const findAndAdd = (node: CustomDataNode) => {
    if (node.key === selectedNode!.key) {
      node.children = node.children || [];
      node.children.push({
        title: "My Attribute",
        name: "my-attribute",
        key: uuidv4(),
        icon: <Folder size={15} className="mt-[0.35rem]" />,
        dataType: "object",
        description: "My attribute description",
        required: false,
      });
      return;
    }
    if (node.children) {
      for (const child of node.children) {
        findAndAdd(child);
      }
    }
  };

  const findAndRemove = (node: CustomDataNode) => {
    if (node.children) {
      node.children = node.children.filter((child) => {
        if (child.key === selectedNode!.key) {
          return false;
        }
        findAndRemove(child);
        setSelectedNode(null);
        return true;
      });
    }
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    const node = info.node as unknown as CustomDataNode;
    setSelectedNode(node);
    console.log(node);
    form.reset({
      name: node.name,
      title: node.title,
      dataType: node.dataType,
      description: node.description,
      required: node.required,
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setTreeData((prev) => {
      const newTree = [...prev];
      const findAndUpdate = (node: CustomDataNode) => {
        if (!selectedNode) return prev;
        if (node.key === selectedNode.key) {
          node.name = values.name;
          node.title = values.title;
          node.dataType = values.dataType;
          if (values.dataType === "object") {
            node.icon = <Folder size={15} className="mt-[0.35rem]" />;
          } else {
            node.icon = <File size={15} className="mt-[0.35rem]" />;
          }
          node.description = values.description;
          node.required = values.required;
          return;
        }
        if (node.children) {
          for (const child of node.children) {
            findAndUpdate(child);
          }
        }
      };
      for (const node of newTree) {
        findAndUpdate(node);
      }
      return newTree;
    });
  };

  return (
    <div>
      <div className="flex gap-2 justify-end">
        <Button
          disabled={selectedNode === null || selectedNode.dataType !== "object"}
          onClick={() => {
            const tree = treeData[0];

            findAndAdd(tree);
            setTreeData([tree]);
          }}
        >
          Add
        </Button>
        <Button
          disabled={
            selectedNode === null ||
            selectedNode.name === "id" ||
            selectedNode.name === "credentialSubject"
          }
          variant="destructive"
          onClick={() => {
            const tree = treeData[0];
            findAndRemove(tree);
            setTreeData([tree]);
          }}
        >
          Remove
        </Button></div>
      <Tree
        defaultExpandAll
        autoExpandParent
        defaultExpandParent
        showIcon
        showLine
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        treeData={treeData}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Name"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Title"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={form.formState.isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="object">Object</SelectItem>
                    <SelectItem value="integer">Integer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    {...field}
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel className="text-right">Required</FormLabel>
                <FormControl>
                  <div style={{ marginBottom: "0.4rem" }}>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button type="submit">Save</Button></div>
        </form>
      </Form>
    </div>
  );
};

export default Step2;
