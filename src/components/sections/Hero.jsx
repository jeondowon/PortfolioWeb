import "./Hero.css";

export default function Hero() {
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
          <p className="hero-greeting">Hello, I'm Dowon Jeon</p>
          <p className="hero-desc">Check below to learn more about me</p>
        </div>
      </div>
      <div className="hero-divider" />
    </section>
  );
}
