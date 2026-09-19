import { useRef, useState } from "react";
import api from "../../services/api";
import "./Results.css";

// =========================================
// SEMESTER ORDER
// =========================================

function getSemesterOrder(name = "") {
  const semester = String(name).toLowerCase();

  const yearMatch = semester.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : 9999;

  let seasonOrder = 9;

  if (semester.includes("winter")) {
    seasonOrder = 1;
  } else if (semester.includes("spring")) {
    seasonOrder = 2;
  } else if (semester.includes("summer")) {
    seasonOrder = 3;
  } else if (semester.includes("fall")) {
    seasonOrder = 4;
  } else if (semester.includes("autumn")) {
    seasonOrder = 4;
  }

  return year * 10 + seasonOrder;
}

// =========================================
// NUMBER FORMAT
// =========================================

function formatNumber(value, decimals = 2) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0.00";
  }

  return number.toFixed(decimals);
}

// =========================================
// GET MARKS
// =========================================

function getMarks(subject) {
  const possibleMarks = [
    subject?.marks,
    subject?.total,
    subject?.obtainedMarks,
    subject?.marksObtained,
    subject?.obtained,
    subject?.mark,
  ];

  for (const value of possibleMarks) {
    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      return value;
    }
  }

  return "-";
}

// =========================================
// RESULTS COMPONENT
// =========================================

