import { desktopStyles, buildColor } from "@talentprotocol/design-system";
import styled, { css } from "styled-components";

export const Container = styled.section`
  padding: 24px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 24px auto 52px;

  ${desktopStyles(css`
    width: 1128px;
    max-width: 1128px;

    p {
      max-width: 562px;
    }
  `)}
`;

export const UsersContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > * {
    border-bottom: 1px solid ${buildColor("surfaceHover02")};
  }
`;

export const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;
