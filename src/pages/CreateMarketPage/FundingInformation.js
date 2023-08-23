import React, { useState } from "react";
import TagPurple from "../../assets/tag_purple.svg";
import EventIcon from "../../assets/event_icon.svg";
import LiquidityIcon from "../../assets/liquidity_icon.svg";


export default function FundingInformation({ inputData, setInputData }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFeesChange = (type, value) => {
    setInputData((prevData) => ({
      ...prevData,
      [type]: formatDecimalValue(value),
    }));
  };

  const handleLiquidityChange = (value) => {
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    setInputData((prevData) => ({
      ...prevData,
      liquidity: sanitizedValue,
    }));
  };

  const formatDecimalValue = (value) => {
    const decimalParts = value.split(".");
    if (decimalParts[1] && decimalParts[1].length > 2) {
      return `${decimalParts[0]}.${decimalParts[1].substring(0, 2)}`;
    }
    return value;
  };

  const increaseValue = (type) => {
    setInputData((prevData) => ({
      ...prevData,
      [type]: formatDecimalValue((parseFloat(prevData[type]) + 1).toFixed(2)),
    }));
  };

  const decreaseValue = (type) => {
    setInputData((prevData) => ({
      ...prevData,
      [type]: formatDecimalValue(
        Math.max(parseFloat(prevData[type]) - 1, 0).toFixed(2)
      ),
    }));
  };

  return (
    <section className="fundinginfo">
      <div className="fundinginfo_wallet">
        <div className="fundinginfo_wallet_title">
          <span>Add Liquidity</span>
          <span>
            9.56 <span>USDC</span>
          </span>
        </div>
        <input
          className="fundinginfo_wallet_input"
          type="number"
          value={inputData.liquidity}
          onChange={(e) => handleLiquidityChange(e.target.value)}
        />
        <div className="fundinginfo_wallet_feescontainer">
          <div className="fundinginfo_wallet_feescontainer_title">
            Platform Fees
          </div>
          <div className="fundinginfo_wallet_feescontainer_inputcontainer">
            <div onClick={() => decreaseValue("platformFees")}>-</div>
            <div onClick={() => increaseValue("platformFees")}>+</div>
            <input
              type="text"
              value={inputData.platformFees}
              onChange={(e) => handleFeesChange("platformFees", e.target.value)}
            />
          </div>
        </div>
        <div className="fundinginfo_wallet_feescontainer">
          <div className="fundinginfo_wallet_feescontainer_title">
            Liquidity Fees
          </div>
          <div className="fundinginfo_wallet_feescontainer_inputcontainer">
            <div onClick={() => decreaseValue("liquidityFees")}>-</div>
            <div onClick={() => increaseValue("liquidityFees")}>+</div>
            <input
              type="text"
              value={inputData.liquidityFees}
              onChange={(e) =>
                handleFeesChange("liquidityFees", e.target.value)
              }
            />
          </div>
        </div>
      </div>
      <div className="fundinginfo_preview">
        <div className="fundinginfo_preview_title">Preview</div>
        <div className="fundinginfo_preview_card">
          <div className="fundinginfo_preview_card_top">
            <div className="fundinginfo_preview_card_top_left">
              {inputData?.imageFile ?
                <img src={URL.createObjectURL(inputData?.imageFile)} className="w-32 h-32 rounded-lg object-cover" alt="preview" />
                : <div className="h-32 w-32" />
              }
            </div>
            <div className="fundinginfo_preview_card_top_right">
              <div className="fundinginfo_preview_card_top_right_title">
                {inputData.description}{" "}
              </div>
              <div className="fundinginfo_preview_card_top_right_detailcontainer">
                <div className="fundinginfo_preview_card_top_right_detailcontainer_card">
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_title">
                    $0.10
                  </div>
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_subtitle">
                    LP Value
                  </div>
                </div>
                <div className="fundinginfo_preview_card_top_right_detailcontainer_card">
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_title">
                    $0.10
                  </div>
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_subtitle">
                    LP Value
                  </div>
                </div>
                <div className="fundinginfo_preview_card_top_right_detailcontainer_card">
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_title">
                    $0.10
                  </div>
                  <div className="fundinginfo_preview_card_top_right_detailcontainer_card_subtitle">
                    LP Value
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="fundinginfo_preview_card_footer">
            <div className="fundinginfo_preview_card_footer_left">
              <img src={TagPurple} alt="tag" />
              {inputData.category}
            </div>
            <div className="fundinginfo_preview_card_footer_right">
              <div className="fundinginfo_preview_card_footer_right_event">
                <img className="float-left mr-2" src={EventIcon} alt="event" />{" "}
                {inputData.closeDateTime.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
