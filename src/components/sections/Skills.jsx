import { forwardRef } from 'react';
import { SKILLS } from '../../constants';
import './Skills.css';

const Skills = forwardRef(function Skills(_, ref) {
  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-inner">
        <h2 className="skills-title">Skills</h2>
        <div className="skills-grid">
          {SKILLS.map((skill) => (
            <div key={skill.id} className="skill-card">
              <h3 className="skill-name">{skill.title}</h3>
              <ul className="skill-list">
                {skill.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Skills;
