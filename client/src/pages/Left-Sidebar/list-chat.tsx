import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "../login";
import { RoomDetails } from "./list-group";
import { getFriendName } from "@/utils/private_chat";
import ChatItem from "../Component/chat";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export interface Chat {
  roomName: string;
  name: string;
  message: string;
  isPrivate: any;
  pin: boolean;
}

interface allChatsProps {
  onGroupClick: (groupName: string, isprivate: any) => void;
  selectedGroup: string;
  isPrivate: any;
}

const Chats: React.FC<allChatsProps> = ({
  onGroupClick,
  selectedGroup,
  isPrivate,
}) => {
  const [likedList, setLikedList] = useState<String[]>([]);
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { username } = router.query;

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.namedItem(
      "search_user"
    ) as HTMLInputElement;
    setSearchTerm(searchQuery.value);
  };
  const filteredChats = chatList.filter((chat) => {
    const name = chat.isPrivate ? chat.name : chat.roomName;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const customSort = (a: JSX.Element, b: JSX.Element) => {
    const aIndex = likedList.indexOf(a.props.chat.name);
    const bIndex = likedList.indexOf(b.props.chat.name);
    if (aIndex !== -1 && bIndex !== -1) {
      return bIndex - aIndex;
    } else if (aIndex !== -1) {
      return -1;
    } else if (bIndex !== -1) {
      return 1;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    socket.emit("get-user-rooms", { username: username });
  }, [username]);

  useEffect(() => {
    const chatListener = (data: { room: RoomDetails; pin: boolean }[]) => {
      const chats: Chat[] = [];
      const pinList: string[] = [];
      data.map((roomDetails) => {
        let chatName = "";
        if (roomDetails.room.private) {
          chatName =
            username !== undefined && typeof username === "string"
              ? getFriendName(username, roomDetails.room.room)
              : "";
        } else {
          chatName = `${roomDetails.room.room} (${roomDetails.room.userCount})`;
        }
        const chat: Chat = {
          roomName: roomDetails.room.room,
          name: chatName,
          message: roomDetails.room.latestMessage.message,
          isPrivate: roomDetails.room.private,
          pin: roomDetails.pin,
        };
        if (roomDetails.pin) {
          pinList.push(chatName);
        }
        chats.push(chat);
      });
      setChatList(chats);
      setLikedList(pinList);
    };
    socket.on("user-rooms", chatListener);

    return () => {
      socket.off("user-rooms", chatListener);
    };
  }, [username]);

  const mockChatList = [
    {
      id: "1",
      name: "Chat 1",
      chat: [
        {
          roomName: "Room 1",
          name: "User1",
          message: "Hello",
          isPrivate: false,
          pin: false,
        },
      ],
      isPrivate: true,
      likedList: ["m2"],
    },
    {
      id: "2",
      name: "Chat 2",
      chat: [
        {
          roomName: "Room 2",
          name: "User2",
          message: "How are you?",
          isPrivate: false,
          pin: false,
        },
      ],
      isPrivate: true,
      likedList: ["m3"],
    },
    {
      id: "3",
      name: "Chat 3",
      chat: [
        {
          roomName: "Room 3",
          name: "User3",
          message: "Good morning",
          isPrivate: false,
          pin: false,
        },
      ],
      isPrivate: true,
      likedList: ["m1"],
    },
  ];

  return (
    <div className="bg-white w-1/3 dark:bg-gray-800 border-r border-gray-200">
      <div className="h-20 w-full border-b border-gray-200 items-center flex justify-center py-4">
        <form
          className="w-4/5 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl bg-white dark:bg-gray-400 dark:placeholder:text-gray-700 border-[2px] pl-5 text-black pr-10 outline-none"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500 dark:text-black" />
          </div>
        </form>
      </div>
      <div className="h-full overflow-y-auto">
        {mockChatList
          .map((chat, index) => (
            <ChatItem
              key={index}
              setLikedList={setLikedList}
              onGroupClick={onGroupClick}
              selectedGroup={selectedGroup}
              isPrivate={isPrivate}
              chat={chat}
            />
          ))
          .sort(customSort)}
      </div>
    </div>
  );
};
export default Chats;
