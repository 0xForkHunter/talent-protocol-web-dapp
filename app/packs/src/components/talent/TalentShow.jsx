import React, { useState } from "react";
import {
  faCommentAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faStar,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useWindowDimensionsHook } from "../../utils/window";
import TalentProfilePicture from "./TalentProfilePicture";

import EditProfile from "./Show/EditProfile";
import TalentTags from "./TalentTags";

import Roadmap from "./Show/Roadmap";
import Services from "./Show/Services";
import Perks from "./Show/Perks";
import Overview from "./Show/Overview";
import Timeline from "./Show/Timeline";
import TokenDetails from "./Show/TokenDetails";

const TalentShow = ({
  talent,
  services,
  token,
  perks,
  milestones,
  current_user_id,
  token_live,
  user,
  profilePictureUrl,
  primary_tag,
  secondary_tags,
  career_goal,
  goals,
  posts,
  isFollowing,
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;
  const [pageInDisplay, setPageInDisplay] = useState("Overview");
  const [show, setShow] = useState(false);
  const { height, width } = useWindowDimensionsHook();
  const [sharedState, setSharedState] = useState({
    talent,
    services,
    token,
    perks,
    milestones,
    current_user_id,
    token_live,
    user,
    profilePictureUrl,
    primary_tag,
    secondary_tags,
    career_goal,
    goals,
    posts,
  });

  const ticker = () =>
    sharedState.token.ticker ? `$${sharedState.token.ticker}` : "";
  const allTags = () =>
    [sharedState.primary_tag].concat(sharedState.secondary_tags);
  const displayName = ({ withLink }) => {
    if (sharedState.talent.profile.website && withLink) {
      return (
        <a href={sharedState.talent.profile.website} className="text-reset">
          {sharedState.user.display_name || sharedState.user.username}
        </a>
      );
    }
    return sharedState.user.display_name || sharedState.user.username;
  };

  const prettifyWebsiteUrl = (url) => {
    const link = new URL(url);
    return link.host;
  };

  return (
    <div className="d-flex flex-column">
      <section className="mt-3">
        <div className="d-flex flex-row text-muted mx-3">
          <span>
            <a href="/talent" className="text-reset">
              <small>TALENT</small>
            </a>
          </span>
          <span className="mx-3">
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </span>
          <span className="text-uppercase">
            <small>{displayName({ withLink: false })}</small>
          </span>
        </div>
      </section>
      <section className="d-flex flex-row mt-3 ml-3 align-items-center justify-content-between flex-wrap">
        <div className="d-flex flex-row align-items-center flex-wrap">
          <TalentProfilePicture
            src={sharedState.profilePictureUrl}
            height={192}
            className="mr-2"
          />
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center">
              <h2 className="mb-0">{displayName({ withLink: false })}</h2>
              <p className="mb-0 border rounded p-1 bg-light ml-2">
                <small>{ticker()}</small>
              </p>
              <button className="btn border-0 text-warning">
                {isFollowing ? (
                  <FontAwesomeIcon icon={faStar} />
                ) : (
                  <FontAwesomeIcon icon={faStarOutline} />
                )}
              </button>
            </div>
            <div className="d-flex flex-row">
              <p>{sharedState.talent.profile.ocupation}</p>
              <a
                href={sharedState.talent.profile.website}
                className="text-primary ml-2"
              >
                {prettifyWebsiteUrl(sharedState.talent.profile.website)}
              </a>
            </div>
            <TalentTags tags={allTags()} className="mr-2" />
          </div>
        </div>
        <div className="d-flex flex-row align-items-center mt-2">
          <button
            className="btn btn-secondary"
            style={{ height: 38, width: 99 }}
          >
            <small>GET {ticker()}</small>
          </button>
          <a href={`/message?user=${user.id}`} className="text-secondary mx-2">
            <FontAwesomeIcon icon={faCommentAlt} size="lg" />
          </a>
          <EditProfile
            {...sharedState}
            updateSharedState={setSharedState}
            allowEdit={talentIsFromCurrentUser}
          />
        </div>
      </section>
      <div className="d-flex flex-row mx-3 mt-3">
        <button
          className={`btn btn-light rounded mr-2 p-1 ${
            pageInDisplay == "Overview" && "active"
          }`}
          onClick={() => setPageInDisplay("Overview")}
        >
          <small>Overview</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 p-1 ${
            pageInDisplay == "Timeline" && "active"
          }`}
          onClick={() => setPageInDisplay("Timeline")}
        >
          <small>Timeline</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 p-1 ${
            pageInDisplay == "Activity" && "active"
          }`}
          onClick={() => setPageInDisplay("Activity")}
          disabled
        >
          <small>Activity</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 p-1 ${
            pageInDisplay == "Community" && "active"
          }`}
          onClick={() => setPageInDisplay("Community")}
          disabled
        >
          <small>Community</small>
        </button>
      </div>
      <div className="d-flex flex-row flex-wrap">
        <div className="col-12 col-lg-8">
          {pageInDisplay == "Overview" && (
            <Overview sharedState={sharedState} />
          )}
          {pageInDisplay == "Timeline" && (
            <Timeline sharedState={sharedState} />
          )}
        </div>
        <div className="col-12 col-lg-4">
          <TokenDetails
            ticker={ticker()}
            displayName={displayName({ withLink: false })}
          />
        </div>
      </div>
      <section className="d-flex flex-column mx-3 my-3">
        <Roadmap goals={sharedState.goals} width={width} />
        <Services
          services={sharedState.services}
          ticker={ticker()}
          width={width}
        />
        <Perks perks={sharedState.perks} ticker={ticker()} width={width} />
      </section>
    </div>
  );
};

export default TalentShow;
