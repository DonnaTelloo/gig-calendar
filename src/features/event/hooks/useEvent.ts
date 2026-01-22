import { useState } from "react";
import { fetchCalendarSlidesMock } from "../api/event.mock";
import { useCalendarContext } from "../../../context";

enum Direction {
    LEFT = "prev",
    RIGHT = "next",
    CURRENT = "current",
}

const useEvent = () => {
    const { state, setDate, setIsLoading } = useCalendarContext();
    const [data, setData] = useState<any>(null);

    const addDays = (date: Date, days: number) => {
        const d = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        d.setDate(d.getDate() + days);
        return d;
    };

    const toLocalDateString = (date: Date) =>
        [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

    const requestEventHandler = async (direction?: Direction) => {
        setIsLoading(true);

        const nextDate = direction
            ? direction === Direction.RIGHT
                ? addDays(state.date, 1)
                : addDays(state.date, -1)
            : state.date;

        await new Promise((r) => setTimeout(r, 300));

        const result = await fetchCalendarSlidesMock(
            toLocalDateString(nextDate)
        );

        setDate(nextDate);
        setData(result);
        setIsLoading(false);
    };

    return {
        data,
        requestEventHandler,
    };
};

export default useEvent;
