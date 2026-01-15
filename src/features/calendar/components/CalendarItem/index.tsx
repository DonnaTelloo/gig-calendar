import MonthSelector from "../MonthSelector";
import ArrowIcon from '/assets/arrow.svg'
import './style.css'
import {useTranslation} from "react-i18next";

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

    const { i18n, t } = useTranslation();

    return (
        <div className={`year ${disabled ? "disabled" : ""}`}>
            <div
                className="year-header"
                onClick={() => !disabled && onToggle(year)}
            >
                <span>{year}</span>

                {!disabled && <span className={`arrow ${active ? "open" : ""}`}>
                    <img src={ArrowIcon} alt=""/>
                </span> }

                {disabled && <span className="badge">{t("notAvailable")}</span>}
            </div>

            {active && <MonthSelector />}
        </div>
    );
}

