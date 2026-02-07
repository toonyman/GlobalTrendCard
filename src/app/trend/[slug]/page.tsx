import { generateTrendData } from '@/utils/trendData';
import Header from '@/components/Header';
import { Metadata } from 'next';

// Generate static params for SSG (optional, but good for SEO)
export async function generateStaticParams() {
    const trends = generateTrendData();
    return trends.slice(0, 20).map((trend) => ({
        slug: trend.name.toLowerCase().replace(/ /g, '-'),
    }));
}

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const name = resolvedParams.slug.replace(/-/g, ' ').toUpperCase();
    return {
        title: `${name} | Global Trend Analysis`,
        description: `Detailed real-time search volume and sentiment analysis for ${name}.`,
    };
}

export default async function TrendPage({ params }: Props) {
    const resolvedParams = await params;
    const slugName = resolvedParams.slug.replace(/-/g, ' '); // simple decode

    // Mock Data Retrieval
    const trends = generateTrendData();
    // Relaxed matching
    const trend = trends.find(t => t.name.toLowerCase() === slugName.toLowerCase()) || {
        name: slugName.charAt(0).toUpperCase() + slugName.slice(1),
        category: 'general',
        volume: Math.floor(Math.random() * 1000000),
        change: 15,
        color: '#00BBFF',
        isPositive: true,
        region: 'Global',
        peakTime: 'Now',
        isHot: false
    };

    return (
        <div className="scroll-container">
            <Header />
            <main className="main-container" style={{ maxWidth: 1000, margin: '2rem auto' }}>
                <div className="daily-briefing" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '2rem' }}>

                    <div className="briefing-header" style={{ width: '100%', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <h1 style={{ fontSize: '3rem', margin: 0, color: trend.color }}>{trend.name}</h1>
                        <span style={{
                            background: trend.isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: trend.isPositive ? '#10B981' : '#EF4444',
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            fontWeight: 'bold',
                            marginLeft: '1rem'
                        }}>
                            {trend.change > 0 ? '+' : ''}{trend.change}%
                        </span>
                    </div>

                    <div className="info-body-grid" style={{ width: '100%' }}>
                        <div className="info-stats-col">
                            <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
                                <h3 className="text-[var(--text-muted)] uppercase text-sm mb-4">Trend Statistics</h3>
                                <div className="space-y-4">
                                    <StatDisplay label="Volume" value={trend.volume.toLocaleString()} />
                                    <StatDisplay label="Category" value={trend.category} />
                                    <StatDisplay label="Region" value={trend.region} />
                                    <StatDisplay label="Peak Interest" value={trend.peakTime} />
                                </div>
                            </div>
                        </div>

                        <div className="info-news-col">
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Latest News</h3>
                            <div className="news-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Mock News for SEO Content */}
                                <NewsItem title={`Why ${trend.name} is trending right now`} source="Global News" />
                                <NewsItem title={`${trend.name} hits record search volume`} source="Data Weekly" />
                                <NewsItem title={`Analysis: The future of ${trend.name}`} source="Tech Insider" />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <a href="/" className="btn">← Back to Dashboard</a>
                    </div>

                </div>
            </main>
        </div>
    );
}

function StatDisplay({ label, value }: { label: string, value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
    );
}

function NewsItem({ title, source }: { title: string, source: string }) {
    return (
        <div style={{ padding: '1rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{title}</h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{source} • Just now</span>
        </div>
    );
}
