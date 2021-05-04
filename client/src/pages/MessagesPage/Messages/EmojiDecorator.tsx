import * as React from "react";
import { ContentBlock, CompositeDecorator } from "draft-js";
import twemoji from "twemoji";

const handleSpan = (props: {
  offsetKey: string;
  children: React.ReactNode;
  emoji: any;
  decoratedText: any;
}) => {
  const e = twemoji.parse(props.decoratedText);
  const url = e.match(/(https:\/\/[^">]+)g/);
  if (!url) return <span>{props.children}</span>;
  return (
    <span
      className="style-emoji"
      style={{ backgroundImage: `url(${url![0]})` }}
    >
      <span style={{ clipPath: "circle(0% at 50% 50%)" }}>
        {props.children}
      </span>
    </span>
  );
};

function handleStrat(
  contentBlock: ContentBlock,
  callback: (length: number, blockLength: number) => void
) {
  const regex = /\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]/g;

  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}

export const EmojiDecorator = new CompositeDecorator([
  { strategy: handleStrat, component: handleSpan },
]);
