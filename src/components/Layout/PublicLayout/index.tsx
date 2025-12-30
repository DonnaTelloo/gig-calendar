import { Outlet } from "react-router";
import Header from "./partials/Header";
import {useState} from "react";
import CalendarModal from "../../../features/calendar/components/CalendarModal";

export default function PublicLayout() {

    const [calendarOpen, setCalendarOpen] = useState(false);

    return (
        <div className="layout-wrapper">
            <Header onOpenCalendar={() => setCalendarOpen(!calendarOpen)} />
            <Outlet />

            {calendarOpen && (
                <CalendarModal onClose={() => setCalendarOpen(!calendarOpen)} />
            )}
        </div>
    );
}
