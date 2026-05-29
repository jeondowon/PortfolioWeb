# Portfolio Website

[English](#english) | [한국어](#한국어)

---

## English

Personal portfolio website built with React and Vite, deployed via GitHub Pages.

**Live:** [jeondowon.com](https://jeondowon.com)

### Tech Stack

- **React 18** — UI
- **React Router v7** — client-side routing
- **Vite** — build tool & dev server
- **react-icons** — icon set
- **GitHub Actions** — CI/CD → GitHub Pages

### Project Structure

```
src/
├── components/
│   ├── sections/     # Page sections (Hero, Cover, About, Experiences, Skills, Contact)
│   └── common/       # Shared UI (Navbar, ScrollButton)
├── pages/            # Route-level pages (ProjectsPage)
├── contexts/         # React contexts (LangContext — KO/EN toggle)
├── constants/        # Site data (projects, skills, experience, social links)
├── hooks/            # Custom hooks
└── assets/           # Static assets (audio, etc.)
```

### Getting Started

```bash
npm install
npm run dev
npm run build
npm run preview
```

### Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the project and deploys the `dist/` folder to GitHub Pages. The custom domain `jeondowon.com` is configured via `public/CNAME`.

### Features

- **KO / EN** language toggle (React Context)
- Sections: Hero · About · Experiences · Projects · Skills · Contact
- BGM player
- Responsive layout
- Rain animation on Projects nav link

---

## 한국어

React와 Vite로 제작하고 GitHub Pages에 배포한 개인 포트폴리오 웹사이트입니다.

**라이브:** [jeondowon.com](https://jeondowon.com)

### 기술 스택

- **React 18** — UI
- **React Router v7** — 클라이언트 사이드 라우팅
- **Vite** — 빌드 도구 & 개발 서버
- **react-icons** — 아이콘
- **GitHub Actions** — CI/CD → GitHub Pages

### 프로젝트 구조

```
src/
├── components/
│   ├── sections/     # 페이지 섹션 (Hero, Cover, About, Experiences, Skills, Contact)
│   └── common/       # 공통 UI (Navbar, ScrollButton)
├── pages/            # 라우트 페이지 (ProjectsPage)
├── contexts/         # React Context (LangContext — 한/영 전환)
├── constants/        # 사이트 데이터 (프로젝트, 기술, 경력, 소셜 링크)
├── hooks/            # 커스텀 훅
└── assets/           # 정적 자산 (오디오 등)
```

### 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 로컬에서 프로덕션 빌드 미리보기
```

### 배포

`main` 브랜치에 푸시하면 GitHub Actions 워크플로우(`.github/workflows/deploy.yml`)가 자동으로 실행되어 `dist/` 폴더를 GitHub Pages에 배포합니다. 커스텀 도메인 `jeondowon.com`은 `public/CNAME`으로 설정되어 있습니다.

### 주요 기능

- **한 / 영** 언어 전환 (React Context)
- 섹션 구성: Hero · About · Experiences · Projects · Skills · Contact
- BGM 플레이어
- 반응형 레이아웃
- Projects 네비게이션 링크 비 하강 애니메이션
