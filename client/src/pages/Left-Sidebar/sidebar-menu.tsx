type SidebarMenuProps = {
  setPage: (page: string) => void;
  currentPage: string;
};

import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
// import { useState } from "react";
// import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
// import Sidebar from "./Left-Sidebar/sidebar";
import ChatWindow from "../Chat-Window/chat-window";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";

const SidebarMenu = ({ setPage, currentPage }: SidebarMenuProps) => {
  const [room, setRoom] = useState("all-chats");
  ///

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
    <div className="w-64 bg-gradient-to-r from-[#F6F5F2] to-[#F3D0D7] flex text-gray-800 flex-col justify-start items-center space-y-4 font-roboto">
      <Image
        src="/barby-logo.png"
        alt=""
        width={150}
        height={75}
        className="mt-8"
      ></Image>
      <div className="">
        <button
          ref={accountButtonRef}
          type="button"
          name="account"
          className="flex flex-col items-center justify-center hover:bg-bgColor p-2 rounded-2xl transition duration-200"
          onClick={toggleDropdown}
        >
          <Image
            src={`/Frame_${
              username ? hashString(username as string) % 9 : 0
            }.png`}
            alt=""
            width={50}
            height={50}
          ></Image>
          <p className="text-sm font-roboto text-gray-800 mt-2">{username}</p>
          <ChevronDownIcon className="h-4 w-4 text-fontWhiteDarkBgColor" />
        </button>
        {dropdownVisible && (
          <div
            ref={dropdownRef}
            className="bg-borderColor bg-opacity-80 text-gray-800 absolute mt-2 top-16 right-4 shadow-md py-2 px-4 rounded-md z-10 hover:bg-red-500 transition duration-200"
            onClick={toggleDropdown}
          >
            <button onClick={handleLogout} className="text-sm">
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="mb-8">
        <button
          type="button"
          name="friends"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-bgColor ${
            room === "friends" ? "text-purple" : ""
          } transition duration-250`}
          onClick={() => {
            setPage("friends");
            setRoom("friends");
            console.log("friends");
          }}
        >
          <UserIcon className="h-8 w-8" />
          <span className="text-sm font-medium">Friends</span>
        </button>
      </div>
      <div className="mb-8">
        <button
          type="button"
          name="groups"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-bgColor ${
            room === "groups" ? "text-purple" : ""
          } transition duration-250`}
          onClick={() => {
            setPage("groups");
            setRoom("groups");
            console.log("groups");
          }}
        >
          <UserGroupIcon className="h-8 w-8" />
          <span className="text-sm font-medium">Groups</span>
        </button>
      </div>

      <div className="mb-12">
        <button
          type="button"
          name="all-chats"
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl hover:bg-bgColor ${
            room === "all-chats" ? "text-purple" : ""
          } transition duration-250`}
          onClick={() => {
            setPage("all-chats");
            setRoom("all-chats");
            console.log("all-chats");
          }}
        >
          <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
          <span className="text-sm font-medium">All Chats</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarMenu;
