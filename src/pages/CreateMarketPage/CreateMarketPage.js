import React, { useEffect, useRef, useState } from "react";
import "./CreateMarketPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import MarketDetails from "./MarketDetails";
import ChooseOutcome from "./ChooseOutcome";
import FundingInformation from "./FundingInformation";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import axios from "axios";
import short from "short-uuid";

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
  LAMPORTS_PER_SOL,
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
import Api from "../../utils/api";
import { parse } from "url";
import useScreenSize from "../../utils/useScreenSize";

export default function CreateMarketPage() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [mode, setMode] = useState("single");
  const api = new Api();

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
    categoryId: "",
    resolutionType: "",
    closeDateTime: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    outcomesNames: ["Yes", "No"],
    outcomesLower: [1, 2],
    outcomesUpper: [1, 2],
    imageFile: null,
    imageIPFSHash: "",
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
  const screenSize = useScreenSize()

  console.log(screenSize)
  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      setTabUnderlineLeft(screenSize.width < 900 ? currentTab?.offsetLeft - 40 ?? 0 : currentTab?.offsetLeft - 90 ?? 0);
      setTabUnderlineWidth(screenSize.width < 900 ? currentTab?.clientWidth + 40 ?? 0 : currentTab?.clientWidth + 130 ?? 0);
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
      lowerBound = inputData.outcomesLower.map((_, index) => index + 1);
      console.log("lower bound", lowerBound);
      upperBound = lowerBound;
    } else if (mode === "range") {
      lowerBound = inputData.outcomesLower;
      upperBound = inputData.outcomesUpper;
    }
    // while (lowerBound.length < 10) {
    //   lowerBound.push(0);
    // }
    // while (upperBound.length < 10) {
    //   upperBound.push(0);
    // }
    return {
      lowerBound,
      upperBound,
      numOutcomes,
      eventCloseTime,
    };
  };
  const amountToLamports = (sol) => {
    const LAMPORTS_PER_SOL = new BN(1000000000);
    return new BN(sol).mul(LAMPORTS_PER_SOL);
  };
  const getApiConfig = async () => {
    const config = {
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxNWUxM2FjYy1jODJjLTQ0NTQtOWVlNC1iMmUxMjNiMTkxYTEiLCJlbWFpbCI6InJpc2hhYmhrZXNoYW5AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY0ZjhhNmVlNjFiNDE0MjE0NWQxIiwic2NvcGVkS2V5U2VjcmV0IjoiM2VkYzU2MWY3MGRmYWI1YTcxY2UwMDAzYmU0YzYzZDY1ZDRmNGVmNGZjMDRmZjdmMDUwMTQ4OWUxNWJhMzhlMSIsImlhdCI6MTY5MDQ1NDUyMH0.rdkxgYaI0_KP-9UQAPGac7-XH-OXn1YMs_1nTkfV0do`,
      },
    };
    return config;
  };

  const handleUpload = async (selectedFiles, customName, wrapWithDirectory) => {
    try {
      const data = new FormData();
      console.log(selectedFiles);
      if (customName && customName !== "") {
        const metadata = JSON.stringify({
          name: customName,
        });
        data.append("pinataMetadata", metadata);
        console.log("pinataMetadata", metadata);
      }

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          data.append(`file`, file);
        });
      } else {
        console.log("hut");
        data.append("file", selectedFiles);
      }
      const pinataOptions = JSON.stringify({
        wrapWithDirectory: false,
      });
      data.append("pinataOptions", pinataOptions);
      const res = await axios.post(
        `https://api.pinata.cloud/pinning/pinFileToIPFS`,
        data,
        await getApiConfig()
      );
      return res.data;
    } catch (error) {
      console.log(error);
      //  Handle error
    }
  };
  const checkUserWalletExists = async (program, userWalletAddress) => {
    try {
      const walletData = await program.account.userWallet.fetch(
        userWalletAddress
      );
      console.log(walletData, "user");

      if (walletData.balance) {
        return true;
      }
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("Account does not exist")) return false;
    }
  };
  const handleNext = async () => {
    if (isLastStep) {
      if (!publicKey) throw new WalletNotConnectedError();
      let uuidMarket = short.generate();
      const { lowerBound, upperBound, numOutcomes, eventCloseTime } =
        getMarketDetails();
      let res = { IpfsHash: "QmYz44TZqHXeaQ4jKVEECcRMNC8JCD4hEMwtahXqAjRkJX" };
      if (inputData.imageFile) {
        res = await handleUpload(inputData.imageFile, inputData.name, true);
        const eventImageURL = "https://ipfs.io/ipfs/" + res.IpfsHash;
        console.log(res);
        console.log(eventImageURL);
      }
      let outcomeArray = [];

      if (mode === "single") {
        outcomeArray = inputData.outcomesNames.map((outcome, index) => ({
          name: outcome,
          contractOutcomeId: index + 1,
          lowerBound: lowerBound[index],
          upperBound: upperBound[index],
        }));
      } else if (mode === "range") {
        outcomeArray = inputData.outcomesNames.map((outcome, index) => ({
          name: outcome,
          contractOutcomeId: index + 1,
          lowerBound: parseFloat(inputData.outcomesLower[index]),
          upperBound: parseFloat(inputData.outcomesUpper[index]),
        }));
      }

      const marketData = {
        marketName: inputData.name,
        marketContractId: uuidMarket,
        description: inputData.description,
        categoryId: inputData.categoryId,
        resolutionSourceId: 1,
        createdBy: 1,
        resolutionSourceURL: inputData.resolutionSource,
        closeTime: inputData.closeDateTime.toISOString(),
        image: res.IpfsHash,
        outcomesList: outcomeArray,
      };

      console.log(marketData);

      const response = await createMarketBackend(marketData);
      console.log(response);
      if (response.success) {
        const marketId = String(
          response.data.marketrestructuredResponse.marketDetails.id
        );
        const liquidityData = {
          walletAddress: publicKey.toBase58(),
          amount: parseFloat(inputData.liquidity),
          type: "Add",
          marketDetailsId: Number(marketId),
        };
        const res = await api.addLiquidity(liquidityData);
        if (res.success) {
          console.log(res.data);
          const liquidityId = String(res.data.liquidityInfo[0].id);
          await createMarketOnChain(uuidMarket, marketId, liquidityId);
        }
      }
    } else {
      setActiveTabIndex(activeTabIndex + 1);
    }
  };

  const createMarketBackend = async (data) => {
    const response = await api.createMarket(data);
    console.log(response);
    return response;
  };
  const createMarketOnChain = async (uuid, marketId, liquidityId) => {
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
      userWalletAddress,
      userVaultAddress,
      userVaultBump,
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
      let walletExists = await checkUserWalletExists(
        program,
        userWalletAddress
      );
      const liquidity = amountToLamports(inputData.liquidity);
      console.log(walletExists);
      if (walletExists) {
        const dm = await program.methods
          .tokenDeposit(userVaultBump, liquidity)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            tokenAta: token_ata,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();
        const tx_add = new Transaction().add(dm);
        const tx_final_add = await provider.sendAndConfirm(tx_add);
      } else {
        const id = await program.methods
          .initializeTokenDeposit(wallet.publicKey)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();

        const dm = await program.methods
          .tokenDeposit(userVaultBump, liquidity)
          .accounts({
            authority: publicKey,
            systemProgram: SystemProgram.programId,
            tokenAta: token_ata,
            userWallet: userWalletAddress,
            userVault: userVaultAddress,
            tokenMint: usdcPublicKey,
          })
          .instruction();
        const tx_add = new Transaction().add(id).add(dm);
        const tx_final_add = await provider.sendAndConfirm(tx_add);
      }
      console.log("lower bound", lowerBound);
      console.log("upper bound", upperBound);
      console.log(numOutcomes);
      const ix = await program.methods
        .createMarket(
          uuid,
          eventCloseTime,
          1,
          "",
          "=",
          lowerBound,
          upperBound,
          1.0,
          numOutcomes,
          1.0
        )
        .accounts({
          authority: publicKey,
          adminAccount: adminAddress,
          systemProgram: SystemProgram.programId,
          createMarket: eventAccount,
          tokenMint: usdcPublicKey,
          vaultUsdc: vaultAddress,
        })
        .instruction();
      const ix2 = await program.methods
        .adminAddLiquidity(uuid, vaultBump, userVaultBump, liquidity)
        .accounts({
          authority: publicKey,
          systemProgram: SystemProgram.programId,
          marketAccount: eventAccount,
          userMarketShare: userStateAddress,
          tokenMint: usdcPublicKey,
          vaultUsdc: vaultAddress,
          tokenAta: token_ata,
          adminAccount: adminAddress,
          userWallet: userWalletAddress,
          userVault: userVaultAddress,
        })
        .instruction();
      const tx = new Transaction().add(ix).add(ix2);
      const tx2 = await provider.sendAndConfirm(tx);
      console.log("Your transaction signature", tx2);
      console.log("initial liquidity", ix2);
    } catch (err) {
      console.log("error here =======================")
      console.log(err);
    }
    try {
      const marketData = await program.account.marketEvent.fetch(eventAccount);
      console.log("market data", marketData);
      if (marketData) {
        const activateMarket = await api.activateMarket(marketId);
        const activateLiquidity = await api.activateLiquidity(liquidityId);
        console.log(activateMarket);
        console.log(activateLiquidity);
      }
    } catch (err) {
      console.log(err);
    }

    console.log("event account", eventAccount);
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
                <React.Fragment className="createmarket_main_container_container" key={idx}>
                  <button
                    ref={(el) => (tabsRef.current[idx] = el)}
                    className={`pt-2 pb-1 font-bold flex gap-3 ${isActive ? "active-tab" : ""
                      }`}
                    onClick={() => {
                      setSelectedTab(tab.label);
                      setActiveTabIndex(idx);
                    }}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {
                      screenSize.width > 900 &&
                      <span>{`${idx + 1}.  `}</span>
                    }
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
