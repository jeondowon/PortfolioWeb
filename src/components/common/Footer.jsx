import {
  FaEnvelope,
  FaPhone,
  FaInstagram,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import { SOCIAL } from "../../constants";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-contact">
          <a href={`mailto:${SOCIAL.email}`} className="footer-link">
            <FaEnvelope size={20} />
            <span>{SOCIAL.email}</span>
          </a>
          <a href={`tel:${SOCIAL.phone}`} className="footer-link">
            <FaPhone size={20} />
            <span>{SOCIAL.phoneDisplay}</span>
          </a>
        </div>

        <div className="footer-social">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram size={28} />
          </a>
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={28} />
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
          >
            <FaYoutube size={28} />
          </a>
        </div>

        <p className="footer-credit">Website designed and made by Dowon Jeon</p>
      </div>
    </footer>
  );
}
