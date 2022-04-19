import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { get } from "src/utils/requests";
import { TALENT_TOKEN_APPLICATION_FORM } from "src/utils/constants";

import Tag from "src/components/design_system/tag";
import {
  P1,
  P2,
  P3,
  H3,
  H4,
  H5,
} from "src/components/design_system/typography";
import { Copy, OrderBy, Spinner } from "src/components/icons";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";
import Table from "src/components/design_system/table";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";

dayjs.extend(utc);

const RaceHeader = ({ isEligible, race, isTalent, username }) => {
  const [timeUntilEnd, setTimeUntilEnd] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  let timeoutPointer;

  const updateTimeUntilEnd = () => {
    // All calculations need to be done in UTC
    const currentTime = dayjs().utc();
    let raceEndTime = dayjs(race.ends_at).utc().endOf("day");

    if (currentTime.isAfter(raceEndTime)) {
      setTimeUntilEnd({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      return;
    }

    const days = raceEndTime.diff(currentTime, "days");
    raceEndTime = raceEndTime.subtract(days, "days");
    const hours = raceEndTime.diff(currentTime, "hours");
    raceEndTime = raceEndTime.subtract(hours, "hours");
    const minutes = raceEndTime.diff(currentTime, "minutes");
    raceEndTime = raceEndTime.subtract(minutes, "minutes");
    const seconds = raceEndTime.diff(currentTime, "seconds");

    setTimeUntilEnd({
      days,
      hours,
      minutes,
      seconds,
    });

    timeoutPointer = setTimeout(() => updateTimeUntilEnd(), 1000);
  };

  const redirectToLaunchToken = () => {
    if (isTalent) {
      window.location.href = `u/${username}/edit_profile`;
    } else {
      window.open(TALENT_TOKEN_APPLICATION_FORM);
    }
  };

  useEffect(() => {
    updateTimeUntilEnd();

    return () => clearTimeout(timeoutPointer);
  }, [race]);

  if (!isEligible) {
    return (
      <div className="race-header-row p-4 p-lg-6 mx-4 mx-lg-0 overview-section">
        <div className="d-flex flex-column col-lg-6">
          <H4 className="mb-3 d-flex flex-row align-items-center" bold>
            Referral Race
          </H4>
          <P1>
            Every week the 3 users with the most referrals will win a total of
            2,000 $TAL. The 1st wins 1,200, the 2nd 500 and the 3rd 300. No
            repeat winners. You must connect your wallet to be eligible.
          </P1>
        </div>
        <div className="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-end col-lg-5 px-4 px-lg-0 mt-4 mt-lg-0">
          <Button
            type="primary-default"
            size="big"
            onClick={() => (window.location.href = "/talent")}
          >
            Start Supporting
          </Button>
          <Button
            type="primary-outline"
            className="ml-0 ml-lg-2 mt-2 mt-lg-0"
            size="big"
            onClick={redirectToLaunchToken}
          >
            Launch a Talent Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="race-header-row">
        <div className="d-flex flex-column col-lg-5 px-4 px-lg-0">
          <H4 className="mb-3 d-flex flex-row align-items-center" bold>
            Referral Race
          </H4>
          <P1>
            Every week the 3 users with the most referrals will win a total of
            2,000 $TAL. The 1st wins 1200, the 2nd 500 and the 3rd 300. No
            repeat winners. You must connect your wallet to be eligible.
          </P1>
        </div>
        <div className="d-flex flex-row justify-content-center justify-content-lg-end col-lg-5 px-4 px-lg-0 mt-5 mt-lg-0">
          <div className="race-time-counter-box">
            <P2>Days</P2>
            <H3 bold>{timeUntilEnd.days}</H3>
          </div>
          <div className="race-time-counter-box">
            <P2>Hours</P2>
            <H3 bold>{timeUntilEnd.hours}</H3>
          </div>
          <div className="race-time-counter-box">
            <P2>Minutes</P2>
            <H3 bold>{timeUntilEnd.minutes}</H3>
          </div>
          <div className="race-time-counter-box hide-content-in-mobile">
            <P2>Seconds</P2>
            <H3 bold>{timeUntilEnd.seconds}</H3>
          </div>
        </div>
      </div>

      <Caption
        className="align-self-center align-self-lg-end mt-2"
        text="TIME LEFT UNTIL THE ONGOING RACE ENDS"
      />
    </>
  );
};

const Overview = ({
  supporterInvites,
  currentRaceResults,
  currentPosition,
}) => {
  const [invite, setInvite] = useState({
    code: "N/A",
    uses: 0,
    usesLeft: 0,
  });

  useEffect(() => {
    if (supporterInvites.length == 0) {
      return;
    }

    const unlimitedCodeInvite = supporterInvites.filter(
      (inv) => inv.max_uses === null
    );
    if (unlimitedCodeInvite.length > 0) {
      setInvite({
        code: unlimitedCodeInvite[0].code,
        uses: unlimitedCodeInvite[0].uses,
        usesLeft: "Unlimited",
      });

      return;
    }

    const notUnlimitedCodeInvite = supporterInvites.filter(
      (inv) => inv.uses < inv.max_uses
    );
    if (notUnlimitedCodeInvite.length > 0) {
      setInvite({
        code: notUnlimitedCodeInvite[0].code,
        uses: notUnlimitedCodeInvite[0].uses,
        usesLeft:
          notUnlimitedCodeInvite[0].max_uses - notUnlimitedCodeInvite[0].uses,
      });

      return;
    }

    setInvite({
      code: supporterInvites[0].code,
      uses: supporterInvites[0].uses,
      usesLeft: supporterInvites[0].max_uses - supporterInvites[0].uses,
    });
  }, [supporterInvites]);

  const getInviteLink = (full) => {
    if (invite.code == "N/A") {
      return invite.code;
    }

    if (full) {
      return `https://beta.talentprotocol.com/sign_up?code=${invite.code}`;
    } else {
      const start = invite.code.length > 5 ? invite.code.length - 5 : 0;
      return `https://beta.talentprotocol...${invite.code.substring(
        start,
        invite.code.length
      )}`;
    }
  };

  const copyCode = () => navigator.clipboard.writeText(invite.code);

  const copyLink = () => navigator.clipboard.writeText(getInviteLink(true));

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-lg-between mt-6 mt-lg-7">
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column overview-section rounded-sm mb-6 mb-lg-7">
        <P1 bold className="m-4 text-black">
          Supporter Invite Link
        </P1>
        <div className="d-flex flex-column mx-4 flex-lg-row justify-content-lg-between align-items-lg-center">
          <P3 className="mb-0">Referral Code</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">{invite.code}</P2>
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"copy_code_success"}
              placement="top"
            >
              <Button
                type="white-ghost"
                className="ml-2 text-primary"
                onClick={copyCode}
              >
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="d-flex flex-column mx-4 mb-4 flex-lg-row justify-content-lg-between align-items-lg-center mt-2">
          <P3 className="mb-0">Referral Link</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">{getInviteLink(false)}</P2>
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"copy_link_success"}
              placement="top"
            >
              <Button
                type="white-ghost"
                className="ml-2 text-primary"
                onClick={copyLink}
              >
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column justify-content-between overview-section rounded-sm pb-4  mb-6 mb-lg-7">
        <P1 bold className="m-4 text-black">
          Race Overview
        </P1>
        <div className="d-flex flex-column flex-lg-row mx-4 justify-content-lg-between">
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <P3>Your Position</P3>
            <H5 bold>{currentRaceResults == 0 ? "N/A" : currentPosition}</H5>
          </div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <P3>Wallets connected using your invite</P3>
            <H5 bold>{currentRaceResults}</H5>
          </div>
          <div className="d-flex flex-column">
            <P3>Invites available</P3>
            <H5 bold>{invite.usesLeft}</H5>
          </div>
        </div>
      </div>
    </div>
  );
};

