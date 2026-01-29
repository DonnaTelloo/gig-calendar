import { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import ShareIcon from "../../../../../public/assets/share.svg";
import useEvent from "../../hooks/useEvent";
import { ShareModal } from "../ShareModal";
import { useTranslation } from "react-i18next";
import { useCalendarContext } from "../../../../context";
import PageHeader from "./micro-components/article-header.component.tsx";
import {Helmet} from 'react-helmet'

enum Direction {
    LEFT = "prev",
    RIGHT = "next",
    CURRENT = "current",
}

export const BookSlider = () => {
    const { state, isLoading } = useCalendarContext();
    const { t, i18n } = useTranslation();

    const months = t("months", { returnObjects: true }) as string[];
    const weekdays = t("calendar.weekdays", { returnObjects: true }) as string[];

    const { data, requestEventHandler, localLoading } = useEvent(months, weekdays, t);

    const [direction, setDirection] = useState<Direction>(Direction.CURRENT);
    const [flipSlide, setFlipSlide] = useState<any>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [pendingDirection, setPendingDirection] = useState<Direction | null>(null);
    const pageFlipSound = useRef<HTMLAudioElement | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const sliderRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!pendingDirection) return;

        requestEventHandler(i18n.language, pendingDirection).finally(() => {
            setIsFlipping(false);
            setDirection(Direction.CURRENT);
            setPendingDirection(null);
        });
    }, [pendingDirection, i18n.language]);

    // Handle touch events for swipe functionality
    const handleTouchStart = useCallback((e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!touchStartX.current) return;

        touchEndX.current = e.changedTouches[0].clientX;

        // Calculate swipe distance
        const swipeDistance = touchEndX.current - touchStartX.current;

        // If swipe distance is significant enough (more than 50px)
        if (Math.abs(swipeDistance) > 50) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                handleFlip(Direction.LEFT);
            } else {
                // Swipe left - go to next
                handleFlip(Direction.RIGHT);
            }
        }

        // Reset touch coordinates
        touchStartX.current = null;
        touchEndX.current = null;
    }, []);

    // Add and remove touch event listeners
    useEffect(() => {
        const currentSlider = document.querySelector('.book-slider');
        if (currentSlider) {
            sliderRef.current = currentSlider as HTMLElement;
            currentSlider.addEventListener('touchstart', handleTouchStart);
            currentSlider.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (sliderRef.current) {
                sliderRef.current.removeEventListener('touchstart', handleTouchStart);
                sliderRef.current.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [handleTouchStart, handleTouchEnd]);

    /* ---------- initial + date change fetch ---------- */
    useEffect(() => {
        requestEventHandler(i18n.language);
    }, [state.date, i18n.language]);


    /* ---------- initialize page flip sound ---------- */
    useEffect(() => {
        pageFlipSound.current = new Audio('/assets/sounds/page-flip.mp3');
        return () => {
            if (pageFlipSound.current) {
                pageFlipSound.current.pause();
                pageFlipSound.current = null;
            }
        };
    }, []);

    /* ---------- preload images ---------- */
    useEffect(() => {
        if (!data) return;

        [data.prev, data.current, data.next]
            .map(p => p?.image)
            .filter(Boolean)
            .forEach(src => {
                const img = new Image();
                img.src = src;
            });
    }, [data]);

    useEffect(() => {
        document.body.style.overflow = isFlipping ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "hidden";
        };
    }, [isFlipping]);

    const preloadImage = (src: string): Promise<void> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = reject;
        });

    /* ---------- check if month is changing ---------- */
    const isMonthChanging = (dir: Direction): boolean => {
        if (!data) return false;

        const currentDate = new Date(data.current.date.iso);
        const targetDate = dir === Direction.RIGHT 
            ? new Date(data.next.date.iso) 
            : new Date(data.prev.date.iso);

        return currentDate.getMonth() !== targetDate.getMonth() || 
               currentDate.getFullYear() !== targetDate.getFullYear();
    };

    /* ---------- flip handler ---------- */
    const handleFlip = async (dir: Direction) => {
        if (isFlipping || localLoading || !data) return;

        // Play page flip sound
        if (pageFlipSound.current) {
            pageFlipSound.current.currentTime = 0;
            await pageFlipSound.current.play();
        }

        const nextSlide = data[dir];
        if (!nextSlide?.image) return;

        if (isMonthChanging(dir)) {
            setPendingDirection(dir);
            return;
        }

        // 🔒 SNAPSHOT
        const snapshot = {
            ...data.current,
            image: data.current.image,
            date: { ...data.current.date }
        };

        // Preload the next image before flipping
        try {
            if (nextSlide.image) {
                await preloadImage(import.meta.env.VITE_API_BASE_URL + nextSlide.image);
            }
        } catch (error) {
            console.error("Failed to preload image:", error);
        }

        setIsFlipping(true);
        setDirection(dir);
        setFlipSlide(snapshot);

        setTimeout(async () => {
            setFlipSlide(null);
            await requestEventHandler(i18n.language, dir);
            setIsFlipping(false);
            setDirection(Direction.CURRENT);
            pageFlipSound.current.pause();
            pageFlipSound.current.currentTime = 0;
        }, 1000);
    };

    // Show a placeholder when data is null but loading is in progress
    if (!data) {
        return (
            <section className="book-slider">
                <div className="book-stage">
                    <button className="nav left" disabled>‹</button>
                    <article className="page static">
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%' 
                        }}>
                            <p>Loading content...</p>
                        </div>
                    </article>
                    <button className="nav right" disabled>›</button>
                </div>
            </section>
        );
    }
    const isFound = data[direction].title !== null;

    return (
        <>
            <ShareModal
                open={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                url={`${window.location.origin}/${data.current.date.iso}`}
                title={data.current.title || t("noEventFound")}
                description={data.current.text || t("noEventFoundDesc")}
                image={data.current.image ? `${import.meta.env.VITE_API_BASE_URL}${data.current.image}` : '/assets/nothing-found.svg'}
            />

            <section className="book-slider">
                <div className="book-stage">
                    <button
                        className="nav left"
                        onClick={() => handleFlip(Direction.LEFT)}
                        disabled={localLoading}
                    >
                        ‹
                    </button>

                    {/* STATIC PAGE */}
                    <article className="page static">
                        <PageHeader
                            date={data[direction].date}
                            onShare={() => setIsShareOpen(true)}
                        />



                        {!isFound ? (
                                <div className="page-content" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}>
                                    <img style={{
                                        width: "20%",
                                        maxHeight: "150px",
                                        objectFit: "contain",
                                    }} src={'/assets/nothing-found.svg'} />
                                    <h2 style={{textAlign: 'center'}}>{data[direction].title ?? t("noEventFound")}</h2>
                                    <p style={{textAlign: 'center'}}>{data[direction].text ?? t("noEventFoundDesc")}</p>
                                </div>
                        ) : (
                            <div className="page-content">
                                <img src={import.meta.env.VITE_API_BASE_URL + data[direction].image} />
                                <h2>{data[direction].title}</h2>
                                <p>{data[direction].text}</p>
                            </div>
                        )}
                    </article>

                    {/* FLIP PAGE */}
                    {flipSlide && (
                        <article className={`page flip ${direction} animate`}>
                            <PageHeader
                                date={flipSlide.date}
                                onShare={() => setIsShareOpen(true)}
                            />
                            <div
                                className="page-content"
                                style={
                                    !flipSlide?.title
                                        ? {
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }
                                        : {}
                                }
                            >
                            {!flipSlide.title ? (
                                        <>
                                            <img style={{
                                                width: "20%",
                                                maxHeight: "150px",
                                                objectFit: "contain",
                                            }} src={'/assets/nothing-found.svg'} />
                                            <h2 style={{textAlign: 'center'}}>{flipSlide.title ?? t("noEventFound")}</h2>
                                            <p style={{textAlign: 'center'}}>{flipSlide.text ?? t("noEventFoundDesc")}</p>
                                        </>
                                    ) : (
                                        <>
                                            <img src={import.meta.env.VITE_API_BASE_URL + flipSlide.image} />
                                            <h2>{flipSlide.title}</h2>
                                            <p>{flipSlide.text}</p>
                                        </>
                                    )}
                                </div>
                        </article>
                    )}

                    <button
                        className="nav right"
                        onClick={() => handleFlip(Direction.RIGHT)}
                        disabled={localLoading}
                    >
                        ›
                    </button>
                </div>
            </section>
        </>
    );

};
