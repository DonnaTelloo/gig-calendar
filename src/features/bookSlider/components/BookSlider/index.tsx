import { useState } from 'react';
import { slides } from '../../data/slides';
import './index.css';
import ShareIcon from '../../../../assets/share.svg';

export const BookSlider = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev'>('next');

    const slide = slides[index];

    const next = () => {
        setDirection('next');
        setIndex((i) => (i + 1) % slides.length);
    };

    const prev = () => {
        setDirection('prev');
        setIndex((i) => (i - 1 + slides.length) % slides.length);
    };

    return (
        <section className="book-slider">
            {/* Header */}
            <header className="book-header">
                <div className="date">
                    <div className="day">{slide.date.day}</div>
                    <div>
                        <div className="month">{slide.date.month}</div>
                        <div className="weekday">{slide.date.weekday}</div>
                    </div>
                </div>

                <button className="share-btn">
                    <img src={ShareIcon} alt=""/>
                    Share
                </button>
            </header>

            {/* Slider */}
            <div className="book-stage">
                {/*<button className="nav left" onClick={prev}>‹</button>*/}

                <article className={`page ${direction}`}>
                    <img src={slide.image} alt="" />
                    <h2>{slide.title}</h2>
                    <p>{slide.text}</p>
                </article>

                {/*<button className="nav right" onClick={next}>›</button>*/}
            </div>
        </section>
    );
};
