import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import "./UserStatisticsPage.scss";
import RedirectIcon from "../../assets/redirect.svg";
import NotificationIcon from "../../assets/emailnotification.svg";
import AccountIcon from "../../assets/account.svg";
import PurpleIcon from "../../assets/purpleicon.svg";
import EventImage from "../../assets/event_image.svg";
import VolumeIcon from "../../assets/tab_icon.svg";
import LiquidityIcon from "../../assets/liquidity_icon.svg";
import EventIcon from "../../assets/event_icon.svg";

import TogglePosition from "../../components/EventsPage/TogglePosition";

export default function UserStatisticsPage() {
  const marketPositionData = [
    {
      market: "Dummy Market 1",
      outcome: "Positive",
      price: 10.5,
      "profit/loss": 250.75,
      shares: 100,
      value: 1050,
      "max payout": 5000,
      status: "Active",
    },
    {
      market: "Dummy Market 2",
      outcome: "Negative",
      price: 8.75,
      "profit/loss": -150.25,
      shares: 50,
      value: 437.5,
      "max payout": 3000,
      status: "Inactive",
    },
    {
      market: "Dummy Market 3",
      outcome: "Positive",
      price: 12.25,
      "profit/loss": 500.1,
      shares: 200,
      value: 2450,
      "max payout": 10000,
      status: "Active",
    },
    {
      market: "Dummy Market 4",
      outcome: "Positive",
      price: 15.0,
      "profit/loss": 750.0,
      shares: 150,
      value: 2250,
      "max payout": 7000,
      status: "Active",
    },
    {
      market: "Dummy Market 5",
      outcome: "Negative",
      price: 9.99,
      "profit/loss": -200.0,
      shares: 80,
      value: 799.2,
      "max payout": 4000,
      status: "Inactive",
    },
    {
      market: "Dummy Market 6",
      outcome: "Positive",
      price: 14.5,
      "profit/loss": 300.25,
      shares: 70,
      value: 1015,
      "max payout": 5500,
      status: "Active",
    },
    {
      market: "Dummy Market 7",
      outcome: "Positive",
      price: 11.75,
      "profit/loss": 125.5,
      shares: 90,
      value: 1057.5,
      "max payout": 6000,
      status: "Active",
    },
    {
      market: "Dummy Market 8",
      outcome: "Negative",
      price: 7.25,
      "profit/loss": -400.75,
      shares: 30,
      value: 217.5,
      "max payout": 2000,
      status: "Inactive",
    },
    {
      market: "Dummy Market 9",
      outcome: "Positive",
      price: 13.0,
      "profit/loss": 625.0,
      shares: 120,
      value: 1560,
      "max payout": 8000,
      status: "Active",
    },
    {
      market: "Dummy Market 10",
      outcome: "Positive",
      price: 17.0,
      "profit/loss": 850.0,
      shares: 180,
      value: 3060,
      "max payout": 9000,
      status: "Active",
    },
  ];
  const activityData = [
    {
      amount: "9,112",
      date: "May 31, 2023",
      volume: "49.2K",
      liquidity: "19.0K",
      name: "Miami Heat",
      description:
        "Which team will emerge as the Eastern Conference Champions in the 2023 NBA Finals? Boston Celtics or Miami Heat?",
      icon: EventImage,
    },
    {
      amount: "3,789",
      date: "June 15, 2023",
      volume: "22.5K",
      liquidity: "15.7K",
      name: "Los Angeles Lakers",
      description:
        "Who will win the MVP award in the 2023 NBA season? LeBron James or Kevin Durant?",
      icon: EventImage,
    },
    {
      amount: "2,451",
      date: "July 2, 2023",
      volume: "14.8K",
      liquidity: "9.3K",
      name: "Golden State Warriors",
      description:
        "Will the Golden State Warriors make it to the playoffs in the 2023 NBA season?",
      icon: EventImage,
    },
    {
      amount: "5,624",
      date: "July 20, 2023",
      volume: "31.6K",
      liquidity: "22.9K",
      name: "Brooklyn Nets",
      description:
        "Who will score the most points in a single game during the 2023 NBA season? Kevin Durant or James Harden?",
      icon: EventImage,
    },
  ];

  return (
    <section class="userstatistics">
      <Navbar />
      <div className="userstatistics_main">
        <div className="userstatistics_main_statscontainer">
          <div className="userstatistics_main_statscontainer_left">
            <div className="userstatistics_main_statscontainer_left_wallet">
              <div className="userstatistics_main_statscontainer_left_wallet_title">
                0x7d0A5D9596337fFCEff4aE3d68D51c8cF9
                <img src={RedirectIcon} alt="redirect" />
              </div>
              <div className="userstatistics_main_statscontainer_left_wallet_subtext">
                <div>
                  FIRST PREDICTION: <span>DECEMBER 05, 2022</span>
                </div>
                <div>
                  TOTAL PREDICTION: <span>112</span>
                </div>
              </div>
            </div>
            <div className="userstatistics_main_statscontainer_left_other">
              <div className="userstatistics_main_statscontainer_left_other_title">
                Leaderboard Ranks
              </div>
              <div className="userstatistics_main_statscontainer_left_other_details">
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Rank (By Volume)
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    4
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Rank (By Markets Created)
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    5
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Rank (By Won Predictions)
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    8
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Rank (By Liquidity Added)
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    0
                  </div>
                </div>
              </div>
            </div>
            <div className="userstatistics_main_statscontainer_left_other">
              <div className="userstatistics_main_statscontainer_left_other_title">
                Prediction Statistics
              </div>
              <div className="userstatistics_main_statscontainer_left_other_details">
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Volume
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    35.0 <span>GMLR</span>
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Markets Created
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    5
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Won Predictions
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    8
                  </div>
                </div>
                <div className="userstatistics_main_statscontainer_left_other_details_container">
                  <div className="userstatistics_main_statscontainer_left_other_details_container_text">
                    Liquidity Added
                  </div>
                  <div className="userstatistics_main_statscontainer_left_other_details_container_subtext">
                    32.0 <span>GMLR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="userstatistics_main_statscontainer_right">
            <div className="userstatistics_main_statscontainer_right_header">
              <img src={NotificationIcon} alt="statistics" />
              <span>Statistics</span>
            </div>
            <div className="userstatistics_main_statscontainer_right_body">
              <div className="userstatistics_main_statscontainer_right_body_earning">
                <div className="userstatistics_main_statscontainer_right_body_earning_title">
                  Total Earnings
                </div>
                <div className="userstatistics_main_statscontainer_right_body_earning_subtitle">
                  - 169.14 GMLR
                </div>
              </div>
              <div className="userstatistics_main_statscontainer_right_body_other">
                <div className="userstatistics_main_statscontainer_right_body_other_title">
                  Liquidity Provided
                </div>
                <div className="userstatistics_main_statscontainer_right_body_other_subtitle">
                  289.22 GMLR
                </div>
              </div>
              <div className="userstatistics_main_statscontainer_right_body_other">
                <div className="userstatistics_main_statscontainer_right_body_other_title">
                  Won Predictions
                </div>
                <div className="userstatistics_main_statscontainer_right_body_other_subtitle">
                  23
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="userstatistics_main_positioncontainer">
          <div className="userstatistics_main_positioncontainer_header">
            <TogglePosition />
          </div>
          <div className="userstatistics_main_positioncontainer_table">
            <div className="userstatistics_main_positioncontainer_table_header">
              <div className="userstatistics_main_positioncontainer_table_header_column market_column">
                Market
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column outcome_column">
                Outcome
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column price_column">
                Price
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column profitloss_column">
                Profit/Loss
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column shares_column">
                Shares
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column value_column">
                Value
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column maxpayout_column">
                Max Payout
              </div>
              <div className="userstatistics_main_positioncontainer_table_header_column status_column">
                Status
              </div>
            </div>
            <div className="userstatistics_main_positioncontainer_table_body">
              {marketPositionData.map((order) => (
                <div
                  className="userstatistics_main_positioncontainer_table_body_row"
                  key={order.txId}
                >
                  <div className="userstatistics_main_positioncontainer_table_body_column market_column">
                    {order.market}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column outcome_column">
                    {order.outcome}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column price_column">
                    {order.price}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column profitloss_column">
                    {order["profit/loss"]}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column shares_column">
                    {order.shares}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column value_column">
                    {order.value}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column maxpayout_column">
                    {order["max payout"]}
                  </div>
                  <div className="userstatistics_main_positioncontainer_table_body_column status_column">
                    {order.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="userstatistics_main_activitycontainer">
          <div className="userstatistics_main_activitycontainer_header">
            <div className="userstatistics_main_activitycontainer_header_left">
              <img src={AccountIcon} alt="account" />
              <span>Account</span>
            </div>

            <div className="userstatistics_main_activitycontainer_header_right">
              <input
                className="userstatistics_main_activitycontainer_header_right_searchinput"
                placeholder="Search activities"
              />
            </div>
          </div>
          <div className="userstatistics_main_activitycontainer_body">
            {activityData.map((activity) => (
              <div
                className="userstatistics_main_activitycontainer_body_card"
                key={activity.name}
              >
                <div className="userstatistics_main_activitycontainer_body_card_header">
                  <div className="userstatistics_main_activitycontainer_body_card_header_left">
                    <img src={PurpleIcon} alt="purple" />{" "}
                    <div>{`Bought ${activity.amount} shares of event '${activity.name}'`}</div>
                  </div>
                  <div className="userstatistics_main_activitycontainer_body_card_header_right">
                    6 Days Ago
                  </div>
                </div>
                <div className="userstatistics_main_activitycontainer_body_card_body">
                  <div className="userstatistics_main_activitycontainer_body_card_body_left">
                    <div className="userstatistics_main_activitycontainer_body_card_body_left_title">
                      {activity.description}
                    </div>
                    <div className="userstatistics_main_activitycontainer_body_card_body_left_others">
                      <div className="userstatistics_main_activitycontainer_body_card_body_left_others_left">
                        <div className="userstatistics_main_activitycontainer_body_card_body_left_others_left_detail">
                          <img src={VolumeIcon} alt="volume" />{" "}
                          {activity.volume}
                        </div>
                        <div className="userstatistics_main_activitycontainer_body_card_body_left_others_left_detail">
                          <img src={LiquidityIcon} alt="volume" />{" "}
                          {activity.liquidity}
                        </div>
                      </div>
                      <div className="userstatistics_main_activitycontainer_body_card_body_left_others_right">
                        <img src={EventIcon} alt="volume" /> {activity.date}
                      </div>
                    </div>
                  </div>
                  <div className="userstatistics_main_activitycontainer_body_card_body_right">
                    <img src={EventImage} alt="event" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
