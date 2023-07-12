import React, { useState } from "react";
import "./CreateMarketPage.scss";
const ToggleOutcome = ({ id, mode, setMode }) => {

  const handleToggle = () => {
    setMode(mode === "range" ? "single" : "range");
  };

  return (
    <div className="flex items-center justify-start w-full mt-5">
      <label htmlFor={`${id}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={mode === "range"}
            id={`${id}`}
            name={id}
            className="sr-only"
            onChange={handleToggle}
          />
          <div className="tp_c bg-gray-800 w-96 h-16">
            <p
              className={`tar_text ${
                mode === "single" ? "text-white" : "text-gray"
              }`}
            >
              Single
            </p>
            <p
              className={`tar_text ${
                mode === "range" ? "text-white" : "text-gray"
              }`}
            >
              Range
            </p>
          </div>
          <div
            className={`${
              mode === "range"
                ? "translate-x-full bg-green-500"
                : "bg-green-500"
            } tp_h`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default ToggleOutcome;
