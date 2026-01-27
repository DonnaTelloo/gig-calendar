import './style.css';

type YearInfoModalProps = {
    open: boolean;
    yearInfo: string;
    year: number;
    onClose: () => void;
};

export const YearInfoModal = ({ open, yearInfo, year, onClose }: YearInfoModalProps) => {
    if (!open) return null;

    return (
        <div className="yearinfo-overlay">
            <div className="yearinfo-modal">
                <button className="close-btn" onClick={onClose}>×</button>

                <h3>{year} წლის მიმოხილვა</h3>

                <div 
                    className="yearinfo-content"
                    dangerouslySetInnerHTML={{ __html: yearInfo }}
                />
            </div>
        </div>
    );
};
