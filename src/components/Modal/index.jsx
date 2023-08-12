import { Modal, SegmentedControl } from "@mantine/core";
import { useState } from "react";
import Deposit from "./Deposit";
import Sell from "./Sell";

export default function Index({ opened, setOpened }) {
  const [value, setValue] = useState('deposit');
  return (
    <Modal title={<h3 className="text-white font-bold">Manage Balances</h3>} classNames={{ header: "bg-black border-t border-r border-l border-[#252525]", content: "bg-black border-b border-l border-r border-[#252525]" }} opened={opened} withCloseButton onClose={() => {
      setOpened(false);
    }}>
      <div className="flex flex-col w-full h-full items-center space-y-4">
        <SegmentedControl
          className="w-11/12 bg-black border-[#333333] border rounded-lg"
          classNames={{ control: "py-1", controlActive: "bg-[#333333]" }}
          value={value}
          onChange={setValue}
          data={[
            { label: 'Deposit', value: 'deposit' },
            { label: 'Sell', value: 'sell' },
            { label: 'Bridge', value: 'bridge' },
          ]}
        />
        {
          value === "deposit" && <Deposit />
        }
        {
          value === "sell" && <Sell />
        }
      </div>
    </Modal>
  );
}
