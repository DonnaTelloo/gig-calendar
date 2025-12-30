import YearSelector from "../../features/calendar/components/YearSelector";
import { useCalendar } from "../../features/calendar/hooks/useCalendar.ts";
import TimelineView from "../../features/calendar/components/TimelineVIew";
import MonthSelector from "../../features/calendar/components/MonthSelector";
import "./index.css";
import {useState} from "react";

export default function HomePage() {
    const {
        year,
        month,
        setYear,
        setMonth,
        items,
        highlights,
        loading
    } = useCalendar();

    return (
        <div className="home-layout">

            {/* LEFT SIDE PANEL */}
            <aside className="sidebar">
                {/* <YearSelector year={year} onChange={setYear} /> */}
                <MonthSelector month={month} onChange={setMonth} />
            </aside>

            {/* RIGHT SIDE TIMELINE */}
            <main className="timeline-panel">
                <div className="timeline-center">
                    <TimelineView
                        loading={loading}
                        items={items}
                        highlights={highlights}
                        month={month}
                        year={year}
                    />
                </div>
            </main>

        </div>
    );
}
