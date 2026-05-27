import { forwardRef } from 'react';
import './Contact.css';

const Contact = forwardRef(function Contact(_, ref) {
  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact-inner">
        <h2 className="contact-heading">If you're interested,</h2>
        <a
          href="/resume.pdf"
          download
          className="contact-btn"
        >
          Download Resume <span className="contact-btn-arrow">↗</span>
        </a>
      </div>
    </section>
  );
});

export default Contact;
