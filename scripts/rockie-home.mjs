// Rockie 홈페이지 영문판을 생성한다.
//
//   npm run rockie:home
//   → public/rockie/en/index.html
//
// 한국어 `public/rockie/index.html`이 단일 원본이다. 디자인·구조를 고칠 때는
// 한국어 쪽만 고치고 이 스크립트를 다시 돌리면 영문판이 따라온다.
//
// 번역은 scripts/rockie-en.json의 표로만 한다. 표에 없는 한국어가 남아 있으면
// **생성을 중단한다.** 조용히 한국어가 섞인 영문 페이지가 나가는 것보다 낫고,
// 한국어 문구를 고쳤을 때 번역을 갱신하라고 알려주는 장치이기도 하다.

import { readFile, writeFile, mkdir } from "node:fs/promises";

const SRC = "public/rockie/index.html";
const OUT_DIR = "public/rockie/en";
const TABLE = "scripts/rockie-en.json";

const HANGUL = /[가-힣]/;
const squeeze = (s) => s.split(/\s+/).join(" ").trim();

const table = JSON.parse(await readFile(TABLE, "utf8"));
delete table._; // 표 맨 위의 설명 주석
let html = await readFile(SRC, "utf8");

const missing = new Set();

function translate(raw) {
  const key = squeeze(raw);
  if (!HANGUL.test(key)) return null; // 번역 대상이 아니다
  const value = table[key];
  if (value === undefined) {
    missing.add(key);
    return null;
  }
  return value;
}

// 1. 태그 사이의 텍스트. 원본은 들여쓰기 때문에 여러 줄에 걸쳐 있을 수 있어
//    앞뒤 공백을 살려 두고 가운데 글자만 바꾼다.
html = html.replace(/>([^<>]+)</g, (match, text) => {
  const en = translate(text);
  if (en === null) return match;
  const [, lead, , tail] = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return `>${lead}${en}${tail}<`;
});

// 2. 속성값. alt는 스크린리더가 읽고, meta content는 검색·링크 공유에 쓰인다.
html = html.replace(
  /(alt|content|title|placeholder|aria-label)="([^"]*)"/g,
  (match, attr, value) => {
    const en = translate(value);
    return en === null ? match : `${attr}="${en}"`;
  },
);

// 3. 언어·주소 등 문구가 아닌 것들.
const rewrites = [
  // 문서 언어
  ['<html lang="ko">', '<html lang="en">'],
  // 이 페이지 자신의 주소
  [
    'content="https://jeondowon.com/rockie/"',
    'content="https://jeondowon.com/rockie/en/"',
  ],
  // 언어 전환 링크: 한국어판으로 되돌아간다
  ['href="en/"', 'href="../"'],
  [">English</a", ">한국어</a"],
];
for (const [from, to] of rewrites) {
  if (!html.includes(from)) {
    console.error(`✗ 원본에서 '${from}' 를 찾지 못했습니다. index.html이 바뀌었는지 확인하세요.`);
    process.exit(1);
  }
  html = html.replaceAll(from, to);
}

// 4. 한 단계 깊어졌으므로 상대 경로를 올린다.
//    정책 문서는 영문판이 같은 깊이(en/privacy/)에 있어 그대로 두고,
//    라이선스 고지는 한국어 자리에 한 벌뿐이라 위로 올려 보낸다.
html = html
  .replace(/(src|href)="assets\//g, '$1="../assets/')
  .replace(/href="licenses\/"/g, 'href="../licenses/"');

if (missing.size) {
  console.error(`✗ 번역이 없는 문구 ${missing.size}개 — ${TABLE}에 추가하세요.\n`);
  for (const k of missing) console.error(`  "${k}": "",`);
  process.exit(1);
}

// 마지막 확인: 번역이 끝난 페이지에 한국어가 남아 있으면 안 된다.
// HTML 주석은 개발자용이고 화면에 안 나오므로 한국어로 둔다.
// 언어 전환 링크의 "한국어"는 영문판에서도 그대로 있어야 하니 함께 빼고 본다.
const leftover = html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(">한국어</a", ">LANG</a")
  .match(/[가-힣][^<>"]*/g);
if (leftover) {
  console.error(`✗ 한국어가 ${leftover.length}곳 남았습니다:`);
  for (const t of leftover.slice(0, 10)) console.error(`  ${squeeze(t)}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(`${OUT_DIR}/index.html`, html);
console.log(`✓ ${OUT_DIR}/index.html  (${(html.length / 1024).toFixed(0)}KB)`);
