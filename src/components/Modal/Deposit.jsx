import { Select } from "@mantine/core"
import { useState } from "react"

const IncrementButton = ({ value, amount, setAmount }) => {
  return (
    <button onClick={() => {
      setAmount(amount + value)
    }} className="w-full py-2 bg-[#1D1D1D] text-white rounded-lg">+${value}</button>
  )
}


export default function Deposit() {
  const [amount, setAmount] = useState(0)

  const buttonValues = [100, 250, 450, 900]

  return (
    <div className="flex flex-col space-y-3 w-full h-full">
      <div className="w-full h-full flex flex-col space-y-3 p-2 border-[#333333] rounded-lg border">
        <input className="w-full py-20 bg-[#1D1D1D] text-[#646464] text-3xl font-bold text-center outline-none rounded-lg" placeholder="Enter an Amount" value={amount} onChange={(e) => {
          setAmount(e.target.value)
        }} />
        <div className="grid grid-cols-4 gap-3">
          {buttonValues.map((value) => {
            return (
              <IncrementButton value={value} amount={amount} setAmount={setAmount} />
            )
          })}
        </div>
        <div className="w-full h-1 bg-[#646464] rounded-xl" />
        <div className="flex justify-between items-center bg-[#1D1D1D] px-2 py-3 rounded-lg">
          <div className="flex space-x-2 items-start">
            <img src="/crypto.png" />
            <div className="flex flex-col justify-between">
              <h2 className="font-semibold text-white">Steller</h2>
              <p className="text-sm text-[#646464]">Polygon Mainnet</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <p className="text-[#8C8C8C]">0 BLF</p>
          </div>
        </div>
      </div>
      <button className="w-full py-3 bg-[#D4D5F9] text-black rounded-lg font-semibold">Deposit</button>
    </div>
  )
}
