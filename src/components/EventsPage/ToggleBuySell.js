import React, { useState } from "react";
import "./EventsPage.scss";
const ToggleBuySell = ({ id, modeBS, setModeBS }) => {

  const handleToggle = () => {
    setModeBS(modeBS === "sell" ? "buy" : "sell");
  };

  return (
    <div className="flex items-center justify-start w-full mt-5">
      <label htmlFor={`${id}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={modeBS === "sell"}
            id={`${id}`}
            name={id}
            className="sr-only"
            onChange={handleToggle}
          />
          <div className="tar_c bg-gray-800 w-60 h-16">
            <p
              className={`tar_text ${
                modeBS === "buy" ? "text-white" : "text-gray"
              }`}
            >
              Buy
            </p>
            <p
              className={`tar_text ${
                modeBS === "sell" ? "text-white" : "text-gray"
              }`}
            >
              Sell
            </p>
          </div>
          <div
            className={`${
              modeBS === "sell" ? "translate-x-full bg-green-500" : "bg-green-500"
            } tar_h`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleBuySell;
