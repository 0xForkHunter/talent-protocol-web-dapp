import { Button, Typography } from "@talentprotocol/design-system";
import { BottomContainer, Container, UsersContainer } from "./styled";
import React, { useEffect, useMemo, useState } from "react";
import { leaderboardService } from "../../../../api";
import { LeaderboardEntry } from "../../../leaderboard-entry";

const ITEMS_PER_PAGE = 20;

export const Leaderboard = ({ profile }) => {
  const [leaderboardEntries, setLeaderboardEntries] = useState([]);
  const [entriesToDisplay, setEntriesToDisplay] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    leaderboardService
      .getExperiencePointsLeaderboard()
      .then(({ data }) => {
        setLeaderboardEntries(data.leaderboard.results);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const ownEntryIndex = useMemo(() => {
    return leaderboardEntries.findIndex(entry => entry.id === profile?.id);
  }, [profile, leaderboardEntries]);

  const handleLoadMore = () => {
    if (leaderboardEntries.length <= entriesToDisplay) return;
    setEntriesToDisplay(entriesToDisplay + ITEMS_PER_PAGE);
  };

  const memoEntries = useMemo(() => {
    const entriesToTake = ownEntryIndex >= entriesToDisplay - 1 ? entriesToDisplay - 1 : entriesToDisplay;
    return (
      <>
        {leaderboardEntries.slice(0, Math.min(leaderboardEntries.length, entriesToTake)).map((entry, i) => (
          <LeaderboardEntry key={i} position={i + 1} entry={entry} profile={profile} />
        ))}
        {ownEntryIndex >= entriesToDisplay - 1 && (
          <LeaderboardEntry
            key={profile.id}
            position={ownEntryIndex + 1}
            entry={leaderboardEntries[ownEntryIndex]}
            profile={profile}
          />
        )}
      </>
    );
  }, [profile, entriesToDisplay, ownEntryIndex, leaderboardEntries]);
  return (
    <Container>
      <Typography specs={{ variant: "p2", type: "medium" }} color="primary03">
        Top members of all-time
      </Typography>
      <UsersContainer>{memoEntries}</UsersContainer>
      <BottomContainer>
        {leaderboardEntries.length > entriesToDisplay && (
          <Button onClick={handleLoadMore} hierarchy="secondary" text="Load more" />
        )}
      </BottomContainer>
    </Container>
  );
};
