import finalJsonMaker from "./helper";
import { CustomDataNode, FormData } from "./renderer";
import { CodeBlock } from "react-code-blocks";

const Preview = ({
  formData,
  treeData,
}: {
  formData: FormData;
  treeData: CustomDataNode[];
}) => {
  return (
    <div>
      <CodeBlock
        text={JSON.stringify(finalJsonMaker(treeData[0], formData), null, 2)}
        language={"json"}
        showLineNumbers={false}
        wrapLongLines={true}
      />
    </div>
  );
};

export default Preview;
