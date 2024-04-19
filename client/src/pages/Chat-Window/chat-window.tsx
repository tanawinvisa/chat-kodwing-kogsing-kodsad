import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { socket } from "../login";
import Image from "next/image";
import {
  ChevronDownIcon,
  MegaphoneIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { formatTime } from "@/utils/date";
import hashString from "@/utils/hashString";
import { formatRoomName } from "@/utils/private_chat";

export type Message = {
  id: string;
  author: string;
  message: string;
  time: Date;
  room: string;
  announce: boolean;
};

interface ChatWindowProps {
  selectedGroup: string;
  isPrivate: any;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedGroup,
  isPrivate,
}) => {
  const [room, setRoom] = useState("public");
  const [message, setmessage] = useState("");
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const router = useRouter();
  const { username } = router.query;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showHideButton, setShowHideButton] = useState(false);
  const [hideAnnouncements, setHideAnnouncements] = useState(false);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    isCurrentUser: false,
  });

  const handleHideAnnouncements = useCallback(() => {
    setHideAnnouncements(true);
    messages[selectedGroup].map((m) => (m.announce = false));
  }, [messages, selectedGroup]);

  useEffect(() => {
    socket.on("announce-removed", (room) => {
      const roomName = isPrivate
        ? formatRoomName(selectedGroup, username as string)
        : room;
      if (room == roomName) {
        handleHideAnnouncements();
      }
    });
    return () => {
      socket.off("announce-removed");
    };
  }, [handleHideAnnouncements, isPrivate, selectedGroup, username]);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    const isCurrentUser = messages[selectedGroup][index].author === username;
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      isCurrentUser,
    });
    setSelectedMessageIndex(index); // Set the selected message index
  };

  const hideContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleAnnounce = useCallback(() => {
    if (selectedMessageIndex !== null) {
      const message = messages[selectedGroup][selectedMessageIndex];
      if (message.announce) {
        return;
      } else {
        message.announce = true;
      }
      const newAnnouncement = `${message.author}: ${message.message}`;

      setAnnouncements((prev) => {
        // If hiding announcements, reset the list and only show the new announcement
        if (hideAnnouncements) {
          setShowAnnouncements(false);
          setShowHideButton(false);
          return [newAnnouncement];
        } else {
          return [newAnnouncement, ...prev];
        }
      });

      setContextMenu({ ...contextMenu, visible: false });
      setHideAnnouncements(false); // Show the announcements again
    }
  }, [
    contextMenu,
    hideAnnouncements,
    messages,
    selectedGroup,
    selectedMessageIndex,
  ]);

  useEffect(() => {
    const handleNewAnnounce = (data: Message) => {
      const currentRoomMessages = messages[selectedGroup] || [];
      const index = currentRoomMessages.findIndex(
        (m) => m.id === data.id && m.message === data.message
      );
      const message = currentRoomMessages[index];
      if (message && !message.announce) {
        currentRoomMessages[index].announce = true;
        const newAnnouncement = `${message.author}: ${message.message}`;
        setAnnouncements((prev) => {
          if (hideAnnouncements) {
            setShowAnnouncements(false);
            setShowHideButton(false);
            return [newAnnouncement];
          } else {
            return [newAnnouncement, ...prev];
          }
        });
        setContextMenu({ ...contextMenu, visible: false });
        setHideAnnouncements(false);
      }
    };
    socket.on("new-announce", handleNewAnnounce);
    return () => {
      socket.off("new-announce", handleNewAnnounce);
    };
  }, [contextMenu, hideAnnouncements, messages, selectedGroup]);

  const toggleAnnouncements = () => {
    setShowAnnouncements((prev) => !prev);
    setShowHideButton((prev) => !prev);
  };

  useEffect(() => {
    if (showAnnouncements) {
      setShowHideButton(true);
    }
  }, [showAnnouncements]);

  const handleUnsendMessage = () => {
    if (selectedMessageIndex !== null) {
      socket.emit(
        "unsend-message",
        messages[selectedGroup][selectedMessageIndex]
      );

      setMessages((prevMessages) => {
        const currentRoomMessages = prevMessages[selectedGroup] || [];
        return {
          ...prevMessages,
          [selectedGroup]: [
            ...currentRoomMessages.slice(0, selectedMessageIndex),
            ...currentRoomMessages.slice(selectedMessageIndex + 1),
          ],
        };
      });
      setContextMenu({ ...contextMenu, visible: false });
      setSelectedMessageIndex(null);
    }
  };

  useEffect(() => {
    const handleRemoveMessage = (data: Message) => {
      setMessages((prevMessages) => {
        const currentRoomMessages = prevMessages[selectedGroup] || [];
        const index = currentRoomMessages.findIndex(
          (m) => m.id === data.id && m.message === data.message
        );
        if (index !== -1) {
          return {
            ...prevMessages,
            [selectedGroup]: [
              ...currentRoomMessages.slice(0, index),
              ...currentRoomMessages.slice(index + 1),
            ],
          };
        } else {
          return prevMessages;
        }
      });
    };
    socket.on("remove-message", handleRemoveMessage);
    return () => {
      socket.off("remove-message", handleRemoveMessage);
    };
  }, [selectedGroup]);

  useEffect(() => {
    const handleNewMessage = (data: Message) => {
      console.log(data);
      data.time = new Date(data.time);
      if (data.message.trim() != "") {
        const roomName = isPrivate
          ? formatRoomName(username as string, selectedGroup)
          : selectedGroup;

        // Check if the received message's room is a private room between the current user and the message sender
        const isPrivateChat =
          data.room === formatRoomName(username as string, data.author);

        // Only update messages if the received message's room matches the current room or is a private chat
        if (data.room === roomName || (isPrivateChat && isPrivate)) {
          setMessages((prevMessages) => {
            const roomKey = isPrivate ? room : selectedGroup;
            const currentRoomMessages = prevMessages[roomKey] || [];
            return {
              ...prevMessages,
              [roomKey]: [...currentRoomMessages, data],
            };
          });
        }
      }
    };

    socket.on("message", handleNewMessage);

    // Add a cleanup function to remove the event listener when the component updates
    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [selectedGroup, room, isPrivate, messages, username]); // Keep 'messages' as a dependency

  useEffect(() => {
    if (selectedGroup) {
      setRoom(selectedGroup);
      let roomName = "";
      if (isPrivate) {
        roomName = formatRoomName(username as string, selectedGroup);
        socket.emit("join-room", {
          username: username,
          room: roomName,
          private: isPrivate,
        });
        // auto join for other side
        socket.emit("join-room", {
          username: selectedGroup,
          room: roomName,
          private: isPrivate,
        });
      } else {
        roomName = selectedGroup;
        socket.emit("join-room", { username: username, room: selectedGroup });
      }
      socket.emit("get-all-rooms");
      socket.emit("get-past-messages", { room: roomName });
    }
  }, [isPrivate, selectedGroup, username]);

  useEffect(() => {
    const handlePastMessages = (data: {
      room: string;
      messages: Message[];
    }) => {
      const roomName = isPrivate
        ? formatRoomName(selectedGroup, username as string)
        : selectedGroup;
      if (data.room === roomName) {
        const allAnnouncements: string[] = [];
        data.messages.map((m) => {
          m.time = new Date(m.time);
          if (m.announce) {
            const newAnnouncement = `${m.author}: ${m.message}`;
            allAnnouncements.push(newAnnouncement);
          }
        });
        setShowAnnouncements(false);
        setShowHideButton(false);
        setAnnouncements(allAnnouncements);
        setHideAnnouncements(false);
        setMessages((prevMessages) => {
          // Set past messages if either the room is not in the prevMessages or it's an update for the current room
          if (
            !prevMessages[room] ||
            (prevMessages[room] && data.room === roomName)
          ) {
            return {
              ...prevMessages,
              [room]: data.messages,
            };
          } else {
            return { ...prevMessages };
          }
        });
      }
    };
    socket.on("past-messages", handlePastMessages);
    return () => {
      socket.off("past-messages", handlePastMessages);
    };
  }, [isPrivate, room, selectedGroup, username, messages]); // Add 'messages' as a dependency

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // prevent the form from refreshing the page
    if (message.trim() != "") {
      const roomName = isPrivate
        ? formatRoomName(room, username as string)
        : room;
      socket.emit("send-message", {
        author: username,
        message: message,
        time: new Date(),
        room: roomName,
        isPrivate: isPrivate, // add the isPrivate field
      });
    } // Prevent sending empty message
    setmessage(""); // Clear the input text box
  };

  return (
    <div className="h-full w-2/3 flex flex-col" onClick={hideContextMenu}>
      <div className="h-20 w-full bg-bgColor border-b border-borderColor flex-shrink-0">
        <div className="container mx-auto flex justify-center items-center h-full">
          <div>
            <p className="text-3xl font-roboto text-white font-medium">
              {selectedGroup}
            </p>
          </div>
        </div>
      </div>

      <div
        className="bg-bgColor h-full w-full flex-grow overflow-y-auto"
        ref={messagesEndRef}
      >
        {!hideAnnouncements && (
          <>
            {announcements[0] != null && (
              <div className="bg-darkBgColor text-fontWhiteDarkBgColor w-[100%] sticky top-0 z-10">
                <div className="py-2 px-4 flex items-center justify-between border-b border-borderColor">
                  <div className="flex items-center">
                    <MegaphoneIcon className="h-6 w-6 text-white-500" />
                    <p className="ml-2">{announcements[0]}</p>
                  </div>
                  <button
                    className="focus:outline-none"
                    onClick={toggleAnnouncements}
                  >
                    <ChevronDownIcon className="h-4 w-4 text-fontWhiteDarkBgColor" />
                  </button>
                </div>
                {!hideAnnouncements && showAnnouncements && (
                  <div className="absolute mt-2 top-[80%] right-0 w-[100%] z-10 border-fontWhiteDarkBgColor">
                    {announcements.slice(1).map((announce, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-fontBgColor bg-opacity-20 text-fontWhiteDarkBgColor py-2 px-4 border-b border-fontWhiteDarkBgColor"
                      >
                        <MegaphoneIcon className="h-6 w-6 text-white-500" />
                        <p className="text-sm ml-2">{announce}</p>
                      </div>
                    ))}
                    {showHideButton && (
                      <button
                        className="bg-darkBgColor bg-opacity-80 text-fontWhiteDarkBgColor py-2 px-4 w-full text-left focus:outline-none"
                        onClick={() => {
                          const roomName = isPrivate
                            ? formatRoomName(selectedGroup, username as string)
                            : room;
                          socket.emit("remove-announce", {
                            room: roomName,
                          });
                          handleHideAnnouncements();
                        }}
                      >
                        <p className="text-sm hover:text-purple transition duration-250">
                          Do not show again!
                        </p>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        <div className="px-8 pt-8">
          <div>
            {(messages[selectedGroup] || []).map((m, index) => {
              const isCurrentUser = m.author === username;
              return (
                <div
                  key={index}
                  className={`flex items-start mb-2 ${
                    isCurrentUser ? "flex-row-reverse" : "flex-row -ml-4"
                  }`}
                >
                  <Image
                    src={`/Frame_${
                      m.author ? hashString(m.author as string) % 9 : 0
                    }.png`}
                    alt=""
                    width={40}
                    height={40}
                    className={"ml-2"}
                  />
                  <div className={"ml-2"}>
                    <p
                      className={`font-semibold ${
                        isCurrentUser
                          ? "text-right text-fontWhiteDarkBgColor"
                          : "text-gray-800"
                      }`}
                    >
                      {isCurrentUser ? (
                        <>
                          <span className="text-fontBgColor text-sm ml-2">
                            {formatTime(m.time)}
                          </span>
                          <span className="text-fontWhiteDarkBgColor text-sm ml-2">
                            {m.author}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-fontWhiteDarkBgColor text-sm">
                            {m.author}
                          </span>
                          <span className="text-fontBgColor text-sm ml-2">
                            {formatTime(m.time)}
                          </span>
                        </>
                      )}
                    </p>
                    <div
                      className={`px-2 py-1 w-fit h-fit ${
                        isCurrentUser
                          ? "ml-auto bg-purple text-fontWhiteDarkBgColor rounded-lg rounded-tr-none rounded-br-lg"
                          : "bg-borderColor text-fontWhiteDarkBgColor rounded-lg rounded-bl-lg rounded-tl-none"
                      }`}
                      onContextMenu={(e) => handleContextMenu(e, index)}
                    >
                      <div className="break-words max-w-[20ch]">
                        <span>{m.message}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {contextMenu.visible && (
              <div
                className="fixed text-fontWhiteDarkBgColor p-2 bg-darkBgColor bg-opacity-70 rounded-2xl"
                style={{ top: contextMenu.y, left: contextMenu.x }}
              >
                {contextMenu.isCurrentUser && (
                  <button
                    onClick={handleUnsendMessage}
                    className="cursor-pointer text-sm p-1 block w-full text-left hover:text-purple transition duration-250"
                  >
                    unsend
                  </button>
                )}
                <button
                  onClick={() => {
                    if (selectedMessageIndex !== null) {
                      const announceMessage =
                        messages[selectedGroup][selectedMessageIndex];
                      socket.emit("announce-message", announceMessage);
                      handleAnnounce();
                    }
                  }}
                  className={`cursor-pointer text-sm p-1 block w-full text-left ${
                    contextMenu.isCurrentUser ? "mt-1" : ""
                  } hover:text-purple transition duration-250`}
                >
                  announce
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-bgColor h-20 w-full p-5 flex-shrink-0 flex items-center">
        <form
          onSubmit={handleSendMessage}
          className="relative w-full flex-grow mr-4"
        >
          <input
            className="p-2 w-full rounded-xl bg-borderColor text-fontWhiteDarkBgColor hover:border-indigo-600 h-14"
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setmessage(e.target.value)}
          />
          <button
            className="p-2 rounded-xl bg-purple text-white hover:bg-purple-500 flex items-center absolute right-2 top-2 h-10"
            type="submit"
          >
            <span>Send</span>
            <PaperAirplaneIcon className="h-6 w-6 text-white ml-2 -rotate-45" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
