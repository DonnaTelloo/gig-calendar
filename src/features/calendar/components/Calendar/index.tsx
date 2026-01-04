import CalendarItem from "../CalendarItem";
import './style.css'
import {useState} from "react";

export default function Calendar() {
    const [openYear, setOpenYear] = useState<number | null>(2024);

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
                    disabled={year !== 2025}
                    onToggle={toggleYear}
                />
            ))}
        </div>
    );
}