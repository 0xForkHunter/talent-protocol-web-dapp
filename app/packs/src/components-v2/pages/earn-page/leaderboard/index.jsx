import { Pagination, Typography } from "@talentprotocol/design-system";
import { Container, UsersContainer } from "./styled";
import React, { useEffect, useState } from "react";
import { leaderboardService } from "../../../../api";
import { LeaderboardEntry } from "../../../leaderboard-entry";

const ITEMS_PER_PAGE = 20;

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    leaderboardService
      .getExperiencePointsLeaderboard()
      .then(({ data }) => {
        setLeaderboardData([...data.leaderboard.results, ...data.leaderboard.results, ...data.leaderboard.results]);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handlePageChange = page => {
    console.log(page);
    setCurrentPage(page);
  };

  return (
    <Container>
      <Typography specs={{ variant: "p2", type: "medium" }} color="primary03">
        Top members in the last 30 days
      </Typography>
      <UsersContainer>
        {leaderboardData
          .slice(ITEMS_PER_PAGE * currentPage, ITEMS_PER_PAGE * currentPage + ITEMS_PER_PAGE)
          .map((entry, i) => (
            <LeaderboardEntry key={entry.id} position={i + 1} entry={entry} />
          ))}
        <Pagination
          initialSelectedPage={0}
          totalPages={Math.ceil(leaderboardData.length / ITEMS_PER_PAGE)}
          onSelectPage={handlePageChange}
        />
      </UsersContainer>
    </Container>
  );
};
