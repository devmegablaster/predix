import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import EventImage from "../../assets/event_image.svg";
import BookmarkEmpty from "../../assets/bookmark_empty.svg";
import Share from "../../assets/share_icon.svg";
import VolumeIcon from "../../assets/tab_icon.svg";
import LiquidityIcon from "../../assets/liquidity_icon.svg";
import EventIcon from "../../assets/event_icon.svg";
import TagPurple from "../../assets/tag_purple.svg";
import Dropdown from "../../assets/dropdown.svg";
import Dropup from "../../assets/dropup.svg";
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
import { useParams } from "react-router-dom";

import { getAccountAddresses } from "../../utils/createEventFunctions.js";

import "./EventPage.scss";
import ToggleAddRemove from "../../components/EventsPage/ToggleAddRemove";
import ToggleBuySell from "../../components/EventsPage/ToggleBuySell";
import Api from "../../utils/api";

// remove_liquidity;
// buy_outcome_share;
// close_market_with_admin;

const calculateSharePrice = (market_details) => {
  const index = market_details.totalOutcomes;

  const prod_price_weights = market_details.availableOutcomeShares
    .slice(0, index)
    .map((value) => Number(value) / 1000000.0)
    .reduce((product, value) => product * value, 1);

  console.log("total", index);
  console.log("price weights", prod_price_weights);

  const weights = new Array(10).fill(0.0);

  for (let i = 0; i < index; i++) {
    weights[i] = prod_price_weights / (market_details.availableOutcomeShares[i] / 1_000_000.0);
  }

  const sum_price_weights = weights.slice(0, index).reduce((sum, value) => sum + value, 0);

  const prices = new Array(10).fill(0);

  for (let i = 0; i < index; i++) {
    prices[i] = Math.round((weights[i] / sum_price_weights * 1_000_000.0));
  }

  return prices;
};

