import React, { useEffect, useState } from "react";
import "./LandingPage.scss";
import Modal from "../../components/Modal";
import Navbar from "../../components/Navbar/Navbar";
import LandingBanner from "../../assets/LandingBanner.png";
import FundIcon from "../../assets/fund.svg";
import BetIcon from "../../assets/bet.svg";
import EarnIcon from "../../assets/earn.svg";
import PredictIcon from "../../assets/predict.svg";
import TrackIcon from "../../assets/track.svg";
import DiscoverIcon from "../../assets/discover.svg";
import RedeemIcon from "../../assets/redeem.svg";
import Predix from "../../assets/PredixLogo.svg";
import MarketsContainer from "../../components/MarketsContainer/MarketsContainer";
import { Link } from "react-router-dom";
import Api from "../../utils/api";

export default function LandingPage() {


  const getStartedCardsData = [
    {
      title: "1. Connect",
      subtext:
        "Connect your existing pre-funded Solana wallets like Phantom or Backpack.",
      icon: FundIcon,
    },
    {
      title: "2. Bet",
      subtext:
        "Trade on future events, buy shares of markets of your choice. Exit at any time.",
      icon: BetIcon,
    },
    {
      title: "3. Earn",
      subtext:
        "Once the market is resolved, redeem your winnings directly to your wallet.",
      icon: EarnIcon,
    },
  ];
  const featuresData = [
    {
      title: "Discover",
      subtext:
        "Explore a diverse catalog of events across a wide range of topics, including Crypto, Sports, and Politics, along with the live odds associated with each event in the market.",
      icon: DiscoverIcon,
    },
    {
      title: "Predict",
      subtext:
        "Place a bet on the outcome by purchasing contracts or shares that represent your prediction. The potential winnings are also displayed alongside the bet amount.",
      icon: PredictIcon,
    },
    {
      title: "Track",
      subtext:
        "Monitor the progress of your portfolio and sell contracts to lock in profits at any time. Compete against a global leaderboard of all traders and win rewards.",
      icon: TrackIcon,
    },
    {
      title: "Redeem",
      subtext:
        "Collect your winnings based on the odds and the amount you bet, and redeem them directly to your wallet.",
      icon: RedeemIcon,
    },
  ];

  const [fundsModalOpen, setFundsModalOpen] = useState(false);

  return (
    <article className="landing">
      <Navbar />
      <section className="landing_main">
        <Modal fundsModalOpen={fundsModalOpen} setFundsModalOpen={setFundsModalOpen} />
        <img
          src={LandingBanner}
          className="landing_main_banner"
          alt="landing banner"
        />
        <div className="landing_main_content">
          <div className="landing_main_content_markets">
            <div className="landing_main_content_markets_title">
              Trending Markets
            </div>
            <MarketsContainer />
            <Link
              to="/markets"
              className="landing_main_content_markets_allbutton"
            >
              See All Markets
            </Link>
          </div>
          <div className="landing_main_content_getstarted">
            <div className="landing_main_content_getstarted_title">
              Get Started in Few Simple Steps
            </div>
            <div className="landing_main_content_getstarted_cards">
              {getStartedCardsData.map((card, id) => {
                return (
                  <div
                    key={id}
                    className="landing_main_content_getstarted_cards_card"
                  >
                    <div className="landing_main_content_getstarted_cards_card_left">
                      <img src={card.icon} alt={`${card.icon}`} />
                    </div>
                    <div className="landing_main_content_getstarted_cards_card_right">
                      <div className="landing_main_content_getstarted_cards_card_right_title">
                        {card.title}
                      </div>
                      <div className="landing_main_content_getstarted_cards_card_right_subtitle">
                        {card.subtext}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="landing_main_content_features">
            <div className="landing_main_content_features_title">
              Non-custodial, Fast, and Transparent
            </div>
            <div className="landing_main_content_features_subtitle">
              Powered by the most performant blockchain, Solana, with extremely
              low fees and high speed.
            </div>
            <div className="landing_main_content_features_cards">
              {featuresData.map((card, id) => {
                return (
                  <div
                    key={id}
                    className="landing_main_content_features_cards_card"
                  >
                    <div className="landing_main_content_features_cards_card_top">
                      <img src={card.icon} alt={`${card.icon}`} />
                    </div>
                    <div className="landing_main_content_features_cards_card_bottom">
                      <div className="landing_main_content_features_cards_card_bottom_title">
                        {card.title}
                      </div>
                      <div className="landing_main_content_features_cards_card_bottom_subtitle">
                        {card.subtext}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="landing_main_content_bottom">
            <div className="landing_main_content_bottom_title">
              Let's PREDIX.
            </div>
            <div className="landing_main_content_bottom_subtitle">
              Start making predictions with Predix Market and earn if you are
              right.
            </div>
          </div>
          <div className="landing_main_content_footer">
            <div className="landing_main_content_footer_left">
              <Link to="/" className="landing_main_content_footer_left_logo">
                <img src={Predix} alt="Predix" />
              </Link>
            </div>
            <div className="landing_main_content_footer_middle">
              <Link
                to="/markets"
                className="landing_main_content_footer_middle_text"
              >
                Markets
              </Link>
              <Link
                to="/"
                onClick={() => setFundsModalOpen(true)}
                className="landing_main_content_footer_middle_subtext"
              >
                Funds
              </Link>
              <Link
                to="/leaderboard"
                className="landing_main_content_footer_middle_subtext"
              >
                Leaderboard
              </Link>
              <Link
                to="/userstatistics/455"
                className="landing_main_content_footer_middle_subtext"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="landing_main_content_footer_middle_subtext"
              >
                Settings
              </Link>
            </div>
            <div className="landing_main_content_footer_right">
              <div className="landing_main_content_footer_right_text">
                Join the community
              </div>
              <div className="landing_main_content_footer_right_socials">
                <Link to="/">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M19.8 3.71776C19.0716 4.04204 18.2875 4.26284 17.4669 4.36061C18.3036 3.85465 18.9486 3.05373 19.2521 2.09882C18.4687 2.56731 17.5979 2.9087 16.6737 3.09039C15.9324 2.296 14.8771 1.7998 13.7085 1.7998C11.4635 1.7998 9.64669 3.63059 9.64669 5.8883C9.64669 6.21014 9.68149 6.52056 9.75029 6.82039C6.37475 6.65093 3.38201 5.0222 1.37902 2.54858C1.02941 3.15313 0.828709 3.85464 0.828709 4.60504C0.828709 6.02355 1.58701 7.27504 2.67792 8.00914C2.01189 7.98633 0.878076 7.80381 0.878076 7.49746V7.54798C0.878076 9.52949 2.23686 11.1827 4.0958 11.5583C3.75509 11.6511 3.37554 11.7009 3.00407 11.7009C2.74347 11.7009 2.47804 11.6756 2.22877 11.6267C2.74591 13.2514 4.23985 14.4344 6.01947 14.4669C4.62831 15.5653 2.87459 16.2187 0.970334 16.2187C0.642574 16.2187 0.31805 16.1992 0 16.1601C1.79742 17.3219 3.93312 17.9998 6.22665 17.9998C13.6987 17.9998 17.7841 11.7668 17.7841 6.36413C17.7841 6.18569 17.78 6.0097 17.7719 5.83453C18.5666 5.25768 19.2537 4.53741 19.8 3.71776Z"
                      fill="white"
                    />
                  </svg>
                </Link>
                <Link to="/">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.6254 4.72684C15.0387 3.451 12.5287 3.23517 12.422 3.226C12.2545 3.21184 12.0954 3.30684 12.027 3.46017C12.022 3.47017 11.967 3.596 11.9062 3.79184C12.9554 3.9685 14.2445 4.32517 15.4112 5.04934C15.5979 5.16517 15.6554 5.411 15.5395 5.5985C15.4645 5.72017 15.3337 5.78684 15.2004 5.78684C15.1287 5.78684 15.0562 5.76767 14.9904 5.72684C12.9854 4.4835 10.4804 4.421 9.9987 4.421C9.51703 4.421 7.0112 4.4835 5.00786 5.72684C4.82036 5.8435 4.57536 5.78517 4.4587 5.5985C4.34203 5.411 4.40036 5.166 4.58703 5.04934C5.7537 4.326 7.04203 3.9685 8.09203 3.79184C8.03036 3.59517 7.97536 3.47017 7.9712 3.46017C7.90203 3.30684 7.7437 3.21017 7.57536 3.22684C7.46953 3.23517 4.95953 3.451 3.3512 4.74517C2.5112 5.521 0.832031 10.061 0.832031 13.986C0.832031 14.0552 0.850365 14.1235 0.884531 14.1835C2.0437 16.2193 5.20536 16.7527 5.9262 16.776C5.93036 16.776 5.93453 16.776 5.9387 16.776C6.0662 16.776 6.1862 16.7152 6.2612 16.6118L6.99036 15.6102C5.02453 15.1018 4.02036 14.2393 3.96203 14.1885C3.79703 14.0427 3.7812 13.791 3.92703 13.626C4.07286 13.461 4.3237 13.4452 4.4887 13.5902C4.51286 13.6118 6.36203 15.181 9.9987 15.181C13.642 15.181 15.4912 13.6052 15.5095 13.5893C15.6745 13.446 15.9262 13.461 16.0712 13.6268C16.2162 13.7918 16.2004 14.0427 16.0362 14.1877C15.9779 14.2393 14.9737 15.101 13.0079 15.6093L13.737 16.611C13.812 16.7143 13.932 16.7752 14.0595 16.7752C14.0637 16.7752 14.0679 16.7752 14.072 16.7752C14.7929 16.7527 17.9545 16.2193 19.1137 14.1827C19.147 14.1227 19.1654 14.0552 19.1654 13.986C19.1654 10.061 17.4862 5.521 16.6254 4.72684ZM7.40786 12.3918C6.63786 12.3918 6.01286 11.6777 6.01286 10.7977C6.01286 9.91767 6.63703 9.2035 7.40786 9.2035C8.1787 9.2035 8.80286 9.91767 8.80286 10.7977C8.80286 11.6777 8.1787 12.3918 7.40786 12.3918ZM12.5895 12.3918C11.8195 12.3918 11.1945 11.6777 11.1945 10.7977C11.1945 9.91767 11.8187 9.2035 12.5895 9.2035C13.3595 9.2035 13.9845 9.91767 13.9845 10.7977C13.9845 11.6777 13.3595 12.3918 12.5895 12.3918Z"
                      fill="white"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
