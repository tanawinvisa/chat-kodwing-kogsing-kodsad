import hashString from "@/utils/hashString";
import Image from "next/image";

interface Group {
  groupName: string;
  people: number;
}
interface GroupItemProps {
  onGroupClick: (groupName: string, isPrivate: any) => void;
  group: Group;
  selectedGroup: string;
  isPrivate: any;
}

const GroupItem: React.FC<GroupItemProps> = ({
  onGroupClick,
  group,
  selectedGroup,
  isPrivate,
}) => {
  return (
    <div
      className={`h-28 w-full cursor-pointer border-b dark:border-white border-gray-300 items-center  flex ${group.groupName === selectedGroup && !isPrivate
        ? "bg-white bg-opacity-40 font-bold"
        : "hover:bg-white hover:bg-opacity-5"
        } transition duration-200`}
      onClick={() => {
        onGroupClick(group.groupName, false);
        console.log(group.groupName);
      }}
    >
      <Image
        src={`/G${group.groupName ? hashString(group.groupName as string) % 9 : 0
          }.png`}
        alt=""
        width={75}
        height={50}
        className="ml-6"
      ></Image>
      <div className="font-roboto ml-6">
        <p
          className={`text-black dark:text-white text-xl dark:text-white${group.groupName === selectedGroup && !isPrivate ? "font-bold" : ""
            }`}
        >
          {`${group.groupName} (${group.people})`}
        </p>
      </div>
    </div>
  );
};

export default GroupItem;
