import { useEffect, useState } from "react";
import { finalJsonLDMaker, finalJsonMaker } from "./helper";
import { CustomDataNode, FormData } from "./renderer";
import { CodeBlock } from "react-code-blocks";

const Preview = ({
  formData,
  treeData,
  isViewJson,
}: {
  formData: FormData;
  treeData: CustomDataNode[];
  isViewJson: boolean;
}) => {
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
    <CodeBlock
      text={code}
      language={"json"}
      showLineNumbers={false}
      wrapLongLines={true}
    />
  );
};

export default Preview;
