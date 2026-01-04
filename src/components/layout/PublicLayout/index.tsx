import { Outlet } from "react-router";
import Header from "./partials/Header";
import {useState} from "react";
import CalendarModal from "../../../features/calendar/components/CalendarModal";
import {useCalendar} from "../../../features/calendar/hooks/useCalendar.ts";
import Calendar from "../../../features/calendar/components/Calendar";

export default function PublicLayout() {

    const [calendarOpen, setCalendarOpen] = useState(false);

    const {
        month,
        setMonth,
    } = useCalendar();

    return (
        <div className="gig-container">
            <Header onOpenCalendar={() => setCalendarOpen(!calendarOpen)} />

            <div className="content">

                {/* LEFT SIDE PANEL */}
                <aside className="sidebar">
                    <Calendar month={month} onChange={setMonth}/>
                </aside>
                <main className="timeline-panel">
                    <div className="timeline-center">
                        <Outlet/>
                    </div>
                </main>

                {calendarOpen && (
                    <CalendarModal onClose={() => setCalendarOpen(!calendarOpen)}/>
                    )}

            </div>
        </div>
);
}
