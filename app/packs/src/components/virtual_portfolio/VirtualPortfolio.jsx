import React, { useState, useEffect, useCallback } from "react";

import { toast } from "react-toastify";
import { ToastBody } from "src/components/design_system/toasts";

// ON CHAIN DEPENDENCIES
import { OnChain } from "src/onchain";
import { chainIdToName, chainNameToId, parseAndCommify } from "src/onchain/utils";
import { ethers } from "ethers";
import { formatUnits } from "viem";

import { get, post } from "src/utils/requests";

// DESIGN SYSTEM COMPONENTS INTERNAL
import Button from "src/components/design_system/button";
// COMPONENTS TO BE REPLACED WITH DESIGN SYSTEM
import { BalanceCard, TokensList, WalletActivity } from "./components";
// LAYOUT COMPONENTS
import {
  NetworkSelection,
  BalanceSection,
  BalanceInformation,
  Label,
  TableOptions,
  BalanceRow,
  SecondRowTitle
} from "./styled";

// DESIGN SYSTEM COMPONENTS LIB
import { Tabs } from "@talentprotocol/design-system";
import { Typography, TalentThemeProvider, getTheme } from "@talentprotocol/design-system";
import { Spinner } from "src/components/icons";

// const SellTalentTokenModal = ({ setShow, show, connection, unstakeTalentToken }) => {
//   const [amount, setAmount] = useState("");
//   const amountRef = useRef(null);

//   const amountToTal = () => {
//     return "0";
//   };

//   return (
//     <>
//       <Modal
//         scrollable={true}
//         show={show}
//         centered={true}
//         onHide={() => setShow(false)}
//         dialogClassName={"remove-background rewards-modal"}
//         fullscreen={"md-down"}
//       >
//         <>
//           <Modal.Header closeButton className="pt-3 pb-1 px-4 pb-0 border-bottom">
//             <div className="d-flex">
//               <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
//                 Sell
//               </Typography>
//             </div>
//           </Modal.Header>
//           <Modal.Body className="show-grid px-4 pb-4 d-flex flex-column justify-content-between">
//             <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
//               {`Sell $${connection.ticker}`}
//             </Typography>
//             <Typography specs={{ variant: "p2", type: "regular" }} color="primary03" className="mb-4">
//               {`Sell $${connection.ticker}`}
//             </Typography>

//             <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
//               Amount
//             </Typography>
//             <Input
//               placeholder={`$${connection.ticker} amount`}
//               inputRef={amountRef}
//               onChange={() => setAmount(amountRef.current.value)}
//               onBlur={() => setAmount(amountRef.current.value)}
//             />
//             <SellAvailableModalRow>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary04">
//                 Available: {displayableAmount(connection.user_invested_amount)} ${connection.ticker}
//               </Typography>
//             </SellAvailableModalRow>
//             <ModalRow>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
//                 ${connection.ticker} price
//               </Typography>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
//                 $0.1
//               </Typography>
//             </ModalRow>
//             <Divider className="my-3" />
//             <ModalRow>
//               <Typography specs={{ variant: "p1", type: "bold" }} color="primary01">
//                 You will receive
//               </Typography>

//               <Typography specs={{ variant: "p1", type: "bold" }} color="primary01">
//                 {amountToTal()} TAL
//               </Typography>
//             </ModalRow>
//             <Divider className="my-3" />
//             <Typography specs={{ variant: "p3", type: "regular" }} color="primary03">
//               Please note that you'll need to pay for gas fees. Make sure you have enough on your wallet.
//             </Typography>
//             <Divider className="my-3 mx-n4 w-auto" />
//             <SellAreaButtons>
//               <DSButton size="small" hierarchy="tertiary" text="Cancel" onClick={() => setShow(false)} />
//               <DSButton size="small" hierarchy="primary" text="Sell" onClick={unstakeTalentToken} />
//             </SellAreaButtons>
//           </Modal.Body>
//         </>
//       </Modal>
//     </>
//   );
// };

