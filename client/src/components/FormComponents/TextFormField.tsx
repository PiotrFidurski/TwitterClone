import * as React from "react";
import { useField, FieldAttributes } from "formik";
import { SpanContainer } from "../../styles";
import { TextFieldProps } from "@material-ui/core/TextField";
import styled, { css } from "styled-components";
import { BaseStyles } from "../../styles";
import { Field } from "formik";

export const FieldContainer = styled.div<{ hasError?: boolean }>`
  ${({ hasError }) => css`
    ${BaseStyles}
    flex-grow: 1;
    border-bottom: 2px solid
      ${hasError ? "rgb(224, 36, 94)" : "rgb(136, 153, 166)"};
    background-color: var(--colors-thirdbackground);
    border-radius: 2px;
    flex-direction: column;
    margin-bottom: 20px;
    > ${LabelContainer} {
      ${SpanContainer} {
        color: ${hasError && "rgb(224, 36, 94)"} !important;
      }
    }
  `}
`;

export const LabelContainer = styled.div`
  ${BaseStyles};
  align-self: flex-start;
  padding-top: 5px;
  padding-left: 10px;
  font-size: 5px;
  > ${SpanContainer} {
    color: var(--colors-secondarytext);
  }
`;

export const InputContainer = styled(Field)`
  ${BaseStyles};
  border-width: 0px;
  border-style: inset;
  width: 100%;
  background-color: var(--colors-thirdbackground);
  outline: none;
  padding: 2px 10px 5px 10px;
  color: var(--colors-maintext);
  font-size: 19px;
`;

type TextFormFieldProps = TextFieldProps & FieldAttributes<{}>;

export const TextFormField: React.FC<TextFormFieldProps> = (props) => {
  // eslint-disable-next-line
  const [_, meta] = useField<{}>(props);

  const errorText = meta.error;

  return (
    <FieldContainer hasError={!!errorText}>
      <LabelContainer>
        <SpanContainer>
          <span>{meta.error ? meta.error : props.label}</span>
        </SpanContainer>
      </LabelContainer>
      <InputContainer {...props} />
    </FieldContainer>
  );
};
