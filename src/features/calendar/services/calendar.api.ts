// -------------------------------
// MOCK / API SWITCH
// -------------------------------
const localMock = true; // change to false when real backend is ready

// -------------------------------
// REAL API URL
// -------------------------------
const API_BASE = "https://your-backend-api.com";

// -------------------------------
// FULL MOCK TIMELINE DATA
// matches screenshot fields
// -------------------------------
const mockTimeline = [
  {
    id: 1,
    day: 1,
    month: 9, // October index 9 (0-based JS)
    monthName: "October",
    weekday: "Wednesday",
    title: "Italian Aircraft in the Georgian Armed Forces",
    image: "/images/plane1.jpg",
    text: `
According to the 1920 newspaper “Republic of Georgia,“ the Democratic Republic of Georgia commissioned pilot Mikheil Machavariani to procure Italian aircraft. Colonel Mikheil Machavariani, head of the aviation team, departed for Italy in March 1920. He traveled alongside Senator Ettore Conti’s civilian delegation, which was returning from their official visit to Tbilisi.

Machavariani’s mission proved successful, earning commendation from the Minister of Defense. His negotiations resulted in the Georgian government’s acquisition of ten SVSA-10 aircraft from Italy’s Ansaldo factory. The Ansaldo aircraft obtained by the Georgian army featured robust 250-horsepower engines. However, as they were purchased without armament, these aircraft were restricted to reconnaissance operations.
`
  },
  {
    id: 2,
    day: 2,
    month: 9,
    monthName: "October",
    weekday: "Thursday",
    title: "Formation of the Georgian Air Detachment",
    image: "/images/plane2.jpg",
    text: `
In early October 1920, following the arrival of newly purchased Italian aircraft, the Ministry of Defense initiated the formal organization of Georgia’s Air Detachment. The unit was tasked with integrating the Ansaldo aircraft into active military service and preparing aviators for reconnaissance operations.

Documents of the era highlight that Georgian pilots underwent intensive training to adapt to the 250-horsepower engines of the SVSA-10 models. Although the aircraft lacked onboard weaponry, their speed and altitude capabilities made them valuable for monitoring borders and gathering intelligence.

The formation of this detachment marked a significant step in modernizing the country’s defense system, representing one of the last major military developments before the Soviet occupation.
`
  },
  {
    id: 3,
    day: 5,
    month: 9,
    monthName: "October",
    weekday: "Sunday",
    title: "Formation of the Georgian Air Detachment",
    image: "/images/plane2.jpg",
    text: `
In early October 1920, following the arrival of newly purchased Italian aircraft, the Ministry of Defense initiated the formal organization of Georgia’s Air Detachment. The unit was tasked with integrating the Ansaldo aircraft into active military service and preparing aviators for reconnaissance operations.

Documents of the era highlight that Georgian pilots underwent intensive training to adapt to the 250-horsepower engines of the SVSA-10 models. Although the aircraft lacked onboard weaponry, their speed and altitude capabilities made them valuable for monitoring borders and gathering intelligence.

The formation of this detachment marked a significant step in modernizing the country’s defense system, representing one of the last major military developments before the Soviet occupation.
`
  }
];

// -------------------------------
// HIGHLIGHTS MOCK
// -------------------------------
const mockHighlights = [
  { day: 1, highlight: true },
  { day: 2, highlight: false },
  { day: 5, highlight: true }
];

// -------------------------------
// API WRAPPERS
// -------------------------------

export async function getTimeline(year: number, month: number) {
  if (localMock) {
    await delay(500);
    return mockTimeline.filter(e => e.month === month);
  }

  const res = await fetch(`${API_BASE}/timeline?year=${year}&month=${month}`);
  if (!res.ok) throw new Error("Timeline API error");
  return res.json();
}

export async function getHighlights(year: number, month: number) {
  if (localMock) {
    await delay(200);
    return mockHighlights.filter(h => h.highlight);
  }

  const res = await fetch(`${API_BASE}/highlights?year=${year}&month=${month}`);
  if (!res.ok) throw new Error("Highlights API error");
  return res.json();
}

// -------------------------------
function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
