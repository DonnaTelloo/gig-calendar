import "./index.css";
import {useTranslation} from "react-i18next";
import {useCalendarContext} from "../../../../context";
import { useCallback, useRef, useEffect } from "react";

export default function MonthSelector({
    year
                                      }) {
    const { state, setYearMonth } = useCalendarContext();

    const { i18n,t } = useTranslation();
    const months = t("months", { returnObjects: true }) as string[];

    // Debounce function to prevent rapid clicks
    const debounce = (func, delay) => {
        let timeoutId;
        return function(...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func.apply(this, args);
                timeoutId = null;
            }, delay);
        };
    };

    // Use useRef to maintain the debounced function instance
    const debouncedSetYearMonthRef = useRef(null);

    // Initialize debounced function with useEffect
    useEffect(() => {
        debouncedSetYearMonthRef.current = debounce((y, m) => {
            setYearMonth(y, m);
        }, 300);
    }, [setYearMonth]);

    // Function to open calendar modal
    const openCalendarModal = () => {
        // Dispatch a custom event that the PublicLayout component will listen for
        const event = new CustomEvent('openCalendarModal');
        window.dispatchEvent(event);
    };

    return (
        <div className="month-selector">
            <div className="ruler">
                <span className="line" />
                {months.map((_, i) => (
                    <span key={i} className={`tick ${(i === state.month && year === state.year) ? "active" : ""}`} />
                ))}
            </div>

            <div className="months">
                {months.map((m, i) => (
                    <div                         
                        onClick={() => {
                            // Always set the date to the 1st day of the month before opening the modal
                            setYearMonth(year, i);

                            // Open calendar modal after setting the date
                            // Use setTimeout with 0ms to ensure the date is set before opening the modal
                            setTimeout(() => {
                                openCalendarModal();
                            }, 0);
                        }}
                        key={i}
                        className={`month ${(i === state.month && year === state.year) ? "active" : ""}`}
                    >
                        {m}
                    </div>
                ))}
            </div>
        </div>
    );
}
