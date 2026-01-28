import "./style.css";
import { Link } from "react-router";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";

import CalendarIcon from "../../../../../../public/assets/calendar.svg";
import CloseIcon from "../../../../../../public/assets/close.svg";
import GeorgiaFlag from "../../../../../../public/assets/georgia-flag.svg";
import USFlag from "../../../../../../public/assets/us-flag.svg";
import MenuIcon from "../../../../../../public/assets/menu.svg";
import LogoKA from "../../../../../../public/assets/logo-ka.png";
import LogoEN from "../../../../../../public/assets/logo-en.png";
import LogoBejuaKA from "../../../../../../public/assets/d-bejuashvili-logo.png";
import LogoBejuaEN from "../../../../../../public/assets/d-bejuashvili-logo-en.png";

/* ------------------- HEADER ------------------- */

type HeaderProps = {
    onOpenCalendar: () => void;
    calendarOpen: boolean;
    onMenuOpen?: () => void;
};

export default function Header({ onOpenCalendar, calendarOpen, onMenuOpen }: HeaderProps) {
    const { i18n, t } = useTranslation();
    const currentLang = i18n.language;
    const [menuOpen, setMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        const timelinePanel = document.querySelector('.timeline-panel');
        if (menuOpen) {
            // Disable scrolling on timeline-panel when mobile menu is open
            if (timelinePanel) {
                timelinePanel.classList.add('no-scroll');
            }
        } else {
            // Re-enable scrolling on timeline-panel when mobile menu is closed
            if (timelinePanel) {
                timelinePanel.classList.remove('no-scroll');
            }
        }
    }, [menuOpen]);

    // Close mobile menu when calendar modal is opened
    useEffect(() => {
        if (calendarOpen) {
            setMenuOpen(false);
        }
    }, [calendarOpen]);

    const changeLanguage = (lng: "en" | "ka") => {
        i18n.changeLanguage(lng);
        setMenuOpen(false);
    };

    return (
        <header className="header">
            {/* LEFT – LOGO */}
            <div className="logo">
                <Link to="/" reloadDocument>
                    {i18n.language === "ka" ? (
                        <>
                            <img src={LogoKA} alt=""/>
                            <img src={LogoBejuaKA} alt=""/>
                        </>
                    ) : (
                        <>
                            <img src={LogoEN} alt=""/>
                            <img src={LogoBejuaEN} alt=""/>
                        </>
                    )}
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
                    onClick={() => {
                        const newMenuState = !menuOpen;
                        setMenuOpen(newMenuState);
                        if (newMenuState && onMenuOpen) {
                            onMenuOpen();
                        }
                    }}
                >
                    <img src={MenuIcon} alt="menu" />
                </button>
            </div>

            {/* MOBILE LANGUAGE MENU */}
            {menuOpen && (
                <div className="mobile-menu">
                    <div className="lang-switch">
                        <button
                            className={`lang-item ${
                                currentLang === "ka" ? "active" : ""
                            }`}
                            onClick={() => changeLanguage("ka")}
                        >
                            <img src={GeorgiaFlag} alt="KA" />
                            <span>ქართული</span>
                        </button>

                        <button
                            className={`lang-item ${
                                currentLang === "en" ? "active" : ""
                            }`}
                            onClick={() => changeLanguage("en")}
                        >
                            <span>English</span>
                            <img src={USFlag} alt="EN" />
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
