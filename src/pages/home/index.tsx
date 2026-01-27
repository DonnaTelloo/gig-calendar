import { useEffect, useState } from "react";
import { BookSlider } from "../../features/event/components/BookSlider";
import { getYearsApi, getYearInfoApi } from "../../features/calendar/api/calendar.api";
import { YearInfoModal } from "../../features/event/components/YearInfoModal";
import { useCalendarContext } from "../../context";
import { useTranslation } from "react-i18next";

const Home = () => {
    const [modalOpen, setModalOpen] = useState(true);
    const [yearInfo, setYearInfo] = useState<any>();
    const { i18n } = useTranslation();
    const {
        state
    } = useCalendarContext()

    // Fetch year info when component mounts
    useEffect(() => {
        const fetchYearInfo = async () => {
            try {
                const data = await getYearInfoApi(state.year.toString());
                if (data && data.localizations && data.localizations.length > 0) {
                    // Get current language from i18n
                    const currentLang = i18n.language || "ka";

                    // Find localization for current language, fallback to first available
                    const localization = data.localizations.find(loc => loc.languageCode === currentLang) || 
                                        data.localizations[0];

                    if (localization) {
                        setYearInfo(localization);
                    }
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
    }, [state.year, i18n.language]);

    return(
        <>
            <BookSlider />
            {yearInfo && (
                <YearInfoModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    yearInfo={yearInfo}
                    year={state.year}
                />
            )}
        </>
    )
}

export default Home;
