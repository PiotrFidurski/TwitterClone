import { EditorState } from "draft-js";
import * as React from "react";
import {
  Absolute,
  BaseStylesDiv,
  HoverContainer,
  SpanContainer,
} from "../../styles";
import { TextFormField } from "../FormComponents/TextFormField";
import emojiJson from "./emojis.json";
import { insertEmoji } from "./insertEmoji";
import { StyledPanelButton, StyledBody, StyledContainer } from "./styles";
import { Emoji, Props } from "./types";

let allEmojis: Array<Emoji> = [];

emojiJson.forEach((emoji) => (allEmojis = [...allEmojis, ...emoji.emojis]));

export const EmojiPicker: React.FC<Props> = ({ ...props }) => {
  const { setState, state, setFieldValue } = props;

  const [categoryIdx, setCurrentCategory] = React.useState(0);

  const [searchEmoji, setSearchEmoji] = React.useState("");

  const onEmojiSelect = (emoji: Emoji) => {
    const newState = insertEmoji(emoji.char, state);
    setFieldValue("body", newState.getCurrentContent().getPlainText("\u0001"));
    setState(
      EditorState.push(state, newState.getCurrentContent(), "insert-characters")
    );
  };

  const foundEmojis = React.useMemo(() => {
    if (!searchEmoji.length) {
      return null;
    }
    return allEmojis!
      .filter((e) => {
        if (e.name.toLowerCase().includes(searchEmoji.toLowerCase())) {
          return true;
        }
        return false;
      })
      .slice(0, 50);
  }, [searchEmoji]);

  function createEmojiSvg(unicode: string, title: string) {
    return (
      <svg width="20" height="20">
        <use href={`/emojiSprite.svg#${unicode}`}>
          <title>{title}</title>
        </use>
      </svg>
    );
  }

  function getCategories() {
    return emojiJson.map((item, index) => (
      <BaseStylesDiv
        key={index}
        flexGrow
        style={
          categoryIdx === index
            ? {
                justifyContent: "space-between",
                width: "32px",
                height: "32px",
                borderBottom: "2.5px solid var(--colors-button)",
              }
            : { justifyContent: "space-between", width: "32px", height: "32px" }
        }
      >
        <HoverContainer stretch>
          <Absolute
            noMargin
            style={{ borderRadius: "4px" }}
            onClick={() => setCurrentCategory(index)}
          />
          {createEmojiSvg(item.unicode, item.name)}
        </HoverContainer>
      </BaseStylesDiv>
    ));
  }

  function getEmojis(index: number) {
    return foundEmojis! && foundEmojis!.length > 0
      ? foundEmojis!.map((item, index) => (
          <StyledPanelButton
            key={index}
            onClick={(e: any) => onEmojiSelect(item)}
          >
            <BaseStylesDiv style={{ width: "29px", height: "29px" }}>
              <HoverContainer stretch>
                <Absolute noMargin style={{ borderRadius: "4px" }} />
                {createEmojiSvg(item.unicode, item.name)}
              </HoverContainer>
            </BaseStylesDiv>
          </StyledPanelButton>
        ))
      : emojiJson[index].emojis.map((item, index) => (
          <StyledPanelButton
            key={index}
            onClick={(e: any) => onEmojiSelect(item)}
          >
            <BaseStylesDiv style={{ width: "29px", height: "29px" }}>
              <HoverContainer stretch>
                <Absolute noMargin style={{ borderRadius: "4px" }} />
                {createEmojiSvg(item.unicode, item.name)}
              </HoverContainer>
            </BaseStylesDiv>
          </StyledPanelButton>
        ));
  }

  return (
    <BaseStylesDiv style={{ maxWidth: "300px", minHeight: "470px" }}>
      <StyledContainer>
        <BaseStylesDiv
          flexGrow
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "10px 7px 5px 7px",
          }}
        >
          <TextFormField
            placeholder="search emojis"
            name="search"
            autoComplete="off"
            onChange={(e: any) => setSearchEmoji(e.target.value)}
          />
        </BaseStylesDiv>
        <BaseStylesDiv
          flexGrow
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "5px 7px 10px 7px",
          }}
        >
          {getCategories()}
        </BaseStylesDiv>
        <BaseStylesDiv
          style={{
            borderBottom: "1px solid var(--colors-border)",
            padding: "10px 15px",
          }}
        >
          <SpanContainer bigger bolder>
            <span>
              {searchEmoji &&
              searchEmoji.length &&
              foundEmojis &&
              foundEmojis!.length > 0
                ? "Search result"
                : emojiJson[categoryIdx].name}
            </span>
          </SpanContainer>
        </BaseStylesDiv>
        <StyledBody>{getEmojis(categoryIdx)}</StyledBody>
      </StyledContainer>
    </BaseStylesDiv>
  );
};
