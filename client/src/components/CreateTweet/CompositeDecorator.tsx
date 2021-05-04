import * as React from "react";
import { ContentBlock, CompositeDecorator } from "draft-js";

const handleErrorSpan = (props: {
  offsetKey: string;
  children: React.ReactNode;
}) => (
  <span
    style={{
      color: "inherit",
      backgroundColor: "rgb(224, 36, 94)",
      height: "70%",
    }}
    data-offset-key={props.offsetKey}
  >
    {props.children}
  </span>
);

function handleErrorStrat(
  contentBlock: ContentBlock,
  callback: (length: number, blockLength: number) => void
) {
  if (contentBlock.getLength() >= 280) {
    callback(280, contentBlock.getLength());
  }
}

export default new CompositeDecorator([
  { strategy: handleErrorStrat, component: handleErrorSpan },
]);
