import "./Banner.css";

const TEXT = "Keep Dreaming, Develop Imagination, and Make it Real";

export default function Banner() {
  return (
    <div className="banner">
      <div className="banner-track">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="banner-text">
            {TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}
