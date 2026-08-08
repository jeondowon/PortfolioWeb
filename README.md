![PortfolioWeb](public/images/PortfolioWeb.png)

# Portfolio Website

Personal portfolio site built with React and Vite, hosted on Cloudflare Pages.

**Live:** [jeondowon.com](https://jeondowon.com)

[English](#english) | [한국어](#한국어)

---

## English

### Tech Stack

| | |
| --- | --- |
| **React 18** | UI |
| **React Router v7** | Client-side routing |
| **Vite** | Build tool & dev server |
| **react-icons** | Icon set |
| **Cloudflare Pages** | Hosting & CI/CD |

### Getting Started

```bash
npm install
npm run dev      # Dev server at http://localhost:5173
npm run build    # Production build to dist/
npm run preview  # Preview the production build locally
```

### Project Structure

```
src/
├── components/
│   ├── sections/     # Main-page sections (Cover, Hero, About, Skills, Experiences, Contact) + Banner, a decorative marquee strip
│   └── common/       # Shared UI (Navbar, ScrollButton)
├── pages/            # Route-level pages (ProjectsPage, LabPage)
├── contexts/         # React contexts (LangContext — KO/EN toggle)
├── constants/        # Site data (projects, skills, experience, lab items, social links)
├── styles/           # global.css
└── assets/           # Static assets (audio, etc.)

public/               # Copied to dist/ verbatim, served at the matching path
├── images/           # Project thumbnails, profile image, favicon
├── lab/              # Standalone experiments, served at /lab/<id>
└── rockie/           # Rockie — desktop pet, served at /rockie
```

Files under `public/` are served as-is. Cloudflare Pages resolves a real file first and only falls back to the SPA rule when none matches, so these standalone pages coexist with React Router.

### Routes

| Path | |
| --- | --- |
| `/` | Single-page main — Cover → Hero → About → Skills → Experiences → Contact |
| `/projects` | Project listing |
| `/lab` | Laboratory — index of the standalone experiments under `public/lab/` |

### Deployment

Pushing to `main` triggers a Cloudflare Pages build, which runs `npm run build` and serves `dist/`.

- The custom domain is configured in the Cloudflare Pages dashboard.
- `public/_redirects` provides the SPA fallback (`/* /index.html 200`), so client-side routes survive a direct visit or a refresh.

> **Note** — Cloudflare Pages treats paths as **case-sensitive**, unlike macOS. An asset referenced as `foo.png` but stored as `foo.PNG` works locally and 404s in production, where the SPA fallback then returns HTML instead of the asset. That failure looks like a rendering bug rather than a missing file.

### Features

- **KO / EN** language toggle (React Context)
- Main page: Cover · Hero · About · Skills · Experiences · Contact
- **Projects** (`/projects`) — project cards filtered by category tag, each linking to its GitHub repo or live page
- **Laboratory** (`/lab`) — a horizontal carousel of experiments driven by wheel and swipe, each card opening its standalone page under `/lab/<id>`
- BGM player, started from the Cover section
- Responsive layout
- Rain animation on the Projects nav link

---

## 한국어

### 기술 스택

| | |
| --- | --- |
| **React 18** | UI |
| **React Router v7** | 클라이언트 사이드 라우팅 |
| **Vite** | 빌드 도구 & 개발 서버 |
| **react-icons** | 아이콘 |
| **Cloudflare Pages** | 호스팅 & CI/CD |

### 시작하기

```bash
npm install
npm run dev      # 개발 서버 http://localhost:5173
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 프로덕션 빌드 로컬 미리보기
```

### 프로젝트 구조

```
src/
├── components/
│   ├── sections/     # 메인 페이지 섹션 (Cover, Hero, About, Skills, Experiences, Contact) + 장식용 마퀴 띠 Banner
│   └── common/       # 공통 UI (Navbar, ScrollButton)
├── pages/            # 라우트 페이지 (ProjectsPage, LabPage)
├── contexts/         # React Context (LangContext — 한/영 전환)
├── constants/        # 사이트 데이터 (프로젝트, 기술, 경력, 실험 목록, 소셜 링크)
├── styles/           # global.css
└── assets/           # 정적 자산 (오디오 등)

public/               # dist/로 그대로 복사되어 같은 경로에서 서비스
├── images/           # 프로젝트 썸네일, 프로필 이미지, 파비콘
├── lab/              # 독립 실험 페이지, /lab/<id>에서 서비스
└── rockie/           # Rockie — 데스크톱 애완돌, /rockie에서 서비스
```

`public/` 아래의 파일은 그대로 서비스됩니다. Cloudflare Pages는 실제 파일을 먼저 찾고 없을 때만 SPA fallback을 적용하므로, 이 독립 페이지들은 React Router와 충돌하지 않습니다.

### 라우트

| 경로 | |
| --- | --- |
| `/` | 단일 페이지 메인 — Cover → Hero → About → Skills → Experiences → Contact |
| `/projects` | 프로젝트 목록 |
| `/lab` | Laboratory — `public/lab/` 아래 독립 실험 페이지 목록 |

### 배포

`main` 브랜치에 푸시하면 Cloudflare Pages가 `npm run build`를 실행하고 `dist/`를 서비스합니다.

- 커스텀 도메인은 Cloudflare Pages 대시보드에서 설정합니다.
- `public/_redirects`가 SPA fallback(`/* /index.html 200`)을 제공하여, 클라이언트 라우트로 직접 접속하거나 새로고침해도 정상 동작합니다.

> **참고** — Cloudflare Pages는 macOS와 달리 경로의 **대소문자를 구분**합니다. `foo.png`로 참조하는데 실제 파일이 `foo.PNG`이면 로컬에서는 정상이지만 배포 후 404가 나고, 이때 SPA fallback이 에셋 대신 HTML을 반환합니다. 파일 누락이 아니라 렌더링 버그처럼 보이므로 주의가 필요합니다.

### 주요 기능

- **한 / 영** 언어 전환 (React Context)
- 메인 페이지 구성: Cover · Hero · About · Skills · Experiences · Contact
- **Projects** (`/projects`) — 카테고리 태그로 필터링되는 프로젝트 카드, 각 카드에서 GitHub 저장소나 실제 페이지로 이동
- **Laboratory** (`/lab`) — 휠·스와이프로 넘기는 가로 캐러셀, 카드마다 `/lab/<id>` 독립 페이지로 연결
- Cover 섹션에서 시작되는 BGM 플레이어
- 반응형 레이아웃
- Projects 네비게이션 링크 비 하강 애니메이션
