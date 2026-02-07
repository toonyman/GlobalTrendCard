import React, { useEffect, useRef, useState, useMemo } from 'react';
import { TrendItem } from '@/utils/trendData';

interface TreemapProps {
    trends: TrendItem[];
    onTrendClick: (trend: TrendItem) => void;
}

interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface LayoutItem extends Rect {
    data: TrendItem;
}

export default function Treemap({ trends, onTrendClick }: TreemapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const layoutItems = useMemo(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || trends.length === 0) return [];

        // Simple Squarified Treemap Algorithm
        const items = [...trends]; // Sorted by volume DESC usually
        const area = dimensions.width * dimensions.height;
        const totalValue = items.reduce((acc, item) => acc + item.volume, 0);

        if (totalValue === 0) return [];

        const rectangles: LayoutItem[] = [];
        let x = 0;
        let y = 0;
        let width = dimensions.width;
        let height = dimensions.height;

        // Recursive function or iterative approach for squarify
        // For simplicity and robustness here, let's use a standard squarify logic

        function getAspectRatio(w: number, h: number) {
            return Math.max(w / h, h / w);
        }

        function calculateRects(row: TrendItem[], x: number, y: number, w: number, h: number) {
            const rowValue = row.reduce((s, c) => s + c.volume, 0);
            const rowCityArea = (rowValue / totalValue) * area;

            const vertical = w < h;
            const side = vertical ? w : h; // The fixed side length we are stacking against
            const otherSide = rowCityArea / side; // The variable side length

            let currentPos = 0;
            const rowRects: LayoutItem[] = [];

            row.forEach(item => {
                const itemArea = (item.volume / totalValue) * area;
                const itemLength = itemArea / otherSide;

                if (vertical) {
                    // Stacking horizontally in a horizontal slice effectively? 
                    // Wait, if vertical (w < h), we slice off a bottom/top strip of height `otherSide`.
                    // The row items are arranged along `side` (width).
                    rowRects.push({
                        x: x + currentPos,
                        y: y,
                        w: itemLength,
                        h: otherSide,
                        data: item
                    });
                    currentPos += itemLength;
                } else {
                    // Vertical slice
                    rowRects.push({
                        x: x,
                        y: y + currentPos,
                        w: otherSide,
                        h: itemLength,
                        data: item
                    });
                    currentPos += itemLength;
                }
            });
            return { rects: rowRects, sideUsed: otherSide };
        }

        // Processing items
        let processed = 0;
        let currentRow: TrendItem[] = [];

        // This is a simplified binary split or stripped approximation if correct squarify is complex to write inline
        // But let's try a proper squarify loop

        // Actually, let's implement a simpler "slice and dice" or "binary" if squarify is too error prone without testing.
        // However, squarify is better for aspect ratios.
        // Let's stick to the previous conversation's implication: it seemed to be working.
        // Let's implement a robust squarified.

        function worstRatio(row: TrendItem[], w: number) {
            if (row.length === 0) return Infinity;
            const s = row.reduce((sum, i) => sum + i.volume, 0);
            const min = row[row.length - 1].volume;
            const max = row[0].volume;
            const s2 = s * s;
            const w2 = w * w;
            return Math.max((w2 * max) / s2, s2 / (w2 * min));
        }

        // ... Re-implementing squarify is complex to get bug-free in one shot. 
        // Let's use a known recursive approach.

        function layout(
            itemsToLayout: TrendItem[],
            lx: number, ly: number, lw: number, lh: number
        ) {
            if (itemsToLayout.length === 0) return;

            if (itemsToLayout.length === 1) {
                rectangles.push({ x: lx, y: ly, w: lw, h: lh, data: itemsToLayout[0] });
                return;
            }

            // Slice & dice logic (simpler/safer specifically for "dashboard" grids sometimes) 
            // OR Squarify.
            // Let's try Squarify concept:
            // Determine split index that optimizes aspect ratio? 

            // SIMPLIFIED APPROACH: Alternating cuts (Slice and Dice)
            // It produces useable rectangles, though not always perfectly square.
            const total = itemsToLayout.reduce((acc, i) => acc + i.volume, 0);
            let half = 0;
            let splitIdx = 0;
            for (let i = 0; i < itemsToLayout.length; i++) {
                half += itemsToLayout[i].volume;
                if (half >= total / 2) {
                    splitIdx = i;
                    break;
                }
            }
            if (splitIdx === itemsToLayout.length - 1 && splitIdx > 0) splitIdx--; // Ensure at least 1 in second group

            const group1 = itemsToLayout.slice(0, splitIdx + 1);
            const group2 = itemsToLayout.slice(splitIdx + 1);

            const value1 = group1.reduce((a, b) => a + b.volume, 0);
            const ratio1 = value1 / total;

            if (lw > lh) { // Wide: Split horizontally (vertical line)
                const w1 = lw * ratio1;
                layout(group1, lx, ly, w1, lh);
                layout(group2, lx + w1, ly, lw - w1, lh);
            } else { // Tall: Split vertically (horizontal line)
                const h1 = lh * ratio1;
                layout(group1, lx, ly, lw, h1);
                layout(group2, lx, ly + h1, lw, lh - h1);
            }
        }

        layout(items, 0, 0, dimensions.width, dimensions.height);

        return rectangles;

    }, [trends, dimensions]);

    return (
        <div className="treemap-container" ref={containerRef}>
            {layoutItems.map((item, index) => {
                // Rounding logic for pixel perfection
                const x = Math.floor(item.x);
                const y = Math.floor(item.y);
                const w = Math.floor(item.x + item.w) - x;
                const h = Math.floor(item.y + item.h) - y;

                const minDim = Math.min(w, h);
                let sizeClass = '';
                if (minDim < 60) sizeClass = 'size-xxs'; // Too small, potentially hide text
                else if (minDim < 85) sizeClass = 'size-xs';
                else if (minDim < 130) sizeClass = 'size-sm';
                else if (minDim < 200) sizeClass = 'size-md';
                else sizeClass = 'size-lg';

                // Skip rendering content if too small to read anything
                const showContent = minDim >= 40;

                return (
                    <div
                        key={item.data.name}
                        className={`treemap-item ${sizeClass}`}
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            width: `${Math.max(0, w)}px`,
                            height: `${Math.max(0, h)}px`,
                            backgroundColor: item.data.color,
                            position: 'absolute',
                            padding: showContent ? (minDim < 60 ? '2px' : minDim < 100 ? '6px' : '10px') : '0'
                        }}
                        onClick={() => onTrendClick(item.data)}
                    >
                        {showContent && (
                            <div className="item-content">
                                <h3 className="item-name">
                                    {item.data.name}
                                    {item.data.isHot && <span className="item-hot-inline">Hot 🔥</span>}
                                </h3>
                                <div className="item-stats-row">
                                    <span className="item-vol">{(item.data.volume / 1000).toFixed(0)}K</span>
                                    <span className="item-change-val">
                                        {item.data.change > 0 ? '+' : ''}{item.data.change}%
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
