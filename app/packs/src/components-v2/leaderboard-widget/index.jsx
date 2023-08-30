import React, { useEffect, useState } from "react";
import { Container, Entry, EntryIdentification, Footer, ListContainer, TitleContainer } from "./styled";
import { Avatar, Button, TextLink, Typography } from "@talentprotocol/design-system";
import { leaderboardService } from "../../api/leaderboard";
import { toast } from "react-toastify";

export const LeaderboardWidget = ({ user }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);
  useEffect(() => {
    leaderboardService
      .getExperiencePointsLeaderboard()
      .then(({ data }) => {
        setLeaderboardData(data.leaderboard);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);
  return (
    !isLoading && (
      <Container>
        {!!leaderboardData.results.length && (
          <TitleContainer>
            <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
              Community Leaderboard
            </Typography>
            <TextLink
              text="Go to leaderboard"
              rightIcon="carret"
              color="primary"
              size="small"
              href="/quests?tab=leaderboard"
            />
          </TitleContainer>
        )}
        <ListContainer>
          {leaderboardData.results.slice(0, 5).map((entry, index) => (
            <Entry key={entry.username}>
              <EntryIdentification>
                <Typography specs={{ variant: "label2", type: "medium" }} color="primary01">
                  #{index + 1}
                </Typography>
                <Avatar
                  userId={1}
                  occupation={`${entry.score.toLocaleString()} experience points`}
                  name={entry.name}
                  size="md"
                  url={entry.profile_picture_url}
                  profileURL={`/u/${entry.username}`}
                  isVerified={entry.verified}
                />
              </EntryIdentification>
            </Entry>
          ))}
        </ListContainer>
        <Footer isEmpty={!!leaderboardData.length}>
          <Typography specs={{ variant: "h4", type: "regular" }} color="primary01">
            <b>Help the</b> <i>community</i> <b>grow</b>
          </Typography>
          <Typography specs={{ variant: "p2", type: "regular" }} color="primary01">
            Invite your peers to join and earn rewards.
          </Typography>
          <Button
            hierarchy="primary"
            size="large"
            text="Copy your referral link"
            isStretched
            rightIcon="copy"
            onClick={() => {
              navigator.clipboard.writeText(`https://beta.talentprotocol.com/join/${user?.username}`);
              toast.success("Copied to clipboard!", {
                autoClose: 3000
              });
            }}
          />
        </Footer>
      </Container>
    )
  );
};
