// Rockie 정책 문서 페이지를 생성한다.
//
//   npm run rockie:docs
//   → public/rockie/{privacy,terms,licenses}/index.html
//
// 원본은 앱 저장소(jeondowon/rockie)에 있다. 앱과 함께 배포되는 문서라 그쪽이
// 단일 정의처이고, 여기서는 받아서 페이지로 감싸기만 한다. 사본을 두면 앱이
// 여는 주소의 내용과 앱에 동봉된 문서가 어긋난다.
//
// 문서를 고쳤으면 rockie 저장소에 먼저 푸시하고 이 스크립트를 다시 돌린다.

import { writeFile, mkdir } from "node:fs/promises";

// 푸시 전 미리보기용으로 ROCKIE_DOCS_SRC에 로컬 서버 주소를 넣을 수 있다.
const RAW =
  process.env.ROCKIE_DOCS_SRC ??
  "https://raw.githubusercontent.com/jeondowon/rockie/main";

// 한국어는 /rockie/<slug>/, 영어는 /rockie/en/<slug>/ 에 놓는다.
// 라이선스 고지는 본문이 영문 라이선스 전문이고 머리말만 이중 언어라 한 벌만 만들고
// 양쪽 언어가 같은 페이지를 가리킨다.
const PAGES = [
  {
    slug: "privacy",
    ko: { src: `${RAW}/docs/privacy-policy.md`, title: "개인정보처리방침",
          desc: "Rockie가 어떤 정보를 다루고 그 정보가 어디에 머무는지" },
    en: { src: `${RAW}/docs/privacy-policy.en.md`, title: "Privacy Policy",
          desc: "What Rockie handles, and where that information stays" },
  },
  {
    slug: "terms",
    ko: { src: `${RAW}/docs/terms.md`, title: "이용약관",
          desc: "Rockie의 이용 조건" },
    en: { src: `${RAW}/docs/terms.en.md`, title: "Terms of Use",
          desc: "The conditions for using Rockie" },
  },
  {
    slug: "install",
    ko: { src: `${RAW}/docs/install.md`, title: "설치 안내",
          desc: "Rockie 설치·권한·업데이트·삭제 안내" },
    en: { src: `${RAW}/docs/install.en.md`, title: "Install Guide",
          desc: "Installing Rockie, permissions, updates, and removal" },
  },
  {
    slug: "licenses",
    shared: true, // 언어별 사본을 만들지 않는다
    ko: { src: `${RAW}/assets/licenses/THIRD-PARTY-NOTICES.md`,
          title: "오픈소스 라이선스",
          desc: "Rockie에 포함된 오픈소스 소프트웨어의 저작권 고지" },
    en: { title: "Open Source" },
  },
];

const NAV_SWITCH = { ko: "English", en: "한국어" };

// 문서끼리 거는 상대경로는 저장소 안에서만 맞는 주소다. 웹에서는 페이지 주소로 바꾼다.
// 한국어판과 영문판이 같은 깊이에 있어 상대 주소가 동일하다.
const DOC_LINKS = {
  "./privacy-policy.md": "../privacy/",
  "./terms.md": "../terms/",
  "./privacy-policy.en.md": "../privacy/",
  "./terms.en.md": "../terms/",
};

const esc = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// 인라인 문법. 코드가 먼저다 — 코드 안의 **나 [](), 는 문법이 아니라 글자다.
function inline(text) {
  // 자리표시자는 본문에 나올 수 없는 문자여야 한다. 숫자만 쓰면 "패키지 123개"
  // 같은 평범한 숫자를 코드로 되돌리게 된다.
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_m, code) => {
    codes.push(code);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = esc(s);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, label, href) => `<a href="${DOC_LINKS[href] ?? href}">${label}</a>`,
  );
  // 문서에 그대로 적힌 주소도 누를 수 있게 한다(방침의 GitHub 링크 등).
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, '$1<a href="$2">$2</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_m, i) => `<code>${esc(codes[i])}</code>`);
}

const cells = (row) =>
  row
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

