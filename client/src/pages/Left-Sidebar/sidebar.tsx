import React, { useState } from "react";
import Chats from "./list-chat";
import Friends from "./list-friend";
import Groups from "./list-group";
import SidebarMenu from "./sidebar-menu";
import Image from "next/image";

interface SidebarProps {
  onGroupClick: (groupName: string, isprivate: any) => void; // Update the type of onGroupClick
  selectedGroup: string;
  isPrivate: any;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onGroupClick,
  selectedGroup,
  isPrivate,
  currentPage,
}) => {

  return (
    <>
      {(() => {
        switch (currentPage) {
          case "friends":
            return (
              <Friends
                onGroupClick={onGroupClick}
                selectedFriend={selectedGroup}
                isPrivate={isPrivate}
              />
            );
          case "groups":
            return (
              <Groups
                onGroupClick={onGroupClick}
                selectedGroup={selectedGroup}
                isPrivate={isPrivate}
              />
            );
          case "all-chats":
            return (
              <Chats
                onGroupClick={onGroupClick}
                selectedGroup={selectedGroup}
                isPrivate={isPrivate}
              />
            );
          default:
            return null;
        }
      })()}
    </>
  );
};

export default Sidebar;
