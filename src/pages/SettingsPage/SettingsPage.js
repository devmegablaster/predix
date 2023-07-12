import React, { useState } from "react";
import "./SettingsPage.scss";
import Navbar from "../../components/Navbar/Navbar";
import SettingsBanner from "../../assets/SettingsBanner.png";
import Account from "../../assets/account.svg";
import Email from "../../assets/emailnotification.svg";

export default function SettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  const [contestsEnabled, setContestsEnabled] = useState(false);
  const [marketUpdatesEnabled, setMarketUpdatesEnabled] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };
  const handleNewsletterToggle = () => {
    setNewsletterEnabled(!newsletterEnabled);
  };

  const handleContestsToggle = () => {
    setContestsEnabled(!contestsEnabled);
  };

  const handleMarketUpdatesToggle = () => {
    setMarketUpdatesEnabled(!marketUpdatesEnabled);
  };
  return (
    <article className="settings">
      <Navbar />
      <section className="settings_main">
        <img
          src={SettingsBanner}
          className="settings_main_banner"
          alt="settings banner"
        />
        <div className="settings_main_content">
          <div className="settings_main_content_accountcontainer">
            <div className="settings_main_content_accountcontainer_header">
              <div className="settings_main_content_accountcontainer_header_left">
                <img src={Account} alt="account" />
                <span>Account</span>
              </div>
              {!isEditing && (
                <div className="settings_main_content_accountcontainer_header_right">
                  <button onClick={handleEditClick}>Edit</button>
                </div>
              )}
            </div>
            <div className="settings_main_content_accountcontainer_body">
              <div className="settings_main_content_accountcontainer_body_inputcontainer">
                <div className="settings_main_content_accountcontainer_body_inputcontainer_title">
                  Display Name
                </div>
                <input className="settings_main_content_accountcontainer_body_inputcontainer_input" />
                <div className="settings_main_content_accountcontainer_body_inputcontainer_subtitle">
                  Everyone can see this
                </div>
              </div>
              <div className="settings_main_content_accountcontainer_body_inputcontainer">
                <div className="settings_main_content_accountcontainer_body_inputcontainer_title">
                  Email
                </div>
                <input className="settings_main_content_accountcontainer_body_inputcontainer_input" />
              </div>
              {isEditing && (
                <div className="settings_main_content_accountcontainer_body_buttoncontainer">
                  <div
                    onClick={handleCancelClick}
                    className="settings_main_content_accountcontainer_body_buttoncontainer_cancel button"
                  >
                    Cancel
                  </div>
                  <div
                    onClick={handleSaveClick}
                    className="settings_main_content_accountcontainer_body_buttoncontainer_save button"
                  >
                    Save
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="settings_main_content_emailcontainer">
            <div className="settings_main_content_emailcontainer_header">
              <div className="settings_main_content_emailcontainer_header_left">
                <img src={Email} alt="email" />
                <span>Email Notification</span>
              </div>
            </div>
            <div className="settings_main_content_emailcontainer_body">
              <div className="settings_main_content_emailcontainer_body_togglecontainer">
                <div className="settings_main_content_emailcontainer_body_togglecontainer_title">
                  Newsletter
                </div>
                <div
                  className={`toggle-switch ${
                    newsletterEnabled ? "enabled" : ""
                  }`}
                  onClick={handleNewsletterToggle}
                >
                  <div className="toggle-slider"></div>
                </div>
              </div>
              <div className="settings_main_content_emailcontainer_body_togglecontainer">
                <div className="settings_main_content_emailcontainer_body_togglecontainer_title">
                  Contests & Promotions
                </div>
                <div
                  className={`toggle-switch ${
                    contestsEnabled ? "enabled" : ""
                  }`}
                  onClick={handleContestsToggle}
                >
                  <div className="toggle-slider"></div>
                </div>{" "}
              </div>
              <div className="settings_main_content_emailcontainer_body_togglecontainer">
                <div className="settings_main_content_emailcontainer_body_togglecontainer_title">
                  Predix Market Updates
                </div>
                <div
                  className={`toggle-switch ${
                    marketUpdatesEnabled ? "enabled" : ""
                  }`}
                  onClick={handleMarketUpdatesToggle}
                >
                  <div className="toggle-slider"></div>
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