const RaceDropdown = ({ allRaces, race, setRace }) => {
  // @TODO: Add other options & load a different race
  const options =
    allRaces.length == 2 ? ["Current Race", "Previous Race"] : ["Current Race"];

  const selectedClass = (option) =>
    option == race ? " text-primary" : "text-black";

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="talent-button white-subtle-button normal-size-button no-caret d-flex justify-content-between align-items-center"
        id="referral-race-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34, width: 150 }}
      >
        <P2 bold text={race} className="mr-2 align-middle text-black" />
        <OrderBy black />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item
            key={`tab-dropdown-${option}`}
            className="d-flex flex-row justify-content-between"
            onClick={() => setRace(option)}
          >
            <P3 bold text={option} className={selectedClass(option)} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const RaceTable = ({ leaderboardResults, allRaces }) => {
  const [selectedRace, setSelectedRace] = useState("Current Race");
  const [topInviters, setTopInviters] = useState([...leaderboardResults.top5]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    if (selectedRace == "Current Race") {
      let topUsers = [...leaderboardResults.top5];
      if (leaderboardResults.userStats?.position > 5) {
        topUsers = [...topUsers, leaderboardResults.userStats];
      }
      setTopInviters(topUsers);
      setLoadingResults(false);
      return;
    }

    setLoadingResults(true);
    get(`/api/v1/races/${allRaces[0].id}`).then((response) => {
      let topUsers = [...response.top5];
      if (response.userStats?.position > 5) {
        topUsers = [...topUsers, response.userStats];
      }
      setTopInviters(topUsers);
      setLoadingResults(false);
      return;
    });
  }, [selectedRace]);

  const getRewardsForPosition = (position) => {
    if (position === 1) {
      return "1,200 $TAL";
    } else if (position === 2) {
      return "500 $TAL";
    } else if (position === 3) {
      return "300 $TAL";
    } else {
      return "0 $TAL";
    }
  };

  const getPositionCircle = (position) => {
    if (position <= 3) {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="bg-primary rounded-circle mr-4 text-center"
        >
          <P2 className="permanent-text-white" bold>
            {position}
          </P2>
        </div>
      );
    } else if (position <= 5) {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="bg-surface-hover text-primary-03 rounded-circle mr-4 text-center"
        >
          <P2 bold>{position}</P2>
        </div>
      );
    } else {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="text-primary-03 text-center mr-4"
        >
          <P2>{position}</P2>
        </div>
      );
    }
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center px-4 px-lg-0">
        <H4 className="mb-0" bold>
          Ranking
        </H4>
        <RaceDropdown
          race={selectedRace}
          setRace={setSelectedRace}
          allRaces={allRaces}
        />
      </div>
      {loadingResults && (
        <div className="w-100 my-6 d-flex flex-row justify-content-center">
          <Spinner />
        </div>
      )}
      {!loadingResults && (
        <Table mode={"dark"} className="px-3 horizontal-scroll mb-5 mt-5">
          <Table.Head>
            <Table.Th className="w-100 pl-4 pl-lg-3">
              <Caption bold text={"POSITION"} />
            </Table.Th>
            <Table.Th className="pr-4 pr-lg-0">
              <Caption bold text={"WALLETS CONNECTED"} />
            </Table.Th>
            <Table.Th className="hide-content-in-mobile text-black">
              <Caption bold text={"REWARDS"} />
            </Table.Th>
          </Table.Head>
          <Table.Body>
            {topInviters.length === 0 && (
              <Table.Tr className="w-100 d-flex flex-row justify-content-center py-3">
                <P2 bold>There are no participants in this race</P2>
              </Table.Tr>
            )}
            {topInviters.map((inviter) => (
              <Table.Tr key={`inviter-${inviter.id}`}>
                <td
                  className="w-100 pl-4 pl-lg-3 py-3"
                  onClick={() =>
                    (window.location.href = `/u/${inviter.username}`)
                  }
                >
                  <div className="d-flex align-items-center">
                    {getPositionCircle(inviter.position)}
                    <TalentProfilePicture
                      src={inviter.profilePictureUrl}
                      height="32"
                    />
                    <P2 text={inviter.name} bold className="ml-3" />
                  </div>
                </td>
                <Table.Td
                  className="race-table-invites-cell py-3"
                  onClick={() =>
                    (window.location.href = `/u/${inviter.username}`)
                  }
                >
                  <P2
                    className={`${
                      inviter.position <= 3 ? "text-black" : "text-primary-03"
                    }`}
                    text={inviter.invites}
                  />
                </Table.Td>
                <Table.Td
                  className={
                    "race-table-rewards-cell hide-content-in-mobile py-3"
                  }
                  onClick={() =>
                    (window.location.href = `/u/${talent.user.username}`)
                  }
                >
                  <P2
                    className={`${
                      inviter.position <= 3 ? "text-black" : "text-primary-03"
                    }`}
                    text={getRewardsForPosition(inviter.position)}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Table>
      )}
    </>
  );
};

const ReferralRace = ({
  race,
  allRaces,
  supporterInvites,
  isEligible,
  currentRaceResults,
  leaderboardResults,
  isTalent,
}) => {
  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      <RaceHeader
        isEligible={!!isEligible}
        race={race}
        isTalent={isTalent}
        username={leaderboardResults.userStats.username}
      />
      <Overview
        supporterInvites={supporterInvites}
        currentRaceResults={currentRaceResults}
        currentPosition={leaderboardResults.userStats.position}
      />
      <RaceTable leaderboardResults={leaderboardResults} allRaces={allRaces} />
    </div>
  );
};

export default ReferralRace;
