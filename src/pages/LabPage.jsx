import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/common/Navbar";
import { LAB_ITEMS } from "../constants";
import { useLang } from "../contexts/LangContext";
import "./LabPage.css";

const DX = 46;
const DY = 40;

function useMobile() {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export default function LabPage() {
  const { lang, setLang } = useLang();
  const [active, setActiveState] = useState(() =>
    Math.floor(LAB_ITEMS.length / 2),
  );
  const [hover, setHover] = useState(-1);
  const [cardX, setCardX] = useState(0);
  const [cardTransition, setCardTransition] = useState(false);
  const isMobile = useMobile();
  const containerRef = useRef(null);
  const wheelAccRef = useRef(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDraggingH = useRef(false);
  const swipeLocked = useRef(false);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.backgroundColor = "#0a0a0a";
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  const step = useCallback((d) => {
    setActiveState((prev) =>
      Math.max(0, Math.min(LAB_ITEMS.length - 1, prev + d)),
    );
  }, []);

  // goNext=true: 왼쪽 드래그 → 다음 카드 (카드가 왼쪽으로 나가고 다음 카드가 오른쪽에서 진입)
  const performSwipe = useCallback(
    (goNext) => {
      if (swipeLocked.current) return;
      const cur = activeRef.current;
      const canGo = goNext ? cur < LAB_ITEMS.length - 1 : cur > 0;
      if (!canGo) {
        setCardTransition(true);
        setCardX(0);
        return;
      }

      swipeLocked.current = true;
      const W = window.innerWidth;
      const exitX = goNext ? -W : W;
      const enterX = goNext ? W : -W;

      setCardTransition(true);
      setCardX(exitX);

      setTimeout(() => {
        setCardTransition(false);
        setCardX(enterX);
        step(goNext ? 1 : -1);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setCardTransition(true);
            setCardX(0);
            setTimeout(() => {
              swipeLocked.current = false;
            }, 320);
          });
        });
      }, 260);
    },
    [step],
  );

  useEffect(() => {
    if (isMobile) return;
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      wheelAccRef.current += e.deltaY;
      if (Math.abs(wheelAccRef.current) >= 48) {
        step(wheelAccRef.current > 0 ? -1 : 1);
        wheelAccRef.current = 0;
      }
    };
    const onKey = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    if (el) el.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      if (el) el.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [step, isMobile]);

  const onTouchStart = useCallback((e) => {
    if (swipeLocked.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDraggingH.current = false;
    setCardTransition(false);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (swipeLocked.current || touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isDraggingH.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
      isDraggingH.current = Math.abs(dx) > Math.abs(dy);
    }
    if (isDraggingH.current) setCardX(dx);
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (swipeLocked.current || touchStartX.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      touchStartY.current = null;

      if (isDraggingH.current && Math.abs(dx) > 40) {
        performSwipe(dx < 0); // 왼쪽 드래그 = 다음 카드
      } else {
        setCardTransition(true);
        setCardX(0);
      }
    },
    [performSwipe],
  );

  const ap = LAB_ITEMS[active];

  const titleBlock = (
    <div className="lab-title-block">
      <div className="lab-title">Laboratory</div>
      <div className="lab-subtitle">
        {lang === "ko"
          ? "인터랙티브 웹, 게임 등 다양한 실험들을 아카이브하는 공간입니다."
          : "An archive of interactive web experiments, games, and various things worth trying."}
      </div>
    </div>
  );

  return (
    <>
      <Navbar
        onHome={() => {
          window.location.href = "/";
        }}
        onAbout={() => {
          window.location.href = "/#about";
        }}
        onContact={() => {
          window.location.href = "/#contact";
        }}
        onLab={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        lang={lang}
        onLangChange={setLang}
        dark
      />

      <div ref={containerRef} className="lab-container">
        <div className="lab-grid-overlay" />
        <div className="lab-vignette" />

        {isMobile ? (
          <div className="lab-mobile">
            {titleBlock}
            {ap && (
              <>
                <div className="lab-mobile-clip">
                  <div
                    className="lab-mobile-full-card"
                    style={{
                      transform: `translateX(${cardX}px)`,
                      transition: cardTransition
                        ? "transform 0.28s cubic-bezier(.22,.61,.36,1)"
                        : "none",
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                  >
                    <div className="lab-detail-thumb">
                      {ap.thumbnail ? (
                        <img
                          className="lab-thumb-img"
                          src={ap.thumbnail}
                          alt={ap.title}
                        />
                      ) : (
                        <div className="lab-thumb-bg" />
                      )}
                    </div>
                    <div className="lab-detail-meta">
                      {ap.exp} · {ap.date}
                    </div>
                    <div className="lab-detail-title">{ap.title}</div>
                    <div className="lab-detail-blurb">{ap.blurb}</div>
                    <div className="lab-detail-tags">
                      {ap.tags.map((tag) => (
                        <span key={tag} className="lab-detail-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={ap.url}
                      target="_blank"
                      rel="noreferrer"
                      className="lab-detail-open"
                    >
                      <span>Open experiment</span>
                      <svg
                        className="lab-open-arrow"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M1 11L11 1M11 1H3M11 1V9"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="lab-mobile-dots">
                  {LAB_ITEMS.map((_, i) => (
                    <span
                      key={i}
                      className={`lab-mobile-dot${i === active ? " active" : ""}`}
                      onClick={() => setActiveState(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            {titleBlock}

            {LAB_ITEMS.map((item, i) => {
              const r = i - active;
              const ar = Math.abs(r);
              const isActive = r === 0;
              const isHover = hover === i;
              const scale =
                (isActive ? 1 : Math.max(0.6, 1 - ar * 0.05)) +
                (isHover ? 0.03 : 0);
              const lift = isHover ? -100 : 0;
              const visible = ar <= 8;

              return (
                <div
                  key={item.id}
                  className="lab-card-wrap"
                  style={{
                    transform: `translate(-50%,-50%) translate(${r * DX}px,${-r * DY}px) translateY(${lift}px) scale(${scale})`,
                    zIndex: 500 - r,
                    cursor: isActive ? "default" : "pointer",
                    pointerEvents: visible ? "auto" : "none",
                  }}
                  onClick={() => {
                    if (!isActive) setActiveState(i);
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() =>
                    setHover((prev) => (prev === i ? -1 : prev))
                  }
                >
                  <div
                    className="lab-card"
                    style={{
                      boxShadow: isActive
                        ? "0 34px 72px -18px rgba(0,0,0,.78)"
                        : "0 16px 34px -16px rgba(0,0,0,.6)",
                      filter: isActive
                        ? "none"
                        : `grayscale(1) brightness(${Math.max(0.5, 0.84 - ar * 0.05)})`,
                    }}
                  >
                    <div className="lab-card-thumb-area">
                      {item.thumbnail ? (
                        <img
                          className="lab-thumb-img"
                          src={item.thumbnail}
                          alt={item.title}
                        />
                      ) : (
                        <div className="lab-thumb-bg" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {ap && (
              <div className="lab-detail">
                <div className="lab-detail-thumb">
                  {ap.thumbnail ? (
                    <img
                      className="lab-thumb-img"
                      src={ap.thumbnail}
                      alt={ap.title}
                    />
                  ) : (
                    <div className="lab-thumb-bg" />
                  )}
                </div>
                <div className="lab-detail-meta">
                  {ap.exp} · {ap.date}
                </div>
                <div className="lab-detail-title">{ap.title}</div>
                <div className="lab-detail-blurb">{ap.blurb}</div>
                <div className="lab-detail-tags">
                  {ap.tags.map((tag) => (
                    <span key={tag} className="lab-detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={ap.url}
                  target="_blank"
                  rel="noreferrer"
                  className="lab-detail-open"
                >
                  <span>Open experiment</span>
                  <svg
                    className="lab-open-arrow"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M1 11L11 1M11 1H3M11 1V9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
