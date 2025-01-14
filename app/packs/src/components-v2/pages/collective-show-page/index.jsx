import { Tabs, TalentThemeProvider, useTabs } from "@talentprotocol/design-system";
import React, { useEffect, useMemo } from "react";
import { Activity } from "./tabs/activity";
import { camelCaseObject } from "src/utils/transformObjects";
import { Container, Divider, TabsContainer } from "./styled";
import { loggedInUserStore } from "src/contexts/state";
import { Members } from "./tabs/members";
import Overview from "./overview";
import ThemeContainer from "src/contexts/ThemeContext";

const TAB_LIST = ["Members", "Activity"];

const TAB_NAME_TO_INDEX = {
  members: 0,
  activity: 1
};

export const CollectiveShowPage = ({ organization }) => {
  const { currentUser, fetchCurrentUser } = loggedInUserStore();

  const collective = { ...camelCaseObject(organization) };

  const tabState = useTabs();

  useEffect(() => {
    if (!currentUser) fetchCurrentUser();
  }, []);

  useEffect(() => {
    const url = new URL(document.location);
    const tab = url.searchParams.get("tab") || "";

    if (tab) tabState.selectElement(TAB_NAME_TO_INDEX[tab]);
  }, []);

  const onClick = index => {
    const tab = Object.keys(TAB_NAME_TO_INDEX).find(key => TAB_NAME_TO_INDEX[key] === index);
    const url = new URL(document.location);
    url.searchParams.set("tab", tab);
    history.pushState({}, "", url);
    tabState.selectElement(TAB_NAME_TO_INDEX[tab]);
  };

  const RenderedTab = useMemo(() => {
    if (!collective) return;

    switch (tabState.selectedIndex) {
      case 0:
        return <Members currentUser={currentUser} members={collective.users} />;
      case 1:
        return <Activity currentUser={currentUser} organization={collective.slug} />;
    }
  }, [collective, tabState.selectedIndex]);

  return (
    <Container>
      <Overview collective={collective} />
      <Divider className="divider" />
      <TabsContainer>
        <Tabs onClick={onClick} selectedIndex={tabState.selectedIndex} tabList={TAB_LIST} />
      </TabsContainer>
      {RenderedTab}
    </Container>
  );
};

export default (props, railsContext) => {
  return () => (
    <TalentThemeProvider>
      <ThemeContainer>
        <CollectiveShowPage {...props} railsContext={railsContext} />
      </ThemeContainer>
    </TalentThemeProvider>
  );
};
