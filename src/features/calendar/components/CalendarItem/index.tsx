import MonthSelector from "../MonthSelector";
import './style.css'

type Props = {
    year: number;
    active?: boolean;
    disabled?: boolean;
    onToggle: (year: number) => void;
};

export default function CalendarItem({
                                         year,
                                         active,
                                         disabled,
                                         onToggle
                                     }: Props) {
    return (
        <div className={`year ${disabled ? "disabled" : ""}`}>
            <div
                className="year-header"
                onClick={() => !disabled && onToggle(year)}
            >
                <span>{year}</span>

                {!disabled && <span className={`arrow ${active ? "open" : ""}`}>⌃</span> }

                {disabled && <span className="badge">მიუწვდომელია</span>}
            </div>

            {active && <MonthSelector />}
        </div>
    );
}

