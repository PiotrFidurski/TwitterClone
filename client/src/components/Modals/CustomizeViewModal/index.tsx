import * as React from "react";
import {
  BaseStylesDiv,
  HoverContainer,
  Absolute,
  SpanContainer,
  InteractiveIcon,
  ButtonContainer,
  JustifyCenter,
} from "../../../styles";
import { Modal } from "../ModalComposition/Modal";
import { ReactComponent as Checkmark } from "../../svgs/checkmark.svg";
import { useTheme } from "../../../hooks/useTheme";
import { colorPickerData, themePickerData } from "./data";
import {
  StyledContainer,
  ThemePickerContainer,
  ColorPickerWrapper,
  ColorPicker,
  Icon,
  ThemePicker,
  CheckmarkContainer,
  EmptyCircle,
} from "./styles";

export const CustomizeViewModal: React.FC = () => {
  const [theme, setTheme] = useTheme();

  return (
    <>
      <Modal>
        <Modal.Content>
          <StyledContainer>
            <h2>Customize your view</h2>
            <SpanContainer
              breakSpaces
              style={{ marginBottom: "20px" }}
              textCenter
            >
              <span>
                Manage your color and background. These settings affect all the
                Twitter accounts on this browser.
              </span>
            </SpanContainer>
            <ThemePickerContainer>
              {colorPickerData.map((_color) => (
                <ColorPickerWrapper key={_color.id}>
                  <ColorPicker
                    onClick={() => setTheme({ ...theme, color: _color.value })}
                    fill={_color.value}
                    currentColor={theme.color}
                  />
                  <Icon image={_color.icon} />
                </ColorPickerWrapper>
              ))}
            </ThemePickerContainer>
            <ThemePickerContainer>
              {themePickerData.map((bg) => (
                <ThemePicker
                  color={theme.color}
                  key={bg!.id}
                  fill={bg!.value}
                  onClick={() => setTheme({ ...theme, themeColor: bg.value })}
                >
                  <CheckmarkContainer>
                    <InteractiveIcon>
                      <HoverContainer>
                        <Absolute biggerMargin />
                        {bg.value === theme.themeColor ? (
                          <EmptyCircle
                            borderColor={theme.color}
                            background={theme.color}
                          >
                            <Checkmark />
                          </EmptyCircle>
                        ) : (
                          <EmptyCircle
                            borderColor={theme.themeColor}
                            background="transparent"
                          />
                        )}
                      </HoverContainer>
                    </InteractiveIcon>
                  </CheckmarkContainer>
                  <SpanContainer grey bold style={{ width: "60%" }} textCenter>
                    <span>{bg.title}</span>
                  </SpanContainer>
                </ThemePicker>
              ))}
            </ThemePickerContainer>
          </StyledContainer>
        </Modal.Content>
        <Modal.Header>
          {({ closeModal }) => (
            <JustifyCenter>
              <BaseStylesDiv>
                <ButtonContainer filledVariant onClick={closeModal}>
                  <SpanContainer bold>
                    <span>Done</span>
                  </SpanContainer>
                </ButtonContainer>
              </BaseStylesDiv>
            </JustifyCenter>
          )}
        </Modal.Header>
      </Modal>
    </>
  );
};
