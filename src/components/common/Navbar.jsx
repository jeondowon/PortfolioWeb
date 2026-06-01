import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import "./Navbar.css";

const LANGS = [
  { value: "en", label: "English" },
  { value: "ko", label: "Korean" },
];

function LangDropdown({ lang, onLangChange, onClose }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-dropdown__trigger"
        onClick={() => setOpen((v) => !v)}
      >
        Language
        <span
          className={`lang-dropdown__arrow ${open ? "lang-dropdown__arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>
      <ul
        className={`lang-dropdown__menu ${open ? "lang-dropdown__menu--open" : ""}`}
      >
        {LANGS.map((l) => (
          <li key={l.value}>
            <button
              className={`lang-dropdown__item ${l.value === lang ? "lang-dropdown__item--active" : ""}`}
              onClick={() => {
                onLangChange(l.value);
                setOpen(false);
                onClose?.();
              }}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RainLink({ dark, coverEndRef, children, mobile = false, active = true }) {
  const ref = useRef(null);
  const [animPhase, setAnimPhase] = useState("idle");
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(64);
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return !mobile;
    return mobile
      ? window.matchMedia("(max-width: 768px)").matches
      : window.matchMedia("(min-width: 769px)").matches;
  });
  const timers = useRef([]);

  useEffect(() => {
    const mq = mobile
      ? window.matchMedia("(max-width: 768px)")
      : window.matchMedia("(min-width: 769px)");
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [mobile]);

  useEffect(() => {
    const update = () => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect?.width > 0) {
        setDropX(rect.left + rect.width / 2);
        if (mobile) setDropY(rect.bottom);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [mobile]);

  useEffect(() => {
    if (!dark || !matches || !active) {
      setAnimPhase("idle");
      timers.current.forEach(clearTimeout);
      return;
    }
    const runCycle = () => {
      timers.current.forEach(clearTimeout);
      const rect = ref.current?.getBoundingClientRect();
      if (rect?.width > 0) {
        setDropX(rect.left + rect.width / 2);
        if (mobile) setDropY(rect.bottom);
      }
      setAnimPhase("underline");
      timers.current = [
        setTimeout(() => setAnimPhase("erasing"), 700),
        setTimeout(() => setAnimPhase("falling"), 1400),
        setTimeout(() => setAnimPhase("splash"), 2800),
        setTimeout(() => setAnimPhase("idle"), 3300),
      ];
    };
    runCycle();
    const interval = setInterval(runCycle, 5000);
    return () => {
      clearInterval(interval);
      timers.current.forEach(clearTimeout);
    };
  }, [dark, matches, active, mobile]);

  return (
    <span className="projects-anim" ref={ref}>
      {children}
      {(animPhase === "underline" || animPhase === "erasing") && (
        <>
          <span className={`rain-underline rain-underline--left rain-underline--${animPhase === "underline" ? "draw" : "erase"}`} />
          <span className={`rain-underline rain-underline--right rain-underline--${animPhase === "underline" ? "draw" : "erase"}`} />
        </>
      )}
      {animPhase === "falling" &&
        createPortal(
          <span
            className="rain-drop"
            style={{
              left: dropX,
              ...(mobile && { "--rain-start": `${dropY}px` }),
              "--rain-end": `${(coverEndRef?.current?.getBoundingClientRect().top ?? window.innerHeight) - 20}px`,
            }}
          />,
          document.body
        )}
      {animPhase === "splash" &&
        createPortal(
          <span
            className="rain-splash-container"
            style={{
              left: dropX,
              "--splash-y": `${(coverEndRef?.current?.getBoundingClientRect().top ?? window.innerHeight) - 4}px`,
            }}
          >
            <span className="rain-splash rain-splash--1" />
            <span className="rain-splash rain-splash--2" />
            <span className="rain-splash rain-splash--3" />
            <span className="rain-splash rain-splash--4" />
            <span className="rain-splash rain-splash--5" />
          </span>,
          document.body
        )}
    </span>
  );
}

export default function Navbar({
  onHome,
  onAbout,
  onExperience,
  onSkills,
  onContact,
  onProjects,
  lang,
  onLangChange,
  dark,
  rain,
  coverEndRef,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const bar3Ref = useRef(null);
  const [hamburgerRainPhase, setHamburgerRainPhase] = useState("idle");
  const [dropX, setDropX] = useState(0);
  const [dropY, setDropY] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 768px)").matches
  );
  const hamburgerRainTimers = useRef([]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const update = () => {
      const rect = bar3Ref.current?.getBoundingClientRect();
      if (rect?.width > 0) {
        setDropX(rect.left + rect.width / 2);
        setDropY(rect.bottom);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!rain || !isMobile || menuOpen) {
      setHamburgerRainPhase("idle");
      hamburgerRainTimers.current.forEach(clearTimeout);
      return;
    }
    const runCycle = () => {
      hamburgerRainTimers.current.forEach(clearTimeout);
      setHamburgerRainPhase("drawing");
      hamburgerRainTimers.current = [
        setTimeout(() => setHamburgerRainPhase("falling"), 1100),
        setTimeout(() => setHamburgerRainPhase("splash"), 2500),
        setTimeout(() => setHamburgerRainPhase("idle"), 3000),
      ];
    };
    runCycle();
    const interval = setInterval(runCycle, 5000);
    return () => {
      clearInterval(interval);
      hamburgerRainTimers.current.forEach(clearTimeout);
    };
  }, [rain, isMobile, menuOpen]);

  const handleClick = (e, callback) => {
    e.preventDefault();
    callback();
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${dark ? "" : "navbar--light"}`}>
      <div className="navbar-identity">
        <span className="navbar-identity__name">Dowon Jeon</span>
        <span className="navbar-identity__sub">AI·Computer Science</span>
      </div>

      <div className="navbar-inner">
        <ul className="navbar-links">
          <li>
            <a href="#" onClick={(e) => handleClick(e, onHome)}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleClick(e, onAbout)}>
              About
            </a>
          </li>
          <li>
            <RainLink dark={rain} coverEndRef={coverEndRef}>
              {onProjects ? (
                <a href="#" onClick={(e) => handleClick(e, onProjects)}>
                  Projects
                </a>
              ) : (
                <Link to="/projects">Projects</Link>
              )}
            </RainLink>
          </li>
          <li>
            <a href="#skills" onClick={(e) => handleClick(e, onSkills)}>
              Skills
            </a>
          </li>
          <li>
            <a
              href="#experiences"
              onClick={(e) => handleClick(e, onExperience)}
            >
              Experiences
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleClick(e, onContact)}>
              Contact
            </a>
          </li>
          <li>
            <LangDropdown lang={lang} onLangChange={onLangChange} />
          </li>
        </ul>
      </div>

      <button
        className={`navbar-hamburger ${menuOpen ? "navbar-hamburger--open" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        <span className="navbar-hamburger__bar" />
        <span className="navbar-hamburger__bar" />
        <span
          className={`navbar-hamburger__bar${hamburgerRainPhase === "drawing" ? " navbar-hamburger__bar--hidden" : ""}`}
          ref={bar3Ref}
        />
        {hamburgerRainPhase === "drawing" && (
          <>
            <span className="hamburger-rain-line hamburger-rain-line--left" />
            <span className="hamburger-rain-line hamburger-rain-line--right" />
          </>
        )}
      </button>

      <div
        className={`navbar-mobile-menu ${menuOpen ? "navbar-mobile-menu--open" : ""}`}
      >
        <ul className="navbar-mobile-links">
          <li>
            <a href="#" onClick={(e) => handleClick(e, onHome)}>
              Home
            </a>
          </li>
          <li>
            <a href="#about" onClick={(e) => handleClick(e, onAbout)}>
              About
            </a>
          </li>
          <li>
            <RainLink dark={rain} coverEndRef={coverEndRef} mobile active={menuOpen}>
              {onProjects ? (
                <a href="#" onClick={(e) => handleClick(e, onProjects)}>
                  Projects
                </a>
              ) : (
                <Link to="/projects" onClick={() => setMenuOpen(false)}>
                  Projects
                </Link>
              )}
            </RainLink>
          </li>
          <li>
            <a href="#skills" onClick={(e) => handleClick(e, onSkills)}>
              Skills
            </a>
          </li>
          <li>
            <a
              href="#experiences"
              onClick={(e) => handleClick(e, onExperience)}
            >
              Experiences
            </a>
          </li>
          <li>
            <a href="#contact" onClick={(e) => handleClick(e, onContact)}>
              Contact
            </a>
          </li>
          <li className="navbar-mobile-lang">
            <LangDropdown
              lang={lang}
              onLangChange={onLangChange}
              onClose={() => setMenuOpen(false)}
            />
          </li>
        </ul>
      </div>
      {hamburgerRainPhase === "falling" &&
        createPortal(
          <span
            className="rain-drop"
            style={{
              left: dropX,
              "--rain-start": `${dropY}px`,
              "--rain-end": `${(coverEndRef?.current?.getBoundingClientRect().top ?? window.innerHeight) - 20}px`,
            }}
          />,
          document.body
        )}
      {hamburgerRainPhase === "splash" &&
        createPortal(
          <span
            className="rain-splash-container"
            style={{
              left: dropX,
              "--splash-y": `${(coverEndRef?.current?.getBoundingClientRect().top ?? window.innerHeight) - 4}px`,
            }}
          >
            <span className="rain-splash rain-splash--1" />
            <span className="rain-splash rain-splash--2" />
            <span className="rain-splash rain-splash--3" />
            <span className="rain-splash rain-splash--4" />
            <span className="rain-splash rain-splash--5" />
          </span>,
          document.body
        )}
    </nav>
  );
}
