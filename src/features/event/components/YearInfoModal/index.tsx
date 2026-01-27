import './style.css';
import { useState, useEffect } from 'react';

type YearInfoModalProps = {
    open: boolean;
    yearInfo: string;
    year: number;
    onClose: () => void;
};

export const YearInfoModal = ({ open, yearInfo, year, onClose }: YearInfoModalProps) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Check localStorage on component mount
    useEffect(() => {
        const savedPreference = localStorage.getItem('dontShowYearInfoModal');
        if (savedPreference === 'true') {
            setDontShowAgain(true);
            // If user previously chose not to show the modal, close it
            onClose();
        }
    }, [onClose]);

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setDontShowAgain(checked);
        localStorage.setItem('dontShowYearInfoModal', checked.toString());
    };

    if (!open) return null;

    return (
        <div className="yearinfo-overlay">
            <div className="yearinfo-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                <h3>{year} წლის მიმოხილვა</h3>

                <div 
                    className="yearinfo-content"
                    dangerouslySetInnerHTML={{ __html: yearInfo.description }}
                />

                <div className="dont-show-again">
                    <input 
                        type="checkbox" 
                        id="dont-show-again" 
                        checked={dontShowAgain}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="dont-show-again">აღარ მაჩვენო</label>
                </div>
            </div>
        </div>
    );
};
