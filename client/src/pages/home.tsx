import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "./Left-Sidebar/sidebar";
import ChatWindow from "./Chat-Window/chat-window";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";

const Home: React.FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isPrivate, setIsPrivate] = useState<any>(undefined);
  const handleGroupClick = (groupName: string, isprivate: any) => {
    setSelectedGroup(groupName);
    setShowChatWindow(true);
    setIsPrivate(isprivate);
  };
  const accountButtonRef = useRef<HTMLButtonElement | null>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      accountButtonRef.current &&
      !accountButtonRef.current.contains(event.target as Node)
    ) {
      setDropdownVisible(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push("/login");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="h-screen flex-col flex">
      {/* <div className="bg-gradient-to-r from-[#F6F5F2] to-[#F3D0D7] text-gray-800 w-full h-[12.5%] items-center flex"></div> */}
      <div className="h-[100%] flex-1 flex-row flex">
        <Sidebar
          onGroupClick={handleGroupClick}
          selectedGroup={selectedGroup}
          isPrivate={isPrivate}
        />
        {showChatWindow ? (
          <ChatWindow selectedGroup={selectedGroup} isPrivate={isPrivate} />
        ) : (
          <div className="bg-bgColor w-2/3">
            <div className="w-full h-full justify-center items-center flex-col flex">
              <Image
                src="/logo1.png"
                alt=""
                width={200}
                height={200}
                className="opacity-50"
              ></Image>
              <p className="text-xl font-roboto text-white opacity-40 mt-2">
                Start your new chat!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
