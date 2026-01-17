// import { useEffect, useState } from "react";
// import { getTimeline, getHighlights } from "../services/calendar.api";
//
// export function useCalendar() {
//     const currentYear = new Date().getFullYear();
//
//     const [year, setYear] = useState(currentYear);
//     const [items, setItems] = useState<any[]>([]);
//     const [highlights, setHighlights] = useState<number[]>([]);
//     const [loading, setLoading] = useState(false);
//
//     const [month, setMonth] = useState(9); // force October for now
//
//     useEffect(() => {
//         async function load() {
//             setLoading(true);
//
//             const timelineRes = await getTimeline(year, month);
//
//             const normalized = timelineRes.map((item: any) => ({
//                 id: item.id,
//                 day: item.day,
//                 month: item.month,
//                 monthName: item.monthName ?? getMonthName(item.month),
//                 weekday: item.weekday ?? getWeekday(year, item.month, item.day),
//                 title: item.title,
//                 text: item.text,
//                 image: item.image,
//             }));
//
//             setItems(normalized);
//             setLoading(false);
//         }
//
//         load();
//     }, [year, month]);
//
//     return {
//         year,
//         month,
//         setYear,
//         setMonth,
//         items,
//         highlights,
//         loading
//     };
// }
//
// Utility: get month name
function getMonthName(monthIndex: number) {
    const names = [
        "January","February","March","April","May","June",
        "July","August","September","October","November","December"
    ];
    return names[monthIndex];
}

// Utility: generate weekday name
function getWeekday(year: number, month: number, day: number) {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("en-US", { weekday: "long" });
}
