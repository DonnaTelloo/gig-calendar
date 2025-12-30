import "./style.css";
import { useState } from "react";

export default function CalendarModal({ onClose }) {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const prevMonth = () => {
        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const monthName = new Date(year, month).toLocaleString("en-US", { month: "long" });
    const daysMatrix = getMonthMatrix(year, month);

    return (
        <div className="calendar-overlay" onClick={onClose}>
            <div className="calendar-container" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="calendar-header">
                    <button onClick={prevMonth}>‹</button>
                    <h2>{monthName}</h2>
                    <button onClick={nextMonth}>›</button>
                </div>

                {/* WEEKDAY HEADER */}
                <div className="week-header">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* GRID */}
                <div className="calendar-grid">
                    {daysMatrix.map((row, rIdx) => (
                        <div className="calendar-row" key={rIdx}>
                            {row.map((cell, cIdx) => (
                                <div
                                    key={cIdx}
                                    className={
                                        "calendar-cell " +
                                        (!cell.current ? "dim " : "") +
                                        (cIdx === 5 ? "saturday" : "")
                                    }
                                >
                                    {cell.day}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

// Month matrix (correct version)
function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7; // Mon=0 ... Sun=6
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let matrix = [];
    let day = 1 - offset;

    for (let r = 0; r < 6; r++) {
        let row = [];
        for (let c = 0; c < 7; c++) {
            const d = new Date(year, month, day);
            row.push({
                day: d.getDate(),
                current: d.getMonth() === month
            });
            day++;
        }
        matrix.push(row);
    }

    return matrix;
}
