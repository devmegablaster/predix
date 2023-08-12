import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import MarketsPage from "./pages/MarketsPage/MarketsPage";
import EventPage from "./pages/EventPage/EventPage";
import LeaderboardPage from "./pages/LeaderboardPage/LeaderboardPage";
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import UserStatisticsPage from "./pages/UserStatisticsPage/UserStatisticsPage";
import CreateMarketPage from "./pages/CreateMarketPage/CreateMarketPage";
import LandingPage from "./pages/LandingPage/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/markets" element={<MarketsPage />} />
      <Route path="/event/:eventId" element={<EventPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/userstatistics/:userid" element={<UserStatisticsPage />} />
      <Route path="/create" element={<CreateMarketPage />} />

    </Routes>
  );
}

export default App;