// const BuyTalentTokenModal = ({ setShow, show, connection, buyMore, talAmount }) => {
//   const [amount, setAmount] = useState("");
//   const amountRef = useRef(null);

//   const amountToToken = () => {
//     return "0";
//   };
//   return (
//     <>
//       <Modal
//         scrollable={true}
//         show={show}
//         centered={true}
//         onHide={() => setShow(false)}
//         dialogClassName={"remove-background rewards-modal"}
//         fullscreen={"md-down"}
//       >
//         <>
//           <Modal.Header closeButton className="pt-3 pb-1 px-4 pb-0 border-bottom">
//             <div className="d-flex">
//               <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
//                 Buy
//               </Typography>
//             </div>
//           </Modal.Header>
//           <Modal.Body className="show-grid px-4 pb-4 d-flex flex-column justify-content-between">
//             <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
//               {`Buy $${connection.ticker}`}
//             </Typography>
//             <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
//               {`Buy $${connection.ticker} for TAL`}
//             </Typography>
//             <Typography specs={{ variant: "p2", type: "bold" }} color="primary01">
//               Amount
//             </Typography>
//             <Input
//               placeholder={`TAL amount`}
//               inputRef={amountRef}
//               onChange={() => setAmount(amountRef.current.value)}
//               onBlur={() => setAmount(amountRef.current.value)}
//             />
//             <SellAvailableModalRow>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary04">
//                 Available: {displayableAmount(talAmount)} TAL
//               </Typography>
//             </SellAvailableModalRow>
//             <ModalRow>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
//                 ${connection.ticker} price
//               </Typography>
//               <Typography specs={{ variant: "p2", type: "regular" }} color="primary03">
//                 $0.1
//               </Typography>
//             </ModalRow>
//             <Divider className="my-3" />
//             <ModalRow>
//               <Typography specs={{ variant: "p1", type: "bold" }} color="primary01">
//                 You will receive
//               </Typography>

//               <Typography specs={{ variant: "p1", type: "bold" }} color="primary01">
//                 {amountToToken()} ${connection.ticker}
//               </Typography>
//             </ModalRow>
//             <Divider className="my-3" />
//             <Typography specs={{ variant: "p3", type: "regular" }} color="primary03">
//               Please note that you'll need to pay for gas fees. Make sure you have enough on your wallet.
//             </Typography>
//             <Divider className="my-3 mx-n4 w-auto" />
//             <SellAreaButtons>
//               <DSButton size="small" hierarchy="tertiary" text="Cancel" onClick={() => setShow(false)} />
//               <DSButton size="small" hierarchy="primary" text="Buy" onClick={buyMore} />
//             </SellAreaButtons>
//           </Modal.Body>
//         </>
//       </Modal>
//     </>
//   );
// };

