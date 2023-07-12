import React, { useState } from "react";
import "./EventsPage.scss";
const TogglePosition = ({ id }) => {
  const [mode, setMode] = useState("add");

  const handleToggle = () => {
    setMode(mode === "remove" ? "add" : "remove");
  };

  return (
    <div className="flex items-center justify-start w-full mt-5">
      <label htmlFor={`${id}`} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={mode === "remove"}
            id={`${id}`}
            name={id}
            className="sr-only"
            onChange={handleToggle}
          />
          <div className="tp_c bg-gray-800 w-96 h-16">
            <p
              className={`tar_text ${
                mode === "add" ? "text-white" : "text-gray"
              }`}
            >
              Market Position
            </p>
            <p
              className={`tar_text ${
                mode === "remove" ? "text-white" : "text-gray"
              }`}
            >
              Liquidity Position
            </p>
          </div>
          <div
            className={`${
              mode === "remove"
                ? "translate-x-full bg-green-500"
                : "bg-green-500"
            } tp_h`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default TogglePosition;
