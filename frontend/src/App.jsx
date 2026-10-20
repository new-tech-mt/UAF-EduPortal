
import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import Calculator from "./pages/Calculator/Calculator";
import Help from "./pages/Help/Help";
import Contact from "./pages/contact/Contact";
import InstallAppButton from "./components/InstallAppButton";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleShare = async () => {
    const shareData = {
      title: "UAF EduPortal",
      text: "Visit UAF EduPortal to access student academic tools.",
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        window.alert("Website link copied. You can now share it.");
      } else {
        window.prompt("Copy this website link:", shareData.url);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        window.prompt("Copy this website link:", shareData.url);
      }
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <span className="logo-box">UAF</span>
          <span>EduPortal</span>
        </NavLink>

        <nav
          id="mobile-navigation"
          className={`nav-links ${menuOpen ? "mobile-menu-open" : ""}`}
        >
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>

          <NavLink to="/results" onClick={closeMenu}>
            Results
          </NavLink>

          <NavLink to="/calculator" onClick={closeMenu}>
            GPA Calculator
          </NavLink>

          <NavLink to="/help" onClick={closeMenu}>
            Help
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-share-btn"
            type="button"
            onClick={handleShare}
            aria-label="Share UAF EduPortal"
            title="Share"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4" />
            </svg>
            <span className="nav-action-label">Share</span>
          </button>

          <div className="nav-install-btn" title="Install App">
            <InstallAppButton />
          </div>

          <button
            className="mobile-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            title={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="23"
                height="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>UAF EduPortal</strong>
        <p>Student Academic Portal</p>
      </div>

      <p>
        © 2026 UAF EduPortal. All Rights Reserved. | Developed by Muhammad Tayyab | MT TECH
      </p>
    </footer>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