const VirtualPortfolio = ({ talent, railsContext }) => {
  // localData
  const theme = getTheme().isDarkTheme ? "dark" : "light";
  const [talBalances, setTalBalances] = useState({
    available: "0",
    staked: "0",
    supportingRewards: "0",
    supportersRewards: "0"
  });
  // const [showSellModal, setShowSellModal] = useState(false);
  // const [showBuyModal, setShowBuyModal] = useState(false);
  // const [activeConnection, setActiveConnection] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [wrongChain, setWrongChain] = useState(false);
  const [loadingOnChain, setLoadingOnChain] = useState(true);
  const [connectedAccount, setConnectedAccount] = useState();

  // onchain data
  const acceptedChains = ["Celo", "Polygon"];
  const [chainId, setChainId] = useState(null);
  const [chainAPI, setChainAPI] = useState(null);

  // api data
  const [tokens, setTokens] = useState([]);
  const [activities, setActivities] = useState([]);
  const [pagination, setPagination] = useState({});
  const [totalTALStaked, setTotalTALStaked] = useState(0);

  // onchain functions
  const setupChain = useCallback(async errorCallback => {
    try {
      const newOnChain = new OnChain(railsContext.contractsEnv);

      const currentAccount = await newOnChain.connectedAccount();
      const chainAvailable = await newOnChain.recognizedChain();
      const chainId = await newOnChain.getChainID();

      setChainAPI(newOnChain);
      setChainId(chainId);
      setConnectedAccount(currentAccount);

      if (!chainAvailable) {
        setWrongChain(!chainAvailable);
        setLoadingOnChain(false);
        return;
      }

      const result = await newOnChain.calculateEstimatedReturns();
      // STAKER - 0, TALENT - 1
      const formatedUnitsSupportingRewards = formatUnits(result[0], 18);
      const supportingRewards = parseAndCommify(formatedUnitsSupportingRewards);

      let supportersRewards = "0";
      if (talent.talent_token?.contract_id && talent.talent_token?.chain_id == chainId) {
        const talentRewards = await newOnChain.pendingTalentRewards(talent.talent_token.contract_id);
        const formatedUnitsSupportersRewards = formatUnits(talentRewards, 18);
        supportersRewards = parseAndCommify(formatedUnitsSupportersRewards);
      }

      // 2nd total TAL locked => TOKEN AMOUNT - 0
      const talLocked = await newOnChain.talLocked();
      const formatedUnitsTALStaked = formatUnits(talLocked[0], 18);
      const staked = parseAndCommify(formatedUnitsTALStaked);

      // 3rd Available TAL for spending
      const availableBalance = await newOnChain.getTALBalance(currentAccount);
      const formatedUnitsTALBalance = formatUnits(availableBalance, 18);
      const available = parseAndCommify(formatedUnitsTALBalance);

      setTalBalances(prev => ({
        ...prev,
        supportingRewards,
        supportersRewards,
        staked,
        available
      }));

      setLoadingOnChain(false);
    } catch (e) {
      console.log(e);
      errorCallback();
    }
  });

  useEffect(() => {
    let maxTries = 5;
    const errorCallback = () => {
      setTimeout(() => {
        if (!!maxTries) {
          setupChain(errorCallback);
          maxTries--;
        } else {
          setLoadingOnChain(false);
          toast.error(
            <ToastBody
              heading="Unable to load your wallet"
              body="There seems to be an issue connecting to your wallet, make sure you are using a supported wallet."
            />
          );
        }
        return;
      }, 500);
    };
    setupChain(errorCallback);
  }, []);

  const networkChange = async tabIndex => {
    if (chainAPI) {
      const chainId = chainNameToId(acceptedChains[tabIndex], railsContext.contractsEnv);
      await chainAPI.switchChain(chainId);
      window.location.reload();
    }
  };

  const updateSupporterRewards = async () => {
    if (talent.talent_token?.contract_id) {
      const supporterRewards = await chainAPI.pendingTalentRewards(talent.talent_token.contract_id);
      const formatedUnitsSupportersRewards = ethers.utils.formatUnits(supporterRewards);
      const rewards = parseAndCommify(formatedUnitsSupportersRewards);

      setTalBalances(prev => ({
        ...prev,
        supporterRewards: rewards
      }));
    }
  };

  const claimSupportingRewards = async () => {
    if (chainAPI) {
      if (!(await chainAPI.recognizedChain())) {
        await chainAPI.switchChain();
      } else {
        const [receipt, hash] = await chainAPI.claimRewardsToVirtualTAL().catch(() => null);

        if (receipt.events?.length > 1 && receipt.events[1].args?.stakerReward) {
          const totalNewBalance = ethers.utils
            .parseUnits(talBalances.available.replace(",", ""))
            .add(receipt.events[1].args.stakerReward);
          const formatedUnitsSupportingRewards = ethers.utils.formatUnits(totalNewBalance);
          const newBalance = parseAndCommify(formatedUnitsSupportingRewards);

          setTalBalances(prev => ({
            ...prev,
            supportingRewards: "0",
            available: newBalance
          }));
          updateSupporterRewards();
        } else {
          setTalBalances(prev => ({
            ...prev,
            supportingRewards: "0"
          }));
        }

        if (hash) {
          post("/api/v1/wallet_activities", { tx_hash: hash, chain_id: chainId }).then(response => {
            if (response.error) {
              console.log(response.error);
              toast.error(
                <ToastBody
                  heading="Unable to sync transaction"
                  body={"We were unable to sync this transaction, reach out to our support with the transaction hash"}
                />
              );
            } else {
              toast.success(<ToastBody heading="Success!" body={"You have claimed your supporting rewards"} />);
            }
          });
        }
      }
    }
  };

  const claimSupportersRewards = async () => {
    if (chainAPI) {
      if (!(await chainAPI.recognizedChain())) {
        await chainAPI.switchChain();
      } else {
        const [receipt, hash] = await chainAPI
          .claimTalentRewardsToVirtualTAL(talent.talent_token.contract_id)
          .catch(err => console.log(err));

        if (receipt.events?.length > 0) {
          const rewardsSupporter = ethers.utils.parseUnits(talBalances.supportersRewards.replace(",", ""));
          const totalNewBalance = ethers.utils.parseUnits(talBalances.available.replace(",", "")).add(rewardsSupporter);
          const formatedUnitsSupporterRewards = ethers.utils.formatUnits(totalNewBalance);
          const newBalance = parseAndCommify(formatedUnitsSupporterRewards);

          setTalBalances(prev => ({
            ...prev,
            supportersRewards: "0",
            available: newBalance
          }));
        } else {
          setTalBalances(prev => ({
            ...prev,
            supportersRewards: "0"
          }));
        }

        if (hash) {
          post("/api/v1/wallet_activities", { tx_hash: hash, chain_id: chainId }).then(response => {
            if (response.error) {
              console.log(response.error);
              toast.error(
                <ToastBody
                  heading="Unable to sync transaction"
                  body={"We were unable to sync this transaction, reach out to our support with the transaction hash"}
                />
              );
            } else {
              toast.success(<ToastBody heading="Success!" body={"You have claimed rewards from your supporters"} />);
            }
          });
        }
      }
    }
  };

  // const onSell = async con => {
  //   setActiveConnection(con);
  //   setShowSellModal(true);

  //   await chainAPI.unstakeTalentToken(talent.contract_id, amount).catch(() => null);
  //   if (chainAPI) {
  //     if (!(await chainAPI.recognizedChain())) {
  //       await chainAPI.switchChain();
  //     } else {
  //       // await chainAPI.claimRewardsToVirtualTAL().catch(() => null);

  //       // TODO: update local state -> balances + connection
  //       // const availableBalance = await newOnChain.getTALBalance(currentAccount)
  //       const available = "9,050";
  //       setTalBalances(prev => ({
  //         ...prev,
  //         supportingRewards: "0",
  //         available
  //       }));
  //     }
  //   }
  // };

  // const onBuy = con => {
  //   setActiveConnection(con);
  //   setShowBuyModal(true);
  //   createStake(tokenAddress, amount)
  // };

  // API data loading

  useEffect(() => {
    // Don't load if it's not the right tab
    if (currentTab === 0) {
      return;
    }
    let url = "/portfolio/tokens";

    if (chainId) {
      url += `?chain_id=${chainId}`;
    }

    get(url).then(response => {
      if (response.error) {
        toast.error(<ToastBody heading="Error!" body={response.error} />);
      } else {
        setPagination(response.pagination);
        setTokens(response.talent_tokens);
      }
    });
  }, [currentTab, chainId]);

  useEffect(() => {
    // Don't load if it's not the right tab
    if (currentTab === 1 || !chainId) {
      return;
    }

    get(`/api/v1/wallet_activities?chain_id=${chainId}`).then(response => {
      if (response.error) {
        toast.error(<ToastBody heading="Error!" body={response.error} />);
      } else {
        setPagination(response.pagination);
        setActivities(response.wallet_activities);
      }
    });
  }, [currentTab, chainId]);

  useEffect(() => {
    if (!chainId) {
      return;
    }

    get(`/portfolio/overview?chain_id=${chainId}`).then(response => {
      if (response.error) {
        toast.error(<ToastBody heading="Unable to load staked TAL amount" body={response.error} />);
      } else {
        setTotalTALStaked(response.total_staked * 5.0);
      }
    });
  }, [chainId]);

  const showLoadMoreActivities = () => {
    return pagination.currentPage < pagination.lastPage;
  };

  const loadMoreActivities = () => {
    const nextPage = pagination.currentPage + 1;

    const params = new URLSearchParams(document.location.search);
    const url = new URL(window.location.href);
    params.set("page", nextPage);
    params.set("chain_id", chainId);

    get(`/api/v1/wallet_activities?${params.toString()}`).then(response => {
      const newActivities = [...activities, ...response.activities];
      const uniqueActivities = newActivities.reduce((acc, el) => {
        acc[el.tx_hash] = el;
        return acc;
      }, {});
      setActivities(Object.values(uniqueActivities));
      setPagination(response.pagination);
      window.history.replaceState({}, document.title, `${url.pathname}?${params.toString()}`);
    });
  };

  const showLoadMoreTokens = () => {
    return pagination.currentPage < pagination.lastPage;
  };

  const loadMoreTokens = () => {
    const nextPage = pagination.currentPage + 1;

    const params = new URLSearchParams(document.location.search);
    const url = new URL(window.location.href);
    params.set("page", nextPage);

    get(`/portfolio/tokens?${params.toString()}`).then(response => {
      const newTokens = [...tokens, ...response.talent_tokens];
      const uniqueTokens = newTokens.reduce((acc, el) => {
        acc[el.ticker] = el;
        return acc;
      }, {});
      setTokens(Object.values(uniqueTokens));
      setPagination(response.pagination);
      window.history.replaceState({}, document.title, `${url.pathname}?${params.toString()}`);
    });
  };

  // local helpers
  const balanceToText = balance => {
    return `${balance} $TAL`;
  };

  const balanceToDollar = balance => {
    const value = parseAndCommify(parseFloat(balance.replaceAll(",", "") * 0.02));

    return `$${value}`;
  };

  const floatToDollar = balance => {
    const value = parseAndCommify(balance.toFixed(2));

    return `${value} $TAL`;
  };

  const changeTab = selectedTab => {
    const url = new URL(window.location.href);
    window.history.replaceState({}, document.title, `${url.pathname}`);

    setCurrentTab(selectedTab);
    setPagination({});
  };

  const activeNetworkTab = () => {
    if (!chainId) {
      return;
    }

    const availableNetworkIds = chainAPI.availableChainIds();

    if (availableNetworkIds.includes(chainId)) {
      const chainName = chainIdToName(chainId, railsContext.contractsEnv);

      return acceptedChains.findIndex(chain => chain === chainName);
    }
  };

  const chainName = () => {
    return chainIdToName(chainId, railsContext.contractsEnv);
  };

  const noWallet = () => {
    return !loadingOnChain && !connectedAccount;
  };

  const isWrongChain = () => {
    return !loadingOnChain && wrongChain && connectedAccount;
  };

  const walletConfigured = () => {
    return !loadingOnChain && !wrongChain && connectedAccount;
  };

  return (
    <>
      {/* {showSellModal && (
        <SellTalentTokenModal
          connection={activeConnection}
          show={showSellModal}
          setShow={setShowSellModal}
          unstakeTalentToken={() => console.log("SEEEEELL")}
        />
      )}
      {showBuyModal && (
        <BuyTalentTokenModal
          connection={activeConnection}
          show={showBuyModal}
          setShow={setShowBuyModal}
          buyMore={() => console.log("BUYYY")}
          talAmount={talBalances.available.replace(",", "") + "000000000000000000"}
        />
      )} */}
      <NetworkSelection>
        <Tabs
          tabList={acceptedChains}
          selectedIndex={activeNetworkTab()}
          onClick={selectedTab => networkChange(selectedTab)}
        />
        <Button
          type="primary-default"
          size="small"
          disabled={true}
          onClick={() => console.log("Convert $TAL button")}
          text="Bridge"
        />
      </NetworkSelection>
      <BalanceSection>
        <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
          My balance
        </Typography>
        <BalanceRow>
          <BalanceInformation>
            <BalanceCard
              title="$TAL Balance"
              value={balanceToText(talBalances.available)}
              valueInDollars={balanceToDollar(talBalances.available)}
              theme={theme}
              primary={true}
              icon={"wallet"}
            >
              <Label>Total amount of $TAL available in your internal wallet on {chainName()}</Label>
            </BalanceCard>
            <BalanceCard
              title="Staked $TAL"
              value={floatToDollar(totalTALStaked)}
              valueInDollars={balanceToDollar(totalTALStaked.toString())}
              theme={theme}
              primary={false}
              icon={"padlock"}
            >
              <Label>The amount of $TAL staked on Talent</Label>
            </BalanceCard>
          </BalanceInformation>
          <SecondRowTitle>
            <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
              {"Rewards"}
            </Typography>
          </SecondRowTitle>
          <BalanceInformation>
            <BalanceCard
              title="Rewards from supporting"
              value={balanceToText(talBalances.supportingRewards)}
              valueInDollars={balanceToDollar(talBalances.supportingRewards)}
              theme={theme}
              primary={false}
              highlightValues={true}
              icon={"gift"}
            >
              <div style={{ alignSelf: "flex-end" }}>
                <Button
                  type="primary-default"
                  onClick={() => claimSupportingRewards()}
                  disabled={true}
                  text="Claim rewards"
                />
              </div>
            </BalanceCard>
            <BalanceCard
              title="Rewards from being supported"
              value={balanceToText(talBalances.supportersRewards)}
              valueInDollars={balanceToDollar(talBalances.supportersRewards)}
              theme={theme}
              primary={false}
              highlightValues={true}
              icon={"gift"}
            >
              <div style={{ alignSelf: "flex-end" }}>
                <Button
                  type="primary-default"
                  onClick={() => claimSupportersRewards()}
                  disabled={true}
                  text="Claim rewards"
                />
              </div>
            </BalanceCard>
          </BalanceInformation>
        </BalanceRow>
      </BalanceSection>
      {loadingOnChain && (
        <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3 pb-3 mt-5 pt-5">
          <Spinner />
        </div>
      )}
      {noWallet() && (
        <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3 pb-3 mt-4">
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01" className="mt-4">
            Connect your wallet
          </Typography>
          <Typography specs={{ variant: "p2", type: "regular" }} color="primary01" className="mb-3">
            You need to have your wallet connected in order to see your balance.
          </Typography>
        </div>
      )}
      {isWrongChain() && (
        <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3 pb-3 mt-4">
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01" className="mt-4">
            Switch Network
          </Typography>
          <Typography specs={{ variant: "p2", type: "regular" }} color="primary01" className="mb-3">
            Switch to one of the available chains at the top of the page to check your wallet.
          </Typography>
        </div>
      )}
      {walletConfigured() && (
        <>
          <TableOptions>
            <Tabs
              tabList={["Transactions", "Tokens"]}
              selectedIndex={currentTab}
              onClick={selectedTab => changeTab(selectedTab)}
            />
          </TableOptions>
          {currentTab == 1 && (
            <TokensList
              tokens={tokens}
              theme={theme}
              showLoadMoreTokens={showLoadMoreTokens}
              loadMoreTokens={loadMoreTokens}
              blockExplorerUrl={chainAPI.getEnvBlockExplorerUrls(chainId)}
            />
          )}
          {currentTab == 0 && (
            <WalletActivity
              activities={activities}
              theme={theme}
              showLoadMoreActivities={showLoadMoreActivities}
              loadMoreActivities={loadMoreActivities}
              blockExplorerUrl={chainAPI.getEnvBlockExplorerUrls(chainId)}
            />
          )}
        </>
      )}
    </>
  );
};

export default (props, railsContext) => () =>
  (
    <TalentThemeProvider>
      <VirtualPortfolio {...props} railsContext={railsContext} />
    </TalentThemeProvider>
  );
