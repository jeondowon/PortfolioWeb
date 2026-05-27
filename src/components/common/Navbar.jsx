import { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const LANGS = [
  { value: "en", label: "English" },
  { value: "ko", label: "Korean" },
];

function LangDropdown({ lang, onLangChange }) {
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

export default function Navbar({
  onHome,
  onAbout,
  onExperience,
  onProjects,
  onSkills,
  onContact,
  lang,
  onLangChange,
  dark,
}) {
  const handleClick = (e, callback) => {
    e.preventDefault();
    callback();
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
            <a href="#projects" onClick={(e) => handleClick(e, onProjects)}>
              Projects
            </a>
          </li>
          <li>
            <a href="#skills" onClick={(e) => handleClick(e, onSkills)}>
              Skills
            </a>
          </li>
          <li>
            <a href="#experience" onClick={(e) => handleClick(e, onExperience)}>
              Experience
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
    </nav>
  );
}
