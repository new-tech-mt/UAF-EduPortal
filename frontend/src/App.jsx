import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import Calculator from "./pages/Calculator/Calculator";
import Help from "./pages/Help/Help";
import Contact from "./pages/contact/Contact";
import InstallAppButton from "./components/InstallAppButton";

function Navbar() {
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
        <NavLink to="/" className="logo">
          <span className="logo-box">UAF</span>
          <span>EduPortal</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/results">Results</NavLink>
          <NavLink to="/calculator">GPA Calculator</NavLink>
          <NavLink to="/help">Help</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-share-btn"
            type="button"
            onClick={handleShare}
            aria-label="Share UAF EduPortal"
          >
            <span aria-hidden="true">↗</span>
            Share
          </button>
          <InstallAppButton />
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