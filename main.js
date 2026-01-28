document.addEventListener('DOMContentLoaded', () => {
    const trendsContainer = document.getElementById('trends-container');

    // --- Main execution on page load ---
    const mockTrendsData = generateMockData(100);
    displayTreemap(mockTrendsData);
    // --- End main execution ---

    function generateMockData(count) {
        const keywords = [
            "인공지능", "메타버스", "NFT", "웹 3.0", "양자컴퓨팅", "사이버보안", "지속가능성", "ESG", "전기차", "자율주행",
            "도심항공교통", "스마트시티", "디지털트윈", "블록체인", "클라우드", "빅데이터", "딥러닝", "머신러닝", "핀테크", "가상화폐",
            "비트코인", "이더리움", "대체불가토큰", "탈중앙화", "원격근무", "재택근무", "화상회의", "협업툴", "구독경제", "공유경제",
            "라이브커머스", "숏폼", "OTT", "웹툰", "웹소설", "K-POP", "한류", "오징어게임", "기생충", "방탄소년단",
            "블랙핑크", "친환경", "업사이클링", "제로웨이스트", "기후변화", "탄소중립", "그린뉴딜", "디지털뉴딜", "헬스케어", "원격의료",
            "정신건강", "명상", "홈트레이닝", "펫코노미", "반려동물", "식물집사", "캠핑", "차박", "골프", "테니스",
"MZ세대", "Y2K", "레트로", "뉴트로", "할매니얼", "가치소비", "미닝아웃", "슬로건패션", "비건", "대체육",
            "푸드테크", "스마트팜", "애그테크", "배달앱", "중고거래", "리셀테크", "크라우드펀딩", "P2P", "인플루언서", "유튜버",
            "틱톡", "인스타그램", "클럽하우스", "로블록스", "제페토", "게더타운", "VR", "AR", "MR", "XR",
            "코딩", "프로그래밍", "파이썬", "자바스크립트", "데이터과학", "로우코드", "노코드", "서버리스", "마이크로서비스", "DevOps"
        ];
        while (keywords.length < count) {
            keywords.push(`키워드 ${keywords.length + 1}`);
        }
        return keywords.slice(0, count).map(name => ({
            name: name,
            value: Math.floor(Math.random() * 1000) + 50
        }));
    }

    function displayTreemap(data) {
        if (!trendsContainer || !data || data.length === 0) return;
        trendsContainer.innerHTML = '';

        const width = trendsContainer.offsetWidth;
        const height = trendsContainer.offsetHeight;

        const treemap = d3.treemap()
            .tile(d3.treemapSquarify)
            .size([width, height])
            .padding(1) // Use a tiny padding to create a "stroke" effect, set to 0 for no gap
            .round(true);

        const root = d3.hierarchy({ children: data })
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        treemap(root);

        const color = d3.scaleOrdinal([
            "#ff4e50", "#fc913a", "#f9d62e", "#eae374", "#e2f4c7", "#a7c5eb", "#84a9ac",
            "#3b6978", "#4f8a8b", "#fbd1a2", "#ff8c94", "#a2d5f2", "#98ded9", "#f4a261",
            "#e76f51", "#2a9d8f", "#264653", "#e9c46a", "#fefae0", "#faedcd"
        ]);

        const svg = d3.select(trendsContainer).append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("style", "display: block; margin: 0;");

        const node = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);
        
        node.append("title")
            .text(d => `${d.data.name}\nValue: ${d.data.value}`);

        const link = node.append("a")
            .attr("xlink:href", d => `https://trends.google.com/trends/explore?q=${encodeURIComponent(d.data.name)}`)
            .attr("target", "_blank");

        link.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", (d, i) => color(i))
            .style("opacity", 0.8);
        
        // Add text only if the rectangle is big enough
        link.append("foreignObject")
            .attr("x", 4)
            .attr("y", 4)
            .attr("width", d => (d.x1 - d.x0) - 8)
            .attr("height", d => (d.y1 - d.y0) - 8)
            .style("display", d => (d.x1 - d.x0 < 40 || d.y1 - d.y0 < 20) ? "none" : "block")
            .append("xhtml:div")
            .style("width", "100%")
            .style("height", "100%")
            .style("color", "white")
            .style("font-size", d => Math.min(24, (d.x1 - d.x0) / d.data.name.length * 1.5) + "px")
            .style("text-align", "center")
            .style("word-wrap", "break-word")
            .style("text-shadow", "1px 1px 2px #000")
            .style("pointer-events", "none")
            .text(d => d.data.name);

        node.on("mouseover", function() {
            d3.select(this).select("rect").style("opacity", 1);
        }).on("mouseout", function() {
            d3.select(this).select("rect").style("opacity", 0.8);
        });
    }
});
