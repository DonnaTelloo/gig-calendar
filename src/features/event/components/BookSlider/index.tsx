import { useEffect, useState, useRef, useCallback } from "react";
import "./index.css";
import ShareIcon from "../../../../../public/assets/share.svg";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import useEvent from "../../hooks/useEvent";
import { ShareModal } from "../ShareModal";
import { useTranslation } from "react-i18next";
import { useCalendarContext } from "../../../../context";
import PageHeader from "./micro-components/article-header.component.tsx";
import {Helmet} from 'react-helmet'
import FullscreenImage from "../../../../components/common/FullscreenImage";

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
    const touchMoveX = useRef<number | null>(null);
    const isSwiping = useRef<boolean>(false);
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
        isSwiping.current = false;
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!touchStartX.current) return;

        touchMoveX.current = e.touches[0].clientX;

        // Calculate current swipe distance
        const currentSwipeDistance = touchMoveX.current - touchStartX.current;

        // Mark as swiping if the movement is significant (more than 10px)
        if (Math.abs(currentSwipeDistance) > 10) {
            isSwiping.current = true;
        }

        // Prevent default to avoid scrolling while swiping horizontally
        if (isSwiping.current && Math.abs(currentSwipeDistance) > 30) {
            e.preventDefault();
        }
    }, []);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!touchStartX.current) return;

        touchEndX.current = e.changedTouches[0].clientX;

        // Calculate swipe distance
        const swipeDistance = touchEndX.current - touchStartX.current;

        // If swipe distance is significant enough (more than 50px) and we're in a swiping state
        if (Math.abs(swipeDistance) > 50 || isSwiping.current) {
            if (swipeDistance > 0) {
                // Swipe right - go to previous
                handleFlip(Direction.LEFT);
            } else {
                // Swipe left - go to next
                handleFlip(Direction.RIGHT);
            }
        }

        // Reset touch coordinates and state
        touchStartX.current = null;
        touchEndX.current = null;
        touchMoveX.current = null;
        isSwiping.current = false;
    }, []);

    // Add and remove touch event listeners
    useEffect(() => {
        const currentSlider = document.querySelector('.book-slider');
        if (currentSlider) {
            sliderRef.current = currentSlider as HTMLElement;
            currentSlider.addEventListener('touchstart', handleTouchStart, { passive: false });
            currentSlider.addEventListener('touchmove', handleTouchMove, { passive: false });
            currentSlider.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        return () => {
            if (sliderRef.current) {
                sliderRef.current.removeEventListener('touchstart', handleTouchStart);
                sliderRef.current.removeEventListener('touchmove', handleTouchMove);
                sliderRef.current.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

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
        // Hide all scrollbars during flipping
        if (isFlipping) {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "hidden"; // Also hide scrollbars on html element
        } else {
            document.body.style.overflowX = "auto";
            document.body.style.overflowY = "auto";
            document.documentElement.style.overflowX = "auto";
            document.documentElement.style.overflowY = "auto";
        }

        return () => {
            document.body.style.overflow = "hidden";
            document.documentElement.style.overflow = "auto";
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

        setFlipSlide(snapshot);
        setDirection(dir);
        setIsFlipping(true);

        setTimeout(async () => {
            setFlipSlide(null);
            await requestEventHandler(i18n.language, dir);
            setIsFlipping(false);
            setDirection(Direction.CURRENT);
            pageFlipSound.current.pause();
            pageFlipSound.current.currentTime = 0;
        }, 1000);
    };

    console.log(data)

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
    const isFound = data[direction].image !== "/assets/nothing-found.svg";

    console.log(data[direction])

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
                        {!isFound ? (
                                <div className="page-content" style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}>
                                    <img style={{
                                        width: "50%",
                                        maxHeight: "150px",
                                        objectFit: "contain",
                                    }} src={'/assets/nothing-found.svg'} />
                                    {/*<h2 style={{textAlign: 'center'}}>{data[direction].title ?? t("noEventFound")}</h2>*/}
                                    {/*<p style={{textAlign: 'center'}}>{data[direction].text ?? t("noEventFoundDesc")}</p>*/}
                                </div>
                        ) : (
                            <div className="page-content">
                                <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <img src={import.meta.env.VITE_API_BASE_URL + data[direction].image} />
                                    <div className="image-controls">
                                        <button 
                                            className="image-control-button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsShareOpen(true);
                                            }}
                                        >
                                            <img src={ShareIcon} alt="Share" />
                                        </button>
                                        <FullscreenImage 
                                            src={import.meta.env.VITE_API_BASE_URL + data[direction].image}
                                            alt={data[direction].title || "Image"}
                                        />
                                    </div>
                                </div>
                                {/*<h2>{data[direction].title}</h2>*/}
                                {/*<p>{data[direction].text}</p>*/}
                            </div>
                        )}
                    </article>

                    {/* FLIP PAGE */}
                    {flipSlide && (
                        <article className={`page flip ${direction} animate`} style={{background: window.getComputedStyle(document.body).backgroundColor}}>
                            {/*<PageHeader*/}
                            {/*    date={flipSlide.date}*/}
                            {/*    onShare={() => setIsShareOpen(true)}*/}
                            {/*/>*/}
                            <div
                                className="page-content"
                                style={
                                    flipSlide?.image == "/assets/nothing-found.svg"
                                        ? {
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }
                                        : {}
                                }
                            >
                            {flipSlide.image == "/assets/nothing-found.svg" ? (
                                        <>
                                            <img style={{
                                                width: "50%",
                                                maxHeight: "150px",
                                                objectFit: "contain",
                                            }} src={'/assets/nothing-found.svg'} />
                                            {/*<h2 style={{textAlign: 'center'}}>{flipSlide.title ?? t("noEventFound")}</h2>*/}
                                            {/*<p style={{textAlign: 'center'}}>{flipSlide.text ?? t("noEventFoundDesc")}</p>*/}
                                        </>
                                    ) : (
                                        <div style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                            <img src={import.meta.env.VITE_API_BASE_URL + flipSlide.image} />
                                            <div className="image-controls">
                                                <button 
                                                    className="image-control-button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsShareOpen(true);
                                                    }}
                                                >
                                                    <img src={ShareIcon} alt="Share" />
                                                </button>
                                                <FullscreenImage 
                                                    src={import.meta.env.VITE_API_BASE_URL + flipSlide.image}
                                                    alt={flipSlide.title || "Image"}
                                                />
                                            </div>
                                        </div>
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
