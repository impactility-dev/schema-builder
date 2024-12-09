import convertJsonStructure from "./helper";
import { CustomDataNode, FormData } from "./renderer";
import { CopyBlock } from "react-code-blocks";

const Preview = ({
  formData,
  treeData,
}: {
  formData: FormData;
  treeData: CustomDataNode[];
}) => {
  console.log(JSON.stringify(treeData[0], null, 2));
  console.log(JSON.stringify(convertJsonStructure(treeData[0]), null, 2));
  return (
    <div>
      <h1>Preview</h1>
      <p>Preview content</p>
      <CopyBlock
        text={JSON.stringify(convertJsonStructure(treeData[0]), null, 2)}
        language={"json"}
        showLineNumbers={false}
        wrapLongLines={true}
      />
    </div>
  );
};

export default Preview;
