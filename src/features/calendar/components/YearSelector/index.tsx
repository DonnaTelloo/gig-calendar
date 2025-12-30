import "./style.css";
import { YEARS } from "../../utils/yearList";

export default function YearSelector({ year, onChange }) {
    return (
        <div className="year-selector">
            {YEARS.map((y) => (
                <div
                    key={y}
                    className={`year-item ${y === year ? "active" : ""}`}
                    onClick={() => onChange(y)}
                >
                    {y}
                </div>
            ))}
        </div>
    );
}
