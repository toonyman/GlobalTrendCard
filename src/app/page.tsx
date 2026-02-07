import { generateTrendData } from '@/utils/trendData';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Global Trends Bubble | Real-Time Trending Topics',
  description: 'Visualize global search trends in real-time. Discover what is trending in Tech, Entertainment, Sports, and more.',
  openGraph: {
    title: 'Global Trends Bubble',
    description: 'Real-time search trends visualization.',
    type: 'website',
  }
};

export default function Home() {
  // Server-side Data Generation for SSR
  const trends = generateTrendData();

  // SEO Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": trends.slice(0, 10).map((trend, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": trend.name,
      "url": `https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.name)}`
    }))
  };

  return (
    <div className="scroll-container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Dashboard initialTrends={trends} />

      <footer style={{ padding: '4rem 2rem', borderTop: '1px solid var(--border-subtle)', marginTop: '4rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <p>&copy; 2026 Global Trends Bubble. Powered by Google Trends.</p>
        </div>
      </footer>
    </div>
  );
}
