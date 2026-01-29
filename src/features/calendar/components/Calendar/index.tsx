import CalendarItem from "../CalendarItem";
import "./style.css";
import { useEffect, useState } from "react";
import { useCalendarContext } from "../../../../context";
import useCalendar from "../../hooks/useCalendar";
import { useTranslation } from "react-i18next";

export default function Calendar() {
    const { state } = useCalendarContext();
    const { getYears } = useCalendar();
    const { t } = useTranslation();
    const [openYear, setOpenYear] = useState<number | null>(state.year);
    const [yearInfoModalOpen, setYearInfoModalOpen] = useState(false);

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

    const handleYearInfoClick = () => {
        // Dispatch a custom event that the Home component will listen for
        const event = new CustomEvent('openYearInfoModal');
        window.dispatchEvent(event);
    };

    return (
        <div className="calendar">
            <div className="year-introduction">
                <button className="year-intro-button" onClick={handleYearInfoClick}>
                    {state.year} | {t("projectAbout", "პროექტის შესახებ")}
                </button>
            </div>
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
