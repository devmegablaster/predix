import { Slider } from "@mantine/core"
import { useState } from "react"

export default function Sell() {
  const [amount, setAmount] = useState("Amount")
  return (
    <div className="h-full w-full flex flex-col space-y-3">
      <div className="w-full h-full flex flex-col space-y-2 border border-[#333333] rounded-lg p-2">
        <div className="flex justify-between items-center bg-[#1D1D1D] px-3 py-3 rounded-lg">
          <div className="flex space-x-2 items-start">
            <img src="/crypto.png" />
            <div className="flex flex-col justify-between">
              <h2 className="font-semibold text-white">Steller</h2>
              <p className="text-sm text-[#646464]">Polygon Mainnet</p>
            </div>
          </div>
          <div className="flex items-end flex-col justify-between">
            <p className="text-sm text-[#8C8C8C]">Available</p>
            <p className="">0 BLF</p>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <p className="text-sm font-bold text-[#646464]">Current Price</p>
          <p className="text-sm">1 stl = 23.454 USDC</p>
        </div>
        <div className="w-full h-1 bg-[#646464] rounded-xl" />
        <div className="py-20 w-full text-3xl bg-[#1D1D1D] rounded-lg text-[#646464] text-center">
          {amount}
        </div>
        <Slider className="w-[95%] pb-5 mx-auto" color="gray" marks={[
          { value: 0, label: "0" },
          { value: 25, label: "25%" },
          { value: 50, label: "50%" },
          { value: 75, label: "75%" },
          { value: 100, label: "100%" },
        ]} />
      </div>
      <button className="bg-[#D4D5F9] text-black font-semibold py-3 rounded-lg">Sell Steller</button>
    </div>
  )
}
