import { Avatar, Icon, Typography } from "@talentprotocol/design-system";
import { ExperienceTag, LeaderboardPosition, LeaderboardUserContainer, LeftContent } from "./styled";
import React, { useMemo } from "react";

export const LeaderboardEntry = ({ position, entry }) => {
  const profileUrl = useMemo(() => `/u/${entry.username}`, [entry]);
  return (
    <LeaderboardUserContainer href={profileUrl}>
      <LeftContent>
        <LeaderboardPosition position={position}>
          <Typography specs={{ variant: "p2", type: "medium" }}>{position}</Typography>
        </LeaderboardPosition>
        <Avatar
          occupation={`5 streaks`}
          name={entry.name}
          size="md"
          url={entry.profile_picture_url}
          profileURL={profileUrl}
          isVerified={entry.verified}
        />
      </LeftContent>
      <ExperienceTag>
        <Icon name="flash" size={12} />
        <Typography specs={{ variant: "label3", type: "medium" }}>{entry.score}</Typography>
      </ExperienceTag>
    </LeaderboardUserContainer>
  );
};
