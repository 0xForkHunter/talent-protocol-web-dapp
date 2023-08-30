import { buildColor } from "@talentprotocol/design-system";
import styled, { css } from "styled-components";

export const LeaderboardUserContainer = styled.div`
  outline: none;
  text-decoration: none;
  padding: 16px 16px;
  color: ${buildColor("primary01")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  background-color: ${({ isSelf }) => (isSelf ? buildColor("primaryTint02") : buildColor("bg01"))};
`;

export const LeftContent = styled.div`
  display: flex;
  gap: 8px;
`;

export const LeaderboardPosition = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  border: 1px solid ${buildColor("surfaceHover02")};
  ${({ position }) => {
    const isColored = position <= 3;
    return css`
      color: ${isColored ? buildColor("primary") : buildColor("primary01")};
      background-color: ${isColored ? buildColor("primaryTint02") : "inherit"};
      border-color: ${isColored ? buildColor("primary") : buildColor("surfaceHover02")};
    `;
  }};
`;

export const ExperienceTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid ${buildColor("surfaceHover02")};
  border-radius: 4px;
  gap: 8px;
  white-space: nowrap;
  color: ${buildColor("primary01")};
`;
