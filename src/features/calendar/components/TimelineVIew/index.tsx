import TimelineItem from "../TimelineItem";
import "./style.css";

export default function TimelineView({ loading, items, highlights }) {
    return (
        <div className="timeline-view">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : items.length === 0 ? (
                <div className="no-results">Nothing found</div>
            ) : (
                items.map((item) => (
                    <TimelineItem
                        key={item.day}
                        day={item.day}
                        title={item.title}
                        text={item.text}
                        image={item.image}
                        monthName={item.monthName}
                        weekday={item.weekday}
                        highlight={highlights.includes(item.day)}
                    />
                ))
            )}
        </div>
    );
}
