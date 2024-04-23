import React, { FormEvent, useEffect, useState } from "react";
import { socket } from "../login";
import { Message } from "../Chat-Window/chat-window";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import GroupItem from "../Component/group";

interface Group {
  groupName: string;
  people: number;
}

interface ChatGroupsProps {
  onGroupClick: (groupName: string, isprivate: any) => void;
  selectedGroup: string;
  isPrivate: any;
}

export type RoomDetails = {
  room: string;
  userCount: number;
  latestMessage: Message;
  private: boolean;
};

const Groups: React.FC<ChatGroupsProps> = ({
  onGroupClick,
  selectedGroup,
  isPrivate,
}) => {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false); // State for showing the create group popup
  const router = useRouter();
  const { username } = router.query;

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchQuery = e.currentTarget.elements.namedItem(
      "search_user"
    ) as HTMLInputElement;
    setSearchTerm(searchQuery.value);
  };

  useEffect(() => {
    socket.emit("get-all-rooms");
  }, []);

  useEffect(() => {
    const groupListener = (data: RoomDetails[]) => {
      const allGroup: Group[] = [];
      data.map((room) => {
        const group: Group = { groupName: room.room, people: room.userCount };
        allGroup.push(group);
      });
      setGroupList(allGroup);
    };

    socket.on("rooms", groupListener);
    return () => {
      socket.off("rooms", groupListener);
    };
  }, []);

  const validateGroupName = (groupName: string): string => {
    groupName = "G: " + groupName;

    return groupName;
  };

  const handleCreateGroup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const groupName = e.currentTarget.elements.namedItem(
      "group_name"
    ) as HTMLInputElement;

    if (groupName.value.trim() === "") {
      return;
    }
    if (groupName) {
      socket.emit("join-room", {
        username: username,
        room: validateGroupName(groupName.value),
      });
    }
    socket.emit("get-all-rooms");
    groupName.value = "";
    setShowCreateGroupPopup(false); // Close the popup after creating the group
  };

  const filteredGroups = groupList.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const mock = [
    { groupName: 'Group 1', people: 5 },
    { groupName: 'Group 2', people: 3 },
    { groupName: 'Group 3', people: 4 },
    { groupName: 'Group 4', people: 2 },
    { groupName: 'Group 5', people: 6 },
  ];

  return (
    <div className="bg-white w-1/3 border-r dark:bg-gray-800 border-gray-300 py-2 h-full flex flex-col">
      <div className="h-20 w-full border-b border-gray-300 dark:border-white flex items-center justify-center space-x-4">
        <form
          className="w-2/3 flex items-center relative"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="w-full h-12 rounded-2xl pl-5 text-black pr-10 bg-white dark:bg-gray-400 dark:placeholder:text-gray-700 border-[2px] outline-none"
            placeholder="Search"
            name="search_user"
          />
          <div className="absolute right-0 top-0 h-full w-10 text-center pointer-events-none flex items-center justify-center">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
          </div>
        </form>

        <button
          className="w-auto items-center flex px-2 justify-center h-12 rounded-2xl text-white bg-[#00a9ff] hover:bg-purple-600 transition duration-300"
          onClick={() => setShowCreateGroupPopup(true)} // Show the popup on button click
        >
          Create Group
        </button>

        {/* Popup for creating a group */}
        {showCreateGroupPopup && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-80 p-4 rounded-lg shadow-lg">
              <form onSubmit={handleCreateGroup}>
                <input
                  type="text"
                  className="w-full h-12 rounded-2xl border-gray-200 border-[2px] outline-none pl-5 text-black mb-2"
                  placeholder="Enter Group Name"
                  name="group_name"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700 mr-3"
                    onClick={() => setShowCreateGroupPopup(false)} // Close the popup on button click
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="w-20 h-12 rounded-3xl text-white bg-[#00a9ff] hover:bg-purple-600 transition duration-300"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="w-full overflow-y-auto">
        <div className="flex flex-col">
          {mock.map((group, index) => (
            <GroupItem
              onGroupClick={onGroupClick}
              key={index}
              group={group}
              selectedGroup={selectedGroup}
              isPrivate={isPrivate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;
