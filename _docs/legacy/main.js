// Sample Trend Data Generator
const generateTrendData = () => {
    // 5 Categories
    const categories = ['tech', 'entertainment', 'sports', 'politics', 'business'];

    // 20 items per category (Total 100 base names)
    // We explicitly structure this to match the category order above
    const techNames = [
        'Bitcoin ETF', // Moved to Top for user request
        'AI Revolution', 'ChatGPT Update', 'iPhone 16', 'Tesla Cybertruck', 'Meta Quest 3',
        'Google Gemini', 'Apple Vision Pro', 'Quantum Computing', 'SpaceX Launch', 'Nvidia Stock',
        'OpenAI', 'Microsoft AI', 'Ethereum 2.0', 'Web3 Gaming', // Removed duplicate Bitcoin ETF
        'Neural Link', 'Starlink', '5G Networks', 'Robotics', 'Cloud Computing'
    ];

    const entNames = [
        'Taylor Swift', 'Oscars 2026', 'Netflix Shows', 'BTS Concert', 'Marvel Movies',
        'Barbie Movie', 'Oppenheimer', 'Dune Part 3', 'Avatar 3', 'Spotify Wrapped',
        'Grammy Awards', 'Eurovision', 'Coachella', 'Squid Game S3', 'Stranger Things',
        'The Weeknd', 'Beyoncé', 'Super Bowl', 'F1 Racing', 'Premier League'
    ];

    const sportsNames = [
        'NBA Finals', 'World Cup', 'Olympics', 'Messi Transfer', 'Ronaldo Goals',
        'MLB Season', 'NFL Draft', 'Wimbledon', 'Tour de France', 'Champions League',
        'LeBron James', 'Tom Brady', 'Serena Williams', 'Usain Bolt', 'Lewis Hamilton',
        'UFC Fight', 'Boxing Match', 'Cricket World Cup', 'Golf Masters', 'Tennis Open'
    ];

    const polNames = [
        'US Elections', 'Climate Summit', 'G20 Meeting', 'NATO Summit', 'UN Assembly',
        'Trump Rally', 'Biden Speech', 'EU Parliament', 'Brexit News', 'China Taiwan',
        'Middle East', 'Ukraine News', 'Global Economy', 'Fed Interest Rate', 'Inflation Data',
        'Supreme Court', 'Senate Vote', 'Trade Deal', 'Immigration Policy', 'Healthcare Reform'
    ];

    const bizNames = [
        'Stock Market', 'Apple Earnings', 'Amazon Prime', 'Google Revenue', 'Meta Profit',
        'Oil Prices', 'Gold Market', 'Real Estate', 'Startup Funding', 'IPO Launch',
        'Tesla Sales', 'Microsoft Deal', 'Disney Plus', 'Nike Launch', 'McDonald\'s Menu',
        'Walmart Sale', 'Costco Deals', 'Target Fashion', 'IKEA Opening', 'Starbucks New'
    ];

    // Combine into one ordered list for indexing logic (0-19 Tech, 20-39 Ent, etc.)
    const trendNames = [
        ...techNames, ...entNames, ...sportsNames, ...polNames, ...bizNames
    ];

    const categoryColors = {
        tech: { positive: '#00BBFF', negative: '#0066ff' },
        entertainment: { positive: '#ff006e', negative: '#cc0055' },
        sports: { positive: '#8338ec', negative: '#6610cc' },
        politics: { positive: '#10B981', negative: '#00cc77' },
        business: { positive: '#F97316', negative: '#ccaa00' }
    };

    // Generate 300 items to ensure at least 50 per category for filtering
    return Array.from({ length: 300 }, (_, i) => {
        // Cyclic name selection
        const nameIndex = i % trendNames.length;
        const name = trendNames[nameIndex];

        // Correct Category Logic: Map index to 0-4 range based on 20 items per block
        // 0-19: Tech (0), 20-39: Ent (1), etc.
        const categoryIndex = Math.floor(nameIndex / 20);
        const category = categories[categoryIndex];

        // Power Law Distribution
        // Randomize rank to ensure high volumes are distributed across all categories
        // instead of favoring the first categories in the loop
        const rank = Math.floor(Math.random() * 300) + 1;
        const volumeBase = 1000000 * (1 / Math.pow(rank, 0.8)); // Zipf-like
        const noise = (Math.random() * 0.2 + 0.9); // +/- 10%
        const volume = Math.floor(volumeBase * noise);

        const change = (Math.random() - 0.3) * 200;
        const isPositive = change >= 0;

        // Momentum Logic: If rank is high (simulated) and change is wildly positive
        const isHot = volume > 500000 && change > 50; // Simple threshold for Hot badge

        return {
            name,
            category,
            volume,
            change: Math.floor(change),
            color: isPositive ? categoryColors[category].positive : categoryColors[category].negative,
            isPositive,
            isHot,
            peakTime: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
            region: ['Global', 'US', 'EU', 'Asia', 'Americas'][Math.floor(Math.random() * 5)]
        };
    });
};

