import { useEffect, useRef, useState } from 'react';
import './index.css';
import ShareIcon from '../../../../../public/assets/share.svg';
import useEvent from "../../hooks/useEvent";
import {ShareModal} from "../ShareModal";
import {useTranslation} from "react-i18next";
import {useCalendarContext} from "../../../../context";

enum Direction {
    LEFT = 'prev',
    RIGHT = 'next',
    CURRENT = 'current',
}

export const BookSlider = () => {
    const { state } = useCalendarContext();

    const { requestEventHandler, data, isLoading } = useEvent();
    const [direction, setDirection] = useState<Direction>(Direction.CURRENT);
    const [flipSlide, setFlipSlide] = useState<any>(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    const {t} = useTranslation();

    useEffect(() => {
        requestEventHandler();
    }, [state.date]);

    useEffect(() => {
        if (!data) return;

        const images = [
            data.prev?.image,
            data.current?.image,
            data.next?.image,
        ].filter(Boolean);

        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }, [data]);


    const preloadImage = (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = reject;
        });
    };

    const handleFlip = async (dir: Direction) => {
        if (isFlipping) return;
        const nextSlide = data[dir];

        await preloadImage(nextSlide.image);

        setIsFlipping(true);

        setDirection(dir);
        setFlipSlide(data.current);

        setTimeout(async () => {
            setFlipSlide(null);
            await requestEventHandler(dir);
            setIsFlipping(false);
            setDirection(Direction.CURRENT);
        }, 1000);
    };

    if (!data) return null;

    return (
        <>
            <ShareModal
                open={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                url={`https://www.gig.ge/event/${data.current.date.iso}`}
            />
            <section className="book-slider">
                <header className="book-header">
                    <div className="date">
                        <div className="day">{data.current.date.day}</div>
                        <div>
                            <div className="month">{data.current.date.month}</div>
                            <div className="weekday">{data.current.date.weekday}</div>
                        </div>
                    </div>

                    <button className="share-btn"   onClick={() => setIsShareOpen(true)}>
                        <img src={ShareIcon} alt=""/>
                        {t('share')}
                    </button>
                </header>
                <div className="book-stage">
                    <button className="nav left" onClick={() => handleFlip(Direction.LEFT)}>‹</button>

                    {/* STATIC PAGE: This is the "new" page that appears underneath */}
                    <article className="page static">
                        <img src={data[direction].image}/>
                        <h2>{data[direction].title}</h2>
                        <p>{data[direction].text}</p>
                    </article>

                    {flipSlide && (
                        <article className={`page flip ${direction} animate`}>
                            <div className="page-content">
                                <img src={flipSlide.image} alt=""/>
                                <h2>{flipSlide.title}</h2>
                                <p>{flipSlide.text}</p>
                            </div>
                        </article>
                    )}

                    <button className="nav right" onClick={() => handleFlip(Direction.RIGHT)}>›</button>
                </div>
            </section>
        </>
    );
};