import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Contact from "../components/sections/Contact";
import { LAB_ITEMS, NAVBAR_H } from "../constants";
import { useLang } from "../contexts/LangContext";
import "./LabPage.css";

export default function LabPage() {
  const { lang, setLang } = useLang();
  const [onContact, setOnContact] = useState(false);
  const contactRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.backgroundColor = "#111";
    return () => {
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const el = contactRef.current;
      if (el) {
        const { top, bottom } = el.getBoundingClientRect();
        setOnContact(top <= NAVBAR_H && bottom > NAVBAR_H);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar
        onHome={() => { window.location.href = "/"; }}
        onAbout={() => { window.location.href = "/#about"; }}
        onExperience={() => { window.location.href = "/#experiences"; }}
        onSkills={() => { window.location.href = "/#skills"; }}
        onContact={() => { contactRef.current?.scrollIntoView({ behavior: "smooth" }); }}
        onLab={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
        lang={lang}
        onLangChange={setLang}
        dark={onContact}
      />

      <section className="lab-page">
        <div className="lab-inner">
          <div className="lab-header">
            <h2 className="lab-title">Lab</h2>
            <p className="lab-subtitle">
              {lang === "ko"
                ? "인터랙티브 웹, 게임 등 다양한 실험들을 아카이브하는 공간입니다."
                : "An archive of interactive web experiments, games, and various things worth trying."}
            </p>
          </div>

          {LAB_ITEMS.length === 0 ? (
            <div className="lab-empty">
              <span className="lab-empty__label">EXPERIMENTS COMING SOON</span>
            </div>
          ) : (
            <div className="lab-grid">
              {LAB_ITEMS.map((item) => (
                <a
                  key={item.id}
                  className="lab-card"
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                >
                  <div className="lab-card__thumb">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="lab-card__img" />
                    ) : (
                      <div className="lab-card__placeholder" />
                    )}
                  </div>
                  <div className="lab-card__body">
                    <div className="lab-card__title-row">
                      <h3 className="lab-card__title">{item.title}</h3>
                      {item.tags?.map((tag) => (
                        <span key={tag} className="lab-card__tag">{tag.toUpperCase()}</span>
                      ))}
                    </div>
                    <p className="lab-card__desc">{item.description?.[lang] ?? item.description}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <Contact ref={contactRef} lang={lang} dark />
    </>
  );
}
