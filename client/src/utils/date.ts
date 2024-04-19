import dayjs from "dayjs"

export const formatTime = (date: Date) => {
    const dateTime = dayjs(date.toISOString());
    const time = dateTime.format("HH:mm");
    return time;
}