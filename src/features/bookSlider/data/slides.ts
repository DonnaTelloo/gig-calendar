export interface BookSlide {
    date: {
        day: string;
        month: string;
        weekday: string;
    };
    title: string;
    text: string;
    image: string;
}

export const slides: BookSlide[] = [
    {
        date: {
            day: '01',
            month: 'October',
            weekday: 'Wednesday',
        },
        title: 'Italian Aircraft in the Georgian Armed Forces',
        text: `According to the 1920 newspaper “Republic of Georgia,“ the Democratic Republic of Georgia commissioned pilot Mikheil Machavariani to procure Italian aircraft. Colonel Mikheil Machavariani, head of the aviation team, departed for Italy in March 1920. He traveled alongside Senator Ettore Conti’s civilian delegation, which was returning from their official visit to Tbilisi.
Machavariani’s mission proved successful, earning commendation from the Minister of Defense. His negotiations resulted in the Georgian government’s acquisition of ten SVSA-10 aircraft from Italy’s Ansaldo factory. The Ansaldo aircraft obtained by the Georgian army featured robust 250-horsepower engines`,
        image: '/src/assets/plane.png',
    },
];