import { useRef, useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Cover from "./components/sections/Cover";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Banner from "./components/sections/Banner";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import "./styles/global.css";

export default function App() {
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);
  const experienceRef = useRef(null);
  const [lang, setLang] = useState("en");
  const [onCover, setOnCover] = useState(true);
  const [onExperience, setOnExperience] = useState(false);

  useEffect(() => {
    const NAVBAR_H = 64;
    const handleScroll = () => {
      setOnCover(window.scrollY < window.innerHeight);
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

  return (
    <>
      <Navbar
        onHome={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onAbout={() => scrollTo(aboutRef)}
        onProjects={() => scrollTo(projectsRef)}
        onSkills={() => scrollTo(skillsRef)}
        onContact={() => scrollTo(contactRef)}
        lang={lang}
        onLangChange={setLang}
        dark={onCover || onExperience}
      />
      <Cover onScrollDown={() => scrollTo(aboutRef, { behavior: "smooth" })} />
      <Hero />
      <About ref={aboutRef} lang={lang} />
      <Banner />
      <Projects ref={projectsRef} />
      <Skills ref={skillsRef} />
      <Experience ref={experienceRef} />
      <Contact ref={contactRef} />
      <Footer />
    </>
  );
}
