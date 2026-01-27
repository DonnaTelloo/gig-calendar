import { useEffect, useState } from "react";
import { BookSlider } from "../../features/event/components/BookSlider";
import { YearInfoModal } from "../../features/event/components/YearInfoModal";
import { getYearsApi, getYearInfoApi } from "../../features/calendar/api/calendar.api";

const Home = () => {
    const [modalOpen, setModalOpen] = useState(true);
    const [yearInfo, setYearInfo] = useState<string | null>(null);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

    // Fetch year info when component mounts
    useEffect(() => {
        const fetchYearInfo = async () => {
            try {
                const data = await getYearInfoApi(currentYear.toString());
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
    }, [currentYear]);

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
