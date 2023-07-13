import React, { useEffect, useRef, useState } from "react";
import "./CreateMarketPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import MarketDetails from "./MarketDetails";
import ChooseOutcome from "./ChooseOutcome";
import FundingInformation from "./FundingInformation";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { Idl, Program, web3, BN, AnchorProvider } from "@project-serum/anchor";
import ProgramIDL from "../../contracts/programIDL.json";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { v4 as uuidv4 } from "uuid";
import { getAccountAddresses } from "../../utils/createMarketFunctions.js";

export default function CreateMarketPage() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [mode, setMode] = useState("single");

  const { publicKey, sendTransaction } = useWallet();
  const ProgramID = new PublicKey(ProgramIDL.metadata.address);
  const [provider, setProvider] = useState(
    new AnchorProvider(connection, wallet, {})
  );
  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);

  const [inputData, setInputData] = useState({
    name: "Hoes Garden",
    description: "Who is known to be a worse women in the music industry?",
    resolutionSource: "https://predixmarkets.com",
    category: "",
    resolutionType: "",
    closeDateTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    outcomesLower: ["Yes", "No"],
    outcomesUpper: ["Yes", "No"],
    imageFile: null,
    platformFees: 0,
    liquidityFees: 0,
    liquidity: 0,
  });
  const tabsData = [
    {
      label: "Market Details",
      component: (
        <MarketDetails inputData={inputData} setInputData={setInputData} />
      ),
    },
    {
      label: "Choose Outcomes",
      component: (
        <ChooseOutcome
          mode={mode}
          setMode={setMode}
          inputData={inputData}
          setInputData={setInputData}
        />
      ),
    },
    {
      label: "Funding Information",
      component: (
        <FundingInformation inputData={inputData} setInputData={setInputData} />
      ),
    },
  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [selectedTab, setSelectedTab] = useState("All");
  const tabsRef = useRef([]);
  const [stepper, setStepper] = useState(0);
  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      setTabUnderlineLeft(currentTab?.offsetLeft - 90 ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth + 130 ?? 0);
    }

    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);
  const isFirstStep = activeTabIndex === 0;
  const isLastStep = activeTabIndex === tabsData.length - 1;
  const nextButtonText = isLastStep
    ? "Create Event"
    : "Next: " + tabsData[activeTabIndex + 1].label;
  const handlePrevious = () => {
    setActiveTabIndex(activeTabIndex - 1);
  };
  const getMarketDetails = () => {
    let lowerBound = [];
    let upperBound = [];
    let numOutcomes = inputData.outcomesLower.length;
    const eventCloseTime = new BN(
      Math.floor(inputData.closeDateTime.getTime() / 1000)
    );

    if (mode === "single") {
      lowerBound = inputData.outcomesLower.map((_, index) => index);
      upperBound = lowerBound;
    } else if (mode === "range") {
      lowerBound = inputData.outcomesLower;
      upperBound = inputData.outcomesUpper;
    }

    return {
      lowerBound,
      upperBound,
      numOutcomes,
      eventCloseTime,
    };
  };
  const handleNext = async () => {
    if (isLastStep) {
      if (!publicKey) throw new WalletNotConnectedError();

      const uuid = "5";
      const { lowerBound, upperBound, numOutcomes, eventCloseTime } =
        getMarketDetails();
      const {
        eventAccount,
        eventBump,
        adminAddress,
        adminBump,
        vaultAddress,
        vaultBump,
        userStateAddress,
        userStateBump,
        usdcAddress,
        usdcPublicKey,
      } = getAccountAddresses(uuid, publicKey, ProgramID);
      const program = new Program(ProgramIDL, ProgramID, provider);
      const token_ata = await getAssociatedTokenAddress(
        usdcPublicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      console.log("vpda", eventBump);
      console.log("data_acccount", eventAccount);
      try {
        const ix = await program.methods
          .createMarket(
            uuid,
            eventCloseTime,
            "Admin",
            "",
            "=",
            lowerBound,
            upperBound,
            0.0,
            numOutcomes
          )
          .accounts({
            authority: publicKey,
            adminAccount: adminAddress,
            systemProgram: SystemProgram.programId,
            createMarket: eventAccount,
            tokenMint: usdcPublicKey,
            vaultUsdc: vaultAddress,
          })
          .rpc();

        const ix2 = await program.methods
          .adminAddLiquidity(uuid, vaultBump, new BN(1000000000))
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            marketAccount: eventAccount,
            userMarketShare: userStateAddress,
            tokenMint: usdcPublicKey,
            vaultUsdc: vaultAddress,
            tokenAta: token_ata,
            adminAccount: adminAddress,
          })
          .rpc();
        console.log("initial liquidity", ix2);
      } catch (err) {
        console.log(err);
      }
      // const tx = new Transaction().add(ix2);
      // const tx2 = await provider.sendAndConfirm(tx);
      // console.log("Your transaction signature", ix2);
      const marketData = await program.account.marketEvent.fetch(eventAccount);
      console.log("market data", marketData);
      console.log("event bump", eventBump);

      console.log("event account", eventAccount);
      console.log("Create Event");
    } else {
      setActiveTabIndex(activeTabIndex + 1);
    }
  };
  return (
    <article className="createmarket">
      <Navbar />
      <section className="createmarket_main">
        <div className="createmarket_main_title">
          Create your Forecasting Market
        </div>
        <div className="createmarket_main_subtitle">
          {`Set up a new forecasting market by providing necessary details and
          funding information. Follow the step-by-step process to create a
          market that's engaging and easy to participate in for users.`}
        </div>
        <div className="createmarket_main_header">
          <div className="createmarket_main_header_tabs">
            {tabsData.map((tab, idx) => {
              const isActive = idx === activeTabIndex;
              return (
                <React.Fragment key={idx}>
                  <button
                    ref={(el) => (tabsRef.current[idx] = el)}
                    className={`pt-2 pb-1 font-bold flex gap-3 ${
                      isActive ? "active-tab" : ""
                    }`}
                    onClick={() => {
                      setSelectedTab(tab.label);
                      setActiveTabIndex(idx);
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    <span>{`${idx + 1}.  `}</span>
                    <span>{tab.label}</span>
                  </button>
                  <span
                    className="absolute bottom-0 block h-0.5 transition-all duration-300"
                    style={{
                      left: tabUnderlineLeft,
                      width: tabUnderlineWidth,
                      backgroundColor: "#D4D5F9",
                    }}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
        <div className="createmarket_main_container">
          {tabsData[activeTabIndex].component}
          <div className="createmarket_main_container_footer">
            <div className="createmarket_main_container_footer_disclaimertext">
              <span>*</span> The information is mandatory
            </div>
            <div className="createmarket_main_container_footer_buttoncontainer">
              {!isFirstStep && (
                <div
                  className="createmarket_main_container_footer_buttoncontainer_previous"
                  onClick={handlePrevious}
                >
                  Previous Step
                </div>
              )}
              <div
                className="createmarket_main_container_footer_buttoncontainer_next"
                onClick={handleNext}
              >
                {nextButtonText}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
