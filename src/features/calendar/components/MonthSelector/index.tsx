import "./index.css";
import { MONTHS } from "../../utils/monthList";
import {useCalendar} from "../../hooks/useCalendar.ts";
import {useTranslation} from "react-i18next";
import {getMonths} from "../../../../i18n/locales/utils";
import {useEffect} from "react";

export default function MonthSelector() {
    const {
        month,
        setMonth
    } = useCalendar();

    const { i18n,t } = useTranslation();
    const months = t("months", { returnObjects: true }) as string[];

    console.log(months)

    return (
        <div className="month-selector">
            <div className="ruler">
                <span className="line" />
                {months.map((_, i) => (
                    <span key={i} className={`tick ${i === month ? "active" : ""}`} />
                ))}
            </div>

            <div className="months">
                {months.map((m, i) => (
                    <div                         onClick={() => setMonth(i)}
                                                 key={i}
                                                 className={`month ${i === month ? "active" : ""}`}
                        >
                        {m}
                    </div>
                ))}
            </div>
        </div>
    );
}
