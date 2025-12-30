import "./style.css";

export default function TimelineItem({
                                         day,
                                         title,
                                         text,
                                         image,
                                         monthName,
                                         weekday
                                     }) {
    return (
        <div className="timeline-item">

            {/* DATE BADGE + SHARE in separate alignment row */}
            <div className="top-row">
                <div className="date-badge">
                    <div className="date-day">{String(day).padStart(2, "0")}</div>

                    <div className="date-info">
                        <div className="date-month">{monthName}</div>
                        <div className="date-weekday">{weekday}</div>
                    </div>
                </div>

                <button className="share-btn">Share</button>
            </div>

            {/* IMAGE */}
            {image && (
                <div className="article-image-wrapper">
                    <img className="article-image" src={image} alt="" />
                </div>
            )}

            {/* TITLE */}
            <h2 className="article-title">{title}</h2>

            {/* TEXT */}
            <p className="article-text">{text}</p>

            <div className="item-divider"></div>
        </div>
    );
}
