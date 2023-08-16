import { Modal, Notification } from "@mantine/core"
import { PiTelegramLogo, PiTwitterLogo, PiWhatsappLogo } from "react-icons/pi"
import { FaAt, FaCopy, FaEnvelope } from "react-icons/fa"
import { useState } from "react";

const SocialIcons = ({ icon, link }) => {
  return (
    <div className="flex flex-col items-center justify-center h-16 w-16 rounded-full bg-[#AEAEAE1A] hover:bg-[#D4D5F93D] duration-100 cursor-pointer text-black">
      {icon}
    </div>
  )
}

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

export default function Index({ opened, setOpened }) {
  const [notify, setNotify] = useState(false);
  return (
    <Modal
      title={<div className="text-white font-lg font-bold">Share with</div>}
      classNames={{
        header: "bg-[#090909] border-t border-r border-l border-[#252525]",
        content: "bg-[#090909] border-b border-l border-r border-[#252525]",
      }}
      opened={opened}
      withCloseButton
      onClose={() => {
        setOpened(false);
      }}
      centered
    >
      <div className="h-full w-full border-t border-[#222222] flex flex-col items-center space-y-3">
        <div className="flex w-full justify-between mt-4">
          <SocialIcons icon={<PiTelegramLogo className="text-white h-6 w-6" />} />
          <SocialIcons icon={<PiTwitterLogo className="text-white h-6 w-6" />} />
          <SocialIcons icon={<PiWhatsappLogo className="text-white h-6 w-6" />} />
          <SocialIcons icon={<FaAt className="text-white h-6 w-6" />} />
        </div>
      </div>
      <div className="flex flex-col items-center mt-4 space-y-4">
        <span>Or share with link</span>
        <div className="flex px-4 py-3 rounded-full bg-[#AEAEAE1A] w-full justify-between">
          <div className="">{truncateString(window.location.href, 35)}</div>
          <FaCopy onClick={() => {
            navigator.clipboard.writeText(window.location.href)
            setNotify(true)
          }} className="text-[#D4D5F9] h-5 w-5 cursor-pointer" />
        </div>
        <Notification onClose={() => setNotify(false)} className="w-full" title="Link Copied!" color={"teal"} hidden={!notify} />
      </div>
    </Modal>
  )
}
