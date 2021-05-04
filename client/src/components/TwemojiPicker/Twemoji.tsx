import * as React from "react";
import twemoji from "twemoji";

export const Twemoji: React.FC = React.memo(
  ({ children }) => {
    const ref = React.useRef<string | HTMLElement>("");

    function parseTwemoji() {
      const node = ref.current;
      twemoji.parse(node, { folder: "svg", ext: ".svg", size: "100px" });
    }

    React.useLayoutEffect(() => parseTwemoji(), [children]);

    return React.createElement("span", { ref }, children);
  },
  (prevProps, nextProps) => prevProps === nextProps
);
