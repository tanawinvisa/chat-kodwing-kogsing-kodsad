import hashString from "@/utils/hashString";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Chat } from "../Left-Sidebar/list-chat";
import { socket } from "../login";
import { useRouter } from "next/router";

interface GroupItemProps {
  chat: Chat;
  setLikedList: React.Dispatch<React.SetStateAction<String[]>>;
  onGroupClick: (groupName: string, isPrivate: any) => void;
  isPrivate: any;
  selectedGroup: string;
}

const ChatItem: React.FC<GroupItemProps> = ({
  chat,
  setLikedList,
  onGroupClick,
  isPrivate,
  selectedGroup,
}) => {
  const [isFavourite, setIsFavourite] = useState(chat.pin);
  const router = useRouter();
  const { username } = router.query;

  const handleHeartClick = () => {
    socket.emit("pin-chat", {
      username: username,
      room: chat.roomName,
      pinStatus: !isFavourite,
    });
    if (isFavourite) {
      setIsFavourite(false);
      setLikedList((prev) => prev.filter((item) => item !== chat.name));
    } else {
      setIsFavourite(true);
      setLikedList((prev) => [...prev, chat.name]);
    }
  };

  return (
    <div
  className={`h-28 w-full items-center flex cursor-pointer border-b border-gray-200 dark:border-white text-black dark:text-white${
    selectedGroup == (chat.isPrivate ? chat.name : chat.roomName) &&
    isPrivate == chat.isPrivate
      ? "bg-yellow-500 bg-opacity-40"
      : "hover:bg-yellow-500 hover:bg-opacity-5"
  } transition duration-250`}
>
  <div
    className={`h-28 w-full items-center flex `}
    onClick={() => {
      const name = chat.isPrivate ? chat.name : chat.roomName;
      onGroupClick(name, chat.isPrivate);
    }}
  >
    <Image
      src={`/${chat.name.includes("(") ? "G" : "Frame_"}${
        chat.name ? hashString(chat.name.split(" (")[0] as string) % 9 : 0
      }.png`}
      alt=""
      width={75}
      height={50}
      className="ml-6 rounded-full"
    ></Image>
    <div className="font-roboto ml-6">
      <p
        className={`text-black text-xl mt-2 ${
          selectedGroup == (chat.isPrivate ? chat.name : chat.roomName)
            ? "font-bold"
            : ""
        }`}
      >
        {chat.name}
      </p>
    </div>
  </div>
  <div className={`ml-auto h-28 items-center flex`}>
    {isFavourite ? (
      <HeartIconSolid
        className="h-8 w-8 mr-6 text-[#ff0049]"
        onClick={handleHeartClick}
      />
    ) : (
      <HeartIcon
        className="h-8 w-8 mr-6 text-gray-500"
        onClick={handleHeartClick}
      />
    )}
  </div>
</div>
  );
};

export default ChatItem;
