import { Avatar, Icon, Typography } from "@talentprotocol/design-system";
import { ExperienceTag, LeaderboardPosition, LeaderboardUserContainer, LeftContent } from "./styled";
import React from "react";

export const LeaderboardEntry = ({ position, entry, profile }) => {
  return (
    <LeaderboardUserContainer isSelf={entry?.id === profile?.id}>
      <LeftContent>
        <LeaderboardPosition position={position}>
          <Typography specs={{ variant: "p2", type: "medium" }}>{position}</Typography>
        </LeaderboardPosition>
        <Avatar
          occupation={entry.occupation || ""}
          name={entry.name}
          size="md"
          url={entry.profile_picture_url}
          profileURL={`/u/${entry.username}`}
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
