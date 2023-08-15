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
import Api from "../../utils/api";

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
    type: "entertainment",
    name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
    yesPrice: "1.81",
    noPrice: "2.19",
    volume: "49.2K",
    liquidity: "19.0K",
    date: "May 31, 2023",
    icon: EventImage,
  },
  // {
  //   type: "entertainment",
  //   name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
  //   yesPrice: "1.81",
  //   noPrice: "2.19",
  //   volume: "49.2K",
  //   liquidity: "19.0K",
  //   date: "May 31, 2023",
  //   icon: EventImage,
  // },
  // {
  //   type: "stocks",
  //   name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
  //   yesPrice: "1.81",
  //   noPrice: "2.19",
  //   volume: "49.2K",
  //   liquidity: "19.0K",
  //   date: "May 31, 2023",
  //   icon: EventImage,
  // },
  // {
  //   type: "politics",
  //   name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
  //   yesPrice: "1.81",
  //   noPrice: "2.19",
  //   volume: "49.2K",
  //   liquidity: "19.0K",
  //   date: "May 31, 2023",
  //   icon: EventImage,
  // },
  // {
  //   type: "sports",
  //   name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
  //   yesPrice: "1.81",
  //   noPrice: "2.19",
  //   volume: "49.2K",
  //   liquidity: "19.0K",
  //   date: "May 31, 2023",
  //   icon: EventImage,
  // },
  // {
  //   type: "economics",
  //   name: "Will DeGods NFT floor price be at or above 500 sol on March 31st?",
  //   yesPrice: "1.81",
  //   noPrice: "2.19",
  //   volume: "49.2K",
  //   liquidity: "19.0K",
  //   date: "May 31, 2023",
  //   icon: EventImage,
  // },
];

export default function MarketsContainer() {
  const api = new Api();

  const [categories, setCategories] = useState([{ id: 0, name: "All" }]);
  const [marketsData, setMarketsData] = useState([]);

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const [selectedTab, setSelectedTab] = useState("All");

  const tabsRef = useRef([]);
  const [filteredCards, setFilteredCards] = useState(marketsData);

  useEffect(() => {
    if (selectedTab === "All") {
      setFilteredCards(marketsData);
    } else {
      console.log(selectedTab);
      const filtered = marketsData.filter(
        (card) =>
          card?.category?.name.toLowerCase() === selectedTab.toLowerCase()
      );
      console.log(filtered);
      setFilteredCards(filtered);
    }
  }, [selectedTab, marketsData]);

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

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    console.log("hello");
    try {
      const data = await api.fetchCategories();
      console.log("data", data);
      if (data.success)
        setCategories([{ id: 0, name: "All" }, ...data.data?.categoryInfo]);
      console.log(data);
      const activeMarketData = await api.fetchActiveMarkets();
      console.log(activeMarketData);
      if (activeMarketData.success) {
        const modifiedMarketData = activeMarketData.data?.marketrestructuredResponse;
        // const modifiedMarketData = activeMarketData.data?.marketDetailsInfo.map(
        //   (market) => {
        //     console.log("m",market);
        //     const category = data.data?.categoryInfo.find(
        //       (cat) => String(cat.id) === market.categoryId
        //     );
        //     return { ...market, categoryName: category ? category.name : null };
        //   }
        // );
        setMarketsData(modifiedMarketData);
      }
    } catch (error) {
      console.log("some error occured");
    }
  };

  const truncateString = (str, num) => {
    if (str?.length <= num) {
      return str;
    }
    return str?.slice(0, num) + "...";
  };

  return (
    <>
      <div className="markets_main_header">
        <div className=" markets_main_header_tabs">
          {categories.map((tab, idx) => {
            const isActive = idx === activeTabIndex;
            return (
              <>
                <button
                  key={idx}
                  ref={(el) => (tabsRef.current[idx] = el)}
                  className={`pt-2 pb-1 font-bold ${isActive ? "active-tab" : ""
                    }`}
                  onClick={() => {
                    setSelectedTab(tab.name);
                    setActiveTabIndex(idx);
                  }}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <img
                    src={isActive ? TabActiveIcon : TabIcon}
                    className="mr-2 float-left"
                    alt="tab"
                  />
                  {tab.name}
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
            card.yesPrice = 20
            card.noPrice = 10
            return (
              <Link
                to={`/event/${card?.marketDetails?.id}`}
                className="markets_main_cardscontainer_card"
              >
                <div className="markets_main_cardscontainer_card_content">
                  <div className="markets_main_cardscontainer_card_content_top">
                    <div className="markets_main_cardscontainer_card_content_top_left">
                      <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer">
                        <div className="markets_main_cardscontainer_card_content_top_left_tagcontainer_label">
                          <img src={TagPurple} alt="tag" />
                          {card?.category?.name}
                        </div>
                      </div>
                      <div className="markets_main_cardscontainer_card_content_top_left_namecontainer max-w-[150px] 2xl:max-w-[280px]">
                        {truncateString(card?.marketDetails?.description, 50)}
                      </div>
                    </div>
                    <div className="markets_main_cardscontainer_card_content_top_right">
                      <img
                        className="w-5 self-start mr-1 mt-2"
                        src={BookmarkEmpty}
                        alt="Empty Bookmark"
                      />
                      <img
                        className="h-32 w-32 rounded-xl object-cover"
                        src={card.marketDetails.imageURL !== "image" ? "https://ipfs.io/ipfs/" + card.marketDetails.imageURL : EventImage}
                        alt="eventImage"
                      />
                    </div>
                  </div>
                  <div className="markets_main_cardscontainer_card_content_yesnocontainer">
                    <div className={`markets_main_cardscontainer_card_content_yesnocontainer_yescontainer`}
                      style={{
                        width: `${Number.parseInt((card?.yesPrice / (card?.yesPrice + card?.noPrice)) * 100)}%`
                      }}
                    >
                      {card?.yesPrice}
                    </div>
                    <div className={`markets_main_cardscontainer_card_content_yesnocontainer_nocontainer`}
                      style={{
                        width: `${Number.parseInt((card?.noPrice / (card?.yesPrice + card?.noPrice)) * 100)}%`
                      }}
                    >
                      {card?.noPrice}
                    </div>
                  </div>
                </div>
                <div className="markets_main_cardscontainer_card_footer">
                  <div className="markets_main_cardscontainer_card_footer_left">
                    <div className="markets_main_cardscontainer_card_footer_left_detail">
                      <img src={TabIcon} alt="volume" /> {card?.volume}
                    </div>
                    <div className="markets_main_cardscontainer_card_footer_left_detail">
                      <img src={LiquidityIcon} alt="volume" /> {card?.liquidity}
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
