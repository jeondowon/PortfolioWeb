import { forwardRef, useState } from "react";
import { ABOUT } from "../../constants";
import ScrollButton from "../common/ScrollButton";
import "./About.css";

const ABBR = {
  en: "AI·CSEE (ABEEK)",
  ko: "AI·컴퓨터공학심화 (공학인증)",
};

const ABBR_TOOLTIP = {
  en: (
    <>
      <strong>CSEE</strong> — Computer Science &amp; Electrical Engineering
      <br />
      <strong>ABEEK</strong> — Accreditation Board for Engineering Education of
      Korea
      <br />
      <span className="abbr-tooltip-sub">
        Engineering education accreditation · Practice-ready competency program
      </span>
    </>
  ),
  ko: (
    <span className="abbr-tooltip-sub">
      한국공학교육인증원 커리큘럼을 적용한
      <br />
      공학교육인증 · 실무 역량 중심 교육과정을 경험하였습니다.
    </span>
  ),
};

function renderBioLine(line, lang) {
  const idx = line.indexOf("DJ");
  if (idx === -1) return line;
  const jeonSuffix = lang === "ko" ? "eon으" : "eon";
  return (
    <>
      {line.slice(0, idx)}
      <span className="dj-wrap">
        <strong>D</strong>
        <span className="dj-expand">{"owon "}</span>
        <strong>J</strong>
        <span className="dj-expand">{jeonSuffix}</span>
      </span>
      {line.slice(idx + 2)}
    </>
  );
}

function renderDesc(text, lang, onAbbrClick) {
  const abbr = ABBR[lang];
  const idx = text.indexOf(abbr);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="abbr-tooltip-wrap">
        <strong onClick={onAbbrClick}>{abbr}</strong>
        <span className="abbr-tooltip-box">{ABBR_TOOLTIP[lang]}</span>
      </span>
      {text.slice(idx + abbr.length)}
    </>
  );
}

const About = forwardRef(function About({ lang = "en", onScrollDown }, ref) {
  const content = ABOUT[lang];
  const [modalOpen, setModalOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setModalOpen(false);
      setClosing(false);
    }, 200);
  }

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-inner">
        <div className="about-card">
          <h2 className="about-title">About Me</h2>

          <div className="about-body">
            <div className="about-content">
              <p className="about-bio">
                {content.bio.split("\n").map((line, i, arr) =>
                  i < arr.length - 1 ? (
                    <span key={i}>
                      {renderBioLine(line, lang)}
                      <br />
                    </span>
                  ) : (
                    renderBioLine(line, lang)
                  ),
                )}
              </p>

              <div className="about-education">
                <h3 className="education-label">Education</h3>
                <ul className="education-list">
                  {content.education.map((edu, i) => (
                    <li key={i} className="education-item">
                      <div className="education-quote-block">
                        <p className="education-school">{edu.school}</p>
                        <p className="education-major">
                          {renderDesc(edu.description, lang, () => setModalOpen(true))}
                        </p>
                      </div>
                      <p className="education-year">{edu.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="about-image-block">
              <img
                src="/images/profile.png"
                alt="Dowon Jeon"
                className="about-photo"
              />
            </div>
          </div>
        </div>
      </div>
      <ScrollButton className="about-scroll" onClick={onScrollDown} />

      {modalOpen && (
        <div className={`abbr-modal-overlay${closing ? " abbr-modal-overlay--closing" : ""}`} onClick={handleClose}>
          <div className="abbr-modal" onClick={(e) => e.stopPropagation()}>
            <p className="abbr-modal-content">{ABBR_TOOLTIP[lang]}</p>
            <button className="abbr-modal-close" onClick={handleClose}>닫기</button>
          </div>
        </div>
      )}
    </section>
  );
});

export default About;
