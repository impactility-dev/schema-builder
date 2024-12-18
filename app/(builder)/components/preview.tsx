import { CodeBlock } from "react-code-blocks";

const Preview = ({ text }: { text: string }) => {
  return (
    <div>
      <CodeBlock
        text={text}
        language={"json"}
        showLineNumbers={false}
        wrapLongLines={true}
      />
    </div>
  );
};

export default Preview;
