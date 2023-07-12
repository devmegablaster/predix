import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import LeaderboardBanner from "../../assets/LeaderboardBanner.png";
import "./LeaderboardPage.scss";

import ActiveIcon from "../../assets/leaderboardactive.svg";
import DefaultIcon from "../../assets/leaderboarddefault.svg";
import GoldTrophy from "../../assets/gold.svg";
import SilverTrophy from "../../assets/silver.svg";
import BronzeTrophy from "../../assets/bronze.svg";
import GenericTrophy from "../../assets/generictrophy.svg";


export default function LeaderboardPage() {
  const filters = ["VOLUME", "PROFIT", "LIQUIDITY"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const dateFilters = ["All", "Day", "Week", "Month"];
  const [activeDateFilter, setActiveDateFilter] = useState(dateFilters[0]);

  const userData = [
    {
      name: "InformalBend",
      volume: "742,110",
      liquidity: "34,456",
      profit: "45,789",
      date: "2023-07-01",
    },
    {
      name: "ExampleUser1",
      volume: "500,000",
      liquidity: "25,000",
      profit: "30,000",
      date: "2023-06-30",
    },
    {
      name: "ExampleUser2",
      volume: "300,000",
      liquidity: "15,000",
      profit: "25,000",
      date: "2023-06-29",
    },
    {
      name: "ExampleUser3",
      volume: "200,000",
      liquidity: "10,000",
      profit: "20,000",
      date: "2023-06-28",
    },
    // Add more dummy objects here
    {
      name: "ExampleUser4",
      volume: "100,000",
      liquidity: "5,000",
      profit: "15,000",
      date: "2023-06-27",
    },
    {
      name: "ExampleUser5",
      volume: "50,000",
      liquidity: "2,500",
      profit: "10,000",
      date: "2023-06-26",
    },
    {
      name: "ExampleUser6",
      volume: "30,000",
      liquidity: "1,500",
      profit: "7,500",
      date: "2023-06-25",
    },
    {
      name: "ExampleUser7",
      volume: "20,000",
      liquidity: "1,000",
      profit: "5,000",
      date: "2023-06-24",
    },
    {
      name: "ExampleUser8",
      volume: "10,000",
      liquidity: "500",
      profit: "2,500",
      date: "2023-06-23",
    },
    {
      name: "ExampleUser9",
      volume: "5,000",
      liquidity: "250",
      profit: "1,500",
      date: "2023-06-22",
    },
    {
      name: "ExampleUser10",
      volume: "2,500",
      liquidity: "100",
      profit: "1,000",
      date: "2023-06-21",
    },
  ];
  // Filter the user data based on the active filter and date filter
  const filteredData = userData.filter((user) => {
    if (activeDateFilter === "All") {
      return true; // Show all data if "All" is selected
    } else if (activeDateFilter === "Day") {
      const currentDate = new Date().toISOString().split("T")[0];
      return user.date === currentDate;
    } else if (activeDateFilter === "Week") {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 7);
      return new Date(user.date) >= dateThreshold;
    } else if (activeDateFilter === "Month") {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 30);
      return new Date(user.date) >= dateThreshold;
    }
  });

  // Sort the filtered data based on the active filter
  filteredData.sort((a, b) => {
    if (activeFilter === "VOLUME") {
      return (
        Number(b.volume.replace(",", "")) - Number(a.volume.replace(",", ""))
      );
    } else if (activeFilter === "PROFIT") {
      return (
        Number(b.profit.replace(",", "")) - Number(a.profit.replace(",", ""))
      );
    } else if (activeFilter === "LIQUIDITY") {
      return (
        Number(b.liquidity.replace(",", "")) -
        Number(a.liquidity.replace(",", ""))
      );
    }
  });
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleDateFilterClick = (dateFilter) => {
    setActiveDateFilter(dateFilter);
  };
  return (
    <article className="leaderboard">
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
            {filteredData.map((user, index) => (
              <div
                key={user.name}
                className="leaderboard_main_content_usercontainer_row"
              >
                <span className="leaderboard_main_content_usercontainer_row_serial">
                  {index + 1}
                </span>
                <span className="leaderboard_main_content_usercontainer_row_name">
                  <span>{user.name}</span>
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
                  {user[activeFilter.toLowerCase()]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
