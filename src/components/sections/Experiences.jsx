import { forwardRef, useState } from "react";
import { EXPERIENCE_DATA } from "../../constants";
import "./Experiences.css";

const TABS = [
  { key: "work", label: "Work Experience" },
  { key: "teams", label: "Teams" },
  { key: "achievements", label: "Achievements" },
];

const Experiences = forwardRef(function Experiences({ onScrollDown }, ref) {
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
      <button className="experiences-scroll" onClick={onScrollDown} aria-label="Scroll down">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
});

export default Experiences;
