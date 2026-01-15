export type CalendarSlide = {
    date: {
        iso: string;
        day: string;
        month: string;
        weekday: string;
    };
    title: string;
    text: string;
    image: string;
};

export type CalendarTriplet = {
    prev: CalendarSlide;
    current: CalendarSlide;
    next: CalendarSlide;
};