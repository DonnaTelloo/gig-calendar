import { useState, useRef } from "react";
import { useCalendarContext } from "../../../context";
import { getArticles } from "../api/event.api";
import type { TFunction } from "i18next";

export enum Direction {
    LEFT = "prev",
    RIGHT = "next",
    CURRENT = "current",
}

const useEvent = (
    months: string[],
    weekdays: string[],
    t: TFunction
) => {
    const { state, setDate, setIsLoading } = useCalendarContext();

    const [data, setData] = useState<any>(null);
    const [localLoading, setLocalLoading] = useState(false);

    const isInitialLoad = useRef(true);

    /** Cache per YYYY-MM */
    const monthDataCache = useRef<Record<string, any>>({});
    const lastRequestedMonth = useRef<string | null>(null);

    /* -------------------------------- helpers -------------------------------- */

    const addDays = (date: Date, days: number) => {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
        title: t("noEventFound"),
        text: t("noEventFoundDesc"),
        image: "/assets/nothing-found.svg",
    });

    /* -------------------------- page builder (SAFE) -------------------------- */

    const buildPage = (
        date: Date,
        articlesData: Record<string, any>,
        lang: string
    ) => {
        const dateKey = toISO(date);
        const article = articlesData?.[dateKey];

        // ⛔ null or missing → empty page
        if (!article) {
            return createEmptyPage(date);
        }

        let imagePath = "/assets/nothing-found.svg";

        // new format: array
        if (Array.isArray(article.localizations)) {
            const loc = article.localizations.find(
                (l: any) => l.languageCode === lang
            );
            if (loc?.imagePath) imagePath = loc.imagePath;
        }
        // old format: object
        else if (article.localizations?.[lang]?.imagePath) {
            imagePath = article.localizations[lang].imagePath;
        }
        // fallback
        else if (article.imagePath) {
            imagePath = article.imagePath;
        }

        return {
            date: {
                iso: dateKey,
                day: String(date.getDate()),
                month: months[date.getMonth()],
                weekday: weekdays[(date.getDay() + 6) % 7],
            },
            title: article.title || t("noEventFound"),
            text: article.description || t("noEventFoundDesc"),
            image: imagePath,
        };
    };

    /* --------------------------- normalize handler --------------------------- */

    const normalizeArticles = (
        articlesData: Record<string, any>,
        baseDate: Date,
        lang: string
    ) => ({
        prev: buildPage(addDays(baseDate, -1), articlesData, lang),
        current: buildPage(baseDate, articlesData, lang),
        next: buildPage(addDays(baseDate, 1), articlesData, lang),
    });

    /* ---------------------------- main request ---------------------------- */

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

        const yearMonth = `${baseDate.getFullYear()}-${String(
            baseDate.getMonth() + 1
        ).padStart(2, "0")}`;

        const currentYearMonth = `${state.date.getFullYear()}-${String(
            state.date.getMonth() + 1
        ).padStart(2, "0")}`;

        const isMonthChanging = yearMonth !== currentYearMonth;

        // loader logic
        if ((isInitialLoad.current && direction === Direction.CURRENT) || isMonthChanging) {
            setIsLoading(true);
        } else {
            setLocalLoading(true);
        }

        try {
            let articlesData = monthDataCache.current[yearMonth];

            if (!articlesData || lastRequestedMonth.current !== yearMonth) {
                const res = await getArticles(iso);
                articlesData = res.data ?? {};
                monthDataCache.current[yearMonth] = articlesData;
                lastRequestedMonth.current = yearMonth;
            }

            setData(normalizeArticles(articlesData, baseDate, lang));
        } catch {
            setData(normalizeArticles({}, baseDate, lang));
        }

        setDate(baseDate);

        if ((isInitialLoad.current && direction === Direction.CURRENT) || isMonthChanging) {
            setIsLoading(false);
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
