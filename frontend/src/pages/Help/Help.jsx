import "./Help.css";

function Help() {
  return (
    <section className="page help-page">
      <div className="page-header">
        <h1>Help & Support</h1>
        <p>
          Find answers to common questions about UAF EduPortal and its
          features.
        </p>
      </div>

      <div className="help-grid">
        <div className="help-card">
          <div className="help-icon">?</div>
          <h2>How do I check my results?</h2>
          <p>
            Go to the Results page, enter your session and registration
            number, then click Search Result.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon">GPA</div>
          <h2>How does the GPA Calculator work?</h2>
          <p>
            Enter your subject name, credit hours and obtained marks. Add
            each subject and then select Calculate GPA.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon">01</div>
          <h2>What registration format should I use?</h2>
          <p>
            Enter your session separately, followed by your registration
            number. The portal automatically creates the UAF registration
            format.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon">04</div>
          <h2>How is GPA calculated?</h2>
          <p>
            The calculator uses the configured UAF quality-point table and
            calculates GPA from total quality points divided by total credit
            hours.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon">!</div>
          <h2>My result is not showing</h2>
          <p>
            Check that your session and registration number are correct.
            Also make sure the UAF LMS is available before trying again.
          </p>
        </div>

        <div className="help-card">
          <div className="help-icon">✓</div>
          <h2>Can I remove a subject?</h2>
          <p>
            Yes. In the GPA Calculator, click the Remove button next to
            any subject you want to delete before calculating your GPA.
          </p>
        </div>
      </div>

      <div className="help-info">
        <div>
          <span className="help-info-label">Need a quick start?</span>
          <h2>Use UAF EduPortal in three simple steps</h2>
        </div>

        <div className="help-steps">
          <div className="help-step">
            <strong>01</strong>
            <span>Check your results</span>
          </div>

          <div className="help-step">
            <strong>02</strong>
            <span>Review your academic data</span>
          </div>

          <div className="help-step">
            <strong>03</strong>
            <span>Calculate your GPA</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Help;