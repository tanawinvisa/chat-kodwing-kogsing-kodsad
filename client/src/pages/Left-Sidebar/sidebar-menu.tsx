import {
  ChatBubbleOvalLeftEllipsisIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ThemeButton from "../theme_button";

const SidebarMenu = ({ setPage, currentPage }: SidebarMenuProps) => {
  const [room, setRoom] = useState("all-chats");

  const router = useRouter();
  const { username } = router.query;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
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
    <div className="w-full bg-[#FFFC00] dark:bg-gray-900 flex text-black justify-between items-center font-sans px-4 py-2">
      <div className="flex flex-row items-center space-x-6 w-1/3">
        <Image
        src="/logo.png"
        alt=""
        width={50}
        height={50}
        className="ml-4 rounded-full"
      ></Image>
        <div>
          <ThemeButton/>
        </div>
      </div>

    <div className="flex items-center w-1/3 justify-center">
        <button
          ref={accountButtonRef}
          type="button"
          name="account"
          className="flex items-center justify-center hover:bg-white p-2 rounded-full transition duration-200"
          onClick={toggleDropdown}
        >
          <Image
            src={`/Frame_${
              username ? hashString(username as string) % 9 : 0
            }.png`}
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          ></Image>
        </button>
    </div>
    
    <div className="flex w-1/3 justify-end">
      <button
        type="button"
        name="friends"
        className={`flex items-center justify-center w-14 h-14 rounded-full ${
          room === "friends" ? "text-yellow-700 bg-white" : "hover:text-yellow-500 dark:hover:scale-110 dark:text-white"
        } transition duration-250`}
        onClick={() => {
          setPage("friends");
          setRoom("friends");
          console.log("friends");
        }}
      >
        <UserIcon className="h-6 w-6" />
      </button>
      <button
        type="button"
        name="groups"
        className={`flex items-center justify-center w-14 h-14 rounded-full ${
          room === "groups" ? "text-yellow-700 bg-white " : "hover:text-yellow-500 dark:hover:scale-110 dark:text-white"
        } transition duration-250`}
        onClick={() => {
          setPage("groups");
          setRoom("groups");
          console.log("groups");
        }}
      >
        <UserGroupIcon className="h-6 w-6 "/>
      </button>
      <button
        type="button"
        name="all-chats"
        className={`flex items-center justify-center w-14 h-14 rounded-full  ${
          room === "all-chats" ? "text-yellow-700 bg-white" : "hover:text-yellow-500 dark:hover:scale-110 dark:text-white"
        } transition duration-250`}
        onClick={() => {
          setPage("all-chats");
          setRoom("all-chats");
          console.log("all-chats");
        }}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
      </button>

      <button
        type="button"
        name="all-chats"
        className={`flex items-center justify-center w-14 h-14 rounded-full dark:hover:scale-110 hover:text-yellow-500 dark:text-white transition duration-250`}
        onClick={handleLogout}
      >
        <ExitToAppIcon className="h-8 w-8" />
      </button>
    </div>
  </div>
  );
};

export default SidebarMenu;
