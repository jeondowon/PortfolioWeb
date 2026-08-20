// Rockie 다운로드 현황을 GitHub Releases API에서 조회해 출력한다.
// 다운로드 버튼(public/rockie/index.html)이 Releases 자산으로 직접 링크되므로
// GitHub이 세어 둔 자산별 download_count가 곧 다운로드 수다.

const REPO = "jeondowon/rockie";

// electron-updater가 업데이트를 확인할 때 읽는 파일들. 실제 다운로드가 아니다.
const isUpdateFile = (name) => name.endsWith(".yml") || name.endsWith(".blockmap");

const res = await fetch(`https://api.github.com/repos/${REPO}/releases`, {
  headers: { Accept: "application/vnd.github+json" },
});
if (!res.ok) {
  console.error(`GitHub API 오류: ${res.status} ${res.statusText}`);
  process.exit(1);
}

const releases = await res.json();
if (releases.length === 0) {
  console.log("릴리스가 없습니다.");
  process.exit(0);
}

let totalDownloads = 0;
let totalUpdateChecks = 0;

console.log(`\nRockie 다운로드 현황  (${REPO})`);

for (const release of releases) {
  const date = release.published_at.slice(0, 10);
  console.log(`\n${release.tag_name}  ${date}`);

  for (const asset of release.assets) {
    const count = asset.download_count;
    if (isUpdateFile(asset.name)) {
      totalUpdateChecks += count;
    } else {
      totalDownloads += count;
      console.log(`  ${asset.name.padEnd(34)}${String(count).padStart(5)}`);
    }
  }

  const checks = release.assets
    .filter((a) => isUpdateFile(a.name))
    .reduce((sum, a) => sum + a.download_count, 0);
  if (checks > 0) console.log(`  ${"└ 업데이트 체크".padEnd(28)}${String(checks).padStart(5)}`);
}

console.log(`\n총 다운로드    ${totalDownloads}`);
console.log(`업데이트 체크  ${totalUpdateChecks}\n`);
