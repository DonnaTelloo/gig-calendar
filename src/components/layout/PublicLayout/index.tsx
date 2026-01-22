import {Outlet} from "react-router";
import Header from "./partials/Header";
import {useState} from "react";
import CalendarModal from "../../../features/calendar/components/CalendarModal";
import Calendar from "../../../features/calendar/components/Calendar";
import {useCalendarContext} from "../../../context";
import Logo from "../../../../public/assets/logo.svg";

const PageLoader = () => (
    <div className="page-loader">
        <img src={Logo} alt=""/>
    </div>
);

export default function PublicLayout() {

    const { isLoading } = useCalendarContext();

    const [calendarOpen, setCalendarOpen] = useState(false);

    console.log(isLoading);

    return (
        <>
            {/*{isLoading && <PageLoader />}*/}

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
