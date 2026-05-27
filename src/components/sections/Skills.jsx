import { forwardRef, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { SKILLS } from "../../constants";
import "./Skills.css";

const Skills = forwardRef(function Skills(_, ref) {
  const [flipped, setFlipped] = useState({});

  const toggle = (id) => setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-inner">
        <h2 className="skills-title">Skills</h2>
        <div className="skills-grid">
          {SKILLS.map((skill) => (
            <div
              key={skill.id}
              className={`skill-card ${flipped[skill.id] ? "skill-card--flipped" : ""}`}
              onClick={() => toggle(skill.id)}
            >
              <div className="skill-card-inner">
                <div className="skill-card-front">
                  <h3 className="skill-card-title">{skill.title}</h3>
                  <ul className="skill-list">
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="skill-card-hint">
                    <TbRefresh size={13} /> Click to flip
                  </span>
                </div>
                <div className="skill-card-back">
                  <h3 className="skill-card-title">{skill.title}</h3>
                  <p className="skill-card-desc">{skill.description}</p>
                  <span className="skill-card-hint">
                    <TbRefresh size={13} /> Click to flip
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Skills;
