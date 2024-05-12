import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import LeaderboardBanner from "../../assets/LeaderboardBanner.png";
import "./LeaderboardPage.scss";

import ActiveIcon from "../../assets/leaderboardactive.svg";
import DefaultIcon from "../../assets/leaderboarddefault.svg";
import GoldTrophy from "../../assets/gold.svg";
import SilverTrophy from "../../assets/silver.svg";
import BronzeTrophy from "../../assets/bronze.svg";
import GenericTrophy from "../../assets/generictrophy.svg";
import Api from '../../utils/api';


export default function LeaderboardPage() {
  const filters = ["VOLUME", "PROFIT", "LIQUIDITY"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const dateFilters = ["All", "Day", "Week", "Month"];
  const [activeDateFilter, setActiveDateFilter] = useState(dateFilters[0]);

  const [data, setData] = useState([])

  useEffect(() => {
    setData([])
    const fetchVolumeData = async () => {
      const api = new Api()
      const leaderBoard = await api.fetchLeaderboardByVolume()
      setData(leaderBoard.data.winingDetailsInfo)
    }

    const fetchProfitData = async () => {
      const api = new Api()
      const leaderBoard = await api.fetchLeaderboardByProfit()
      setData(leaderBoard.data.winingDetailsInfo)
    }

    const fetchLiquidity = async () => {
      const api = new Api()
      const leaderBoard = await api.fetchLeaderboardByLiquidity()
      setData(leaderBoard.data.winingDetailsInfo)
    }

    if (activeFilter === "VOLUME") {
      fetchVolumeData()
    }

    if (activeFilter === "PROFIT") {
      fetchProfitData()
    }

    if (activeFilter === "LIQUIDITY") {
      fetchLiquidity()
    }
  }, [activeFilter])

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDateFilterClick = (dateFilter) => {
    setActiveDateFilter(dateFilter);
  };
  return (
    <article className="leaderboard min-h-screen bg-black">
      <Navbar />
      <section className="leaderboard_main">
        <img
          src={LeaderboardBanner}
          className="leaderboard_main_banner"
          alt="leaderboard banner"
        />
        <div className="leaderboard_main_content">
          <div className="leaderboard_main_content_header">
            {filters.map((filter) => (
              <div
                key={filter}
                className={`leaderboard_main_content_header_tab ${
                  activeFilter === filter ? "active" : ""
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                <img
                  src={activeFilter === filter ? ActiveIcon : DefaultIcon}
                  alt={`${filter} icon`}
                  className="leaderboard_main_content_header_tab_icon"
                />
                <span className="leaderboard_main_content_header_tab_name">
                  {filter}
                </span>
              </div>
            ))}
          </div>
          <div className="leaderboard_main_content_datefiltercontainer">
            {dateFilters.map((dateFilter) => (
              <div
                key={dateFilter}
                className={`leaderboard_main_content_datefiltercontainer_button ${
                  activeDateFilter === dateFilter ? "active" : ""
                }`}
                onClick={() => handleDateFilterClick(dateFilter)}
              >
                <span className="leaderboard_main_content_datefiltercontainer_button_text">
                  {dateFilter}
                </span>
              </div>
            ))}
          </div>
          <div className="leaderboard_main_content_usercontainer">
            {data.map((user, index) => (
              <div
                key={user?.walletAddress}
                className="leaderboard_main_content_usercontainer_row"
              >
                <span className="leaderboard_main_content_usercontainer_row_serial">
                  {index + 1}
                </span>
                <span className="leaderboard_main_content_usercontainer_row_name">
                  <span>{
                    user?.walletAddress.length > 20 ?
                    user?.walletAddress?.slice(0, 6) +
                    "..." +
                    user?.walletAddress?.slice(-4) : user?.walletAddress
                  }</span>
                  {index < 3 ? (
                    // Show gold, silver, and bronze icons for the top 3 users
                    <>
                      {index === 0 && (
                        <img src={GoldTrophy} alt="Gold Trophy" />
                      )}
                      {index === 1 && (
                        <img src={SilverTrophy} alt="Silver Trophy" />
                      )}
                      {index === 2 && (
                        <img src={BronzeTrophy} alt="Bronze Trophy" />
                      )}
                    </>
                  ) : (
                    // Show generic trophy for the rest of the users
                    <img src={GenericTrophy} alt="Generic Trophy" />
                  )}
                </span>
                <span className="leaderboard_main_content_usercontainer_row_value">
                  {user?.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
