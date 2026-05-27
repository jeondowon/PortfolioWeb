import { forwardRef, useState } from "react";
import { EXPERIENCE_DATA } from "../../constants";
import "./Experiences.css";

const TABS = [
  { key: "work", label: "Work Experience" },
  { key: "teams", label: "Teams" },
  { key: "achievements", label: "Achievements" },
];

const Experiences = forwardRef(function Experiences(_, ref) {
  const [activeTab, setActiveTab] = useState("teams");
  const items = EXPERIENCE_DATA[activeTab];

  return (
    <section className="experiences" id="experiences" ref={ref}>
      <div className="experiences-inner">
        <h2 className="experiences-title">Experiences</h2>
        <div className="experiences-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={
                "experiences-tab" +
                (activeTab === tab.key ? " experiences-tab--active" : "")
              }
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {items.length === 0 ? (
          <p className="experiences-empty">Looking for more opportunities...</p>
        ) : (
          <div className="experiences-timeline">
            {items.map((item, i) => (
              <div key={i} className="experiences-item">
                <div
                  className={
                    "experiences-dot" +
                    (item.isActive ? " experiences-dot--active" : "")
                  }
                />
                <div className="experiences-item-content">
                  <span className="experiences-date">{item.date}</span>
                  <span className="experiences-item-title">{item.title}</span>
                  <span className="experiences-item-subtitle">
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

export default Experiences;
