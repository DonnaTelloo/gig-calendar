import { useCallback } from "react";
import { getYearsApi } from "../api/calendar.api";
import {useCalendarContext} from "../../../context";

function useCalendar() {
    const { setYears, setIsLoading } = useCalendarContext();

    const getYears = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await getYearsApi();
            console.log("API response:", res);
            console.log("Years from API:", res.years);
            //@ts-ignore
            setYears(res);
        } catch (error) {
            console.error("Error fetching years:", error);
        } finally {
            setIsLoading(false);
        }
    }, [setYears, setIsLoading]);

    return {
        getYears,
    };
}

export default useCalendar;
