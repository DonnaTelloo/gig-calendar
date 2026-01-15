import { useState } from "react";
import { fetchCalendarSlidesMock } from "../api/event.mock";

type Direction = "prev" | "next";

const useEvent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    // 🔑 current active date
    const [currentDate, setCurrentDate] = useState(
        new Date("2025-10-05")
    );

    const addDays = (date: Date, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d;
    };

    const requestEventHandler = async (direction?: Direction) => {
        setIsLoading(true);

        const nextDate = direction
            ? direction === "next"
                ? addDays(currentDate, 1)
                : addDays(currentDate, -1)
            : currentDate; // 👈 initial load

        console.log(nextDate.toISOString());

        const result = await fetchCalendarSlidesMock(
            nextDate.toISOString()
        );

        if (direction) {
            setCurrentDate(nextDate);
        }

        setData(result);
        setIsLoading(false);
    };


    return {
        isLoading,
        data,
        currentDate,
        requestEventHandler,
    };
};

export default useEvent;
