import { useState, useRef, useEffect } from "react";
import { useCalendarContext } from "../../../context";
import { getArticles } from "../api/event.api.ts";
import type {TFunction} from "i18next";

export enum Direction {
    LEFT = "prev",
    RIGHT = "next",
    CURRENT = "current",
}

const useEvent = (months: string[], weekdays: string[], t: TFunction) => {
    const { state, setDate, setIsLoading } = useCalendarContext();
    const [data, setData] = useState<any>(null);
    const [localLoading, setLocalLoading] = useState(false);
    const isInitialLoad = useRef(true);

    // Cache to store data by month
    const monthDataCache = useRef<Record<string, any>>({});
    const lastRequestedMonth = useRef<string | null>(null);

    /* ---------- helpers ---------- */

    const addDays = (date: Date, days: number) => {
        const d = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        d.setDate(d.getDate() + days);
        return d;
    };

    const toISO = (date: Date) =>
        [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
        ].join("-");

    const createEmptyPage = (date: Date) => ({
        date: {
            iso: toISO(date),
            day: String(date.getDate()),
            month: months[date.getMonth()],
            weekday: weekdays[(date.getDay() + 6) % 7],
        },
        title: null,
        text: null,
        image: "/assets/nothing-found.svg",
    });

    /* ---------- normalize ---------- */

    const normalizeArticles = (articlesData: Record<string, any>, baseDate: Date, lang: string = "ka") => {
        // Create empty pages for prev, current, and next
        const prevDate = addDays(baseDate, -1);
        const nextDate = addDays(baseDate, 1);

        let prev = createEmptyPage(prevDate);
        let current = createEmptyPage(baseDate);
        let next = createEmptyPage(nextDate);

        // Format dates to match the keys in the response
        const currentDateKey = toISO(baseDate);
        const prevDateKey = toISO(prevDate);
        const nextDateKey = toISO(nextDate);

        // Check if we have data for the current date
        if (articlesData[currentDateKey]) {
            const article = articlesData[currentDateKey];
            // Get the current language from i18n
            const currentLang = lang || "ka"; // Default to "ka" if lang is not provided

            // Extract title and description from localizations if available
            const localization = article.localizations?.[currentLang];

            current = {
                date: {
                    iso: currentDateKey,
                    day: String(baseDate.getDate()),
                    month: months[baseDate.getMonth()],
                    weekday: weekdays[(baseDate.getDay() + 6) % 7],
                },
                title: localization?.title || article.title || t("noEventFound"),
                text: localization?.description || article.description || t("noEventFoundDesc"),
                image: article.imagePath || "/assets/nothing-found.svg",
            };
        }

        // Check if we have data for the previous date
        if (articlesData[prevDateKey]) {
            const article = articlesData[prevDateKey];
            // Get the current language from i18n
            const currentLang = lang || "ka"; // Default to "ka" if lang is not provided

            // Extract title and description from localizations if available
            const localization = article.localizations?.[currentLang];

            prev = {
                date: {
                    iso: prevDateKey,
                    day: String(prevDate.getDate()),
                    month: months[prevDate.getMonth()],
                    weekday: weekdays[(prevDate.getDay() + 6) % 7],
                },
                title: localization?.title || article.title || "No events",
                text: localization?.description || article.description || "No historical data for this date.",
                image: article.imagePath || "/assets/nothing-found.svg",
            };
        }

        // Check if we have data for the next date
        if (articlesData[nextDateKey]) {
            const article = articlesData[nextDateKey];
            // Get the current language from i18n
            const currentLang = lang || "ka"; // Default to "ka" if lang is not provided

            // Extract title and description from localizations if available
            const localization = article.localizations?.[currentLang];

            next = {
                date: {
                    iso: nextDateKey,
                    day: String(nextDate.getDate()),
                    month: months[nextDate.getMonth()],
                    weekday: weekdays[(nextDate.getDay() + 6) % 7],
                },
                title: localization?.title || article.title || "No events",
                text: localization?.description || article.description || "No historical data for this date.",
                image: article.imagePath || "/assets/nothing-found.svg",
            };
        }

        return { prev, current, next };
    };

    /* ---------- main handler ---------- */

    const requestEventHandler = async (
        lang: string,
        direction: Direction = Direction.CURRENT
    ) => {
        const baseDate =
            direction === Direction.RIGHT
                ? addDays(state.date, 1)
                : direction === Direction.LEFT
                    ? addDays(state.date, -1)
                    : state.date;

        const iso = toISO(baseDate);

        // Get the year and month for caching
        const yearMonth = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, "0")}`;
        const currentYearMonth = `${state.date.getFullYear()}-${String(state.date.getMonth() + 1).padStart(2, "0")}`;

        // Check if month is changing
        const isMonthChanging = yearMonth !== currentYearMonth;

        // Use global loader for initial page load or when month changes
        if ((isInitialLoad.current && direction === Direction.CURRENT) || isMonthChanging) {
            setIsLoading(true);
        } else {
            setLocalLoading(true);
        }

        try {
            let articlesData = {};

            // Check if we need to fetch new data (if month changed or first load)
            if (!monthDataCache.current[yearMonth] || yearMonth !== lastRequestedMonth.current) {
                console.log(`Fetching data for month: ${yearMonth}`);
                const result = await getArticles(iso, lang);
                monthDataCache.current[yearMonth] = result.data ?? {};
                lastRequestedMonth.current = yearMonth;
                articlesData = monthDataCache.current[yearMonth];
            } else {
                console.log(`Using cached data for month: ${yearMonth}`);
                articlesData = monthDataCache.current[yearMonth];
            }

            setData(normalizeArticles(articlesData, baseDate, lang));
        } catch {
            setData(normalizeArticles({}, baseDate, lang));
        }

        setDate(baseDate); // 🔒 single source of truth

        // Reset the appropriate loading state
        if ((isInitialLoad.current && direction === Direction.CURRENT) || isMonthChanging) {
            setIsLoading(false);
            // After initial load, set flag to false
            isInitialLoad.current = false;
        } else {
            setLocalLoading(false);
        }
    };

    return {
        data,
        requestEventHandler,
        localLoading,
    };
};

export default useEvent;
