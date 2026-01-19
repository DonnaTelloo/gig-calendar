import { useState } from "react";
import { fetchCalendarSlidesMock } from "../api/event.mock";
import { useCalendarContext } from "../../../context";

enum Direction {
    LEFT = "prev",
    RIGHT = "next",
    CURRENT = "current",
}

const useEvent = () => {
    const { state, setDate } = useCalendarContext();

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const addDays = (date: Date, days: number) => {
        const d = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        ); // normalize to local midnight
        d.setDate(d.getDate() + days);
        return d;
    };

    const toLocalDateString = (date: Date) => {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const requestEventHandler = async (direction?: Direction) => {
        setIsLoading(true);

        const nextDate = direction
            ? direction === Direction.RIGHT
                ? addDays(state.date, 1)
                : addDays(state.date, -1)
            : state.date;

        const result = await fetchCalendarSlidesMock(
            toLocalDateString(nextDate) // ✅ DATE ONLY
        );

        setDate(nextDate);
        setData(result);
        setIsLoading(false);
    };

    return {
        isLoading,
        data,
        requestEventHandler,
    };
};

export default useEvent;
