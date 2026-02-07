'use client';

import { useState, useMemo, useEffect } from 'react';
import { TrendItem } from '@/utils/trendData';
import DailyBriefing from './DailyBriefing';
import Treemap from './Treemap';
import InfoPanel from './InfoPanel';

interface DashboardProps {
    initialTrends: TrendItem[];
}

export default function Dashboard({ initialTrends }: DashboardProps) {
    const [trends, setTrends] = useState(initialTrends);
    const [category, setCategory] = useState('all');
    const [timeframe, setTimeframe] = useState('24h');
    const [selectedTrend, setSelectedTrend] = useState<TrendItem | null>(null);

    // Filtering Logic
    const visibleTrends = useMemo(() => {
        if (category === 'all') {
            // "All" view: Select top 10 from each category to ensure diversity (Total 50)
            const categories = ['tech', 'entertainment', 'sports', 'politics', 'business'];
            let mixedTrends: TrendItem[] = [];

            categories.forEach(cat => {
                const catTrends = trends
                    .filter(t => t.category === cat)
                    // Sort by volume DESC
                    .sort((a, b) => b.volume - a.volume)
                    // Take top 10
                    .slice(0, 10);
                mixedTrends = [...mixedTrends, ...catTrends];
            });

            // Optional: Sort the final mixed list by volume so big items are still prominent in layout logic, 
            // or keep them grouped? Treemap algorithm usually handles sorting or we pass as is.
            // Usually sorting by volume helps the squarified algorithm place big items top-left.
            return mixedTrends.sort((a, b) => b.volume - a.volume);

        } else {
            // Specific category view: Show Top 50 of that category
            return trends
                .filter(t => t.category === category)
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 50);
        }
    }, [trends, category]);

    // Time handler placeholder
    const handleTimeframeChange = (newTimeframe: string) => {
        setTimeframe(newTimeframe);
        // In a real app, you would fetch new data here.
        // For this demo, we keep the data static to prevent regeneration consistency issues, 
        // or trigger a server action to get new seed.
    };

    return (
        <main className="main-container">
            <section className="dashboard-toolbar">
                {/* Daily Briefing - Updates based on filters */}
                <DailyBriefing trends={visibleTrends.length > 0 ? visibleTrends : initialTrends} />

                <div className="dashboard-controls-row">
                    <div className="stats-group">
                        <div className="stat-item">
                            <span className="stat-label">Trends</span>
                            <span className="stat-value">{Math.min(visibleTrends.length, 50)}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Updated</span>
                            <UpdateTime />
                        </div>
                    </div>

                    <div className="controls-group">
                        <select value={timeframe} onChange={e => handleTimeframeChange(e.target.value)} aria-label="Timeframe filter">
                            <option value="1h">Past Hour</option>
                            <option value="4h">Past 4 Hours</option>
                            <option value="24h">Past 24 Hours</option>
                            <option value="7d">Past 7 Days</option>
                        </select>
                        <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category filter">
                            <option value="all">All Categories</option>
                            <option value="tech">Technology</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="sports">Sports</option>
                            <option value="politics">Politics</option>
                            <option value="business">Business</option>
                        </select>
                    </div>
                </div>
            </section>

            <Treemap trends={visibleTrends} onTrendClick={setSelectedTrend} />

            {selectedTrend && (
                <InfoPanel trend={selectedTrend} onClose={() => setSelectedTrend(null)} />
            )}
        </main>
    );
}

function UpdateTime() {
    const [time, setTime] = useState('');
    useEffect(() => {
        setTime(new Date().toLocaleTimeString());
        const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(interval);
    }, []);
    return <span className="stat-value">{time || 'Loading...'}</span>;
}
