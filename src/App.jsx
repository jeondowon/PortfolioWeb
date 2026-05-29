import { useRef, useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Cover from "./components/sections/Cover";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Banner from "./components/sections/Banner";
import Skills from "./components/sections/Skills";
import Experiences from "./components/sections/Experiences";
import Contact from "./components/sections/Contact";
import { useLang } from "./contexts/LangContext";
import { NAVBAR_H } from "./constants";
import "./styles/global.css";

export default function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const experienceRef = useRef(null);
  const { lang, setLang } = useLang();
  const [onCover, setOnCover] = useState(true);
  const [onExperience, setOnExperience] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        setOnCover(heroRef.current.getBoundingClientRect().top > NAVBAR_H);
      }
      const el = experienceRef.current;
      if (el) {
        const { top, bottom } = el.getBoundingClientRect();
        setOnExperience(top <= NAVBAR_H && bottom > NAVBAR_H);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const refMap = {
      "#about": heroRef,
      "#skills": skillsRef,
      "#experiences": experienceRef,
      "#contact": contactRef,
    };
    const ref = refMap[hash];
    if (ref) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <>
      <Navbar
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onAbout={() => scrollTo(heroRef)}
        onExperience={() => scrollTo(experienceRef)}
        onSkills={() => scrollTo(skillsRef)}
        onContact={() => scrollTo(contactRef)}
        lang={lang}
        onLangChange={setLang}
        dark={onCover || onExperience}
        rain={onCover}
        coverEndRef={heroRef}
      />
      <Cover
        lang={lang}
        onScrollDown={() => scrollTo(aboutRef, { behavior: "smooth" })}
      />
      <div ref={heroRef}>
        <Hero lang={lang} />
      </div>
      <About
        ref={aboutRef}
        lang={lang}
        onScrollDown={() => scrollTo(skillsRef)}
      />
      <Banner />
      <Skills
        ref={skillsRef}
        lang={lang}
        onScrollDown={() => scrollTo(experienceRef)}
      />
      <Experiences
        ref={experienceRef}
        lang={lang}
        onScrollDown={() => scrollTo(contactRef)}
      />
      <Contact ref={contactRef} lang={lang} />
    </>
  );
}
