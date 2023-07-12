import React from "react";
import Predix from "../../assets/PredixLogo.svg";
import Leaderboard from "../../assets/leaderboard_icon.svg";
import Markets from "../../assets/markets_icon.svg";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import {
  WalletDisconnectButton,
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

export default function Navbar() {
  return (
    <section className="navbar">
      <div className="flex items-center">
        <Link to="/" className="navbar_logocontainer">
          <img
            src={Predix}
            alt="Predix"
            className="navbar_logocontainer_logo"
          />
        </Link>
        <div className="navbar_searchcontainer">
          <input
            className="navbar_searchcontainer_input"
            placeholder="Search markets. topics, categories"
          />
        </div>
      </div>
      <div className="navbar_navigationcontainer">
        <div className="navbar_navigationcontainer_nav">
          <img src={Markets} alt="markets" />
          <div>Markets</div>
        </div>
        <Link to="/leaderboard" className="navbar_navigationcontainer_nav">
          <img src={Leaderboard} alt="leaderboard" />
          <div>Leaderboard</div>
        </Link>
        <Link to="/create" className="navbar_navigationcontainer_createbutton">Create Event</Link>
        <div className="navbar_navigationcontainer_separator"/>
        <div className="navbar_navigationcontainer_connectwallet">
          <WalletMultiButton/>

        </div>
        {/* <WalletDisconnectButton/> */}
      </div>
    </section>
  );
}
