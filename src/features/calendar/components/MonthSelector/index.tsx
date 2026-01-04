import "./index.css";
import { MONTHS } from "../../utils/monthList";
import {useCalendar} from "../../hooks/useCalendar.ts";

export default function MonthSelector() {
    const {
        month,
        setMonth
    } = useCalendar();

    return (
        <div className="month-selector">
            <div className="ruler">
                <span className="line" />
                {MONTHS.map((_, i) => (
                    <span key={i} className={`tick ${i === month ? "active" : ""}`} />
                ))}
            </div>

            <div className="months">
                {MONTHS.map((m, i) => (
                    <div                         onClick={() => setMonth(i)}
                                                 key={i}
                                                 className={`month`}
                        >
                        {m}
                    </div>
                ))}
            </div>
        </div>
    );
}
