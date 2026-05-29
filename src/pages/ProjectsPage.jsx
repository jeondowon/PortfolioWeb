import { useState, useRef, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Contact from "../components/sections/Contact";
import { PROJECTS, NAVBAR_H } from "../constants";
import { useLang } from "../contexts/LangContext";
import "./ProjectsPage.css";

function getAllTags() {
  const tags = new Set();
  PROJECTS.forEach((p) => p.category.forEach((c) => tags.add(c)));
  return ["All", ...Array.from(tags).sort()];
}

const TAGS = getAllTags();

export default function ProjectsPage() {
  const { lang, setLang } = useLang();
  const [activeTag, setActiveTag] = useState("All");
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

  const filtered =
    activeTag === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category.includes(activeTag));

  return (
    <>
      <Navbar
        onHome={() => {
          window.location.href = "/";
        }}
        onAbout={() => {
          window.location.href = "/#about";
        }}
        onExperience={() => {
          window.location.href = "/#experiences";
        }}
        onSkills={() => {
          window.location.href = "/#skills";
        }}
        onContact={() => {
          contactRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
        onProjects={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        lang={lang}
        onLangChange={setLang}
        dark={onContact}
      />
      <section className="projects projects-page">
        <div className="projects-inner">
          <div className="projects-header">
            <h2 className="projects-title">Projects</h2>
            <div className="projects-filter">
              <button
                className={`filter-tag ${activeTag === "All" ? "filter-tag--active" : ""}`}
                onClick={() => setActiveTag("All")}
              >
                All
              </button>
              <div className="filter-scroll">
                {TAGS.filter((tag) => tag !== "All").map((tag) => (
                  <button
                    key={tag}
                    className={`filter-tag ${activeTag === tag ? "filter-tag--active" : ""}`}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="projects-grid">
            {filtered.map((project) => {
              const isLink = project.available && project.github;
              const Tag = isLink ? "a" : "div";
              const linkProps = isLink
                ? { href: project.github, target: "_blank", rel: "noreferrer" }
                : {};

              return (
                <Tag
                  key={project.id}
                  className={`project-card ${!project.available ? "project-card--unavailable" : ""} ${isLink ? "project-card--link" : ""}`}
                  {...linkProps}
                >
                  <div className="project-image-area">
                    {project.available ? (
                      <>
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.title}
                            className="project-img"
                          />
                        ) : (
                          <div className="project-preview-placeholder">
                            <span>PREVIEW COMING SOON</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="project-coming-soon-area">
                        <span>COMING SOON</span>
                      </div>
                    )}
                  </div>

                  <div className="project-content">
                    {project.available ? (
                      <>
                        <div className="project-title-row">
                          <h3 className="project-name">{project.title}</h3>
                          {project.category.map((cat) => (
                            <span key={cat} className="project-category-tag">
                              {cat.toUpperCase()}
                            </span>
                          ))}
                        </div>
                        <p className="project-desc">{project.description[lang]}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="project-name">{project.title}</h3>
                        <p className="project-desc">{project.description[lang]}</p>
                        <div className="project-footer">
                          <span className="project-dash">—</span>
                          <span className="project-in-progress">
                            IN PROGRESS
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </Tag>
              );
            })}
          </div>
        </div>
      </section>
      <Contact ref={contactRef} lang={lang} dark />
    </>
  );
}
