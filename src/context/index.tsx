import React, { createContext, useContext, useState } from "react";

type CalendarState = {
    date: Date;
    year: number;
    month: number;
};

type CalendarContextType = {
    state: CalendarState;
    setDate: (date: Date) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [date, setDateState] = useState<Date>(
        new Date(2025, 9, 5)
    );

    const syncState = (d: Date): CalendarState => ({
        date: d,
        year: d.getFullYear(),
        month: d.getMonth(),
    });

    const setDate = (d: Date) => {
        setDateState(d);
    };

    const setYear = (year: number) => {
        const d = new Date(date);

        d.setDate(1);
        d.setFullYear(year);

        setDateState(d);
    };

    const setMonth = (month: number) => {
        const d = new Date(date);

        // reset day to avoid overflow
        d.setDate(1);
        d.setMonth(month);

        setDateState(d);
    };

    const state = syncState(date);

    return (
        <CalendarContext.Provider
            value={{
                state,
                setDate,
                setYear,
                setMonth,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendarContext = () => {
    const ctx = useContext(CalendarContext);
    if (!ctx) throw new Error("useCalendarContext must be used inside CalendarProvider");
    return ctx;
};