// 이 문서들이 실제로 쓰는 문법만 다룬다: 코드펜스, 제목, 구분선, 표, 목록, 문단.
// 라이선스 전문이 통째로 코드펜스 안에 들어오므로 펜스 판정이 가장 먼저다.
function toHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const body = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++; // 닫는 펜스
      out.push(`<pre><code>${esc(body.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      // 문서의 첫 줄 "# 제목"이 곧 페이지 제목이라 단계를 그대로 쓴다.
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    // 표: 헤더 줄 + 구분 줄이 붙어 있을 때만 표로 본다.
    if (line.startsWith("|") && /^\|[\s:|-]+\|$/.test(lines[i + 1] || "")) {
      const head = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) rows.push(cells(lines[i++]));
      out.push(
        `<div class="table-wrap"><table><thead><tr>${head
          .map((c) => `<th>${inline(c)}</th>`)
          .join("")}</tr></thead><tbody>${rows
          .map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`)
          .join("")}</tbody></table></div>`,
      );
      continue;
    }

    // 인용문. 문서에서 "참고"성 문단에 쓴다.
    if (line.startsWith(">")) {
      const body = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        body.push(lines[i++].replace(/^>\s?/, ""));
      }
      out.push(`<blockquote>${inline(body.join("\n")).replace(/\n/g, "<br />")}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    // 나머지는 문단. 빈 줄이 나올 때까지 모은다. 문단 안의 줄바꿈은 <br />로
    // 살린다 — 원본을 GitHub에서 볼 때와 같은 모양이 되도록.
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith(">") &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i]) &&
      !/^\s*([-*]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i++]);
    }
    out.push(`<p>${inline(para.join("\n")).replace(/\n/g, "<br />")}</p>`);
  }

  return out.join("\n");
}

// locale에 따라 페이지가 놓이는 깊이가 다르다.
//   ko: /rockie/<slug>/      → /rockie 로 올라가려면 ".."
//   en: /rockie/en/<slug>/   → "../.."
function page({ slug, title, desc, locale }, bodyHtml) {
  const rockie = locale === "en" ? "../.." : "..";
  // 같은 언어의 다른 문서는 형제 폴더다. 단 공용 페이지(licenses)는 한국어 자리에만 있다.
  const linkTo = (target) =>
    target.shared ? `${rockie}/${target.slug}/` : `../${target.slug}/`;

  const nav = PAGES.map((t) => {
    const label = (t[locale] ?? t.ko).title;
    return t.slug === slug
      ? `<span class="here">${label}</span>`
      : `<a href="${linkTo(t)}">${label}</a>`;
  }).join("");

  // 같은 문서의 반대 언어판. 공용 페이지는 한 벌뿐이라 전환 링크를 두지 않는다.
  const shared = PAGES.find((t) => t.slug === slug)?.shared;
  const switchLink = shared
    ? ""
    : `<a class="lang" href="${
        locale === "en" ? `${rockie}/${slug}/` : `../en/${slug}/`
      }">${NAV_SWITCH[locale]}</a>`;

  return `<!doctype html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} · Rockie</title>
    <meta name="description" content="${desc}" />
    <meta name="robots" content="index, follow" />
    <link rel="icon" type="image/png" href="${rockie}/assets/favicon.png" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/galmuri/dist/galmuri.css"
    />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: "Pretendard", "Apple SD Gothic Neo", sans-serif;
        background: #f2ede1;
        color: #1b1b16;
        line-height: 1.75;
        -webkit-font-smoothing: antialiased;
      }
      a { color: #4f7a3f; }
      a:hover { color: #a8432b; }
      ::selection { background: #4f7a3f; color: #f2ede1; }

      .top {
        border-bottom: 2px solid #1b1b16;
        background: #faf8f1;
        position: sticky;
        top: 0;
        z-index: 2;
      }
      .top-inner {
        max-width: 780px;
        margin: 0 auto;
        padding: 16px 22px;
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }
      .home {
        font-family: "Galmuri14", monospace;
        font-size: 14px;
        letter-spacing: 1px;
        color: #1b1b16;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .home img { width: 20px; height: 20px; image-rendering: pixelated; }
      .home:hover { color: #a8432b; }
      .doc-nav {
        margin-left: auto;
        display: flex;
        gap: 14px;
        font-family: "Galmuri11", monospace;
        font-size: 11px;
      }
      .doc-nav a { text-decoration: none; }
      .doc-nav .here { color: #a8432b; }
      .doc-nav .lang { color: #1b1b16; border-bottom: 1px solid #1b1b16; }

      main { max-width: 780px; margin: 0 auto; padding: 44px 22px 90px; }
      h1 {
        font-family: "Galmuri14", monospace;
        font-size: clamp(22px, 4vw, 30px);
        line-height: 1.4;
        margin-bottom: 28px;
        padding-bottom: 18px;
        border-bottom: 2px solid #1b1b16;
      }
      h2 {
        font-family: "Galmuri11", monospace;
        font-size: 16px;
        line-height: 1.6;
        margin: 44px 0 14px;
        color: #1b1b16;
      }
      h3 {
        font-family: "Galmuri11", monospace;
        font-size: 13px;
        margin: 28px 0 10px;
        color: #4f7a3f;
      }
      h4 { font-size: 14px; margin: 20px 0 8px; }
      p { margin: 12px 0; }
      ul, ol { margin: 12px 0 12px 22px; }
      li { margin: 5px 0; }
      hr { border: none; border-top: 2px solid #d9d2c0; margin: 38px 0; }
      strong { font-weight: 700; }
      code {
        font-family: "Galmuri11", monospace;
        font-size: 0.88em;
        background: #e7e1d2;
        padding: 1px 5px;
      }
      pre {
        background: #faf8f1;
        border: 2px solid #d9d2c0;
        padding: 14px 16px;
        overflow-x: auto;
        margin: 14px 0;
      }
      pre code {
        background: none;
        padding: 0;
        font-size: 11px;
        line-height: 1.6;
        white-space: pre;
      }
      blockquote {
        margin: 16px 0;
        padding: 12px 16px;
        border-left: 4px solid #4f7a3f;
        background: #e9e3d4;
      }
      .table-wrap { overflow-x: auto; margin: 16px 0; }
      table { border-collapse: collapse; width: 100%; font-size: 14px; }
      th, td {
        border: 1px solid #d9d2c0;
        padding: 8px 11px;
        text-align: left;
        vertical-align: top;
      }
      th { background: #e7e1d2; font-weight: 700; white-space: nowrap; }

      footer {
        border-top: 2px solid #1b1b16;
        background: #1b1b16;
        color: #6b6656;
        font-family: "Galmuri11", monospace;
        font-size: 11px;
      }
      .foot-inner {
        max-width: 780px;
        margin: 0 auto;
        padding: 24px 22px;
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .foot-inner a { color: #6b6656; text-decoration: none; }
      .foot-inner a:hover { color: #e9c85b; }
    </style>
  </head>
  <body>
    <header class="top">
      <div class="top-inner">
        <a class="home" href="${rockie}/">
          <img src="${rockie}/assets/favicon.png" alt="" />
          ROCKIE
        </a>
        <nav class="doc-nav">${nav}${switchLink}</nav>
      </div>
    </header>
    <main>
${bodyHtml}
    </main>
    <footer>
      <div class="foot-inner">
        <span>© 2026 jeondowon</span>
        <span style="margin-left: auto">
          <a href="mailto:jeondowon.dev@gmail.com">jeondowon.dev@gmail.com</a>
        </span>
      </div>
    </footer>
  </body>
</html>
`;
}

for (const p of PAGES) {
  for (const locale of p.shared ? ["ko"] : ["ko", "en"]) {
    const meta = p[locale];
    const res = await fetch(meta.src);
    if (!res.ok) {
      console.error(`✗ ${meta.src} — ${res.status} ${res.statusText}`);
      process.exit(1);
    }
    const dir = locale === "en" ? `public/rockie/en/${p.slug}` : `public/rockie/${p.slug}`;
    const html = page({ ...meta, slug: p.slug, locale }, toHtml(await res.text()));
    await mkdir(dir, { recursive: true });
    await writeFile(`${dir}/index.html`, html);
    console.log(`✓ ${dir}/index.html  (${(html.length / 1024).toFixed(0)}KB)`);
  }
}
