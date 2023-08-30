import { buildColor } from "@talentprotocol/design-system";
import styled, { css } from "styled-components";

export const LeaderboardUserContainer = styled.a`
  outline: none;
  text-decoration: none;
  padding: 16px 16px;
  color: ${buildColor("primary01")};
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${buildColor("surfaceHover02")};
  gap: 16px;
  cursor: pointer;

  &:hover {
    background-color: ${buildColor("primaryTint02")};
  }
`;

export const LeftContent = styled.div`
  display: flex;
  gap: 16px;
`;

export const LeaderboardPosition = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  ${({ position }) => css`
    color: ${position <= 3 ? buildColor("bg01") : buildColor("primary01")};
    border: ${position > 3 ? "1px solid " + buildColor("surfaceHover02") : "none"};
    background-color: ${position === 1
      ? buildColor("primary")
      : position === 2 || position === 3
      ? buildColor("primaryTint01")
      : buildColor("bg01")};
  `};
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
`;
