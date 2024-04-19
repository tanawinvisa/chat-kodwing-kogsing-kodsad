export const getFriendName = (currentUser: string, roomName: string) => {
    const names = roomName.split("_");
    if (names.length === 2) {
        const friendName = names[0] === currentUser ? names[1] : names[0];
        return friendName;
    } else {
        return "";
    }
}

export const formatRoomName = (user1: string, user2: string) => {
    let roomName = "";
    if (user1 < user2) {
        roomName = `${user1}_${user2}`;
    } else {
        roomName = `${user2}_${user1}`;
    }
    return roomName;
}