function Results() {
  const [session, setSession] = useState("");
  const [registrationNumber, setRegistrationNumber] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const sessionRef = useRef(null);
  const registrationRef = useRef(null);

  // =========================================
  // SESSION CHANGE
  // =========================================

  const handleSessionChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setSession(value);

    // Automatically move to AG number
    // after entering 4 digits.
    if (value.length === 4) {
      setTimeout(() => {
        registrationRef.current?.focus();
      }, 0);
    }
  };

  // =========================================
  // REGISTRATION NUMBER CHANGE
  // =========================================

  const handleRegistrationChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 5);

    setRegistrationNumber(value);
  };

  // =========================================
  // SEARCH RESULT
  // =========================================

  const handleSearch = async (e) => {
    e.preventDefault();

    const cleanSession = session.trim();
    const cleanRegistration =
      registrationNumber.trim();

    if (cleanSession.length !== 4) {
      setError(
        "Please enter a valid 4-digit admission year."
      );

      sessionRef.current?.focus();

      return;
    }

    if (cleanRegistration.length !== 5) {
      setError(
        "Please enter your 5-digit registration number."
      );

      registrationRef.current?.focus();

      return;
    }

    const regNo = `${cleanSession}-AG-${cleanRegistration}`;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.get(
        `/results/${encodeURIComponent(regNo)}`
      );

      setResult(response.data);
    } catch (err) {
      console.error("Result fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch result. Please check your registration number and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RESULT DATA
  // =========================================

  const summary = result?.summary || {};
  const subjects = result?.subjects || [];

  const sortedSemesters = [
    ...(result?.semesters || []),
  ].sort((a, b) => {
    const aName =
      a.semester ||
      a.semesterName ||
      a.name ||
      "";

    const bName =
      b.semester ||
      b.semesterName ||
      b.name ||
      "";

    return (
      getSemesterOrder(aName) -
      getSemesterOrder(bName)
    );
  });

  const fullRegistration =
    result?.registration ||
    (session && registrationNumber
      ? `${session}-AG-${registrationNumber}`
      : "N/A");

  return (
    <section className="page results-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="results-page-header">

        <div className="results-header-content">
          <span className="results-eyebrow">
            UAF EDU PORTAL
          </span>

          <h1>Academic Results</h1>

          <p>
            View your complete semester-wise academic
            performance, GPA, CGPA, marks and credit hours.
          </p>
        </div>

        <div className="results-header-badge">
          <span className="header-badge-icon">
            ✓
          </span>

          <div>
            <strong>Official Result</strong>
            <small>Retrieved from UAF LMS</small>
          </div>
        </div>

      </div>

      {/* =====================================
          SEARCH CARD
      ====================================== */}

      <form
        className="result-search-card"
        onSubmit={handleSearch}
      >

        <div className="search-card-icon">
          ⌕
        </div>

        <div className="search-card-content">

          <label>
            Registration Number
          </label>

          <p>
            Enter your admission year and AG number
            to retrieve your academic record.
          </p>

        </div>

        <div className="result-search-controls">

          <div className="registration-input-group">

            <input
              ref={sessionRef}
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="2025"
              value={session}
              onChange={handleSessionChange}
              disabled={loading}
              autoComplete="off"
              aria-label="Admission year"
            />

            <span className="registration-prefix">
              -AG-
            </span>

            <input
              ref={registrationRef}
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="12345"
              value={registrationNumber}
              onChange={handleRegistrationChange}
              disabled={loading}
              autoComplete="off"
              aria-label="Registration number"
            />

          </div>

          <button
            className="result-search-button"
            type="submit"
            disabled={loading}
          >

            {loading ? (
              <>
                <span className="button-spinner"></span>
                Checking...
              </>
            ) : (
              <>
                Check Result
                <span>→</span>
              </>
            )}

          </button>

        </div>

        <div className="registration-help">
          Example:
          <strong>2025</strong>
          <span>-AG-</span>
          <strong>10562</strong>
        </div>

        {error && (
          <div className="result-error">
            <span>!</span>
            {error}
          </div>
        )}

      </form>

      {/* =====================================
          LOADING
      ====================================== */}

     {loading && (
  <div className="result-loading-card">
    <div className="loading-animation">
      <div className="loading-ring"></div>
      <div className="loading-core">UAF</div>
    </div>

    <div className="loading-content">
      <span className="loading-label">PLEASE WAIT</span>

      <h2>Finding Your Result</h2>

      <p>
        Connecting with UAF LMS and retrieving your academic record
        <span className="loading-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>

      <div className="loading-status">
        <span className="loading-status-dot"></span>
        <span>Processing your result securely</span>
      </div>
    </div>
  </div>
)}

      {/* =====================================
          RESULT CONTENT
      ====================================== */}

      {result && !loading && (
        <div className="results-content">

          {/* =================================
              STUDENT INFORMATION
          ================================== */}

          <div className="student-profile-card">

            <div className="student-profile-main">

              <div className="student-avatar">
                {(
                  result.student?.name ||
                  "S"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="student-details">

                <span className="student-label">
                  STUDENT INFORMATION
                </span>

                <h2>
                  {result.student?.name || "N/A"}
                </h2>

                <div className="student-registration">
                  <span>
                    Registration No.
                  </span>

                  <strong>
                    {fullRegistration}
                  </strong>
                </div>

              </div>

            </div>

            <div className="profile-status">
              <span className="status-dot"></span>

              <div>
                <strong>Result Available</strong>
                <small>UAF LMS verified</small>
              </div>
            </div>

          </div>

          {/* =================================
              SUMMARY CARDS
          ================================== */}

          <div className="result-summary-grid">

            {/* CGPA */}

            <div className="result-summary-card cgpa-card">

              <div className="summary-card-top">
                <span>CGPA</span>

                <div className="summary-icon">
                  ★
                </div>
              </div>

              <div className="summary-value">
                {formatNumber(summary.cgpa)}
              </div>

              <small>
                Overall cumulative GPA
              </small>

            </div>

            {/* PERCENTAGE */}

            <div className="result-summary-card percentage-card">

              <div className="summary-card-top">
                <span>Percentage</span>

                <div className="summary-icon">
                  %
                </div>
              </div>

              <div className="summary-value">
                {formatNumber(summary.percentage)}%
              </div>

              <small>
                Overall academic percentage
              </small>

            </div>

            {/* CREDIT HOURS */}

            <div className="result-summary-card credit-card">

              <div className="summary-card-top">
                <span>Credit Hours</span>

                <div className="summary-icon">
                  CH
                </div>
              </div>

              <div className="summary-value">
                {summary.totalCredits || 0}
              </div>

              <small>
                Total completed credit hours
              </small>

            </div>

            {/* SUBJECTS */}

            <div className="result-summary-card subject-card">

              <div className="summary-card-top">
                <span>Subjects</span>

                <div className="summary-icon">
                  #
                </div>
              </div>

              <div className="summary-value">
                {summary.totalSubjects ||
                  subjects.length ||
                  0}
              </div>

              <small>
                Total subjects completed
              </small>

            </div>

          </div>

          {/* =================================
              SEMESTER RESULTS
          ================================== */}

          {sortedSemesters.length > 0 ? (

            <div className="semester-section">

              <div className="section-title-row">

                <div>
                  <span className="section-eyebrow">
                    ACADEMIC HISTORY
                  </span>

                  <h2>
                    Semester Results
                  </h2>

                  <p>
                    Your complete semester-wise
                    academic performance.
                  </p>
                </div>

                <div className="semester-total-badge">
                  {sortedSemesters.length}{" "}
                  {sortedSemesters.length === 1
                    ? "Semester"
                    : "Semesters"}
                </div>

              </div>

              {sortedSemesters.map(
                (semester, semesterIndex) => {

                  const semesterSubjects =
                    semester.subjects || [];

                  const semesterCredits =
                    Number(
                      semester.totalCredits || 0
                    );

                  const semesterQualityPoints =
                    Number(
                      semester.totalQualityPoints || 0
                    );

                  const calculatedGpa =
                    semesterCredits > 0
                      ? semesterQualityPoints /
                        semesterCredits
                      : 0;

                  const semesterGpa =
                    semester.gpa !== undefined
                      ? Number(semester.gpa)
                      : calculatedGpa;

                  const semesterName =
                    semester.semester ||
                    semester.semesterName ||
                    semester.name ||
                    "Semester";

                  const semesterNumber =
                    semester.semesterNumber ||
                    semesterIndex + 1;

                  return (
                    <div
                      className="semester-result-card"
                      key={`${semesterName}-${semesterIndex}`}
                    >

                      {/* SEMESTER HEADER */}

                      <div className="semester-result-header">

                        <div className="semester-title">

                          <div className="semester-number">
                            {semesterNumber}
                          </div>

                          <div>
                            <span>
                              SEMESTER {semesterNumber}
                            </span>

                            <h3>
                              {semesterName}
                            </h3>
                          </div>

                        </div>

                        <div className="semester-gpa-box">
                          <span>GPA</span>

                          <strong>
                            {formatNumber(
                              semesterGpa
                            )}
                          </strong>
                        </div>

                      </div>

                      {/* SEMESTER STATS */}

                      <div className="semester-stats">

                        <div className="semester-stat">
                          <span>Subjects</span>

                          <strong>
                            {semesterSubjects.length}
                          </strong>
                        </div>

                        <div className="semester-stat">
                          <span>Credit Hours</span>

                          <strong>
                            {semesterCredits}
                          </strong>
                        </div>

                        <div className="semester-stat">
                          <span>
                            Quality Points
                          </span>

                          <strong>
                            {formatNumber(
                              semesterQualityPoints
                            )}
                          </strong>
                        </div>

                      </div>

                      {/* SUBJECT TABLE */}

                      {semesterSubjects.length > 0 ? (

                        <div className="result-table-container">

                          <table className="result-table">

                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Credit Hours</th>
                                <th>Marks</th>
                                <th>Grade</th>
                                <th>Quality Points</th>
                              </tr>
                            </thead>

                            <tbody>

                              {semesterSubjects.map(
                                (
                                  subject,
                                  subjectIndex
                                ) => {

                                  const marks =
                                    getMarks(subject);

                                  return (
                                    <tr
                                      key={`${semesterIndex}-${subjectIndex}`}
                                    >

                                      <td>
                                        <div className="subject-cell">

                                          <strong>
                                            {subject.name ||
                                              "N/A"}
                                          </strong>

                                          <span>
                                            {subject.code ||
                                              "N/A"}
                                          </span>

                                        </div>
                                      </td>

                                      <td>
                                        {subject.creditHours ??
                                          "N/A"}
                                      </td>

                                      <td>
                                        <strong className="marks-value">
                                          {marks}
                                        </strong>
                                      </td>

                                      <td>
                                        <span className="grade-badge">
                                          {subject.grade ||
                                            "N/A"}
                                        </span>
                                      </td>

                                      <td>
                                        <strong>
                                          {subject.qualityPoints !==
                                          undefined
                                            ? formatNumber(
                                                subject.qualityPoints
                                              )
                                            : "0.00"}
                                        </strong>
                                      </td>

                                    </tr>
                                  );
                                }
                              )}

                            </tbody>

                            <tfoot>
                              <tr>

                                <td>
                                  <strong>
                                    Semester Total
                                  </strong>
                                </td>

                                <td>
                                  <strong>
                                    {semesterCredits}
                                  </strong>
                                </td>

                                <td>
                                  —
                                </td>

                                <td>
                                  <strong>
                                    GPA{" "}
                                    {formatNumber(
                                      semesterGpa
                                    )}
                                  </strong>
                                </td>

                                <td>
                                  <strong>
                                    {formatNumber(
                                      semesterQualityPoints
                                    )}
                                  </strong>
                                </td>

                              </tr>
                            </tfoot>

                          </table>

                        </div>

                      ) : (

                        <div className="empty-result">
                          No subjects were found for
                          this semester.
                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          ) : (

            /* =================================
               FALLBACK RESULT TABLE
            ================================== */

            <div className="semester-result-card">

              <div className="section-title-row">

                <div>
                  <span className="section-eyebrow">
                    ACADEMIC RESULT
                  </span>

                  <h2>
                    Subject Results
                  </h2>
                </div>

              </div>

              {subjects.length > 0 ? (

                <div className="result-table-container">

                  <table className="result-table">

                    <thead>
                      <tr>
                        <th>Semester</th>
                        <th>Course</th>
                        <th>Subject</th>
                        <th>Credit Hours</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Quality Points</th>
                      </tr>
                    </thead>

                    <tbody>

                      {subjects.map(
                        (subject, index) => (

                          <tr key={index}>

                            <td>
                              {subject.semester ||
                                "N/A"}
                            </td>

                            <td>
                              {subject.code ||
                                "N/A"}
                            </td>

                            <td>
                              {subject.name ||
                                "N/A"}
                            </td>

                            <td>
                              {subject.creditHours ??
                                "N/A"}
                            </td>

                            <td>
                              <strong>
                                {getMarks(subject)}
                              </strong>
                            </td>

                            <td>
                              <span className="grade-badge">
                                {subject.grade ||
                                  "N/A"}
                              </span>
                            </td>

                            <td>
                              {subject.qualityPoints !==
                              undefined
                                ? formatNumber(
                                    subject.qualityPoints
                                  )
                                : "0.00"}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="empty-result">
                  No subjects were found for this
                  registration number.
                </div>

              )}

            </div>

          )}

          {/* =================================
              FINAL SUMMARY
          ================================== */}

          <div className="final-summary-card">

            <div className="final-summary-content">

              <span className="section-eyebrow">
                FINAL ACADEMIC SUMMARY
              </span>

              <h2>
                Overall Performance
              </h2>

              <p>
                Your complete academic record has
                been successfully retrieved from
                UAF LMS.
              </p>

            </div>

            <div className="final-summary-values">

              <div>
                <span>CGPA</span>

                <strong>
                  {formatNumber(summary.cgpa)}
                </strong>
              </div>

              <div>
                <span>Percentage</span>

                <strong>
                  {formatNumber(
                    summary.percentage
                  )}
                  %
                </strong>
              </div>

              <div>
                <span>Credits</span>

                <strong>
                  {summary.totalCredits || 0}
                </strong>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
}

export default Results;