# MonkeysParadise 002: 글로벌 트렌드 뷰어

## 개요

이 프로젝트는 구글 트렌드에서 가져온 것과 유사하게 다양한 카테고리의 주요 글로벌 트렌드를 표시하는 간단한 웹 애플리케이션입니다.

## 기능

*   **메인 페이지:** 깔끔하고 단순한 인터페이스.
*   **반응형 디자인:** 모바일 친화적인 레이아웃입니다.
*   **자동 생성:** 페이지 로드 시 자동으로 트렌드 시각화를 생성합니다.
*   **Raw 데이터 뷰:** 전체 트렌드 데이터를 테이블 형식으로 보여주는 모달창 기능.

## 현재 작업: CryptoSentimeter 스타일의 프리미엄 디자인 리뉴얼 (v9)

사용자가 `https://crypto-sentimeter.vercel.app/` 사이트를 참고하여, 현대적이고 데이터 중심적인 프리미엄 대시보드 스타일로 디자인 리뉴얼을 요청했습니다.

### 주요 변경 사항:

1.  **디자인 시스템 구축:**
    - **폰트:** Google Fonts의 'Outfit' 폰트를 적용하여 깔끔하고 세련된 느낌을 줍니다.
    - **색상 팔레트:** 딥 차콜(`#090B11`) 배경, 카드 배경(`#131720`), 시안(`#00BBFF`) 및 블루(`2563EB`) 강조색을 사용하여 현대적인 다크 모드를 구현했습니다.
    - **유리 효과 (Glassmorphism):** 헤더에 `backdrop-filter`와 투명도를 적용하여 프리미엄 느낌을 더했습니다.

2.  **UI/UX 리뉴얼:**
    - **헤더:** 레이아웃을 1280px로 제한하고, 로고와 네비게이션을 깔끔하게 정리했습니다.
    - **통계 바:** 상단에 현재 트렌드 개수, 업데이트 시간, 최상위 트렌드를 요약하여 보여주는 섹션을 추가했습니다.
    - **트리맵 카드:** 각 트렌드 항목의 배경을 카테고리별 강조색으로 완전히 채워 바둑판(Tiled) 형태의 현대적인 그리드 디자인을 구현했습니다. 테두리를 제거하고 정보의 가독성을 높였습니다.
    - **레이아웃:** 대시보드 형태의 그리드 시스템을 적용하여 데이터 밀도를 높이면서도 가독성을 유지했습니다.

3.  **코드 구조 개선:**
    - 인라인 스타일과 스크립트를 각각 `style.css`와 `main.js`로 분리하여 코드의 유지보수성을 높였습니다.
    - `TreemapView` 클래스를 리팩토링하여 새로운 디자인 시스템과 호환되도록 수정했습니다.

## 이전 작업
- **v1-v7:** 리스트, 그리드, 버블 차트, 다크 모드 등 다양한 UI 구현.
- **v8 (Flexbox 트리스마일):** 사용자가 제공한 코드를 기반으로 Flexbox 기반의 트리스마일 UI와 파스텔 톤을 적용했으나, 검색량에 따른 크기 조절이 되지 않는 문제가 있었음.

## 현재 작업: Finviz 스타일의 D3.js 트리스마일 재구현

사용자가 `finviz.com` 사이트를 참고하여, 검색량에 따라 상자 크기가 정확히 비례하고, 다양한 파스텔 색상을 사용하는 UI를 재요청했습니다. 이는 기존의 Flexbox 기반 레이아웃을 버리고, D3.js의 트리스마일 레이아웃을 다시 구현해야 함을 의미합니다.

### 계획:

1.  **`blueprint.md` 업데이트:** 현재 요청사항을 반영하여 계획을 수정합니다. (완료)
2.  **`index.html` (전체 파일) 수정:**
    *   **`<script>` 로직 변경:**
        *   `TreemapView` 클래스와 Flexbox 렌더링 로직을 폐기합니다.
        *   D3.js의 `d3.treemap()`을 사용하는 새로운 렌더링 함수를 작성합니다. 이를 통해 각 사각형의 면적이 데이터(`volume`) 값에 정확히 비례하도록 합니다.
        *   Finviz와 유사하게 카테고리별로 그룹화된 중첩 구조를 표현하기 위해 `d3.hierarchy`를 사용하여 데이터를 재구성합니다.
        *   사용자 요청에 맞춰 더 다양한 파스텔 색상 팔레트를 정의하고, 각 카테고리/상자에 적용합니다.
        *   작은 사각형의 텍스트가 깨지지 않도록 표시/숨김 로직을 강화합니다.
    *   **`<style>` CSS 정리:**
        *   기존 Flexbox 트리스마일 관련 CSS (`.treemap-item`, `.size-xs` 등)를 제거합니다.
        *   D3.js가 생성하는 SVG 요소에 맞는 새로운 스타일 규칙을 정의합니다.
    *   **기타 요청사항 반영:**
        *   웹 기본 폰트 사용, 폰트 그림자 제거, 상자 간 간격 없음, 상단 메뉴 우측 정렬, 정보 패널 내 구글 트렌드 링크 버튼 등 이전 요청사항을 새로운 D3.js 구현체에 모두 통합합니다.
3. **광고 관리:**
    *   상단 및 하단 광고 배너를 제거했습니다.
    *   중간 광고는 유지됩니다.
4. **Raw 데이터 뷰 추가:**
    * 헤더에 'Raw Data' 버튼을 추가했습니다.
    * 클릭 시 전체 트렌드 데이터를 테이블 형태로 보여주는 모달창을 구현했습니다.
    * 모달창을 위한 HTML, CSS, JavaScript 코드를 추가했습니다.

*   **AdSense Fix (Low Value Content):** To address the "low value content" rejection, the following changes were made:
    *   Created new pages: `blog.html`, `about.html`, `contact.html`, `privacypolicy.html`, and `termsofservice.html`.
    *   Added a dedicated blog section with more detailed articles.
    *   Added content to the "About Us" and "Contact Us" pages.
    *   Added Privacy Policy and Terms of Service pages.
    *   Updated the navigation and footers to include links to the new pages.

## Google Tag Integration
- Google Tag (gtag.js) has been added to `index.html` within the `<head>` section for analytics tracking.