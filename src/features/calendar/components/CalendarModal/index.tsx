import "./style.css";
import { useState } from "react";

const MIN_YEAR = 2025;

export default function CalendarModal({ onClose }) {
    const today = new Date();

    const initialYear = Math.max(today.getFullYear(), MIN_YEAR);

    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(initialYear);
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState("month"); // "month" | "year"

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    };

    const prevMonth = () => {
        if (year === MIN_YEAR && month === 0) return;

        if (month === 0) {
            setMonth(11);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    };

    const monthName = new Date(year, month).toLocaleString("en-US", {
        month: "long",
    });

    const daysMatrix = getMonthMatrix(year, month);

    return (
        <div className="calendar-overlay" onClick={onClose}>
            <div
                className="calendar-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="calendar-header">
                    {/* LEFT */}
                    <div className="calendar-nav">
                        <button onClick={prevMonth}>‹</button>

                        <div className="calendar-title">
                            <span>{monthName}</span>
                            <span className="calendar-year">{year}</span>
                        </div>

                        <button onClick={nextMonth}>›</button>
                    </div>

                    {/* RIGHT */}
                    <div className="calendar-view-toggle">
                        <button
                            className={view === "month" ? "active" : ""}
                            onClick={() => setView("month")}
                        >
                            Month
                        </button>
                        <button
                            className={view === "year" ? "active" : ""}
                            onClick={() => setView("year")}
                        >
                            Year
                        </button>
                    </div>
                </div>

                {/* WEEKDAY HEADER */}
                <div className="week-header">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div key={d}>{d}</div>
                    ))}
                </div>

                {/* GRID */}
                {view === "month" && (
                    <div className="calendar-grid">
                        {daysMatrix.map((row, rIdx) => (
                            <div className="calendar-row" key={rIdx}>
                                {row.map((cell, cIdx) => {
                                    const isSelected =
                                        selectedDate &&
                                        cell.current &&
                                        selectedDate.getDate() === cell.day &&
                                        selectedDate.getMonth() === cell.month &&
                                        selectedDate.getFullYear() === cell.year;

                                    return (
                                        <div
                                            key={cIdx}
                                            className={[
                                                "calendar-cell",
                                                !cell.current && "dim",
                                                cIdx === 5 && "saturday",
                                                isSelected && "selected",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                            onClick={() => {
                                                if (!cell.current) return;
                                                setSelectedDate(
                                                    new Date(
                                                        cell.year,
                                                        cell.month,
                                                        cell.day
                                                    )
                                                );
                                            }}
                                        >
                                            {cell.day}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}

                {view === "year" && (
                    <YearGrid
                        activeYear={year}
                        onSelect={(y) => {
                            setYear(y);
                            setView("month");
                        }}
                    />
                )}

            </div>
        </div>
    );
}

function YearGrid({ activeYear, onSelect }) {
    const startYear = activeYear - 3;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
        <div className="year-grid">
            {years.map((y) => (
                <div
                    key={y}
                    className={[
                        "year-cell",
                        y < 2025 && "disabled",
                        y === activeYear && "selected",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    onClick={() => {
                        if (y < 2025) return;
                        onSelect(y);
                    }}
                >
                    {y}
                </div>
            ))}
        </div>
    );
}

/* REAL month matrix */
function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;

    let matrix = [];
    let day = 1 - offset;

    for (let r = 0; r < 6; r++) {
        let row = [];
        for (let c = 0; c < 7; c++) {
            const d = new Date(year, month, day);
            row.push({
                day: d.getDate(),
                month: d.getMonth(),
                year: d.getFullYear(),
                current: d.getMonth() === month,
            });
            day++;
        }
        matrix.push(row);
    }
    return matrix;
}