class TreemapView {
    constructor(container) {
        this.container = container;
        this.trends = [];
        this.allTrends = [];

        // Debounced Resize Listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.trends.length > 0) {
                    this.render();
                }
            }, 200);
        });
    }

    setTrends(trends) {
        this.allTrends = trends;
        this.trends = trends;
        this.render();
        this.renderDailyBriefing();
    }

    renderDailyBriefing() {
        const summaryContainer = document.getElementById('aiSummary');
        const nameEl = document.getElementById('topTrendName');
        const volEl = document.getElementById('topTrendVol');
        const changeEl = document.getElementById('topTrendChange');
        const linkEl = document.getElementById('topTrendLink');

        // Simulate AI analysis based on top trends
        const topTrends = [...this.trends].sort((a, b) => b.volume - a.volume).slice(0, 3);
        if (topTrends.length < 1) return;

        // Populate Top Trend Section
        if (nameEl && volEl && changeEl) {
            const top = topTrends[0];
            nameEl.textContent = top.name;
            volEl.textContent = (top.volume / 1000).toFixed(0) + 'K'; // e.g. 500K
            changeEl.textContent = (top.change > 0 ? '+' : '') + top.change + '%';
            changeEl.style.color = top.change >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)';

            if (linkEl) {
                linkEl.href = `https://trends.google.com/trends/explore?q=${encodeURIComponent(top.name)}`;
            }
        }

        if (!summaryContainer || topTrends.length < 3) return;

        const dominantCat = topTrends[0].category;

        // Simple sentence templates based on data
        // Ideally this comes from LLM API
        const sentences = [
            `<strong>${dominantCat.toUpperCase()} SECTOR DOMINANCE:</strong> The ${dominantCat} sector is leading today's global attention, driven by a surge of interest in <strong>${topTrends[0].name}</strong> which has seen a ${topTrends[0].change}% spike.`,
            `<strong>RISING MOMENTUM:</strong> <strong>${topTrends[1].name}</strong> follows closely, showing strong engagement patterns indicating a potential breakout trend for the coming hours.`,
            `<strong>MARKET SENTIMENT:</strong> Overall sentiment appears mixed, but <strong>${topTrends[2].name}</strong> remains a resilient topic despite market volatility.`
        ];

        summaryContainer.innerHTML = sentences.map(s => `<div class="briefing-item">${s}</div>`).join('');
    }

    getSizeClass(volume, maxVolume) {
        return 'size-md';
    }

    // Generic Squarified Treemap Algorithm
    getSquarifiedLayout(data, containerWidth, containerHeight) {
        if (data.length === 0) return [];

        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        const totalArea = containerWidth * containerHeight;

        // Map values to areas
        const items = data.map(item => ({
            ...item,
            area: (item.value / totalValue) * totalArea
        }));

        let layoutResult = [];
        let canvas = { x: 0, y: 0, w: containerWidth, h: containerHeight };

        this.squarify(items, [], canvas, layoutResult);
        return layoutResult;
    }

    squarify(children, row, canvas, result) {
        if (children.length === 0) {
            if (row.length > 0) this.layoutRow(row, canvas, result);
            return;
        }

        const c = children[0];
        // Check if adding c to row improves aspect ratio
        if (row.length === 0 || this.worst(row.concat([c]), canvas.w) <= this.worst(row, canvas.w)) {
            // Add to row
            this.squarify(children.slice(1), row.concat([c]), canvas, result);
        } else {
            // Row is full, layout it and start new row
            const newCanvas = this.layoutRow(row, canvas, result);
            this.squarify(children, [], newCanvas, result);
        }
    }

    // Layout a row within the canvas and return the remaining canvas
    layoutRow(row, canvas, result) {
        const totalRowArea = row.reduce((sum, item) => sum + item.area, 0);

        // Decide orientation based on canvas shape
        // If width >= height, we stack vertically in a column (width is fixed for row) -> logic is inverted in standard Algo descriptions sometimes
        // Actually: "Row" runs along the short side of the container.
        // If container is wider than tall (w > h), we cut a vertical strip. Row height = container height.
        // If container is taller than wide (h > w), we cut a horizontal strip. Row width = container width.

        const vertical = canvas.w >= canvas.h;

        // Side length of the row perpendicular to the direction of stacking
        const side = vertical ? canvas.h : canvas.w;

        // Width of the row itself
        const rowWidth = totalRowArea / side;

        let currentOffset = 0;

        row.forEach(item => {
            const itemLength = item.area / rowWidth;
            let rect;

            if (vertical) {
                // Vertical strip (width is rowWidth, height is itemLength)
                rect = {
                    x: canvas.x,
                    y: canvas.y + currentOffset,
                    w: rowWidth,
                    h: itemLength,
                    data: item
                };
            } else {
                // Horizontal strip (height is rowWidth, width is itemLength)
                rect = {
                    x: canvas.x + currentOffset,
                    y: canvas.y,
                    w: itemLength,
                    h: rowWidth,
                    data: item
                };
            }

            result.push(rect);
            currentOffset += itemLength;
        });

        // Return remaining canvas
        if (vertical) {
            return { x: canvas.x + rowWidth, y: canvas.y, w: canvas.w - rowWidth, h: canvas.h };
        } else {
            return { x: canvas.x, y: canvas.y + rowWidth, w: canvas.w, h: canvas.h - rowWidth };
        }
    }

    worst(row, w) {
        if (row.length === 0) return Infinity;

        const totalArea = row.reduce((sum, item) => sum + item.area, 0);
        // We need to know the side length. In recursive steps, w is the shortest side of the remaining rectangle?
        // Actually, the standard algorithm assumes 'w' is the width of the side the row is built against.
        // My implementation of 'worst' needs to be context-aware or simplistic.
        // Let's use normalized aspect ratio calculation: max(w/h, h/w)

        // Simplified Logic: 
        // We know 'w' passed here is actually the length of the side we are stacking against.
        // Let s = totalArea^2
        // Let r_max = max area in row
        // Let r_min = min area in row
        // Worst = max( (w^2 * r_max) / s , s / (w^2 * r_min) )

        const minArea = Math.min(...row.map(i => i.area));
        const maxArea = Math.max(...row.map(i => i.area));
        const s = totalArea * totalArea;
        const w2 = w * w;

        return Math.max((w2 * maxArea) / s, s / (w2 * minArea));
    }

    render() {
        this.container.innerHTML = '';

        // Safely handle container display for measurement
        this.container.style.display = 'block';
        this.container.style.position = 'relative';
        this.container.style.padding = '0'; // Remove padding to simplify calculation

        if (this.trends.length === 0) {
            this.container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); padding: 2rem;">No trends found</div>';
            return;
        }

        // 1. Get Top 50
        this.visibleTrends = [...this.trends].sort((a, b) => b.volume - a.volume).slice(0, 50);

        // 2. Measure Container
        // Use getBoundingClientRect for precise fractional pixels
        const rect = this.container.getBoundingClientRect();
        let containerWidth = rect.width;
        let containerHeight = rect.height;

        // Fallbacks if measurement fails (e.g. hidden or disconnected)
        if (!containerWidth || containerWidth < 100) containerWidth = 1600;
        if (!containerHeight || containerHeight < 100) containerHeight = 800;

        // Ensure container has this height explicitly if it was relying on content
        this.container.style.minHeight = `${containerHeight}px`;

        // 3. Prepare Data
        const layoutData = this.visibleTrends.map(t => ({ ...t, value: t.volume }));

        // 4. Calculate Layout
        const finalRects = this.getSquarifiedLayout(layoutData, containerWidth, containerHeight);

        // 5. Render Items
        finalRects.forEach(rect => {
            const trend = rect.data;
            const item = document.createElement('div');

            // Absolute Positioning
            item.style.position = 'absolute';
            item.style.left = `${rect.x}px`;
            item.style.top = `${rect.y}px`;
            item.style.width = `${Math.max(0, rect.w - 1)}px`; // -1 for visual separation (gap simulation)
            item.style.height = `${Math.max(0, rect.h - 1)}px`;

            // Styling
            item.className = 'treemap-item';
            item.style.backgroundColor = trend.color;
            item.style.setProperty('--item-color-bg', trend.color);
            item.style.color = '#FFFFFF';
            item.style.boxSizing = 'border-box';
            item.style.overflow = 'hidden';

            // Logic for font size and content visibility based on Area
            const area = rect.w * rect.h;

            const showName = area > 1200;
            const showStats = area > 2000;

            let fontSize = 0.7; // Base size reduced
            if (area > 3000) fontSize = 0.8;
            if (area > 6000) fontSize = 0.95;
            if (area > 12000) fontSize = 1.1;
            if (area > 24000) fontSize = 1.4;

            item.innerHTML = `
                ${trend.isHot ? '<div class="hot-badge">Hot 🔥</div>' : ''}
                ${showName ? `
                <div class="item-name" style="font-size: ${fontSize}rem; line-height: 1.1; font-weight: 700; padding: 0.5rem 0.5rem 0 0.5rem;">
                    ${trend.name}
                </div>` : ''}
                ${showStats ? `
                <div class="item-stats" style="padding: 0 0.5rem 0.5rem 0.5rem;">
                    <span class="stat-vol" style="font-size: 0.8em; opacity: 0.9;">${(trend.volume / 1000).toFixed(0)}K</span>
                    <span class="stat-change" style="font-size: 0.8em; color: ${trend.isPositive ? '#aaffaa' : '#ffaaaa'}">${trend.change > 0 ? '+' : ''}${trend.change}%</span>
                </div>` : ''}
            `;

            // Interaction
            const showInfoHandler = (e) => {
                e.stopPropagation();
                this.showInfo(trend);
            };
            item.addEventListener('click', showInfoHandler);

            this.container.appendChild(item);
        });
    }

    // Correct 'worst' implementation for the loop:
    worst(row, sideLength) {
        if (row.length === 0) return Infinity;
        const totalValue = row.reduce((sum, i) => sum + i.area, 0); // Using area
        const maxArea = Math.max(...row.map(i => i.area));
        const minArea = Math.min(...row.map(i => i.area));

        // Aspect Ratio formula: max(w^2 * r+ / s^2, s^2 / w^2 * r-)
        // Where w = sideLength, s = totalValue (sum of areas for row)
        // Wait, 's' is the Area of the row? Yes.
        const s2 = totalValue * totalValue;
        const w2 = sideLength * sideLength;
        return Math.max((w2 * maxArea) / s2, s2 / (w2 * minArea));
    }

    squarify(children, row, canvas, result) {
        // Correct side length: Shortest side of remaining canvas
        const sideLength = Math.min(canvas.w, canvas.h);

        if (children.length === 0) {
            this.layoutRow(row, canvas, result);
            return;
        }

        const c = children[0];
        // Does adding c to row improve worst aspect ratio?
        // Note: we must pass sideLength to worst
        if (row.length === 0 || this.worst(row.concat([c]), sideLength) <= this.worst(row, sideLength)) {
            this.squarify(children.slice(1), row.concat([c]), canvas, result);
        } else {
            const newCanvas = this.layoutRow(row, canvas, result);
            this.squarify(children, [], newCanvas, result);
        }
    }

    closeInfo() {
        const panel = document.getElementById('infoPanel');
        const overlay = document.getElementById('popupOverlay');
        if (panel) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    showInfo(trend) {
        const panel = document.getElementById('infoPanel');
        const overlay = document.getElementById('popupOverlay');
        if (!panel) return;

        // Activate Overlay
        if (overlay) overlay.classList.add('active');

        // Reset panel border/box-shadow style (removed colored border)
        panel.style.borderColor = 'var(--border-subtle)';
        panel.style.boxShadow = `0 25px 50px -12px rgba(0, 0, 0, 0.8)`;

        // Color the header background instead
        const header = document.getElementById('infoHeader');
        if (header) header.style.background = trend.color;

        const infoTitle = document.getElementById('infoTitle');
        if (infoTitle) {
            infoTitle.textContent = trend.name;
            // Reset gradient text since we have a solid colored header now
            infoTitle.style.background = 'none';
            infoTitle.style.webkitBackgroundClip = 'border-box';
            infoTitle.style.webkitTextFillColor = '#FFFFFF';
        }

        // Content updates
        // Note: Category, Volume, etc. are inside a grid structure now implicitly or need updating if HTML structure changed significantly.
        // The HTML replacement above simplified the structure inside infoPanel, let's make sure we target correctly.
        // Since I only replaced the header part in HTML, the inner grid remains.

        // However, I needs to make sure existing IDs still work.
        // Let's assume the previous inner grid structure exists or I need to re-render it if I cleared it. 
        // Actually, the previous HTML replacement tool cut off at line 144, so the inner content of info-panel
        // might be partially missing or I need to be careful.
        // Wait, looking at the HTML replacement, I kept the `div style="display: grid; gap: 1rem;"`.
        // So I can target children or re-inject content.

        // Safer to re-inject content to match the request "popup styling".

        // Actually, let's just update the text content of existing IDs if they are still there.
        // But to be safe given the "layout changes", I will query them safely.

        const setContent = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setContent('infoCategory', trend.category.charAt(0).toUpperCase() + trend.category.slice(1));
        setContent('infoVolume', trend.volume.toLocaleString());

        const changeElem = document.getElementById('infoChange');
        if (changeElem) {
            changeElem.textContent = `${trend.change > 0 ? '+' : ''}${trend.change}%`;
            changeElem.style.color = trend.isPositive ? '#10B981' : '#EF4444';
        }

        setContent('infoPeakTime', trend.peakTime || '14:00 today');
        setContent('infoRegion', trend.region);

        const btn = document.getElementById('googleTrendsBtn');
        if (btn) {
            btn.href = `https://trends.google.com/trends/explore?q=${encodeURIComponent(trend.name)}`;
            // Reset button style to neutral or specific style
            btn.style.background = 'var(--bg-main)';
            btn.style.borderColor = 'var(--border-subtle)';
            btn.style.color = 'var(--text-primary)';
        }

        // --- Fetch & Show News (Mock Implementation) ---
        const newsList = document.getElementById('newsList');
        if (newsList) {
            newsList.innerHTML = '<div style="color:var(--text-muted); font-style:italic;">Finding related news...</div>';

            // Validate NewsAPI Key usage
            // In a real app, we would make a fetch() call here.
            // fetch(`https://newsapi.org/v2/everything?q=${trend.name}&apiKey=YOUR_API_KEY`)

            // Mock delay and response
            setTimeout(() => {
                // Generate dummy news relevant to the trend name
                const mockHeadlines = [
                    { title: `Why everyone is talking about ${trend.name} today`, source: "TechCrunch", time: "2 hours ago" },
                    { title: `Market Analysis: The impact of ${trend.name} on global sector`, source: "Bloomberg", time: "4 hours ago" },
                    { title: `Opinion: ${trend.name} marks a new era in ${trend.category}`, source: "The Verge", time: "5 hours ago" },
                    { title: `Breaking: Major updates regarding ${trend.name}`, source: "Reuters", time: "Just now" }
                ];

                newsList.innerHTML = mockHeadlines.map(news => `
                    <div class="news-item">
                        <a href="#" class="news-link" onclick="event.preventDefault(); window.open('https://news.google.com/search?q=${encodeURIComponent(trend.name)}', '_blank')">
                            <span class="news-title">${news.title}</span>
                            <span class="news-meta">
                                <span>${news.source}</span>
                                <span>${news.time}</span>
                            </span>
                        </a>
                    </div>
                `).join('');
            }, 600); // 600ms fake delay
        }

        panel.classList.add('active');
    }

    filterByCategory(category) {
        if (category === 'all') {
            this.trends = this.allTrends;
        } else {
            this.trends = this.allTrends.filter(t => t.category === category);
        }
        this.render();
    }

    filterBySearch(query) {
        if (!query) {
            this.trends = this.allTrends;
        } else {
            this.trends = this.allTrends.filter(t =>
                t.name.toLowerCase().includes(query.toLowerCase())
            );
        }
        this.render();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('treemapContainer');
    if (!container) return;

    const treemapView = new TreemapView(container);
    const trends = generateTrendData();
    treemapView.setTrends(trends);

    // Update stats
    const totalTrendsEl = document.getElementById('totalTrends');
    const updateTimeEl = document.getElementById('updateTime');

    if (totalTrendsEl) totalTrendsEl.textContent = treemapView.visibleTrends ? treemapView.visibleTrends.length : 50;

    // Update time
    setInterval(() => {
        const now = new Date();
        if (updateTimeEl) updateTimeEl.textContent = now.toLocaleTimeString();
    }, 1000);

    // Theme Toggle (Simplified as reference is always dark)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            alert('This dashboard is optimized for Dark Mode.');
        });
    }

    // Event handlers
    // Event handlers
    const closePanel = document.getElementById('closePanel');
    const overlay = document.getElementById('popupOverlay');

    const handleClose = () => {
        treemapView.closeInfo();
    };

    if (closePanel) closePanel.addEventListener('click', handleClose);
    if (overlay) overlay.addEventListener('click', handleClose);

    const updateStats = () => {
        if (totalTrendsEl) totalTrendsEl.textContent = treemapView.visibleTrends.length;
    };

    // Removed old document-wide click listener

    const categorySelect = document.getElementById('category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            treemapView.filterByCategory(e.target.value);
            updateStats();
        });
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            treemapView.filterBySearch(e.target.value);
            updateStats();
        });
    }

    const resetBtn = document.getElementById('resetView');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const newTrends = generateTrendData();
            treemapView.setTrends(newTrends);
            if (searchInput) searchInput.value = '';
            if (categorySelect) categorySelect.value = 'all';
            updateStats();
        });
    }

    const timeframeSelect = document.getElementById('timeframe');
    if (timeframeSelect) {
        timeframeSelect.addEventListener('change', (e) => {
            const newTrends = generateTrendData();
            treemapView.setTrends(newTrends);
            updateStats();
        });
    }

    // Raw Data Modal
    const rawDataModal = document.getElementById('rawDataModal');
    const rawDataBtn = document.getElementById('rawDataView');
    const closeRawDataModal = document.getElementById('closeRawDataModal');
    const rawDataTbody = document.getElementById('rawData-tbody');

    const populateRawDataTable = () => {
        if (!rawDataTbody) return;
        rawDataTbody.innerHTML = '';
        // Fix: Use visibleTrends instead of allTrends to match what user sees
        const dataToShow = treemapView.visibleTrends || treemapView.allTrends.slice(0, 50);

        dataToShow.forEach(trend => {
            const row = `<tr>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle);">${trend.name}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle);">${trend.category}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle);">${trend.volume.toLocaleString()}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle); color: ${trend.change >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)'}">${trend.change}%</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle);">${trend.peakTime}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border-subtle);">${trend.region}</td>
            </tr>`;
            rawDataTbody.innerHTML += row;
        });
    };

    if (rawDataBtn && rawDataModal) {
        rawDataBtn.addEventListener('click', () => {
            populateRawDataTable();
            rawDataModal.style.display = 'flex';
        });
    }

    if (closeRawDataModal) {
        closeRawDataModal.addEventListener('click', () => {
            rawDataModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == rawDataModal) {
            rawDataModal.style.display = 'none';
        }
    });
});