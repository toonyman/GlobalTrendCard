import Link from 'next/link';

export default function Header() {
    return (
        <header role="banner">
            <div className="header-content">
                <h1 className="logo">
                    <span style={{ color: 'var(--accent-primary)' }}>◉</span> GLOBAL TRENDS
                </h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <nav role="navigation" aria-label="Main navigation">
                        <div className="main-nav">
                            <Link href="/" className="nav-link active">Home</Link>
                            <Link href="/about" className="nav-link">About</Link>
                        </div>
                    </nav>

                    <div className="share-buttons">
                        <button className="share-btn" aria-label="Share on Meta/Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.15L15.71 14.96H13.38V21.96C17.61 21.57 21 17.48 21 12.06C21 6.53 16.5 2.04 12 2.04Z" />
                            </svg>
                        </button>
                        <button className="share-btn" aria-label="Share on X/Twitter">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </button>
                        <button className="share-btn" aria-label="Copy Link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
