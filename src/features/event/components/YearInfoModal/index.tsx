import './style.css';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {useTranslation} from "react-i18next";

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

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (open) {
            // Store original overflow style
            const originalOverflow = document.body.style.overflow;
            // Disable scrolling
            document.body.style.overflow = 'hidden';

            // Cleanup function to restore scrolling when modal closes
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [open]);

    // Handle checkbox change
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setDontShowAgain(checked);
        localStorage.setItem('dontShowYearInfoModal', checked.toString());
    };

    if (!open) return null;

    return createPortal(
        <div className="yearinfo-overlay">
            <div className="yearinfo-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                <h3>{yearInfo.description.split("sumelji")[0]}</h3>

                <div 
                    className="yearinfo-content"
                    dangerouslySetInnerHTML={{ __html: yearInfo.description.split("sumelji")[1] }}
                />

                {/*<div className="dont-show-again">*/}
                {/*    <input */}
                {/*        type="checkbox" */}
                {/*        id="dont-show-again" */}
                {/*        checked={dontShowAgain}*/}
                {/*        onChange={handleCheckboxChange}*/}
                {/*    />*/}
                {/*    <label htmlFor="dont-show-again">აღარ მაჩვენო</label>*/}
                {/*</div>*/}
            </div>
        </div>,
        document.body
    );
};
