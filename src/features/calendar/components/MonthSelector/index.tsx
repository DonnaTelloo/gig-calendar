import "./index.css";
import {useTranslation} from "react-i18next";
import {useCalendarContext} from "../../../../context";

export default function MonthSelector() {
    const { state, setMonth } = useCalendarContext();

    const { i18n,t } = useTranslation();
    const months = t("months", { returnObjects: true }) as string[];

    return (
        <div className="month-selector">
            <div className="ruler">
                <span className="line" />
                {months.map((_, i) => (
                    <span key={i} className={`tick ${i === state.month ? "active" : ""}`} />
                ))}
            </div>

            <div className="months">
                {months.map((m, i) => (
                    <div                         onClick={() => setMonth(i)}
                                                 key={i}
                                                 className={`month ${i === state.month ? "active" : ""}`}
                        >
                        {m}
                    </div>
                ))}
            </div>
        </div>
    );
}
