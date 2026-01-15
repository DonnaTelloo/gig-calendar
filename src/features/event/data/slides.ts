export type Slide = {
    id: number;

    date: {
        /** Day of month (e.g. "12") */
        day: string;

        /** Month name (e.g. "October") */
        month: string;

        /** Weekday name (e.g. "Saturday") */
        weekday: string;
    };

    /** Event or article title */
    title: string;

    /** Short historical description */
    text: string;

    /** Main visual for the slide */
    image: string;
};

export const mockSlides: Slide[] = [
    {
        id: 1,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Discovery of America',
        text: 'Christopher Columbus reached the Americas in 1492, marking a turning point in world history and the beginning of sustained European contact.',
        image: 'https://picsum.photos/600/400?random=101'
    },
    {
        id: 2,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Opening of the Eiffel Tower',
        text: 'The Eiffel Tower officially opened in Paris in 1889 as the entrance arch for the World’s Fair, becoming a global cultural icon.',
        image: 'https://picsum.photos/600/400?random=102'
    },
    {
        id: 3,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'First Oktoberfest Celebration',
        text: 'Munich hosted the first Oktoberfest in 1810 to celebrate the marriage of Crown Prince Ludwig of Bavaria.',
        image: 'https://picsum.photos/600/400?random=103'
    },
    {
        id: 4,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Discovery of Pluto',
        text: 'In 1930, astronomer Clyde Tombaugh discovered Pluto, expanding humanity’s understanding of the solar system.',
        image: 'https://picsum.photos/600/400?random=104'
    },
    {
        id: 5,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Construction of the Sydney Opera House Begins',
        text: 'Construction began in 1959 on what would become one of the most recognizable architectural landmarks in the world.',
        image: 'https://picsum.photos/600/400?random=105'
    },
    {
        id: 6,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'First Human in Space',
        text: 'Yuri Gagarin became the first human to journey into outer space in 1961, orbiting the Earth aboard Vostok 1.',
        image: 'https://picsum.photos/600/400?random=106'
    },
    {
        id: 7,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Declaration of Independence of Brazil',
        text: 'Brazil declared independence from Portugal in 1822, leading to the formation of the Brazilian Empire.',
        image: 'https://picsum.photos/600/400?random=107'
    },
    {
        id: 8,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'First Commercial Jet Flight',
        text: 'In 1952, the world’s first commercial jet airliner entered service, revolutionizing global air travel.',
        image: 'https://picsum.photos/600/400?random=108'
    },
    {
        id: 9,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'Launch of the Hubble Space Telescope',
        text: 'NASA launched the Hubble Space Telescope in 1990, providing unprecedented views of the universe.',
        image: 'https://picsum.photos/600/400?random=109'
    },
    {
        id: 10,
        date: {
            day: '12',
            month: 'October',
            weekday: 'Saturday'
        },
        title: 'First iPhone Announced',
        text: 'Apple announced the first iPhone in 2007, reshaping the mobile phone industry and modern technology.',
        image: 'https://picsum.photos/600/400?random=110'
    }
];
