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
    <div className="bg-white w-1/3 border-r border-gray-300 p-4 h-full flex flex-col">
  <div className="h-[150px] w-full border-b border-gray-300 flex flex-col">
    <form
      className="w-4/5 flex items-center relative"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        className="w-full h-12 rounded-2xl bg-gray-200 pl-5 text-black pr-10"
        placeholder="Search"
        name="search_user"
      />
      <div className="absolute right-0 top-0 h-full w-10 text-center text-gray-400 pointer-events-none flex items-center justify-center">
        <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
      </div>
    </form>

    <form
      className="w-11/12 items-center flex justify-center mt-3"
      onSubmit={handleCreateGroup}
    >
      <input
        type="text"
        className="w-full h-12 rounded-2xl bg-gray-200 pl-5 text-black"
        placeholder="Enter Group Name"
        name="group_name"
      />
      <button
        type="submit"
        name="all-chats"
        className="w-20 h-12 rounded-3xl text-white ml-2 bg-[#00a9ff] hover:bg-purple-600 transition duration-300"
      >
        Create
      </button>
    </form>
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
