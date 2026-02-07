import { TrendItem } from '@/utils/trendData';
import React from 'react';

interface DailyBriefingProps {
    trends: TrendItem[];
}

export default function DailyBriefing({ trends }: DailyBriefingProps) {
    // Basic sorting logic from original main.js
    const topTrends = [...trends].sort((a, b) => b.volume - a.volume).slice(0, 3);
    if (topTrends.length < 1) return null;

    const top = topTrends[0];
    const dominantCat = top.category;

    return (
        <div className="daily-briefing-v2">
            {/* Left: Top Trend Card */}
            <div className="briefing-card-v2 trend-hero-card">
                <div className="card-bg-glow" style={{ backgroundColor: top.color }}></div>
                <div className="card-top">
                    <span className="badge-v2 hot">Trending NOW</span>
                    <span className="cat-pill" style={{ borderColor: top.color, color: top.color }}>
                        {dominantCat.toUpperCase()}
                    </span>
                </div>

                <div className="card-mid">
                    <h2 className="hero-trend-name">{top.name}</h2>
                    <div className="hero-trend-stats">
                        <div className="stat-v2">
                            <span className="stat-v2-label">Search Volume</span>
                            <span className="stat-v2-value">{(top.volume / 1000).toLocaleString()}K+</span>
                        </div>
                        <div className="stat-v2">
                            <span className="stat-v2-label">Daily Growth</span>
                            <span className="stat-v2-value" style={{ color: top.change >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                {top.change > 0 ? '▲' : '▼'} {Math.abs(top.change)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card-bottom">
                    <a href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(top.name)}`}
                        target="_blank"
                        className="explorer-link">
                        Market Analysis & Insights ↗
                    </a>
                </div>
            </div>

            {/* Right: AI Insight Card */}
            <div className="briefing-card-v2 insight-hero-card">
                <div className="insight-header-v2">
                    <div className="insight-icon-pulse">✨</div>
                    <h3>AI TREND INTELLIGENCE</h3>
                </div>

                <div className="insight-list-v2">
                    <div className="insight-entry">
                        <div className="entry-marker"></div>
                        <p>
                            <strong>Market Leadership:</strong> The {dominantCat} sector dominates global search volume today,
                            primarily fueled by interest in <strong>{top.name}</strong>.
                        </p>
                    </div>
                    <div className="insight-entry">
                        <div className="entry-marker"></div>
                        <p>
                            <strong>Rising Momentum:</strong> <strong>{topTrends[1].name}</strong> is gaining significant traction
                            with a {topTrends[1].change}% increase in metadata engagement.
                        </p>
                    </div>
                    <div className="insight-entry">
                        <div className="entry-marker"></div>
                        <p>
                            <strong>Cyclic Patterns:</strong> <strong>{topTrends[2].name}</strong> continues to show stable
                            resilience across {topTrends[2].region} markets.
                        </p>
                    </div>
                </div>

                <div className="insight-footer-v2">
                    <span className="data-source">Real-time Analysis based on Global Signals</span>
                </div>
            </div>
        </div>
    );
}
