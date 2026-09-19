import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <span className="badge">University of Agriculture Faisalabad</span>

          <h1>
            Your Academic
            <br />
            <span>Information, Simplified.</span>
          </h1>

          <p className="hero-text">
            UAF EduPortal provides students with an easy way to check
            academic results, calculate GPA, and view their academic record
            from one place.
          </p>

          <div className="hero-buttons">
            <Link to="/results" className="primary-btn">
              Check Results
            </Link>

            <Link to="/calculator" className="secondary-btn">
              GPA Calculator
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-icon">UAF</div>

          <h2>Student Portal</h2>

          <p>
            Access your academic information through a clean and simple
            student-friendly interface.
          </p>
        </div>
      </section>

      <section className="page">
        <div className="page-header">
          <h1>Portal Features</h1>
          <p>Everything you need for your basic academic information.</p>
        </div>

        <div className="cards">
          <div className="card">
            <h3>📊 Results</h3>
            <p>
              Check your semester results and view subject-wise academic
              information.
            </p>
          </div>

          <div className="card">
            <h3>🧮 GPA Calculator</h3>
            <p>
              Calculate semester GPA using credit hours and grade points.
            </p>
          </div>

          <div className="card">
            <h3>📚 Academic Record</h3>
            <p>
              Keep your semester-wise academic information organized in one
              place.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;