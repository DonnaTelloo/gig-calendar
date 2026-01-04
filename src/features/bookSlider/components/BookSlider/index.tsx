import { useState } from 'react';
import { slides } from '../../data/slides';
import './index.css';
import ShareIcon from '../../../../assets/share.svg';

export const BookSlider = () => {
    const [index, setIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const current = slides[index];
    const nextSlide = slides[(index + 1) % slides.length];
    const prevSlide = slides[(index - 1 + slides.length) % slides.length];

    const flip = (dir: 'next' | 'prev') => {
        if (isFlipping) return;

        setDirection(dir);
        setIsFlipping(true);

        setTimeout(() => {
            setIndex((i) =>
                dir === 'next'
                    ? (i + 1) % slides.length
                    : (i - 1 + slides.length) % slides.length
            );
            setIsFlipping(false);
        }, 1000);
    };

    return (
        <section className="book-slider">
            {/* HEADER */}
            <header className="book-header">
                <div className="date">
                    <div className="day">{current.date.day}</div>
                    <div>
                        <div className="month">{current.date.month}</div>
                        <div className="weekday">{current.date.weekday}</div>
                    </div>
                </div>

                <button className="share-btn">
                    <img src={ShareIcon} alt="" />
                    Share
                </button>
            </header>


            {/* BOOK */}
            <div className="book-stage">
                <button className="nav left" onClick={() => flip('prev')}>‹</button>

                {/* LEFT PAGE */}
                <article className="page static">
                    <img src={direction === 'next' ? current.image : prevSlide.image} />
                    <h2>{direction === 'next' ? current.title : prevSlide.title}</h2>
                    <p>{direction === 'next' ? current.text : prevSlide.text}</p>
                </article>

                {/* FLIPPING PAGE */}
                <article
                    className={`page flip ${direction} ${isFlipping ? 'animate' : ''}`}
                >
                    <img src={direction === 'next' ? nextSlide.image : current.image} />
                    <h2>{direction === 'next' ? nextSlide.title : current.title}</h2>
                    <p>{direction === 'next' ? nextSlide.text : current.text}</p>
                </article>
                <button className="nav right" onClick={() => flip('next')}>›</button>
            </div>
        </section>
    );
};
