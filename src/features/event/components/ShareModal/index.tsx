import './style.css';
import { useState, useEffect } from 'react';

type ShareModalProps = {
    open: boolean;
    url: string;
    onClose: () => void;
    title?: string;
    description?: string;
    image?: string;
};

const Logo = () => {
    return (
        <svg width="265" height="70" viewBox="0 0 270 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g className="typography" width="300">
                <path
                    d="M250.05 16.03C242.47 16.03 235.6 22.06 235.6 31.15C235.6 43.72 245.48 47.62 245.48 47.62L246.61 46.29C244.26 42.21 243.24 35.91 243.24 31.15C243.24 24.32 245.02 18.45 250.06 18.45C255.1 18.45 256.82 24.05 256.82 31.15C256.82 35.92 255.8 42.22 253.45 46.29L254.58 47.62C254.58 47.62 264.46 43.72 264.46 31.15C264.46 22.06 257.65 16.03 250.07 16.03H250.05Z"
                    fill="black"></path>
                <path
                    d="M99.77 22.56C99.77 20.78 98.39 19.49 96.11 19.69C94.81 19.81 93.68 20.43 93.68 20.43L92.7 19.23C92.7 19.23 95.5 16.5 99.48 16.06C102.82 15.69 105.84 16.97 106.21 20.35C106.74 25.09 99.7 27.81 96.05 29.62C92.14 31.56 80.79 36.81 80.79 36.81C80.79 36.81 86.04 37.74 86.04 42.48C86.04 46.01 82.48 48 79.13 48C74.95 48 71.98 45.08 71.98 45.08L72.93 44.05C72.93 44.05 74.91 44.96 76.55 44.96C79.04 44.96 80.22 43.64 80.22 42.18C80.22 39.6 77.4 38.62 75.08 38.16L74.67 36.81C74.67 36.81 92.3 28.59 95.42 27.13C99.25 25.34 99.75 24.01 99.75 22.55L99.77 22.56Z"
                    fill="black"></path>
                <path
                    d="M87.1 34.18C87.1 34.18 85.95 31.99 84.77 29.38C84.2 28.11 83.78 27.21 82.88 25.25C81.28 21.77 80.03 20.61 78.43 20.61C76.95 20.61 75.81 21.65 75.43 23.52C75.04 25.44 74.92 26.18 74.92 26.18L73.24 26.45L74.32 17.23C74.32 17.23 78.82 16.35 80.84 16.35C84.65 16.35 86.85 17.27 89.8 22.75C90.68 24.38 90.77 24.67 91.97 27.07C92.94 29.02 94.12 31.63 94.12 31.63C97 37.53 99.84 44.31 102.54 44.31C104.02 44.31 104.68 42.93 104.63 41.66C104.57 40.14 104.15 39.2 103.49 37.99C102.92 36.94 102.27 35.79 102.27 35.79L103.55 34.83L109.02 41.79C109.02 41.79 105.9 47.73 99.9 47.73C97.18 47.73 93.85 47.3 90.39 40.56C87.42 34.77 87.11 34.18 87.11 34.18H87.1Z"
                    fill="black"></path>
                <path
                    d="M182.81 16.03C175.23 16.03 168.36 22.06 168.36 31.15C168.36 43.72 178.24 47.62 178.24 47.62L179.37 46.29C177.02 42.21 176 35.91 176 31.15C176 24.32 177.78 18.45 182.82 18.45C187.86 18.45 189.58 24.05 189.58 31.15C189.58 35.92 188.56 42.22 186.21 46.29L187.34 47.62C187.34 47.62 197.22 43.72 197.22 31.15C197.22 22.06 190.41 16.03 182.83 16.03H182.81Z"
                    fill="black"></path>
                <path
                    d="M141.3 34.09L143.07 34.6C143.07 34.6 144.57 45.51 152.16 45.51C156.55 45.51 158.89 41.78 158.89 38.26C158.89 35.42 157.77 33.1101 152.75 29.42C149.43 26.98 146.31 25.09 146.31 21.21C146.31 17.96 149.84 16.05 149.84 16.05L150.43 16.47C150.43 16.47 149.78 17.13 149.78 17.99C149.78 19.8 152.65 21.1501 156.08 23.2001C158.02 24.35 165.91 28.15 165.91 35.34C165.91 42.89 159.92 47.75 152.26 47.75C147.62 47.75 142.9 46.0201 140.17 43.9901L141.29 34.09H141.3Z"
                    fill="black"></path>
                <path
                    d="M123.94 16.03C116.36 16.03 109.49 22.06 109.49 31.15C109.49 43.72 119.37 47.62 119.37 47.62L120.5 46.29C118.15 42.21 117.13 35.91 117.13 31.15C117.13 24.32 118.91 18.45 123.95 18.45C128.99 18.45 130.71 24.05 130.71 31.15C130.71 35.92 129.69 42.22 127.34 46.29L128.47 47.62C128.47 47.62 138.35 43.72 138.35 31.15C138.35 22.06 131.54 16.03 123.96 16.03H123.94Z"
                    fill="black"></path>
                <path
                    d="M225.88 22.56C225.88 20.78 224.5 19.49 222.22 19.69C220.92 19.81 219.79 20.43 219.79 20.43L218.81 19.23C218.81 19.23 221.61 16.5 225.59 16.06C228.93 15.69 231.95 16.97 232.32 20.35C232.85 25.09 225.81 27.81 222.16 29.62C218.25 31.56 206.9 36.81 206.9 36.81C206.9 36.81 212.15 37.74 212.15 42.48C212.15 46.01 208.59 48 205.24 48C201.06 48 198.09 45.08 198.09 45.08L199.04 44.05C199.04 44.05 201.02 44.96 202.66 44.96C205.15 44.96 206.33 43.64 206.33 42.18C206.33 39.6 203.51 38.62 201.19 38.16L200.78 36.81C200.78 36.81 218.41 28.59 221.53 27.13C225.36 25.34 225.86 24.01 225.86 22.55L225.88 22.56Z"
                    fill="black"></path>
                <path
                    d="M213.21 34.18C213.21 34.18 212.06 31.99 210.88 29.38C210.31 28.11 209.89 27.21 208.99 25.25C207.39 21.77 206.14 20.61 204.54 20.61C203.06 20.61 201.92 21.65 201.54 23.52C201.15 25.44 201.03 26.18 201.03 26.18L199.35 26.45L200.43 17.23C200.43 17.23 204.93 16.35 206.95 16.35C210.76 16.35 212.96 17.27 215.91 22.75C216.79 24.38 216.88 24.67 218.08 27.07C219.05 29.02 220.23 31.63 220.23 31.63C223.11 37.53 225.95 44.31 228.65 44.31C230.13 44.31 230.79 42.93 230.74 41.66C230.68 40.14 230.26 39.2 229.6 37.99C229.03 36.94 228.38 35.79 228.38 35.79L229.66 34.83L235.13 41.79C235.13 41.79 232.01 47.73 226.01 47.73C223.29 47.73 219.96 47.3 216.5 40.56C213.53 34.77 213.22 34.18 213.22 34.18H213.21Z"
                    fill="black"></path>
            </g>
            <g className="leaves">
                <path
                    d="M40.51 8.60996L40.89 8.97996C40.89 8.97996 37.35 14.76 32.44 14.92C28.32 15.06 26.62 12.99 22.94 9.32996C19.54 5.95996 15.57 5.23996 13.48 7.31996L13.1 6.93996C13.1 6.93996 16.77 0.399961 21.86 0.0299609C26.62 -0.320039 28.82 2.80996 30.73 4.71996C32.95 6.93996 36.66 10.34 40.51 8.61996V8.60996Z"
                    fill="#FF0000"></path>
                <path
                    d="M21.48 9.43994H22.01C22.01 9.43994 23.59 16.0199 20.24 19.6099C17.43 22.6199 14.76 22.3599 9.57002 22.3799C4.78002 22.3999 1.47002 24.6999 1.46002 27.6399H0.92002C0.92002 27.6399 -1.11998 20.4199 2.22002 16.5599C5.34002 12.9499 9.11002 13.5999 11.81 13.5999C14.95 13.5999 19.98 13.3799 21.48 9.43994Z"
                    fill="#FF0000"></path>
                <path
                    d="M8.61002 23.49L8.98002 23.11C8.98002 23.11 14.76 26.65 14.92 31.56C15.06 35.68 12.99 37.38 9.33002 41.06C5.96002 44.46 5.24002 48.43 7.32002 50.52L6.94002 50.9C6.94002 50.9 0.400022 47.23 0.030022 42.14C-0.319978 37.38 2.81002 35.18 4.72002 33.27C6.94002 31.05 10.34 27.34 8.62002 23.49H8.61002Z"
                    fill="#FF0000"></path>
                <path
                    d="M9.44 42.52V41.99C9.44 41.99 16.02 40.41 19.61 43.76C22.62 46.57 22.36 49.24 22.38 54.43C22.4 59.22 24.7 62.53 27.64 62.54V63.08C27.64 63.08 20.42 65.12 16.56 61.78C12.95 58.66 13.6 54.89 13.6 52.19C13.6 49.05 13.38 44.02 9.44 42.52Z"
                    fill="#FF0000"></path>
                <path
                    d="M23.49 55.3899L23.11 55.0199C23.11 55.0199 26.65 49.2399 31.56 49.0799C35.68 48.9399 37.38 51.0099 41.06 54.6699C44.46 58.0399 48.43 58.7599 50.52 56.6799L50.9 57.0599C50.9 57.0599 47.23 63.6099 42.15 63.9799C37.39 64.3299 35.19 61.1999 33.28 59.2899C31.06 57.0699 27.35 53.6699 23.5 55.3899H23.49Z"
                    fill="#FF0000"></path>
                <path
                    d="M42.52 54.56H41.99C41.99 54.56 40.41 47.98 43.76 44.39C46.57 41.38 49.24 41.64 54.43 41.62C59.22 41.6 62.53 39.3 62.54 36.36H63.08C63.08 36.36 65.12 43.58 61.78 47.44C58.66 51.05 54.89 50.4 52.19 50.4C49.05 50.4 44.02 50.62 42.52 54.56Z"
                    fill="#FF0000"></path>
                <path
                    d="M55.39 40.51L55.02 40.89C55.02 40.89 49.24 37.35 49.08 32.44C48.94 28.32 51.01 26.62 54.67 22.94C58.04 19.54 58.76 15.57 56.68 13.48L57.06 13.1C57.06 13.1 63.61 16.77 63.98 21.85C64.33 26.61 61.2 28.81 59.29 30.72C57.07 32.94 53.67 36.65 55.39 40.5V40.51Z"
                    fill="#FF0000"></path>
                <path
                    d="M54.56 21.48V22.01C54.56 22.01 47.98 23.59 44.39 20.24C41.38 17.43 41.64 14.76 41.62 9.57002C41.6 4.78002 39.3 1.47002 36.36 1.46002V0.92002C36.36 0.92002 43.58 -1.11998 47.44 2.22002C51.05 5.34002 50.4 9.11002 50.4 11.81C50.4 14.95 50.62 19.98 54.56 21.48Z"
                    fill="#FF0000"></path>
            </g>
        </svg>
    )
}

