import { useEffect, useState } from "react";
import { BookSlider } from "../../features/event/components/BookSlider";
import { getYearsApi, getYearInfoApi } from "../../features/calendar/api/calendar.api";
import {YearInfoModal} from "../../features/event/components/YearInfoModal";
import {useCalendarContext} from "../../context";

const Home = () => {
    const [modalOpen, setModalOpen] = useState(true);
    const [yearInfo, setYearInfo] = useState<string | null>(null);
    const {
        state
    } = useCalendarContext()

    // Fetch year info when component mounts
    useEffect(() => {
        const fetchYearInfo = async () => {
            try {
                const data = await getYearInfoApi(state.year.toString());
                if (data) {
                    setYearInfo(data.description || data.content || "");
                }
            } catch (error: any) {
                console.error("Failed to fetch year info:", error);
                // 404 is expected if no year info exists
                if (error.response && error.response.status !== 404) {
                    console.error("Error fetching year info:", error);
                }
            }
        };

        fetchYearInfo();
    }, [state.year]);

    return(
        <>
            <BookSlider />
            {yearInfo && (
                <YearInfoModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    yearInfo={yearInfo}
                    year={currentYear}
                />
            )}
        </>
    )
}

export default Home;
