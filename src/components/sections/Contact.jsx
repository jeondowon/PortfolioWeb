import { forwardRef } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import { SOCIAL } from "../../constants";
import "./Contact.css";

const LINKS = [
  {
    icon: FaEnvelope,
    label: "EMAIL",
    display: "dowon.9102@gmail.com",
    href: `mailto:${SOCIAL.email}`,
  },
  {
    icon: FaPhone,
    label: "PHONE",
    display: "+82 10-5956-0629",
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

const Contact = forwardRef(function Contact(_, ref) {
  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact-inner">
        <h2 className="contact-heading">Contact</h2>
        <div className="contact-center">
        <div className="contact-body">
          <div className="contact-left">
            <h3 className="contact-subheading">
              Let's Develop,
              <br />
              Build together.
            </h3>
            <p className="contact-sub">
              Always open to new ideas, collaborations, and conversations.
              <br />
              Drop a line — I'll get back to you.
            </p>
            <a href="/resume.pdf" download className="contact-btn">
              Download Resume ↗
            </a>
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
                <span className="contact-row-arrow">↗</span>
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
