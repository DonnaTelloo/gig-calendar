import {Outlet} from "react-router";
import Header from "./partials/Header";
import {useState, useEffect} from "react";
import CalendarModal from "../../../features/calendar/components/CalendarModal";
import Calendar from "../../../features/calendar/components/Calendar";
import { useCalendarContext } from "../../../context";
import PageLoader from "../../common/PageLoader";

export default function PublicLayout() {
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const { isLoading } = useCalendarContext();

    // Update loader state when isLoading changes
    useEffect(() => {
        if (isLoading) {
            setShowLoader(true);
        } else {
            // Small delay to prevent flickering for quick operations
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <>
            {showLoader && <PageLoader />}

            <div className="gig-container">
                <Header calendarOpen={calendarOpen} onOpenCalendar={() => setCalendarOpen(!calendarOpen)} />

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
        </>
    );
}
