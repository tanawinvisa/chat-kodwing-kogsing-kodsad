import Image from "next/image";
import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../login";
import { useRouter } from "next/router";
import hashString from "@/utils/hashString";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ChatFriendsProps {
  onGroupClick: (GroupName: string, isprivate: any) => void;
  selectedFriend: string;
  isPrivate: any;
}

const Friends: React.FC<ChatFriendsProps> = ({
  onGroupClick,
  selectedFriend,
  isPrivate,
}) => {
  const mock = ["John", "Jane", "Doe", "Smith", "Alice", "Bob"];

  const [friendList, setFriendList] = useState<string[]>([]);
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

  const filteredMockFriends = mock.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleSearch = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const searchQuery = e.currentTarget.elements.namedItem(
  //     "search_user"
  //   ) as HTMLInputElement;
  //   setSearchTerm(searchQuery.value);
  // };
  const filteredFriends = friendList.filter((name) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    socket.emit("get-all-users");
  }, []);

  useEffect(() => {
    const friendListener = (data: string[]) => {
      const allUsers = data;
      if (username !== undefined && typeof username === "string") {
        const currentUser = data.indexOf(username);
        if (currentUser !== -1) {
          allUsers.splice(currentUser, 1);
        }
      }
      setFriendList(data);
    };
    socket.on("users", friendListener);
    return () => {
      socket.off("users", friendListener);
    };
  }, [username]);

  return (
    <div className="bg-white dark:bg-gray-800 w-1/3 border-r border-gray-300">
      <div className="h-auto w-full border-b border-gray-300 items-center flex justify-center py-4">
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
            <MagnifyingGlassIcon className="h-6 w-6 dark:text-black text-gray-500" />
          </div>
        </form>
      </div>
      <div className="h-full overflow-y-auto">
        {filteredFriends.map((friend, index) => {
          return (
            <div
              className={`h-28 w-full border-b border-gray-300 dark:border-white items-center flex cursor-pointer ${
                friend == selectedFriend && isPrivate
                  ? "bg-white bg-opacity-40"
                  : "hover:bg-white hover:bg-opacity-5"
              } transition duration-250`}
              key={index}
              onClick={() => {
                onGroupClick(friend, true);
              }}
            >
              <Image
                src={`/Profile_${
                  friend ? hashString(friend as string) % 9 : 0
                }.png`}
                alt=""
                width={75}
                height={50}
                className="ml-6"
              ></Image>
              <div className="font-roboto ml-6">
                <p
                  className={`text-black dark:text-white text-xl ${
                    friend === selectedFriend && isPrivate ? "font-bold" : ""
                  }`}
                >
                  {friend}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Friends;
