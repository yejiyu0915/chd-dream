# Copilot / AI instructions — chd-dream (행복으로가는교회)

프로젝트 루트의 `.impeccable.md`가 **전체 디자인·제품 맥락의 단일 출처**다. 상세·갱신은 그쪽을 따른다.

## Design Context

### Users

- **교인 비중이 높음**; **새가족·외부 방문자**도 분명히 고려. **폐쇄적이지 않은** 열린 톤.
- 핵심 과업: 예배·행사, 공지·소식, 연락·위치, 뉴스·C-log.
- 감정 목표: **행복·활기·신실함** — 따뜻함, 에너지, 믿음직함.

### Brand Personality

- 현대적·열린 교회 웹. **딱딱한 전통 교회 사이트 톤만**으로 가지 않는다.
- **3단어**: 행복 · 활기 · 신실함
- 카피: 한국어, 명료·정중·환대.

### Aesthetic Direction

- 현재 **라이트 중심**; **다크 모드 가능성 열어둠** — 토큰·컴포넌트를 라이트 전용으로 과하게 고정하지 않기.
- 색: `common/styles/constants/_colors.scss` + `html[data-season]`. **흐린 대비 지양**(고연령 교인 고려).
- 타이포: Pretendard 본문, Useol 포인트. **사용자 글자 크기 옵션**은 바람직한 로드맵(미구현).
- 모션: 과한 화려함 지양; **`prefers-reduced-motion` 존중**. 짧고 의미 있는 모션.
- **레퍼런스**: 기업 사이트의 정돈 + 따뜻함 + 젊은 비영리 재단 느낌.
- **안티**: 딱딱·과보수적 “전형 교회 사이트”만 답습한 UI.

### Design Principles

1. 정보(예배·공지·연락) 우선.
2. 교인 중심이어도 새가족·외부인이 소외되지 않게.
3. CSS 토큰·계절 테마·프로젝트 SCSS 규칙(`.cursor/rules/scss.mdc`) 준수.
4. 계절 리듬(이미지·액센트) 유지; SSR/클라이언트 테마 불일치 주의.
5. 접근성: WCAG **2.1 AA 지향**, 대비·크기·모션 부담을 실무 우선순위에 둠.

### Code hints

- Next.js 16 App Router, React 19, TypeScript, Sass modules, Notion CMS, MDX.
- 계절: `getCurrentSeason()`, `data-season`, `ThemeManager`.