export const ShareModal = ({ open, url, onClose, title, description, image }: ShareModalProps) => {
    const [copyNotification, setCopyNotification] = useState<string | null>(null);

    // Clear notification after 3 seconds
    useEffect(() => {
        if (copyNotification) {
            const timer = setTimeout(() => {
                setCopyNotification(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [copyNotification]);

    // Add Open Graph meta tags when modal is opened
    useEffect(() => {
        if (open) {
            // Remove any existing OG meta tags
            document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());

            // Add new OG meta tags
            const metaTags = [
                { property: 'og:url', content: url },
                { property: 'og:type', content: 'website' },
                { property: 'og:title', content: title || 'Historical Event' },
                { property: 'og:description', content: description || 'Check out this historical event' },
                { property: 'og:image', content: image || `${window.location.origin}/assets/nothing-found.svg` }
            ];

            metaTags.forEach(tag => {
                const meta = document.createElement('meta');
                meta.setAttribute('property', tag.property);
                meta.setAttribute('content', tag.content);
                document.head.appendChild(meta);
            });
        }

        // Cleanup function to remove OG meta tags when modal is closed
        return () => {
            document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());
        };
    }, [open, url, title, description, image]);

    if (!open) return null;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopyNotification('Link has been copied to clipboard');
        } catch (error) {
            console.error('Failed to copy:', error);
            setCopyNotification('Failed to copy to clipboard');
        }
    };

    const shareToInstagramStory = async () => {

            // ✅ Web Share API (mobile browsers)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text: description,
                        url,
                    });
                } catch (err) {
                    console.warn("Share cancelled", err);
                }
                return;
            }

            // ❌ Fallback (desktop or unsupported browsers)
            try {
                await navigator.clipboard.writeText(url);
                // setError("Link copied. Open Instagram and paste it into your story.");
            } catch {
                // setError("Sharing not supported on this browser.");
            }
        };

    return (
        <div className="share-overlay" onClick={onClose}>
            <div
                className="share-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-btn" onClick={onClose}>×</button>

                <div className="logo">
                    <Logo />
                </div>

                <h3>Share a historical fact</h3>
                <p>The fact you share will be the best way to promote it</p>

                <div className="share-input">
                    <input value={url} readOnly />
                    <button onClick={copyToClipboard}>📋</button>
                </div>
                {copyNotification && (
                    <div className="copy-notification">
                        {copyNotification}
                    </div>
                )}

                <div className="share-buttons">
                    <button 
                        className="instagram-story-button"
                        onClick={shareToInstagramStory}
                    >
                        Share as Story on Instagram
                    </button>
                </div>
            </div>
        </div>
    );
};
