import { forwardRef } from "react";
import { ABOUT } from "../../constants";
import "./About.css";

const ABBR = 'AI·CSEE (ABEEK)';
const ABBR_TOOLTIP = (
  <>
    <strong>CSEE</strong> — Computer Science &amp; Electrical Engineering
    <br />
    <strong>ABEEK</strong> — Accreditation Board for Engineering Education of Korea
    <br />
    <span className="abbr-tooltip-sub">Engineering education accreditation · Practice-ready competency program</span>
  </>
);

function renderBioLine(line) {
  const idx = line.indexOf('DJ');
  if (idx === -1) return line;
  return (
    <>
      {line.slice(0, idx)}
      <span className="dj-wrap">
        <strong>D</strong><span className="dj-expand">{"owon "}</span><strong>J</strong><span className="dj-expand">eon</span>
      </span>
      {line.slice(idx + 2)}
    </>
  );
}

function renderDesc(text) {
  const idx = text.indexOf(ABBR);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="abbr-tooltip-wrap">
        <strong>{ABBR}</strong>
        <span className="abbr-tooltip-box">{ABBR_TOOLTIP}</span>
      </span>
      {text.slice(idx + ABBR.length)}
    </>
  );
}

const About = forwardRef(function About({ lang = "en" }, ref) {
  const content = ABOUT[lang];

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-inner">
        <div className="about-card">
          <h2 className="about-title">About Me</h2>

          <div className="about-body">
            <div className="about-content">
              <p className="about-bio">
                {content.bio.split('\n').map((line, i, arr) =>
                  i < arr.length - 1 ? <span key={i}>{renderBioLine(line)}<br /></span> : renderBioLine(line)
                )}
              </p>

              <div className="about-education">
                <h3 className="education-label">Education</h3>
                <ul className="education-list">
                  {content.education.map((edu, i) => (
                    <li key={i} className="education-item">
                      <div className="education-quote-block">
                        <p className="education-school">{edu.school}</p>
                        <p className="education-major">{renderDesc(edu.description)}</p>
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
    </section>
  );
});

export default About;
