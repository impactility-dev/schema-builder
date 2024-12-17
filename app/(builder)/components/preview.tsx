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
  return (
    <div>
      <CodeBlock
        text={JSON.stringify(
          isViewJson
            ? finalJsonMaker(treeData[0], formData)
            : finalJsonLDMaker(treeData[0], formData),
          null,
          2
        )}
        language={"json"}
        showLineNumbers={false}
        wrapLongLines={true}
      />
    </div>
  );
};

export default Preview;
