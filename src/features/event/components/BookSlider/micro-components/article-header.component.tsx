import ShareIcon from "../../../../../../public/assets/share.svg";

const PageHeader = ({
                        date,
                        onShare
                    }: {
    date: any;
    onShare: () => void;
}) => (
    <header className="book-header">
        <div className="date">
            <div className="day">{date.day}</div>
            <div>
                <div className="month">{date.month}</div>
                <div className="weekday">{date.weekday}</div>
            </div>
        </div>

        <button className="share-btn" onClick={onShare}>
            <img src={ShareIcon} alt="" />
        </button>
    </header>
);

export default PageHeader;