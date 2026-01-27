import "./style.css";
import {useEffect, useState, useCallback, useRef} from "react";
import { useTranslation } from "react-i18next";
import {useCalendarContext} from "../../../../context";

export default function CalendarModal({ onClose }) {
    const { t } = useTranslation();
    const { state, setDate, setYear, setMonth, setYearMonth } = useCalendarContext();

    const MIN_YEAR = state.years?.length ? Math.min(...state.years) : new Date().getFullYear();

    const month = state.month;
    const year = state.year;

    const [view, setView] = useState("month"); // "month" | "year"

    const months = t("months", { returnObjects: true });
    const weekdays = t("calendar.weekdays", { returnObjects: true }) as Array<string>;

    const monthName = months[month];

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

    // Use useRef to maintain the debounced function instances
    const nextMonthRef = useRef(null);
    const prevMonthRef = useRef(null);

    // Initialize debounced functions with useCallback
    useEffect(() => {
        nextMonthRef.current = debounce(() => {
            if (state.month === 11) {
                setYearMonth(state.year + 1, 0);
            } else {
                setMonth(state.month + 1);
            }
        }, 300);

        prevMonthRef.current = debounce(() => {
            if (state.year === MIN_YEAR && state.month === 0) return;

            if (state.month === 0) {
                setYearMonth(state.year - 1, 11);
            } else {
                setMonth(state.month - 1);
            }
        }, 300);
    }, [state.month, state.year, MIN_YEAR, setMonth, setYearMonth]);

    // Wrapper functions to call the debounced functions
    const nextMonth = () => {
        nextMonthRef.current();
    };

    const prevMonth = () => {
        prevMonthRef.current();
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
                                            cell.current &&
                                            state.date.getDate() === cell.day &&
                                            state.date.getMonth() === cell.month &&
                                            state.date.getFullYear() === cell.year;

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

                                                    const selected = new Date(cell.year, cell.month, cell.day);

                                                    setDate(selected);

                                                    onClose?.();
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
                        years={state.years}
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

function YearGrid({ years, activeYear, minYear, onSelect }) {
    const yearsArray = years || [];

    return (
        <div className="year-grid">
            {yearsArray.map((y) => (
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
