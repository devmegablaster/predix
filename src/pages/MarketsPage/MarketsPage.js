import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MarketsBanner from "../../assets/markets_banner.png";
import TabIcon from "../../assets/tab_icon.svg";
import TabActiveIcon from "../../assets/tab_active_icon.svg";
import EventIcon from "../../assets/event_icon.svg";
import LiquidityIcon from "../../assets/liquidity_icon.svg";
import BookmarkEmpty from "../../assets/bookmark_empty.svg";
import EventImage from "../../assets/event_image.svg";
import TagPurple from "../../assets/tag_purple.svg";
import "./MarketsPage.scss";
import { Link } from "react-router-dom";
import MarketsContainer from "../../components/MarketsContainer/MarketsContainer";

export default function MarketsPage() {
  return (
    <article className="markets min-h-screen">
      <Navbar />
      <section className="markets_main h-full">
        <img
          src={MarketsBanner}
          className="markets_main_banner"
          alt="market banner"
        />
        <MarketsContainer/>
      </section>
    </article>
  );
}
