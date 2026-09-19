import { Routes, Route, NavLink } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Results from "./pages/Results/Results";
import Calculator from "./pages/Calculator/Calculator";
import Help from "./pages/Help/Help";
import Contact from "./pages/Contact/Contact";

function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="logo">
          <span className="logo-box">UAF</span>
          <span>EduPortal</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/results">
            Results
          </NavLink>

          <NavLink to="/calculator">
            GPA Calculator
          </NavLink>

          <NavLink to="/help">
            Help
          </NavLink>

          <NavLink to="/contact">
            Contact
          </NavLink>
        </nav>
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