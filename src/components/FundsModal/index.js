import { Modal, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import DepositModal from "./DepositModal";
import SellModal from "./SellModal";
import BridgeModal from "./BridgeModal";

export default function Index({ fundsModalOpen, setFundsModalOpen }) {
  const [value, setValue] = useState("deposit");
  return (
    <Modal
      title={<div className="text-white font-lg font-bold" >Manage Balances</div>}
      classNames={{
        header: "bg-black border-t border-r border-l border-[#252525]",
        content: "bg-black border-b border-l border-r border-[#252525]",
      }}
      opened={fundsModalOpen}
      withCloseButton
      onClose={() => {
        setFundsModalOpen(false);
      }}
    >
      <div className="flex flex-col w-full h-full items-center space-y-4">
        <SegmentedControl
          className="w-11/12 bg-black border-[#333333] border rounded-lg"
          classNames={{ control: "py-1", controlActive: "bg-[#333333]" }}
          value={value}
          onChange={setValue}
          data={[
            { label: "Deposit", value: "deposit" },
            { label: "Withdraw", value: "withdraw" },
            { label: "Bridge", value: "bridge" },
          ]}
        />
        {value === "deposit" && <DepositModal />}
        {value === "withdraw" && <SellModal />}
        {value === "bridge"  && <BridgeModal />}
      </div>
    </Modal>
  );
}
