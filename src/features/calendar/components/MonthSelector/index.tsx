import "./style.css";
import { MONTHS } from "../../utils/monthList";

export default function MonthSelector({ month, onChange }) {
    return (
        <div className="month-selector-wrapper">

            {/* Ruler */}
            <div className="vertical-ruler">
                <div className="ruler-line"></div>

                <div className="ticks-container">
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className={`tick ${i % 5 === 0 ? "tick-long" : "tick-short"}`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Month list */}
            <div className="month-list">
                {MONTHS.map((m, i) => (
                    <div
                        key={i}
                        className={`month-item ${i === month ? "active" : ""}`}
                        onClick={() => onChange(i)}
                    >
                        {m}
                    </div>
                ))}
            </div>
        </div>
    );
}
