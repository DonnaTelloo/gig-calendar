import CalendarItem from "../CalendarItem";
import "./style.css";
import { useEffect, useState } from "react";
import { useCalendarContext } from "../../../../context";
import useCalendar from "../../hooks/useCalendar";

export default function Calendar() {
    const { state } = useCalendarContext();
    const { getYears } = useCalendar();

    const [openYear, setOpenYear] = useState<number | null>(state.year);

    useEffect(() => {
        getYears();
    }, []);


    useEffect(() => {
        setOpenYear(state.year);
    }, [state.year]);

    const toggleYear = (year: number) => {
        setOpenYear(prev => (prev === year ? null : year));
    };

    useEffect(() => {
        document.body.style.overflow = openYear ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [openYear]);

    console.log("Years in Calendar component:", state.years)
    console.log("Is loading:", useCalendarContext().isLoading)

    return (
        <div className="calendar">
            {state.years?.map(year => (
                <CalendarItem
                    key={year}
                    year={year}
                    active={openYear === year}
                    onToggle={toggleYear}
                />
            )) || []}
        </div>
    );
}
