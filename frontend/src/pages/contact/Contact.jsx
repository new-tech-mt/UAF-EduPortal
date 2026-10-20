
import { useState } from "react";
import "./Contact.css";

const WHATSAPP_NUMBER = "923266337753";
const TIKTOK_URL = "https://www.tiktok.com/@mt_tech13";

function TikTokIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="25"
      height="25"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.24V2h-3.55v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6.05.88.14V9.28a6.45 6.45 0 0 0-.88-.06 6.45 6.45 0 1 0 6.45 6.45V8.7a8.36 8.36 0 0 0 4.9 1.58V6.73c-.38 0-.76-.02-1.13-.04Z" />
    </svg>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const whatsappMessage = `Hello TAYYAB,

Name: ${formData.name.trim()}
Issue: ${formData.subject.trim()}

Message:
${formData.message.trim()}

Sent from UAF EduPortal.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(whatsappMessage);

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setFormData({
      name: "",
      subject: "",
      message: "",
    });

    setError("");
  };

  return (
    <section className="page contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>
          Found an issue or have feedback? Contact us through WhatsApp
          or send us a DM on TikTok.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-info-icon">MT</div>

          <span className="contact-label">Developer Support</span>

          <h2>Need help with UAF EduPortal?</h2>

          <p>
            If you experience a problem with results, GPA calculation, or
            any other portal feature, send us the details through WhatsApp
            or reach out on TikTok.
          </p>

          <div className="contact-details">
            <div>
              <span>Developer</span>
              <strong>Muhammad Tayyab | MT TECH</strong>
            </div>

            <div>
              <span>Support</span>
              <strong>WhatsApp</strong>
            </div>
          </div>

          <a
            className="contact-tiktok-link"
            href={TIKTOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DM us on TikTok @mt_tech13"
          >
            <span className="contact-tiktok-icon">
              <TikTokIcon />
            </span>

            <span className="contact-tiktok-text">
              <strong>DM us on TikTok</strong>
              <small>@mt_tech13</small>
            </span>

            <span className="contact-tiktok-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <div className="contact-form-card">
          <h2>Send us a message</h2>

          <p className="contact-form-description">
            Fill in the details below. Your message will open in WhatsApp.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Issue / Subject</label>

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="e.g. Result not showing"
                value={formData.subject}
                onChange={handleChange}
                maxLength="150"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Describe your issue or feedback..."
                value={formData.message}
                onChange={handleChange}
                maxLength="2000"
              />
            </div>

            {error && (
              <div className="contact-status error" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="contact-submit">
              Send Message on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
