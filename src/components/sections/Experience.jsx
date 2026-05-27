import { forwardRef, useState } from "react";
import { EXPERIENCE_DATA } from "../../constants";
import "./Experience.css";

const TABS = [
  { key: "work", label: "Work Experience" },
  { key: "teams", label: "Teams" },
  { key: "achievements", label: "Achievements" },
];

const Experience = forwardRef(function Experience(_, ref) {
  const [activeTab, setActiveTab] = useState("teams");
  const items = EXPERIENCE_DATA[activeTab];

  return (
    <section className="experience" id="experience" ref={ref}>
      <div className="experience-inner">
        <h2 className="experience-title">Experience</h2>
        <div className="experience-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={
                "experience-tab" +
                (activeTab === tab.key ? " experience-tab--active" : "")
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="experience-empty">Looking for more opportunities...</p>
        ) : (
          <div className="experience-timeline">
            {items.map((item, i) => (
              <div key={i} className="experience-item">
                <div
                  className={
                    "experience-dot" +
                    (item.isActive ? " experience-dot--active" : "")
                  }
                />
                <div className="experience-item-content">
                  <span className="experience-date">{item.date}</span>
                  <span className="experience-item-title">{item.title}</span>
                  <span className="experience-item-subtitle">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default Experience;
