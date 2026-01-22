import CalendarItem from "../CalendarItem";
import './style.css'
import {useState} from "react";
import {useCalendarContext} from "../../../../context";

export default function Calendar() {
    const { state } = useCalendarContext();

    const [openYear, setOpenYear] = useState<number | null>(state.year);

    const toggleYear = (year: number) => {
        setOpenYear(prev => (prev === year ? null : year));
    };

    return (
        <div className="calendar">
            {[2025, 2026, 2027, 2028].map(year => (
                <CalendarItem
                    key={year}
                    year={year}
                    active={openYear === year}
                    disabled={year !== state.year}
                    onToggle={toggleYear}
                />
            ))}
        </div>
    );
}