export default function EventPage() {
  const api = new Api();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [modeAR, setModeAR] = useState("add");
  const [modeBS, setModeBS] = useState("buy");
  const [liquidityValue, setLiquidityValue] = useState(0);
  const [buysellValue, setBuysellValue] = useState(0);
  const [selectedOutcomeId, setSelectedOutcomeId] = useState(0);

  const { publicKey, sendTransaction } = useWallet();
  const ProgramID = new PublicKey(ProgramIDL.metadata.address);
  const [provider, setProvider] = useState(
    new AnchorProvider(connection, wallet, {})
  );
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [outcomeData, setOutcomeData] = useState([]);
  const [contractEventData, setContractEventData] = useState({});
  const [sharePrice, setSharePrice] = useState([]);

  useEffect(() => {
    if (Object.keys(contractEventData).length) {
      setSharePrice(calculateSharePrice(contractEventData))
    }
  }, [contractEventData])

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);
  useEffect(() => {
    fetchEventData();
  }, []);
  const fetchContractEventData = async (contractID) => {

    const program = new Program(ProgramIDL, ProgramID, provider);
    const [eventAccount, eventBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), Buffer.from(contractID)],
      ProgramID
    );

    const marketData = await program.account.marketEvent.fetch(eventAccount);
    const convertedMarketData = {
      ...marketData,
      createdAt: marketData.createdAt.toString(),
      balance: lamportsToAmount(marketData.balance).toString(),
      expiresAt: marketData.expiresAt.toString(),
      liquidity: lamportsToAmount(marketData.liquidity).toString(),
      totalFeeAmount: marketData.totalFeeAmount.toString(),
      volume: lamportsToAmount(marketData.volume).toString(),
      availableShares: lamportsToAmount(marketData.availableShares).toString(),
      availableOutcomeShares: marketData.availableOutcomeShares.map(
        (value) => lamportsToAmount(value).toString()
      ),
      totalOutcomeShares: marketData.totalOutcomeShares.map((value) =>
        lamportsToAmount(value).toString()
      ),
    };
    console.log("useffect market data", convertedMarketData);

    setContractEventData(convertedMarketData);

  };
  const fetchEventData = async () => {
    try {
      const data = await api.fetchParticularMarket(eventId);
      const outcomeData = await api.fetchParticularMarketOutcome(eventId);

      if (data.success) {
        setEventData(data.data?.marketrestructuredResponse[0]);
        await fetchContractEventData(
          data.data?.marketrestructuredResponse[0]?.marketDetails
            ?.marketContractId
        );
      };
      if (outcomeData.success) { setOutcomeData(outcomeData.data?.outcomeInfo) };

      console.log(data.data?.marketrestructuredResponse);
      console.log(data);
    } catch (error) {
      console.log(error);
      console.log("some error occured");
    }
  };

  const onClick = async () => {
    if (!publicKey) throw new WalletNotConnectedError();
  };

  const checkMarketExists = async (program, userStateAddress) => {
    console.log("user state address", userStateAddress);

    try {
      const marketData = await program.account.share.fetch(userStateAddress);
      console.log(marketData, "user");

      if (marketData.marketId) {
        console.log("market exists");
        return true;
      }
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("Account does not exist")) return false;
      else return true;
    }
  };
  const amountToLamports = (sol) => {
    const LAMPORTS_PER_SOL = new BN(1000000000);
    return new BN(sol).mul(LAMPORTS_PER_SOL);
  };
  const lamportsToAmount = (sol) => {
    const LAMPORTS_PER_SOL = new BN(1000000000);
    return new BN(sol).div(LAMPORTS_PER_SOL);
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
      else return true;

    }
  };
  const onAddRemoveClick = async () => {
    const contractID = eventData?.marketDetails?.marketContractId;

    if (contractID && contractID !== "") {
      const {
        eventAccount,
        eventBump,
        vaultAddress,
        vaultBump,
        userStateAddress,
        userStateBump,
        usdcAddress,
        usdcPublicKey,
        userWalletAddress,
        userVaultAddress,
        userVaultBump,
      } = getAccountAddresses(contractID, publicKey, ProgramID);
      if (!publicKey) throw new WalletNotConnectedError();
      const token_ata = await getAssociatedTokenAddress(
        usdcPublicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const program = new Program(ProgramIDL, ProgramID, provider);

      console.log("vpda", eventBump);
      console.log("data_acccount", eventAccount);
      let marketExists = await checkMarketExists(program, userStateAddress);
      console.log("me", marketExists);
      let walletExists = await checkUserWalletExists(
        program,
        userWalletAddress
      );
      const liquidity = amountToLamports(liquidityValue);

      if (modeAR === "add") {
        try {
          const liquidityData = {
            walletAddress: publicKey.toBase58(),
            amount: parseFloat(liquidityValue),
            type: "Add",
            marketDetailsId: eventId,
          };
          const res = await api.addLiquidity(liquidityData);
          if (res.success) {
            console.log(res.data);
            const liquidityId = String(res.data.liquidityInfo[0].id);

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
            if (!marketExists) {
              let ix1 = await program.methods
                .initialiseUserState(contractID)
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                })
                .instruction();
              let ix2 = await program.methods
                .addLiquidity(contractID, vaultBump, userVaultBump, liquidity)
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                  tokenMint: usdcPublicKey,
                  vaultUsdc: vaultAddress,
                  userWallet: userWalletAddress,
                  userVault: userVaultAddress,
                  tokenAta: token_ata,
                })
                .instruction();

              let tx = new Transaction().add(ix1).add(ix2);
              await program.provider.sendAndConfirm(tx);
              console.log(tx);
              if (tx) {
                const activateLiquidity = await api.activateLiquidity(
                  liquidityId
                );
                console.log(activateLiquidity);
              }
            } else {
              let ix = await program.methods
                .addLiquidity(contractID, vaultBump, userVaultBump, liquidity)
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                  tokenMint: usdcPublicKey,
                  vaultUsdc: vaultAddress,
                  userWallet: userWalletAddress,
                  userVault: userVaultAddress,
                  tokenAta: token_ata,
                })
                .instruction();

              let tx = new Transaction().add(ix);
              await program.provider.sendAndConfirm(tx);
              console.log(tx);
              if (tx) {
                const activateLiquidity = await api.activateLiquidity(
                  liquidityId
                );
                console.log(activateLiquidity);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        try {
          if (!marketExists) {
            console.log("There is no liquidity added!");
            const userBalance =
              await program.account.userWallet.fetch(
                userWalletAddress
              );
            console.log(
              lamportsToAmount(userBalance.balance).toString()
            );
          } else {
            let ix = await program.methods
              .removeLiquidity(contractID, vaultBump, userVaultBump, liquidity)
              .accounts({
                authority: publicKey,
                systemProgram: SystemProgram.programId,
                marketAccount: eventAccount,
                userMarketShare: userStateAddress,
                tokenMint: usdcPublicKey,
                vaultUsdc: vaultAddress,
                tokenAta: token_ata,
                userWallet: userWalletAddress,
                userVault: userVaultAddress,
              })
              .instruction();

            let tx = new Transaction().add(ix);
            await program.provider.sendAndConfirm(tx);
            console.log(tx);
            const userBalance = await program.account.userWallet.fetch(
              userWalletAddress
            );
            console.log(lamportsToAmount(userBalance.balance).toString());
          }
        } catch (err) {
          console.log(err);
        }
      }

      const marketData = await program.account.marketEvent.fetch(eventAccount);
      console.log(marketData);
    }
  };
  const onBuySellClick = async () => {
    const contractID = eventData?.marketDetails?.marketContractId;

    if (contractID && contractID !== "") {
      const {
        eventAccount,
        eventBump,
        vaultAddress,
        vaultBump,
        userStateAddress,
        userStateBump,
        usdcAddress,
        usdcPublicKey,
        userWalletAddress,
        userVaultAddress,
        userVaultBump,
      } = getAccountAddresses(contractID, publicKey, ProgramID);
      if (!publicKey) throw new WalletNotConnectedError();
      const token_ata = await getAssociatedTokenAddress(
        usdcPublicKey,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const program = new Program(ProgramIDL, ProgramID, provider);

      console.log("vpda", eventBump);
      console.log("data_acccount", eventAccount);
      let marketExists = await checkMarketExists(program, userStateAddress);
      console.log("me", marketExists);
      let walletExists = await checkUserWalletExists(
        program,
        userWalletAddress
      );

      if (BuySellToggle === "buy") {
        const buyAmount = amountToLamports(buysellValue);
        try {
          const liquidityData = {
            walletAddress: publicKey.toBase58(),
            amount: parseFloat(liquidityValue),
            type: "Add",
            marketDetailsId: eventId,
          };
          const res = await api.addLiquidity(liquidityData);
          if (res.success) {
            console.log(res.data);
            const liquidityId = String(res.data.liquidityInfo[0].id);

            if (walletExists) {
              const dm = await program.methods
                .tokenDeposit(userVaultBump, buyAmount)
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
                .tokenDeposit(userVaultBump, buyAmount)
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
            if (!marketExists) {
              let ix1 = await program.methods
                .initialiseUserState(contractID)
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                })
                .instruction();
              let ix2 = await program.methods
                .buyOutcomeShare(
                  contractID,
                  buyAmount,
                  selectedOutcomeId,
                  vaultBump,
                  userVaultBump
                )
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                  tokenMint: usdcPublicKey,
                  vaultUsdc: vaultAddress,
                  userWallet: userWalletAddress,
                  userVault: userVaultAddress,
                  tokenAta: token_ata,
                })
                .instruction();

              let tx = new Transaction().add(ix1).add(ix2);
              await program.provider.sendAndConfirm(tx);
              console.log(tx);
              if (tx) {
                const activateLiquidity = await api.activateLiquidity(
                  liquidityId
                );
                console.log(activateLiquidity);
              }
            } else {
              let ix = await program.methods
                .buyOutcomeShare(
                  contractID,
                  buyAmount,
                  selectedOutcomeId,
                  vaultBump,
                  userVaultBump,

                )
                .accounts({
                  authority: publicKey,
                  systemProgram: SystemProgram.programId,
                  marketAccount: eventAccount,
                  userMarketShare: userStateAddress,
                  tokenMint: usdcPublicKey,
                  vaultUsdc: vaultAddress,
                  userWallet: userWalletAddress,
                  userVault: userVaultAddress,
                  tokenAta: token_ata,
                })
                .instruction();

              let tx = new Transaction().add(ix);
              await program.provider.sendAndConfirm(tx);
              console.log(tx);
              if (tx) {
                const activateLiquidity = await api.activateLiquidity(
                  liquidityId
                );
                console.log(activateLiquidity);
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        const sellAmount = amountToLamports(buysellValue);

        try {
          if (!marketExists) {
            console.log("There are no shares bought!");
            const userBalance =
              await program.account.userWallet.fetch(
                userWalletAddress
              );
            console.log(
              lamportsToAmount(userBalance.balance).toString()
            );
          } else {
            let ix = await program.methods
              .sellOutcomeShare(
                contractID,
                sellAmount,
                selectedOutcomeId,
                vaultBump,
                userVaultBump
              )
              .accounts({
                authority: publicKey,
                systemProgram: SystemProgram.programId,
                marketAccount: eventAccount,
                userMarketShare: userStateAddress,
                tokenMint: usdcPublicKey,
                vaultUsdc: vaultAddress,
                tokenAta: token_ata,
                userWallet: userWalletAddress,
                userVault: userVaultAddress,
              })
              .instruction();

            let tx = new Transaction().add(ix);
            await program.provider.sendAndConfirm(tx);
            console.log(tx);
            const userBalance = await program.account.userWallet.fetch(
              userWalletAddress
            );
            console.log(lamportsToAmount(userBalance.balance).toString());
          }
        } catch (err) {
          console.log(err);
        }
      }

      const marketData = await program.account.marketEvent.fetch(eventAccount);
      const convertedMarketData = {
        ...marketData,
        createdAt: marketData.createdAt.toString(),
        balance: lamportsToAmount(marketData.balance).toString(),
        expiresAt: marketData.expiresAt.toString(),
        liquidity: lamportsToAmount(marketData.liquidity).toString(),
        totalFeeAmount: marketData.totalFeeAmount.toString(),
        volume: lamportsToAmount(marketData.volume).toString(),
        availableShares: lamportsToAmount(
          marketData.availableShares
        ).toString(),
        availableOutcomeShares: marketData.availableOutcomeShares.map(
          (value) => lamportsToAmount(value).toString()
        ),
        totalOutcomeShares: marketData.totalOutcomeShares.map((value) =>
          lamportsToAmount(value).toString()
        ),
      };
      console.log("useffect market data", convertedMarketData);
    }
  };

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);

  const cardData = {
    type: "crypto",
    name: "Will Degods Price be 225 Sol on March 31st?",
    yesPrice: "1.81",
    noPrice: "2.19",
    volume: "49.2K",
    liquidity: "19.0K",
    date: "May 31, 2023",
    icon: EventImage,
  };
  const orderBookData = [
    {
      walletId: "0xabcdef123456",
      action: "Buy",
      outcome: "Yes",
      quantity: 5,
      txId: "0x0123456789abcdef",
    },
    {
      walletId: "0x0123456789abcdef",
      action: "Sell",
      outcome: "No",
      quantity: 3,
      txId: "0xfedcba9876543210",
    },
    {
      walletId: "0xabcdef123456",
      action: "Add",
      outcome: "LP Tokens",
      quantity: 10,
      txId: "0x9876543210abcdef",
    },
    {
      walletId: "0xfedcba9876543210",
      action: "Remove",
      outcome: "Yes",
      quantity: 2,
      txId: "0xabcdef1234567890",
    },
    {
      walletId: "0x0123456789abcdef",
      action: "Buy",
      outcome: "No",
      quantity: 7,
      txId: "0x1234567890abcdef",
    },
    {
      walletId: "0xfedcba9876543210",
      action: "Sell",
      outcome: "LP Tokens",
      quantity: 4,
      txId: "0xabcdef0123456789",
    },
    {
      walletId: "0xabcdef123456",
      action: "Add",
      outcome: "Yes",
      quantity: 9,
      txId: "0x4567890abcdef123",
    },
    {
      walletId: "0x0123456789abcdef",
      action: "Remove",
      outcome: "No",
      quantity: 1,
      txId: "0xcdef01234567890ab",
    },
    {
      walletId: "0xfedcba9876543210",
      action: "Buy",
      outcome: "LP Tokens",
      quantity: 6,
      txId: "0x567890abcdef0123",
    },
    {
      walletId: "0xabcdef123456",
      action: "Sell",
      outcome: "Yes",
      quantity: 8,
      txId: "0x90123456789abcdef",
    }
  ];
  const [BuySellToggle, setBuySellToggle] = useState("buy");

  const handleButtonClick = (button) => {
    setBuySellToggle(button);
  };
  const [showMore, setShowMore] = useState(false);

  const handleShowToggle = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="event">
      <Navbar />
      <div className="ellipse" />
      <div className="event_header">
        <div className="flex w-full gap-4">
          <div className="event_header_imagecontainer">
            <img className="w-32 h-32 object-cover" src={Object.keys(eventData)?.length > 0 ? eventData?.marketDetails?.imageURL !== "image" ? "https://ipfs.io/ipfs/" + eventData?.marketDetails?.imageURL : cardData.icon : cardData.icon} alt="event" />
          </div>
          <div className="event_header_detailscontainer">
            <div className="event_header_detailscontainer_name">
              {eventData?.marketDetails?.description}
            </div>
            <div className="event_header_detailscontainer_other">
              <div className="event_header_detailscontainer_other_label">
                {" "}
                <img src={TagPurple} alt="tag" />
                {eventData?.category?.name}
              </div>
              <div className="event_header_detailscontainer_other_detail">
                <img src={EventIcon} alt="volume" />{" "}
                {eventData?.marketDetails?.closeTime?.substring(0, 10)}
              </div>
              <div className="event_header_detailscontainer_other_detail">
                <img src={VolumeIcon} alt="volume" /> {cardData.volume}
              </div>
              <div className="event_header_detailscontainer_other_detail">
                <img src={LiquidityIcon} alt="volume" /> {cardData.liquidity}
              </div>
            </div>
          </div>
        </div>
        <div className="event_header_outlinkscontainer">
          <div className="event_header_outlinkscontainer_outlink">
            <img src={Share} alt="share" />
          </div>
          <div className="event_header_outlinkscontainer_outlink">
            <img src={BookmarkEmpty} alt="bookmark" />
          </div>
        </div>
      </div>
      <div className="event_main">
        <div className="event_main_left">
          <h1 className="text-white xl:text-3xl text-2xl font-semibold -mt-12">Price Graph</h1>
          <div className="event_main_left_graphcontainer"></div>
          <div className="event_main_left_ordercontainer">
            <div className="event_main_left_ordercontainer_title">
              <span>Order Book</span>
            </div>
            <div className="event_main_left_ordercontainer_table">
              <div className="event_main_left_ordercontainer_table_header">
                <div className="event_main_left_ordercontainer_table_header_column index_column text-transparent">
                  index
                </div>
                <div className="event_main_left_ordercontainer_table_header_column wallet_column">
                  Wallet
                </div>
                <div className="event_main_left_ordercontainer_table_header_column action_column">
                  Action
                </div>
                <div className="event_main_left_ordercontainer_table_header_column outcome_column">
                  Outcome
                </div>
                <div className="event_main_left_ordercontainer_table_header_column quantity_column">
                  Quantity
                </div>
              </div>
              <div className="event_main_left_ordercontainer_table_body">
                {orderBookData.map((order, index) => (
                  <div
                    className="event_main_left_ordercontainer_table_body_row border-b border-[#252525]"
                    key={order.txId}
                  >
                    <div className="event_main_left_ordercontainer_table_body_column index_column">
                      {index + 1}
                    </div>
                    <div className="event_main_left_ordercontainer_table_body_column wallet_column">
                      {order.walletId}
                    </div>
                    <div className="event_main_left_ordercontainer_table_body_column action_column">
                      {order.action}
                    </div>
                    <div className="event_main_left_ordercontainer_table_body_column outcome_column">
                      {order.outcome}
                    </div>
                    <div className="event_main_left_ordercontainer_table_body_column quantity_column">
                      {order.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="event_main_left_aboutcontainer">
            <div className="event_main_left_aboutcontainer_title">
              <span>About this market</span>
            </div>
            <div
              className={`event_main_left_aboutcontainer_expand ${showMore ? "expanded" : ""
                }`}
            >
              <div className="event_main_left_aboutcontainer_description">
                This market will resolve to 'YES' if DeGods NFT floor price is
                at or above 400 SOL according to magiceden.io, on March 31st
                2023 . Otherwise, this market will resolve to 'NO'.
              </div>
              <div className="event_main_left_aboutcontainer_description">
                Deployed By:
                <span className="event_main_left_aboutcontainer_description_deployer">
                  DzduU1Fy3wxw1XTsg2wjqhZXxRszMJr1pYJZsXzXwq6s
                </span>
              </div>
            </div>
            <div
              onClick={handleShowToggle}
              className="event_main_left_aboutcontainer_showmore"
            >
              {/* <Dropup />
              <Dropdown /> */}
              {showMore && (
                <span>
                  Show Less{" "}
                  <img className="float-right" src={Dropup} alt="dropup" />{" "}
                </span>
              )}
              {!showMore && (
                <span>
                  Show More{" "}
                  <img className="float-right" src={Dropdown} alt="dropdown" />{" "}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="event_main_right">
          <div className="event_main_right_holdingcontainer">
            <div className="event_main_right_holdingcontainer_title">
              Manage Holding
            </div>
            <div className="h-full flex flex-col w-full space-y-2">
              <h2 className="py-2 text-white text-lg font-semibold">
                Choose Outcome
              </h2>
              <div className="w-full h-48 overflow-y-scroll p-2 flex flex-col space-y-2">
                {outcomeData.map((outcome, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedOutcomeId(index)
                      console.log(outcome);
                    }}
                    className={`flex py-6 flex-col justify-between w-full border cursor-pointer bg-[#090909] rounded-lg px-5 ${selectedOutcomeId === index
                      ? "selected_card"
                      : "border-[#252525]"
                      } `}
                  >
                    <h2 className="text-white text-lg font-semibold">
                      {outcome.name}
                    </h2>
                    <div className="py-2 w-full items-center px-4 text-white mt-6 border border-white/10 rounded-xl bg-[#101010] flex justify-between">
                      <h3 className="text-lg">Invested</h3>
                      <h3 className="text-lg">$0.10</h3>
                    </div>
                    {
                      outcome.lowerBound === outcome.upperBound ? (
                        <div className="flex justify-between w-full items-center mt-2 ml-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">
                              Bounds:
                            </h3>
                            <p className="text-white text-base font-light">
                              {outcome.lowerBound}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between w-full items-center mt-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">
                              Lower Bound:
                            </h3>
                            <p className="text-white text-base font-light">
                              {contractEventData.expectedValueLowerBound[index]}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-white">
                              Upper Bound:
                            </h3>
                            <p className="text-white text-base font-light">
                              {contractEventData.expectedValueUpperBound[index]}
                            </p>
                          </div>
                        </div>
                      )
                    }
                  </div>

                ))}
              </div>
            </div>

            <div className="event_main_right_holdingcontainer_yesnobuttons">
              <div
                className={`event_main_right_holdingcontainer_yesnobuttons_yes ${BuySellToggle === "buy" ? "active_yes" : ""
                  }`}
                onClick={() => handleButtonClick("buy")}
              >
                {" "}
                <svg
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="3" cy="3" r="3" fill="#B6F72B" />
                </svg>
                Buy <span>{cardData.yesPrice}</span>
              </div>
              <div
                className={`event_main_right_holdingcontainer_yesnobuttons_no ${BuySellToggle === "sell" ? "active_no" : ""
                  }`}
                onClick={() => handleButtonClick("sell")}
              >
                {" "}
                <svg
                  width="6"
                  height="6"
                  viewBox="0 0 6 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="3" cy="3" r="3" fill="#EF3F5F" />
                </svg>
                Sell <span>{cardData.noPrice}</span>
              </div>
            </div>

            <div className="event_main_right_holdingcontainer_formcontainer">
              <div className="event_main_right_holdingcontainer_formcontainer_title">
                Amount in USD
              </div>
              <input
                value={buysellValue}
                onChange={(e) => {
                  setBuysellValue(e.target.value);
                }}
                className="event_main_right_holdingcontainer_formcontainer_input"
              />
              <div className="event_main_right_holdingcontainer_formcontainer_value">
                Available Shares: <span>{sharePrice[selectedOutcomeId] || "0.00000"}</span>
              </div>
              {BuySellToggle === "buy" ? (
                <div
                  onClick={onBuySellClick}
                  className="event_main_right_holdingcontainer_formcontainer_buybutton"
                >
                  Buy ${cardData.yesPrice}
                </div>
              ) : (
                <div
                  onClick={onBuySellClick}
                  className="event_main_right_holdingcontainer_formcontainer_sellbutton"
                >
                  Sell ${cardData.noPrice}
                </div>
              )}
            </div>
            <div className="event_main_right_holdingcontainer_detailscontainer">
              <div className="event_main_right_holdingcontainer_detailscontainer_details">
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-label">
                  LP Fee
                </span>
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-value">
                  2%
                </span>
              </div>
              <div className="event_main_right_holdingcontainer_detailscontainer_details">
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-label">
                  Estimated Shares Bought
                </span>
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-value">
                  0
                </span>
              </div>
              <div className="event_main_right_holdingcontainer_detailscontainer_details">
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-label">
                  Maximum Winnings
                </span>
                <span className="event_main_right_holdingcontainer_detailscontainer_details_details-value">
                  0
                </span>
              </div>
            </div>
          </div>
          <div className="event_main_right_liquiditycontainer">
            <div className="event_main_right_liquiditycontainer_title">
              Add Liquidity
            </div>
            <ToggleAddRemove id="1234" modeAR={modeAR} setModeAR={setModeAR} />
            <div className="event_main_right_liquiditycontainer_formcontainer">
              <div className="event_main_right_liquiditycontainer_formcontainer_title">
                USDC Amount
              </div>
              <input
                type="number"
                value={liquidityValue}
                onChange={(e) => {
                  setLiquidityValue(e.target.value);
                }}
                className="event_main_right_liquiditycontainer_formcontainer_input"
              />
              {modeAR === "add" && (
                <div
                  onClick={onAddRemoveClick}
                  className="event_main_right_liquiditycontainer_formcontainer_addbutton"
                >
                  Add Liquidity
                </div>
              )}
              {modeAR === "remove" && (
                <div
                  onClick={onAddRemoveClick}
                  className="event_main_right_liquiditycontainer_formcontainer_addbutton"
                >
                  Remove Liquidity
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
