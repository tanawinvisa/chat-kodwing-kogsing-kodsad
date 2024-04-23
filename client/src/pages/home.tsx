import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Sidebar from "./Left-Sidebar/sidebar";
import ChatWindow from "./Chat-Window/chat-window";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";
import Menu from "./Left-Sidebar/sidebar-menu";

const Home: React.FC = () => {
  const [currentPage, setPage] = useState("all-chats");
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
    <div className="h-screen flex flex-col">
      <Menu setPage={setPage} currentPage={currentPage} />
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full w-screen">
          <Sidebar
            onGroupClick={handleGroupClick}
            selectedGroup={selectedGroup}
            isPrivate={isPrivate}
            currentPage={currentPage}
          />
          <div className="flex w-2/3 overflow-hidden">
            {showChatWindow ? (
              <ChatWindow selectedGroup={selectedGroup} isPrivate={isPrivate} />
            ) : (
              <div className="bg-white w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={200}
                    height={200}
                    className="opacity-50"
                  />
                  <p className="text-xl font-roboto text-black mt-2">
                    Too Sad To Chat ?
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
