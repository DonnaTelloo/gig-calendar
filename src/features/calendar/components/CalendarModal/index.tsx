import "./style.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MIN_YEAR = 2025;

export default function CalendarModal({ onClose }) {
    const { t } = useTranslation();

    const today = new Date();
    const initialYear = Math.max(today.getFullYear(), MIN_YEAR);

    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(initialYear);
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState("month"); // "month" | "year"

    // 🌍 i18n
    const months = t("months", { returnObjects: true });
    const weekdays = t("calendar.weekdays", { returnObjects: true });

    const monthName = months[month];

    const nextMonth = () => {
        if (month === 11) {
            setMonth(0);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    };

    const prevMonth = () => {
        if (year === MIN_YEAR && month === 0) return;

        if (month === 0) {
            setMonth(11);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const daysMatrix = getMonthMatrix(year, month);

    return (
        <div className="calendar-overlay" onClick={onClose}>
            <div
                className="calendar-container"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button onClick={prevMonth}>‹</button>

                        <div className="calendar-title">
                            <span>{monthName}</span>
                            <span className="calendar-year">{year}</span>
                        </div>

                        <button onClick={nextMonth}>›</button>
                    </div>

                    <div className="calendar-view-toggle">
                        <button
                            className={view === "month" ? "active" : ""}
                            onClick={() => setView("month")}
                        >
                            {t("calendar.month", "Month")}
                        </button>
                        <button
                            className={view === "year" ? "active" : ""}
                            onClick={() => setView("year")}
                        >
                            {t("calendar.year", "Year")}
                        </button>
                    </div>
                </div>

                {/* MONTH VIEW */}
                {view === "month" && (
                    <>
                        <div className="week-header">
                            {weekdays.map((d) => (
                                <div key={d}>{d}</div>
                            ))}
                        </div>

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
                    </>
                )}

                {/* YEAR VIEW */}
                {view === "year" && (
                    <YearGrid
                        activeYear={year}
                        minYear={MIN_YEAR}
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

/* ================= YEAR GRID ================= */

function YearGrid({ activeYear, minYear, onSelect }) {
    const startYear = activeYear - 3;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
        <div className="year-grid">
            {years.map((y) => (
                <div
                    key={y}
                    className={[
                        "year-cell",
                        y < minYear && "disabled",
                        y === activeYear && "selected",
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    onClick={() => {
                        if (y < minYear) return;
                        onSelect(y);
                    }}
                >
                    {y}
                </div>
            ))}
        </div>
    );
}

/* ================= MONTH MATRIX ================= */

function getMonthMatrix(year, month) {
    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;

    const matrix = [];
    let day = 1 - offset;

    for (let r = 0; r < 6; r++) {
        const row = [];
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
