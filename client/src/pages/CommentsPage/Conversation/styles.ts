import styled from "styled-components";
import { BaseStyles } from "../../../styles";

export const DetailsHeader = styled.div`
  ${BaseStyles};
  flex-grow: 1;
  justify-content: space-between;
  min-height: 0px;
  height: 100%;
`;

export const DetailsInfo = styled.div`
  ${BaseStyles};
  border-top: 1px solid var(--colors-border);
  border-bottom: 1px solid var(--colors-border);
  padding: 15px 0;
  margin-top: 10px;
`;
