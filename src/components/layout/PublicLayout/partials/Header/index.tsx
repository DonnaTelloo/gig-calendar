import "./style.css";
import { Link } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CalendarIcon from "../../../../../../public/assets/calendar.svg";
import CloseIcon from "../../../../../../public/assets/close.svg";
import GeorgiaFlag from "../../../../../../public/assets/georgia-flag.svg";
import USFlag from "../../../../../../public/assets/us-flag.svg";
import MenuIcon from "../../../../../../public/assets/menu.svg";
import Logo from "../../../../../../public/assets/logo.svg";

/* ------------------- HEADER ------------------- */

type HeaderProps = {
    onOpenCalendar: () => void;
    calendarOpen: boolean;
};

export default function Header({ onOpenCalendar, calendarOpen }: HeaderProps) {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;
    const [menuOpen, setMenuOpen] = useState(false);

    const changeLanguage = (lng: "en" | "ka") => {
        i18n.changeLanguage(lng);
        setMenuOpen(false);
    };

    return (
        <header className="header">
            {/* LEFT – LOGO */}
            <div className="logo">
                <Link to="/" reloadDocument>
                    <img src={Logo} alt=""/>
                </Link>
            </div>

            {/* RIGHT – ACTIONS */}
            <div className="header-actions">
                {/* Calendar Button */}
                <button className="explore-btn" onClick={onOpenCalendar}>
                    <span className="icon">
                        <img
                            src={calendarOpen ? CloseIcon : CalendarIcon}
                            alt=""
                        />
                    </span>
                    {calendarOpen
                        ? t("calendar.close")
                        : t("calendar.explore")}
                </button>

                {/* DESKTOP LANGUAGE SWITCH */}
                <div className="lang-switch desktop-only">
                    <button
                        className={`lang-item ${
                            currentLang === "ka" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("ka")}
                    >
                        <img src={GeorgiaFlag} alt="KA" />
                    </button>

                    <button
                        className={`lang-item ${
                            currentLang === "en" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("en")}
                    >
                        <img src={USFlag} alt="EN" />
                    </button>
                </div>

                {/* MOBILE BURGER */}
                <button
                    className="burger-btn mobile-only"
                    onClick={() => setMenuOpen((v) => !v)}
                >
                    <img src={MenuIcon} alt="menu" />
                </button>
            </div>

            {/* MOBILE LANGUAGE MENU */}
            {menuOpen && (
                <div className="mobile-menu">
                    <button
                        className={`lang-item ${
                            currentLang === "ka" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("ka")}
                    >
                        <img src={GeorgiaFlag} alt="KA" />
                        ქართული
                    </button>

                    <button
                        className={`lang-item ${
                            currentLang === "en" ? "active" : ""
                        }`}
                        onClick={() => changeLanguage("en")}
                    >
                        <img src={USFlag} alt="EN" />
                        English
                    </button>
                </div>
            )}
        </header>
    );
}
