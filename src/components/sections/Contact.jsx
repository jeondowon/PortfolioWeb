import { forwardRef } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SOCIAL, RESUME_AVAILABLE } from "../../constants";
import "./Contact.css";

const LINKS = [
  {
    icon: FaEnvelope,
    label: "EMAIL",
    display: SOCIAL.email,
    href: `mailto:${SOCIAL.email}`,
  },
  {
    icon: FaPhone,
    label: "PHONE",
    display: SOCIAL.phoneDisplay,
    href: `tel:${SOCIAL.phone}`,
  },
  {
    icon: FaGithub,
    label: "GITHUB",
    display: "jeondowon",
    href: SOCIAL.github,
  },
  {
    icon: FaLinkedin,
    label: "LINKEDIN",
    display: "in/jeondowon",
    href: SOCIAL.linkedin,
  },
  {
    icon: FaInstagram,
    label: "INSTAGRAM",
    display: "@jeondowon",
    href: SOCIAL.instagram,
  },
];

const TEXT = {
  en: {
    subheading: ["Let's Develop,", "Build together."],
    sub: "Always open to new ideas, collaborations, and conversations.\nDrop a line — I'll get back to you.",
    btn: "Download Resume ↗︎",
  },
  ko: {
    subheading: ["함께 개발하고,", "함께 만들어가고 싶습니다."],
    sub: "새로운 아이디어, 협업, 대화 요청 등 언제나 환영합니다.\n연락 주시면 빠른 시일 내로 답장드리겠습니다.",
    btn: "이력서 보기",
  },
};

const Contact = forwardRef(function Contact({ lang = "en", dark }, ref) {
  const t = TEXT[lang];
  return (
    <section
      className={`contact${dark ? " contact--dark" : ""}`}
      id="contact"
      ref={ref}
    >
      <div className="contact-inner">
        <h2 className="contact-heading">Contact</h2>
        <div className="contact-center">
          <div className="contact-body">
            <div className="contact-left">
              <h3 className="contact-subheading">
                {t.subheading[0]}
                <br />
                {t.subheading[1]}
              </h3>
              <p className="contact-sub">
                {t.sub.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
              <button
                className={`contact-btn${!RESUME_AVAILABLE ? " contact-btn--disabled" : ""}`}
                disabled={!RESUME_AVAILABLE}
                onClick={RESUME_AVAILABLE ? () => window.open("/resume.pdf") : undefined}
              >
                {t.btn}
              </button>
            </div>

            <div className="contact-right">
              {LINKS.map(({ icon: Icon, label, display, href }) => (
                <a
                  key={label}
                  href={href}
                  className="contact-row"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                >
                  <Icon className="contact-row-icon" />
                  <span className="contact-row-label">{label}</span>
                  <span className="contact-row-value">{display}</span>
                  <span className="contact-row-arrow">{'↗︎'}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <p className="contact-credit">
        Website designed &amp; built by Dowon Jeon
      </p>
    </section>
  );
});

export default Contact;
