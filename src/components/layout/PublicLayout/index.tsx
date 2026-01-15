import { Outlet } from "react-router";
import Header from "./partials/Header";
import {useState} from "react";
import CalendarModal from "../../../features/calendar/components/CalendarModal";
import Calendar from "../../../features/calendar/components/Calendar";

export default function PublicLayout() {

    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <div className="gig-container">
            <Header onOpenCalendar={() => setCalendarOpen(!calendarOpen)} />

            <div className="content">

                {/* LEFT SIDE PANEL */}
                <aside className="sidebar">
                    <Calendar />
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
