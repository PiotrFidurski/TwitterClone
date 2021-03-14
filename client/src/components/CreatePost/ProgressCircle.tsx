import * as React from "react";
import { EditorState } from "draft-js";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { SpanContainer } from "../../styles";

interface ProgressCircleProps {
  editorState: EditorState;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  editorState,
}) => {
  const isTextLongerThan = (value: Number) => {
    return editorState.getCurrentContent().getPlainText("").length >= value;
  };

  const progressValue = Math.floor(
    (editorState.getCurrentContent().getPlainText().length / 280) * 100
  );

  const styles = {
    root: {
      width: `${isTextLongerThan(260) ? "30px" : "20px"}`,
    },
    trail: { stroke: "var(--colors-secondarytext)" },
    path: {
      stroke: `${
        isTextLongerThan(280)
          ? "rgb(224, 36, 94)"
          : isTextLongerThan(260)
          ? "rgb(255, 173, 31)"
          : "var(--colors-button)"
      }`,
    },
  };

  return (
    <CircularProgressbarWithChildren
      styles={{ ...styles }}
      value={progressValue}
    >
      <div>
        <SpanContainer
          smaller
          style={{
            color: `${
              isTextLongerThan(280) ? "rgb(224, 36, 94)" : "rgb(255, 173, 31)"
            }`,
          }}
        >
          <span>
            {isTextLongerThan(260)
              ? `${280 - editorState.getCurrentContent().getPlainText().length}`
              : ""}
          </span>
        </SpanContainer>
      </div>
    </CircularProgressbarWithChildren>
  );
};
