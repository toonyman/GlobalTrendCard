export interface TrendItem {
    name: string;
    category: string;
    volume: number;
    change: number;
    color: string;
    isPositive: boolean;
    isHot: boolean;
    peakTime: string;
    region: string;
}

export const generateTrendData = (): TrendItem[] => {
    // 5 Categories
    const categories = ['tech', 'entertainment', 'sports', 'politics', 'business'];

    const techNames = [
        'Bitcoin ETF', 'AI Revolution', 'ChatGPT Update', 'iPhone 16', 'Tesla Cybertruck',
        'Meta Quest 3', 'Google Gemini', 'Apple Vision Pro', 'Quantum Computing', 'SpaceX Launch',
        'Nvidia Stock', 'OpenAI', 'Microsoft AI', 'Ethereum 2.0', 'Web3 Gaming',
        'Neural Link', 'Starlink', '5G Networks', 'Robotics', 'Cloud Computing',
        'Fintech Hub', 'Cybersecurity', 'SaaS Model', 'Biohacking', 'Edge Computing',
        'VR Workspace', 'Green Hydrogen', 'Solid State Battery', 'Fusion Power', 'Autonomous Driving'
    ];

    const entNames = [
        'Taylor Swift', 'Oscars 2026', 'Netflix Shows', 'BTS Concert', 'Marvel Movies',
        'Barbie Movie', 'Oppenheimer', 'Dune Part 3', 'Avatar 3', 'Spotify Wrapped',
        'Grammy Awards', 'Eurovision', 'Coachella', 'Squid Game S3', 'Stranger Things',
        'The Weeknd', 'Beyoncé', 'Super Bowl', 'F1 Racing', 'Premier League',
        'K-Drama Wave', 'TikTok Trends', 'Gaming Awards', 'Hollywood Strike', 'Cannes Festival',
        'Anime Expo', 'Pop Culture', 'Reality TV', 'Celebrity News', 'Movie Premiere'
    ];

    const sportsNames = [
        'NBA Finals', 'World Cup', 'Olympics', 'Messi Transfer', 'Ronaldo Goals',
        'MLB Season', 'NFL Draft', 'Wimbledon', 'Tour de France', 'Champions League',
        'LeBron James', 'Tom Brady', 'Serena Williams', 'Usain Bolt', 'Lewis Hamilton',
        'UFC Fight', 'Boxing Match', 'Cricket World Cup', 'Golf Masters', 'Tennis Open',
        'WNBA Records', 'MLS Growth', 'X Games', 'Marathon Prep', 'Surfing Open',
        'NHL Playoffs', 'Rugby World', 'Badminton Pro', 'Table Tennis', 'Gymnastics Fan'
    ];

    const polNames = [
        'US Elections', 'Climate Summit', 'G20 Meeting', 'NATO Summit', 'UN Assembly',
        'Trump Rally', 'Biden Speech', 'EU Parliament', 'Brexit News', 'China Taiwan',
        'Middle East', 'Ukraine News', 'Global Economy', 'Fed Interest Rate', 'Inflation Data',
        'Supreme Court', 'Senate Vote', 'Trade Deal', 'Immigration Policy', 'Healthcare Reform',
        'Diplomacy Talk', 'Policy Shift', 'Labor Union', 'Human Rights', 'Global Peace',
        'Arctic Melting', 'Energy Crisis', 'Food Security', 'Space Law', 'Digital Identity'
    ];

    const bizNames = [
        'Stock Market', 'Apple Earnings', 'Amazon Prime', 'Google Revenue', 'Meta Profit',
        'Oil Prices', 'Gold Market', 'Real Estate', 'Startup Funding', 'IPO Launch',
        'Tesla Sales', 'Microsoft Deal', 'Disney Plus', 'Nike Launch', 'McDonald\'s Menu',
        'Walmart Sale', 'Costco Deals', 'Target Fashion', 'IKEA Opening', 'Starbucks New',
        'Venture Capital', 'E-commerce', 'Remote Work', 'Customer CX', 'Agile Product',
        'Supply Chain', 'ESG Goals', 'Brand Identity', 'Market Gap', 'Growth Hacking'
    ];

    const allNamesPool = [techNames, entNames, sportsNames, polNames, bizNames];

    const categoryColors: Record<string, { positive: string; negative: string }> = {
        tech: { positive: '#00BBFF', negative: '#0066ff' },
        entertainment: { positive: '#ff006e', negative: '#cc0055' },
        sports: { positive: '#8338ec', negative: '#6610cc' },
        politics: { positive: '#10B981', negative: '#00cc77' },
        business: { positive: '#F97316', negative: '#ccaa00' }
    };

    // Generate exactly 150 unique items (30 per category)
    // No duplication logic used. Each name is mapped to exactly one TrendItem.
    const trends: TrendItem[] = [];

    categories.forEach((category, catIdx) => {
        const names = allNamesPool[catIdx];
        names.forEach((name) => {
            const rank = Math.floor(Math.random() * 150) + 1;
            const volumeBase = 1200000 * (1 / Math.pow(rank, 0.75));
            const noise = (Math.random() * 0.2 + 0.9);
            const volume = Math.floor(volumeBase * noise);

            const change = (Math.random() - 0.3) * 200;
            const isPositive = change >= 0;
            const isHot = volume > 500000 && change > 50;

            trends.push({
                name,
                category,
                volume,
                change: Math.floor(change),
                color: isPositive ? categoryColors[category].positive : categoryColors[category].negative,
                isPositive,
                isHot,
                peakTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
                region: ['Global', 'US', 'EU', 'Asia', 'Americas'][Math.floor(Math.random() * 5)]
            });
        });
    });

    return trends;
};
