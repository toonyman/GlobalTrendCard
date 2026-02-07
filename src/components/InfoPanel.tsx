import { TrendItem } from '@/utils/trendData';
import { useEffect, useState } from 'react';

interface InfoPanelProps {
    trend: TrendItem | null;
    onClose: () => void;
}

export default function InfoPanel({ trend, onClose }: InfoPanelProps) {
    const [news, setNews] = useState<{ title: string; source: string; time: string }[]>([]);
    const [loadingNews, setLoadingNews] = useState(false);

    useEffect(() => {
        if (trend) {
            // Lock background scroll
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            setLoadingNews(true);
            setNews([]);
            const timer = setTimeout(() => {
                setNews([
                    { title: `Why everyone is talking about ${trend.name} today`, source: "TechCrunch", time: "2 hours ago" },
                    { title: `Market Analysis: The impact of ${trend.name} on global sector`, source: "Bloomberg", time: "4 hours ago" },
                    { title: `Opinion: ${trend.name} marks a new era in ${trend.category}`, source: "The Verge", time: "5 hours ago" },
                    { title: `Breaking: Major updates regarding ${trend.name}`, source: "Reuters", time: "Just now" }
                ]);
                setLoadingNews(false);
            }, 800);

            return () => {
                clearTimeout(timer);
                // Restore scroll
                document.body.style.overflow = originalStyle;
            };
        }
    }, [trend]);

    if (!trend) return null;

    return (
        <>
            <div className="popup-overlay active" onClick={onClose}></div>
            <aside className="info-panel-v2 active" role="dialog" aria-hidden="false">
                <button className="close-btn-v2" onClick={onClose} aria-label="Close">&times;</button>

                <div className="info-main-container">
                    {/* Left side: Trend Hero */}
                    <div className="info-hero-section" style={{ backgroundColor: trend.color }}>
                        <div className="hero-glow-v2"></div>
                        <span className="hero-cat-v2">{trend.category.toUpperCase()}</span>
                        <h2 className="hero-title-v2">{trend.name}</h2>

                        <div className="hero-meta-horizontal">
                            <div className="meta-item-inline">
                                <span className="meta-val-v2">{(trend.volume / 1000).toLocaleString()}K+</span>
                                <span className="meta-lab-v2">Volume</span>
                            </div>
                            <div className="meta-item-inline">
                                <span className="meta-val-v2" style={{ color: '#fff', opacity: 0.9 }}>
                                    {trend.change > 0 ? '▲' : '▼'}{Math.abs(trend.change)}%
                                </span>
                                <span className="meta-lab-v2">24h Growth</span>
                            </div>
                        </div>

                        {/* Google Trends CTA Button */}
                        <a className="google-trends-cta-hero"
                            href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.name)}`}
                            target="_blank">
                            Google Trends ↗
                        </a>
                    </div>

                    {/* Right side: Content */}
                    <div className="info-details-section">
                        <div className="details-grid-v2">
                            <div className="stats-card-v2">
                                <h3 className="section-title-v2">
                                    <span className="title-marker" style={{ backgroundColor: trend.color }}></span>
                                    Data Points
                                </h3>
                                <div className="stat-rows-v2">
                                    <DataRow label="Region" value={trend.region} />
                                    <DataRow label="Peak Time" value={trend.peakTime} />
                                    <DataRow label="Velocity" value={trend.isHot ? 'High 🔥' : 'Steady'} />
                                </div>
                            </div>

                            <div className="news-card-v2">
                                <h3 className="section-title-v2">
                                    <span className="title-marker" style={{ backgroundColor: trend.color }}></span>
                                    Coverage
                                </h3>
                                <div className="news-container-fixed-v2">
                                    {loadingNews ? (
                                        <div className="news-loading-v2">
                                            <div className="spinner-v2"></div>
                                            <span>Sourcing news...</span>
                                        </div>
                                    ) : (
                                        <div className="news-list-v2">
                                            {news.length > 0 ? (
                                                news.map((item, i) => (
                                                    <a key={i}
                                                        href={`https://news.google.com/search?q=${encodeURIComponent(trend.name)}`}
                                                        target="_blank"
                                                        className="news-entry-v3">
                                                        <span className="news-entry-title">{item.title}</span>
                                                        <div className="news-entry-footer">
                                                            <span>{item.source}</span>
                                                            <span>{item.time}</span>
                                                        </div>
                                                    </a>
                                                ))
                                            ) : (
                                                <div className="empty-news-v2">No Headlines.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

function DataRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="data-row-v2">
            <span className="data-label-v2">{label}</span>
            <span className="data-value-v2">{value}</span>
        </div>
    );
}
