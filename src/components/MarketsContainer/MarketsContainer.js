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
import "./MarketsContainer.scss";
import { Link } from "react-router-dom";

export default function MarketsContainer() {
  const tabsData = [
    {
      label: "All",
    },
    {
      label: "Crypto",
    },
    {
      label: "Entertainment",
    },
    {
      label: "NFT",
    },
    {
      label: "Stocks",
    },
    {
      label: "Politics",
    },
    {
      label: "Sports",
    },
    {
      label: "Economics",
    },
    {
      label: "Science and Technology",
    },
  ];
  const filters = ["New", "Trending", "Staff Picks", "Ending Soon"];

  const cardsData = [
    {
      type: "crypto",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "crypto",
      name: "Will DeGods NFT floor price be at or above 500 scdčol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "crypto",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "entertainment",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "stocks",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "politics",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "sports",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
    {
      type: "economics",
      name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
      yesPrice: "1.81",
      noPrice: "2.19",
      volume: "49.2K",
      liquidity: "19.0K",
      date: "May 31, 2023",
      icon: EventImage,
    },
  ];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [selectedTab, setSelectedTab] = useState("All");

  const tabsRef = useRef([]);
  const [filteredCards, setFilteredCards] = useState(cardsData);

  useEffect(() => {
    if (selectedTab === "All") {
      setFilteredCards(cardsData);
    } else {
      const filtered = cardsData.filter(
        (card) => card.type.toLowerCase() === selectedTab.toLowerCase()
      );
      setFilteredCards(filtered);
    }
  }, [selectedTab]);

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex];
      setTabUnderlineLeft(currentTab?.offsetLeft - 80 ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth + 60 ?? 0);
    }

    setTabPosition();
    window.addEventListener("resize", setTabPosition);

    return () => window.removeEventListener("resize", setTabPosition);
  }, [activeTabIndex]);
  return (
    <>
      <div className="markets_main_header">
        <div className=" markets_main_header_tabs">
          {tabsData.map((tab, idx) => {
            const isActive = idx === activeTabIndex;
            return (
              <>
                <button
                  key={idx}
                  ref={(el) => (tabsRef.current[idx] = el)}
                  className={`pt-2 pb-1 font-bold ${
                    isActive ? "active-tab" : ""
                  }`}
                  onClick={() => {
                    setSelectedTab(tab.label);
                    setActiveTabIndex(idx);
                  }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <img
                    src={isActive ? TabActiveIcon : TabIcon}
                    className="mr-2 float-left"
                    alt="tab"
                  />
                  {tab.label}
                </button>
                <span
                  className="absolute bottom-0 block h-0.5 transition-all duration-300"
                  style={{
                    left: tabUnderlineLeft,
                    width: tabUnderlineWidth,
                    backgroundColor: "#D4D5F9",
                  }}
                />
              </>
            );
          })}
        </div>
      </div>
      <div className="markets_main_cardscontainer">
        <div className="markets_main_cardscontainer_filters">
          {filters.map((tab, idx) => {
            return (
              <div className="markets_main_cardscontainer_filters_filter">
                <img className="float-left mr-2" src={EventIcon} alt="event" />{" "}
                {tab}
              </div>
            );
          })}
        </div>
        <div className="markets_main_cardscontainer_cards">
          {filteredCards.map((card, id) => {
            return (
              <Link
                to="/event/485839"
                className="markets_main_cardscontainer_card"
              >
                <div className="markets_main_cardscontainer_card_content">
                  <div className="markets_main_cardscontainer_card_content_top">
                    <div className="markets_main_cardscontainer_card_content_top_left">
                      <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer">
                        <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer_label">
                          <img src={TagPurple} alt="tag" />
                          {card.type}
                        </div>
                        <img
                          className="w-5"
                          src={BookmarkEmpty}
                          alt="Empty Bookmark"
                        />
                      </div>
                      <div className="markets_main_cardscontainer_card_content_top_left_namecontainer">
                        {card.name}
                      </div>
                    </div>
                    <div className="markets_main_cardscontainer_card_content_top_right">
                      <img
                        className="w-full"
                        src={card.icon}
                        alt="eventImage"
                      />
                    </div>
                  </div>
                  <div className="markets_main_cardscontainer_card_content_yesnocontainer">
                    <div className="markets_main_cardscontainer_card_content_yesnocontainer_yescontainer">
                      {card.yesPrice}
                    </div>
                    <div className="markets_main_cardscontainer_card_content_yesnocontainer_nocontainer">
                      {card.noPrice}
                    </div>
                  </div>
                </div>
                <div className="markets_main_cardscontainer_card_footer">
                  <div className="markets_main_cardscontainer_card_footer_left">
                    <div className="markets_main_cardscontainer_card_footer_left_detail">
                      <img src={TabIcon} alt="volume" /> {card.volume}
                    </div>
                    <div className="markets_main_cardscontainer_card_footer_left_detail">
                      <img src={LiquidityIcon} alt="volume" /> {card.liquidity}
                    </div>
                  </div>
                  <div className="markets_main_cardscontainer_card_footer_right"></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
