import { useState, useRef, useCallback } from "react";
import bgm from "../../assets/audio/bgm.mp3";
import ScrollButton from "../common/ScrollButton";
import "./Cover.css";

const TEXT = {
  en: {
    heading: ["Developer for", "ideas and beyond.", "Currently in Korea."],
    hint: ["Try clicking the background", "Maybe it would do something good"],
    hintTouch: "Try touching the background",
  },
  ko: {
    heading: ["생각을 현실로,", "아이디어와 그 너머를", "바라보는 개발자"],
    hint: ["배경을 클릭해보세요", "무언가 좋은 일이 생길지도 몰라요."],
    hintTouch: "배경을 터치해보세요",
  },
};

export default function Cover({ lang = "en", onScrollDown }) {
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedbackIcon, setFeedbackIcon] = useState(null);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [animKey, setAnimKey] = useState(0);

  const fadeTo = useCallback((targetVolume, onDone) => {
    const audio = audioRef.current;
    clearInterval(fadeTimerRef.current);
    const step = (targetVolume - audio.volume) / 20;
    fadeTimerRef.current = setInterval(() => {
      const next = audio.volume + step;
      if (
        (step > 0 && next >= targetVolume) ||
        (step < 0 && next <= targetVolume)
      ) {
        audio.volume = targetVolume;
        clearInterval(fadeTimerRef.current);
        onDone?.();
      } else {
        audio.volume = next;
      }
    }, 20);
  }, []);

  const handleClick = useCallback(
    (e) => {
      if (!audioRef.current) {
        audioRef.current = new Audio(bgm);
        audioRef.current.loop = true;
      }

      setClickPos({ x: e.clientX, y: e.clientY });

      if (isPlaying) {
        audioRef.current.pause();
        fadeTo(0);
        setIsPlaying(false);
        setFeedbackIcon("pause");
      } else {
        audioRef.current.volume = 0;
        audioRef.current.play().catch(() => {});
        fadeTo(1);
        setIsPlaying(true);
        setFeedbackIcon("play");
      }
      setAnimKey((k) => k + 1);
    },
    [isPlaying, fadeTo],
  );

  const t = TEXT[lang];

  return (
    <section className="cover" onClick={handleClick}>
      <div className="cover-center">
        <h1 className="cover-heading">
          {t.heading.map((line, i) => (
            <span key={i}>
              {line}
              {i < t.heading.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </div>
      {feedbackIcon && (
        <div
          key={animKey}
          className="cover-feedback"
          style={{ left: clickPos.x, top: clickPos.y }}
          onAnimationEnd={() => setFeedbackIcon(null)}
        >
          {feedbackIcon === "play" ? "▶︎" : "⏸︎"}
        </div>
      )}
      <p className="cover-hint">
        <span className="cover-hint__click">{t.hint[0]}</span>
        <span className="cover-hint__touch">{t.hintTouch}</span>
        <br />
        {t.hint[1]}
      </p>
      <ScrollButton
        className="cover-scroll"
        onClick={(e) => {
          e.stopPropagation();
          onScrollDown();
        }}
      />
    </section>
  );
}
