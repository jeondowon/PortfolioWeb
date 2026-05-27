import { useState, useRef, useCallback } from "react";
import bgm from "../../assets/audio/bgm.mp3";
import "./Cover.css";

export default function Cover({ onScrollDown }) {
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
        fadeTo(0, () => audioRef.current.pause());
        setIsPlaying(false);
        setFeedbackIcon("pause");
      } else {
        audioRef.current.volume = 0;
        audioRef.current.play();
        fadeTo(1);
        setIsPlaying(true);
        setFeedbackIcon("play");
      }
      setAnimKey((k) => k + 1);
    },
    [isPlaying, fadeTo],
  );

  return (
    <section className="cover" onClick={handleClick}>
      <div className="cover-center">
        <h1 className="cover-heading">
          Developer for
          <br />
          ideas and beyond.
          <br />
          Currently in Korea.
        </h1>
      </div>
      {feedbackIcon && (
        <div
          key={animKey}
          className="cover-feedback"
          style={{ left: clickPos.x, top: clickPos.y }}
          onAnimationEnd={() => setFeedbackIcon(null)}
        >
          {feedbackIcon === "play" ? "▶" : "⏸"}
        </div>
      )}
      <p className="cover-hint">
        Try clicking the background
        <br />
        Maybe it would do something good
      </p>
      <button
        className="cover-scroll"
        onClick={(e) => {
          e.stopPropagation();
          onScrollDown();
        }}
        aria-label="Scroll down"
      >
        <svg
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}
