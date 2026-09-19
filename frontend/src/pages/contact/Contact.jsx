import { useState } from "react";
import "./Contact.css";

const WHATSAPP_NUMBER = "923284212706";

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

    const whatsappMessage = `Hello MT TECH,

Name: ${formData.name.trim()}
Issue: ${formData.subject.trim()}

Message:
${formData.message.trim()}

Sent from UAF EduPortal.`;

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(whatsappMessage);

    window.open(whatsappUrl, "_blank");

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
          Found an issue or have feedback? Send us a message on WhatsApp.
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <div className="contact-info-icon">MT</div>

          <span className="contact-label">Developer Support</span>

          <h2>Need help with UAF EduPortal?</h2>

          <p>
            If you experience a problem with results, GPA calculation, or
            any other portal feature, send us the details through WhatsApp.
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
              <div className="contact-status error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
            >
              Send Message on WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;