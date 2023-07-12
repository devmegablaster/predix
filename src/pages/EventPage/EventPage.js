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

import "./EventPage.scss";
import ToggleAddRemove from "../../components/EventsPage/ToggleAddRemove";

export default function EventPage() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const { publicKey, sendTransaction } = useWallet();
  const PID = "Eb7Npv4GATiYsjUUPemCx8skU48ct5BMHtM2Dx2gjkJU";
  const ProgramKey = new PublicKey(PID);
  const [provider, setProvider] = useState(
    new AnchorProvider(connection, wallet, {})
  );
  const IDL = {
    version: "0.1.0",
    name: "basic_crud",
    instructions: [
      {
        name: "setdata",
        accounts: [
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "dataAccount",
            isMut: true,
            isSigner: false,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
          {
            name: "rent",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [
          {
            name: "integer",
            type: "u64",
          },
          {
            name: "string",
            type: "string",
          },
        ],
      },
    ],
    accounts: [
      {
        name: "DataAccount",
        type: {
          kind: "struct",
          fields: [
            {
              name: "integerdata",
              type: "u64",
            },
            {
              name: "stringdata",
              type: "string",
            },
            {
              name: "keydata",
              type: "publicKey",
            },
            {
              name: "bump",
              type: "u8",
            },
          ],
        },
      },
    ],
  };
  const onClick = async () => {
    if (!publicKey) throw new WalletNotConnectedError();
    const program = new Program(IDL, ProgramKey, provider);

    let [data_account, vPDA1] = await PublicKey.findProgramAddress(
      [Buffer.from("data"), publicKey.toBuffer()],
      ProgramKey
    );
    console.log("vpda", vPDA1);
    console.log("data_acccount", data_account);
    const tx = await program.methods
      .setdata(new BN(123), "Hello World")
      .accounts({
        authority: publicKey,
        dataAccount: data_account,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    // const {
    //   context: { slot: minContextSlot },
    //   value: { blockhash, lastValidBlockHeight },
    // } = await connection.getLatestBlockhashAndContext();

    // const signature = await sendTransaction(transaction, connection, {
    //   minContextSlot,
    // });

    // await connection.confirmTransaction({
    //   blockhash,
    //   lastValidBlockHeight,
    //   signature,
    // });
  };
  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      setProvider(provider);
    }
  }, [connection, wallet]);
  const cardData = {
    type: "crypto",
    name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
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
    },
  ];
  const [YesNoActive, setYesNoActive] = useState("yes");

  const handleButtonClick = (button) => {
    setYesNoActive(button);
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
        <div className="event_header_imagecontainer">
          <img className="w-32 h-32" src={cardData.icon} alt="event" />
        </div>
        <div className="event_header_detailscontainer">
          <div className="event_header_detailscontainer_name">
            {cardData.name}
          </div>
          <div className="event_header_detailscontainer_other">
            <div className="event_header_detailscontainer_other_label">
              {" "}
              <img src={TagPurple} alt="tag" />
              {cardData.type}
            </div>
            <div className="event_header_detailscontainer_other_detail">
              <img src={EventIcon} alt="volume" /> {cardData.date}
            </div>
            <div className="event_header_detailscontainer_other_detail">
              <img src={VolumeIcon} alt="volume" /> {cardData.volume}
            </div>
            <div className="event_header_detailscontainer_other_detail">
              <img src={LiquidityIcon} alt="volume" /> {cardData.liquidity}
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
          <div className="event_main_left_pricecontainer">
            <div className="event_main_left_pricecontainer_yes">
              <div className="event_main_left_pricecontainer_yes_price">
                {cardData.yesPrice} | $0.20
              </div>
              <div className="event_main_left_pricecontainer_yes_text">
                Shares: <span>Yes</span>
              </div>
            </div>
            <div className="event_main_left_pricecontainer_no">
              <div className="event_main_left_pricecontainer_no_price">
                {cardData.yesPrice} | $0.19
              </div>
              <div className="event_main_left_pricecontainer_no_text">
                Shares: <span>No</span>
              </div>
            </div>{" "}
            <div className="event_main_left_pricecontainer_lp">
              <div className="event_main_left_pricecontainer_lp_price">
                $0.10
              </div>
              <div className="event_main_left_pricecontainer_lp_text">
                LP Value
              </div>
            </div>
            <div className="event_main_left_pricecontainer_lp">
              <div className="event_main_left_pricecontainer_lp_price">
                $0.23
              </div>
              <div className="event_main_left_pricecontainer_lp_text">
                LP Token
              </div>
            </div>
          </div>
          <div className="event_main_left_graphcontainer"></div>
          <div className="event_main_left_ordercontainer">
            <div className="event_main_left_ordercontainer_title">
              <span>Order Book</span>
            </div>
            <div className="event_main_left_ordercontainer_table">
              <div className="event_main_left_ordercontainer_table_header">
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
                <div className="event_main_left_ordercontainer_table_header_column tx_column">
                  TX ID
                </div>
              </div>
              <div className="event_main_left_ordercontainer_table_body">
                {orderBookData.map((order) => (
                  <div
                    className="event_main_left_ordercontainer_table_body_row"
                    key={order.txId}
                  >
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
                    <div className="event_main_left_ordercontainer_table_body_column tx_column">
                      {order.txId}
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
              className={`event_main_left_aboutcontainer_expand ${
                showMore ? "expanded" : ""
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
            <div className="event_main_right_holdingcontainer_bar">
              <div className="event_main_right_holdingcontainer_bar_green"></div>
              <div className="event_main_right_holdingcontainer_bar_red"></div>
            </div>
            <div className="event_main_right_holdingcontainer_yesnobuttons">
              <div
                className={`event_main_right_holdingcontainer_yesnobuttons_yes ${
                  YesNoActive === "yes" ? "active_yes" : ""
                }`}
                onClick={() => handleButtonClick("yes")}
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
                Yes <span>{cardData.yesPrice}</span>
              </div>
              <div
                className={`event_main_right_holdingcontainer_yesnobuttons_no ${
                  YesNoActive === "no" ? "active_no" : ""
                }`}
                onClick={() => handleButtonClick("no")}
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
                No <span>{cardData.noPrice}</span>
              </div>
            </div>
            <div className="event_main_right_holdingcontainer_formcontainer">
              <div className="event_main_right_holdingcontainer_formcontainer_title">
                Amount in USD
              </div>
              <input className="event_main_right_holdingcontainer_formcontainer_input" />
              <div className="event_main_right_holdingcontainer_formcontainer_value">
                Sol: <span>0.0000</span> <span>0.000000</span> shares(approx.)
              </div>
              {YesNoActive === "yes" ? (
                <div className="event_main_right_holdingcontainer_formcontainer_buybutton">
                  Buy ${cardData.yesPrice}
                </div>
              ) : (
                <div className="event_main_right_holdingcontainer_formcontainer_sellbutton">
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
            <ToggleAddRemove />
            <div className="event_main_right_liquiditycontainer_formcontainer">
              <div className="event_main_right_liquiditycontainer_formcontainer_title">
                USDC Amount
              </div>
              <input className="event_main_right_liquiditycontainer_formcontainer_input" />
              <div
                onClick={onClick}
                className="event_main_right_liquiditycontainer_formcontainer_addbutton"
              >
                Add Liquidity
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
