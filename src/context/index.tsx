import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getYearsApi } from "../features/calendar/api/calendar.api";

/**
 * Calendar state interface
 */
type CalendarState = {
    date: Date;
    year: number;
    month: number;
    years: number[];
};

/**
 * Error state interface
 */
type ErrorState = {
    message: string;
    code?: string;
};

/**
 * Calendar context interface
 */
type CalendarContextType = {
    state: CalendarState;

    // State setters
    setDate: (date: Date) => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    setYearMonth: (year: number, month: number) => void;
    setYears: (years: number[]) => void;

    // API methods
    getYears: () => Promise<void>;

    // Loading and error states
    setIsLoading: (isLoading: boolean) => void;
    isLoading: boolean;
    error: ErrorState | null;
    clearError: () => void;
};

/**
 * Calendar provider props
 */
type CalendarProviderProps = {
    children: React.ReactNode;
    initialDate?: string;
};

// Create context with null default value
const CalendarContext = createContext<CalendarContextType | null>(null);

/**
 * Calendar provider component
 */
export const CalendarProvider: React.FC<CalendarProviderProps> = ({
    children,
    initialDate,
}) => {
    // Parse initial date from string or use current date
    const parseInitialDate = () => {
        if (initialDate) {
            const d = new Date(initialDate);
            if (!isNaN(d.getTime())) return d;
        }
        return new Date();
    };

    // State
    const [date, setDateState] = useState<Date>(parseInitialDate);
    const [years, setYears] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorState | null>(null);

    // Sync state with current date
    const syncState = (d: Date): CalendarState => ({
        date: d,
        year: d.getFullYear(),
        month: d.getMonth(),
        years,
    });

    // Clear error state
    const clearError = () => setError(null);

    // Date setters
    const setDate = (d: Date) => {
        clearError();
        setDateState(d);
    };

    const setYear = (year: number) => {
        clearError();
        const d = new Date(date);
        d.setDate(1);
        d.setFullYear(year);
        setDateState(d);
    };

    const setMonth = (month: number) => {
        clearError();
        const d = new Date(date);
        d.setDate(1);
        d.setMonth(month);
        setDateState(d);
    };

    const setYearMonth = (year: number, month: number) => {
        clearError();
        const d = new Date(date);
        d.setDate(1);
        d.setFullYear(year);
        d.setMonth(month);
        setDateState(d);
    };

    // Fetch years from API
    const getYears = useCallback(async () => {
        try {
            setIsLoading(true);
            clearError();
            console.log("Fetching years from API in context");
            const response = await getYearsApi();

            console.log('response', response);

            // Check if years is undefined or empty
            if (!response) {
                const currentYear = new Date().getFullYear();
                const mockYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
                setYears(mockYears);
            } else {
                //@ts-ignore
                setYears(response);
            }
        } catch (error: any) {
            console.error("Failed to fetch years:", error);
            // Use mock data as fallback on error
            const currentYear = new Date().getFullYear();
            const mockYears = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];
            console.log("Error occurred, using mock years:", mockYears);
            setYears(mockYears);

            setError({
                message: "Failed to fetch years",
                code: error.response?.status?.toString()
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load years on initial mount
    useEffect(() => {
        getYears();
    }, [getYears]);

    // Log years state after it's updated
    useEffect(() => {
        console.log("Years state updated:", years);
    }, [years]);

    const state = syncState(date);

    return (
        <CalendarContext.Provider
            value={{
                state,
                setDate,
                setYear,
                setMonth,
                setYearMonth,
                setYears,
                getYears,
                isLoading,
                setIsLoading,
                error,
                clearError
            }}
        >
            {children}
        </CalendarContext.Provider>
    );
};

/**
 * Hook to use calendar context
 */
export const useCalendarContext = () => {
    const ctx = useContext(CalendarContext);
    if (!ctx) {
        throw new Error("useCalendarContext must be used inside CalendarProvider");
    }
    return ctx;
};
