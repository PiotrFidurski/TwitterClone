import * as React from "react";
import { ContentBlock, CompositeDecorator } from "draft-js";
import { parse } from "twemoji-parser";

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

const handleErrorEmojiSpan = (props: {
  offsetKey: string;
  children: React.ReactNode;
  emoji: any;
  decoratedText: any;
}) => {
  const emoji = parse(props.decoratedText);

  return (
    <span
      className="style-emoji"
      style={{ backgroundImage: `url(${emoji[0].url})` }}
    >
      <span style={{ clipPath: "circle(0% at 50% 50%)" }}>
        <span key={props.offsetKey}>{props.children}</span>
      </span>
    </span>
  );
};

function handleErrorEmojiStrat(
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

export const emojiDecorator = new CompositeDecorator([
  { strategy: handleErrorEmojiStrat, component: handleErrorEmojiSpan },
]);

export default new CompositeDecorator([
  { strategy: handleErrorStrat, component: handleErrorSpan },
]);
