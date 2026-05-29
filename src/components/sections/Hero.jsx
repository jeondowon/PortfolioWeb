import "./Hero.css";

const TEXT = {
  en: {
    greeting: "Hello, I'm Dowon Jeon",
    desc: "Check below to learn more about me",
  },
  ko: {
    greeting: "안녕하세요, 저는 전도원입니다.",
    desc: "아래에서 더욱 흥미로운 정보들을 확인해보세요.",
  },
};

export default function Hero({ lang = "en" }) {
  const t = TEXT[lang];
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-title-block">
          <h1 className="hero-heading">
            AI · Computer Science &<br />
            Engineering
          </h1>
        </div>
        <div className="hero-subtitle-block">
          <p className="hero-greeting">{t.greeting}</p>
          <p className="hero-desc">{t.desc}</p>
        </div>
      </div>
      <div className="hero-divider" />
    </section>
  );
}
