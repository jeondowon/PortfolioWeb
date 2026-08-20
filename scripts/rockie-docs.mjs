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

const RAW = "https://raw.githubusercontent.com/jeondowon/rockie/main";

const PAGES = [
  {
    slug: "privacy",
    src: `${RAW}/docs/privacy-policy.md`,
    title: "개인정보처리방침",
    desc: "Rockie가 어떤 정보를 다루고 그 정보가 어디에 머무는지",
  },
  {
    slug: "terms",
    src: `${RAW}/docs/terms.md`,
    title: "이용약관",
    desc: "Rockie의 이용 조건",
  },
  {
    slug: "licenses",
    src: `${RAW}/assets/licenses/THIRD-PARTY-NOTICES.md`,
    title: "오픈소스 라이선스",
    desc: "Rockie에 포함된 오픈소스 소프트웨어의 저작권 고지",
  },
];

// 문서끼리 거는 상대경로는 저장소 안에서만 맞는 주소다. 웹에서는 페이지 주소로 바꾼다.
const DOC_LINKS = {
  "./privacy-policy.md": "../privacy/",
  "./terms.md": "../terms/",
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

function page({ slug, title, desc }, bodyHtml) {
  const nav = PAGES.map((p) =>
    p.slug === slug
      ? `<span class="here">${p.title}</span>`
      : `<a href="../${p.slug}/">${p.title}</a>`,
  ).join("");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} · Rockie</title>
    <meta name="description" content="${desc}" />
    <meta name="robots" content="index, follow" />
    <link rel="icon" type="image/png" href="../assets/favicon.png" />
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
        <a class="home" href="../">
          <img src="../assets/favicon.png" alt="" />
          ROCKIE
        </a>
        <nav class="doc-nav">${nav}</nav>
      </div>
    </header>
    <main>
${bodyHtml}
    </main>
    <footer>
      <div class="foot-inner">
        <span>© 2026 jeondowon</span>
        <span style="margin-left: auto">
          <a href="mailto:dowon.9102@gmail.com">dowon.9102@gmail.com</a>
        </span>
      </div>
    </footer>
  </body>
</html>
`;
}

for (const p of PAGES) {
  const res = await fetch(p.src);
  if (!res.ok) {
    console.error(`✗ ${p.src} — ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const html = page(p, toHtml(await res.text()));
  await mkdir(`public/rockie/${p.slug}`, { recursive: true });
  await writeFile(`public/rockie/${p.slug}/index.html`, html);
  console.log(`✓ public/rockie/${p.slug}/index.html  (${(html.length / 1024).toFixed(0)}KB)`);
}
