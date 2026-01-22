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

    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
};


type CalendarProviderProps = {
    children: React.ReactNode;
    initialDate?: string; // YYYY-MM-DD
};

const CalendarContext = createContext<CalendarContextType | null>(null);

export const CalendarProvider: React.FC<CalendarProviderProps> = ({
                                                                      children,
                                                                      initialDate,
                                                                  }) => {
    const parseInitialDate = () => {
        if (initialDate) {
            const d = new Date(initialDate);
            if (!isNaN(d.getTime())) return d;
        }
        return new Date();
    };

    const [date, setDateState] = useState<Date>(parseInitialDate);
    const [isLoading, setIsLoading] = useState(false);

    const syncState = (d: Date): CalendarState => ({
        date: d,
        year: d.getFullYear(),
        month: d.getMonth(),
    });

    const setDate = (d: Date) => setDateState(d);

    const setYear = (year: number) => {
        const d = new Date(date);
        d.setDate(1);
        d.setFullYear(year);
        setDateState(d);
    };

    const setMonth = (month: number) => {
        const d = new Date(date);
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
                isLoading,
                setIsLoading,
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendarContext = () => {
    const ctx = useContext(CalendarContext);
    if (!ctx) {
        throw new Error("useCalendarContext must be used inside CalendarProvider");
    }
    return ctx;
};
