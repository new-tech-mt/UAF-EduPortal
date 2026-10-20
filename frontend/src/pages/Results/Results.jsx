
import { useRef, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../services/api";
import "./Results.css";

// =========================================
// HELPERS
// =========================================

function getSemesterOrder(name = "") {
  const semester = String(name).toLowerCase();
  const yearMatch = semester.match(/20\d{2}/);
  const year = yearMatch ? Number(yearMatch[0]) : 9999;

  let season = 9;

  if (semester.includes("winter")) season = 1;
  else if (semester.includes("spring")) season = 2;
  else if (semester.includes("summer")) season = 3;
  else if (semester.includes("fall") || semester.includes("autumn")) {
    season = 4;
  }

  return year * 10 + season;
}

function formatNumber(value, decimals = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(decimals) : "0.00";
}

function getMarks(subject) {
  const values = [
    subject?.marks,
    subject?.total,
    subject?.obtainedMarks,
    subject?.marksObtained,
    subject?.obtained,
    subject?.mark,
  ];

  for (const value of values) {
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

function getCredits(subjects) {
  return subjects.reduce(
    (total, subject) => total + (Number(subject.creditHours) || 0),
    0
  );
}

function getQualityPoints(subjects) {
  return subjects.reduce(
    (total, subject) => total + (Number(subject.qualityPoints) || 0),
    0
  );
}

function calculateSummary(subjects) {
  const totalCredits = getCredits(subjects);
  const totalQualityPoints = getQualityPoints(subjects);
  const cgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  return {
    totalSubjects: subjects.length,
    totalCredits,
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    cgpa: Number(cgpa.toFixed(2)),
    percentage: Number(((cgpa / 4) * 100).toFixed(2)),
  };
}

function normalizeResult(data) {
  const semesters = (data.semesters || []).map((semester) => {
    const subjects = semester.subjects || [];
    const totalCredits = getCredits(subjects);
    const totalQualityPoints = getQualityPoints(subjects);

    return {
      ...semester,
      subjects,
      totalSubjects: subjects.length,
      totalCredits,
      totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
      gpa:
        totalCredits > 0
          ? Number((totalQualityPoints / totalCredits).toFixed(2))
          : 0,
    };
  });

  const subjects = semesters.length
    ? semesters.flatMap((semester) => semester.subjects)
    : data.subjects || [];

  return {
    ...data,
    semesters,
    subjects,
    summary: calculateSummary(subjects),
  };
}

// =========================================
// PDF HELPERS
// =========================================

function addPdfFooter(pdf) {
  const pageCount = pdf.internal.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(222, 230, 241);
    pdf.setLineWidth(0.3);
    pdf.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text("UAF EduPortal | Student Result Report", 14, pageHeight - 9);
    pdf.text(`Page ${page} of ${pageCount}`, pageWidth - 14, pageHeight - 9, {
      align: "right",
    });
  }
}

function addPdfHeader(pdf, title, subtitle = "") {
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(23, 71, 184);
  pdf.rect(0, 0, pageWidth, 35, "F");

  pdf.setFillColor(37, 99, 235);
  pdf.circle(pageWidth - 22, 13, 18, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(title, 14, 15);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(subtitle, 14, 23);

  pdf.setFontSize(8);
  pdf.text("UNIVERSITY ACADEMIC RESULT", 14, 29);
}

function addPdfSectionTitle(pdf, title, y) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(23, 71, 184);
  pdf.text(String(title).toUpperCase(), 14, y);

  pdf.setDrawColor(219, 230, 247);
  pdf.line(14, y + 2, pdf.internal.pageSize.getWidth() - 14, y + 2);
}

function addPdfSummaryCards(pdf, summary, startY) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const gap = 4;
  const left = 14;
  const cardWidth = (pageWidth - left * 2 - gap * 3) / 4;
  const cardHeight = 22;

  const items = [
    ["CGPA", formatNumber(summary.cgpa)],
    ["PERCENTAGE", `${formatNumber(summary.percentage)}%`],
    ["CREDIT HOURS", String(summary.totalCredits || 0)],
    ["SUBJECTS", String(summary.totalSubjects || 0)],
  ];

  items.forEach(([label, value], index) => {
    const x = left + index * (cardWidth + gap);

    pdf.setFillColor(240, 246, 255);
    pdf.setDrawColor(222, 232, 248);
    pdf.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, "FD");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(82, 100, 128);
    pdf.text(label, x + cardWidth / 2, startY + 7, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(23, 71, 184);
    pdf.text(value, x + cardWidth / 2, startY + 16, { align: "center" });
  });

  return startY + cardHeight;
}

function addSubjectPdfTable(pdf, subjects, startY, includeSemester = false) {
  const head = [
    includeSemester
      ? ["Semester", "Course Code", "Subject", "Credits", "Marks", "Grade", "Points"]
      : ["Course Code", "Subject", "Credits", "Marks", "Grade", "Quality Points"],
  ];

  const body = subjects.map((subject) => {
    const row = [
      subject.code || "-",
      subject.name || "Unnamed Subject",
      String(subject.creditHours ?? 0),
      String(getMarks(subject)),
      subject.grade || "-",
      formatNumber(subject.qualityPoints),
    ];

    if (includeSemester) {
      row.unshift(String(subject.semester || "-"));
    }

    return row;
  });

  autoTable(pdf, {
    startY,
    head,
    body,
    margin: { top: 17, left: 14, right: 14, bottom: 19 },
    showHead: "everyPage",
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
      textColor: [51, 65, 85],
      lineColor: [225, 232, 241],
      lineWidth: 0.2,
      valign: "middle",
    },
    headStyles: {
      fillColor: [23, 71, 184],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: { fillColor: [246, 249, 254] },
    columnStyles: includeSemester
      ? {
          0: { cellWidth: 23 },
          1: { cellWidth: 22 },
          2: { cellWidth: "auto" },
          3: { cellWidth: 16, halign: "center" },
          4: { cellWidth: 16, halign: "center" },
          5: { cellWidth: 15, halign: "center" },
          6: { cellWidth: 20, halign: "center" },
        }
      : {
          0: { cellWidth: 25 },
          1: { cellWidth: "auto" },
          2: { cellWidth: 18, halign: "center" },
          3: { cellWidth: 18, halign: "center" },
          4: { cellWidth: 16, halign: "center" },
          5: { cellWidth: 25, halign: "center" },
        },
  });

  return pdf.lastAutoTable.finalY;
}

// =========================================
// RESULTS COMPONENT
// =========================================

function Results() {
  const [session, setSession] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const sessionRef = useRef(null);
  const registrationRef = useRef(null);

  const handleSessionChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 4);
    setSession(value);
    setError("");

    if (result) setResult(null);

    if (value.length === 4) {
      setTimeout(() => registrationRef.current?.focus(), 0);
    }
  };

  const handleRegistrationChange = (event) => {
    setRegistrationNumber(event.target.value.replace(/\D/g, "").slice(0, 5));
    setError("");

    if (result) setResult(null);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (session.length !== 4) {
      setError("Please enter a valid 4-digit admission year.");
      sessionRef.current?.focus();
      return;
    }

    if (registrationNumber.length !== 5) {
      setError("Please enter your 5-digit registration number.");
      registrationRef.current?.focus();
      return;
    }

    const registration = `${session}-AG-${registrationNumber}`;

    setLoading(true);

    try {
      const response = await api.get(
        `/results/${encodeURIComponent(registration)}`
      );

      const data = response.data;

      // Guard against an empty response being treated as a valid result.
      if (
        !data ||
        (!Array.isArray(data.semesters) &&
          !Array.isArray(data.subjects) &&
          !data.student)
      ) {
        setError(
          "Result not found. Please verify your registration number and try again."
        );
        return;
      }

      setResult(normalizeResult(data));
    } catch (err) {
      console.error("Result fetch error:", err);

      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 404) {
        setError(
          "Result not found! Please check your admission year and registration number, then try again."
        );
      } else if (status === 400 || status === 422) {
        setError(
          serverMessage ||
            "The registration number is invalid. Please check the details and try again."
        );
      } else if (!err.response) {
        setError(
          "Unable to connect to the results server. Please check your internet connection and try again."
        );
      } else {
        setError(
          serverMessage ||
            "Unable to retrieve the result. Please verify your registration details and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove only from the displayed result, never from the original UAF record.
  const handleDeleteSubject = (semesterToUpdate, subjectIndex) => {
    const confirmed = window.confirm(
      "Remove this subject from the displayed result? This will not change the original UAF record."
    );

    if (!confirmed) return;

    setResult((current) => {
      if (!current) return current;

      if (current.semesters?.length && semesterToUpdate) {
        const targetIndex = current.semesters.indexOf(semesterToUpdate);

        if (targetIndex === -1) return current;

        const semesters = current.semesters.map((semester, index) => {
          if (index !== targetIndex) return semester;

          const subjects = semester.subjects.filter(
            (_, indexInSemester) => indexInSemester !== subjectIndex
          );

          const totalCredits = getCredits(subjects);
          const totalQualityPoints = getQualityPoints(subjects);

          return {
            ...semester,
            subjects,
            totalSubjects: subjects.length,
            totalCredits,
            totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
            gpa:
              totalCredits > 0
                ? Number((totalQualityPoints / totalCredits).toFixed(2))
                : 0,
          };
        });

        const subjects = semesters.flatMap((semester) => semester.subjects);

        return {
          ...current,
          semesters,
          subjects,
          summary: calculateSummary(subjects),
        };
      }

      const subjects = (current.subjects || []).filter(
        (_, index) => index !== subjectIndex
      );

      return {
        ...current,
        subjects,
        summary: calculateSummary(subjects),
      };
    });
  };

  // Generate and download the PDF directly.
  const handleDownloadPDF = () => {
    if (!result || downloadingPdf) return;

    setDownloadingPdf(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const studentName = result.student?.name || "N/A";
      const registration = fullRegistration || "N/A";
      const currentSummary = result.summary || {};
      const currentSemesters = [...(result.semesters || [])].sort((a, b) => {
        const aName = a.semester || a.semesterName || a.name || "";
        const bName = b.semester || b.semesterName || b.name || "";
        return getSemesterOrder(aName) - getSemesterOrder(bName);
      });

      addPdfHeader(pdf, "UAF EduPortal", "Student Academic Result Report");

      let y = 45;

      addPdfSectionTitle(pdf, "Student Information", y);
      y += 10;

      pdf.setFillColor(248, 250, 254);
      pdf.setDrawColor(229, 235, 245);
      pdf.roundedRect(14, y - 4, pageWidth - 28, 22, 2, 2, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(51, 65, 85);
      pdf.text("Student Name", 19, y + 3);
      pdf.text("Registration Number", pageWidth / 2 + 2, y + 3);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(23, 71, 184);
      pdf.text(pdf.splitTextToSize(studentName, 75).slice(0, 2), 19, y + 10);
      pdf.text(
        pdf.splitTextToSize(registration, 68).slice(0, 2),
        pageWidth / 2 + 2,
        y + 10
      );

      y += 28;
      addPdfSectionTitle(pdf, "Academic Overview", y);
      y += 7;
      y = addPdfSummaryCards(pdf, currentSummary, y) + 12;

      if (currentSemesters.length > 0) {
        currentSemesters.forEach((semester, index) => {
          const subjects = semester.subjects || [];
          const semesterName =
            semester.semester ||
            semester.semesterName ||
            semester.name ||
            `Semester ${index + 1}`;

          if (y > pageHeight - 45) {
            pdf.addPage();
            y = 22;
          }

          addPdfSectionTitle(pdf, semesterName, y);
          y += 5;

          const credits = getCredits(subjects);
          const qualityPoints = getQualityPoints(subjects);
          const gpa = credits > 0 ? qualityPoints / credits : 0;

          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(71, 85, 105);
          pdf.text(
            `Subjects: ${subjects.length}    Credit Hours: ${credits}    GPA: ${formatNumber(gpa)}    Quality Points: ${formatNumber(qualityPoints)}`,
            14,
            y + 1
          );

          y += 5;

          if (subjects.length > 0) {
            y = addSubjectPdfTable(pdf, subjects, y) + 9;
          } else {
            pdf.setFontSize(9);
            pdf.setTextColor(100, 116, 139);
            pdf.text("No subjects remain in this semester.", 14, y + 4);
            y += 13;
          }
        });
      } else {
        const subjects = result.subjects || [];

        addPdfSectionTitle(pdf, "Subject Results", y);
        y += 6;

        if (subjects.length > 0) {
          y = addSubjectPdfTable(pdf, subjects, y, true) + 8;
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(100, 116, 139);
          pdf.text("No subjects were found.", 14, y + 5);
          y += 12;
        }
      }

      if (y > pageHeight - 39) {
        pdf.addPage();
        y = 24;
      }

      addPdfSectionTitle(pdf, "Final Academic Summary", y);
      y += 9;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(23, 71, 184);
      pdf.text(
        `CGPA: ${formatNumber(currentSummary.cgpa)}   |   Percentage: ${formatNumber(currentSummary.percentage)}%`,
        14,
        y
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text(
        `Total Credit Hours: ${currentSummary.totalCredits || 0}   |   Total Subjects: ${currentSummary.totalSubjects || 0}`,
        14,
        y + 7
      );

      pdf.setFontSize(8);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated on ${new Date().toLocaleDateString("en-GB")}`, 14, y + 14);

      addPdfFooter(pdf);

      const safeRegistration = String(registration).replace(
        /[^a-zA-Z0-9_-]/g,
        "_"
      );

      pdf.save(`UAF-Result-${safeRegistration}.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      window.alert(
        "Unable to generate the PDF. Please try again. If the issue continues, check the browser console."
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  const summary = result?.summary || {};

  const semesters = [...(result?.semesters || [])].sort((a, b) => {
    const aName = a.semester || a.semesterName || a.name || "";
    const bName = b.semester || b.semesterName || b.name || "";
    return getSemesterOrder(aName) - getSemesterOrder(bName);
  });

  const fullRegistration =
    result?.registration ||
    (session && registrationNumber
      ? `${session}-AG-${registrationNumber}`
      : "N/A");

  return (
    <section className="page results-page">
      <div className="results-page-header">
        <div className="results-header-content">
          <span className="results-eyebrow">UAF EDU PORTAL</span>
          <h1>Academic Results</h1>
          <p>
            View your semester-wise academic performance, GPA, CGPA, marks and
            credit hours.
          </p>
        </div>

        <div className="results-header-badge">
          <span className="header-badge-icon">✓</span>
          <div>
            <strong>Official Result</strong>
            <small>Retrieved from UAF LMS</small>
          </div>
        </div>
      </div>

      <form className="result-search-card no-print" onSubmit={handleSearch}>
        <div className="search-card-icon">⌕</div>

        <div className="search-card-content">
          <label>Registration Number</label>
          <p>
            Enter your admission year and AG number to retrieve your academic
            record.
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
              aria-invalid={Boolean(error)}
            />

            <span className="registration-prefix">-AG-</span>

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
              aria-invalid={Boolean(error)}
            />
          </div>

          <button
            className="result-search-button"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Checking..."
            ) : (
              <>
                Check Result <span>→</span>
              </>
            )}
          </button>
        </div>

        <div className="registration-help">
          Example: <strong>2025</strong> <span>-AG-</span>{" "}
          <strong>10562</strong>
        </div>

        {error && (
          <div
            className="result-error"
            role="alert"
            aria-live="assertive"
          >
            <span aria-hidden="true">!</span>
            <div>
              <strong className="result-error-title">
                {error.includes("Please enter")
                  ? "Check Your Details"
                  : error.includes("connect")
                    ? "Connection Problem"
                    : "Result Not Found"}
              </strong>
              <div className="result-error-message">{error}</div>
            </div>
          </div>
        )}
      </form>

      {loading && (
        <div className="result-loading-card">
          <div className="loading-animation">
            <div className="loading-ring" />
            <div className="loading-core">UAF</div>
          </div>

          <div className="loading-content">
            <span className="loading-label">PLEASE WAIT</span>
            <h2>Finding Your Result</h2>
            <p>
              Connecting with UAF LMS and retrieving your academic record...
            </p>

            <div className="loading-status">
              <span className="loading-status-dot" />
              Processing your result securely
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="results-content">
          <div className="results-actions no-print">
            <p>
              Subject removals affect this displayed result only. The original
              UAF record remains unchanged.
            </p>

            <button
              type="button"
              className="result-action-button"
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
            >
              {downloadingPdf ? "Preparing PDF..." : "↓ Download PDF"}
            </button>
          </div>

          <div className="student-profile-card">
            <div className="student-profile-main">
              <div className="student-avatar">
                {(result.student?.name || "S").charAt(0).toUpperCase()}
              </div>

              <div className="student-details">
                <span className="student-label">STUDENT INFORMATION</span>
                <h2>{result.student?.name || "N/A"}</h2>

                <div className="student-registration">
                  <span>Registration No.</span>
                  <strong>{fullRegistration}</strong>
                </div>
              </div>
            </div>

            <div className="profile-status">
              <span className="status-dot" />
              <div>
                <strong>Result Available</strong>
                <small>Retrieved from UAF LMS</small>
              </div>
            </div>
          </div>

          <div className="result-summary-grid">
            <div className="result-summary-card cgpa-card">
              <div className="summary-card-top">
                <span>CGPA</span>
                <div className="summary-icon">★</div>
              </div>
              <div className="summary-value">{formatNumber(summary.cgpa)}</div>
              <small>Overall cumulative GPA</small>
            </div>

            <div className="result-summary-card percentage-card">
              <div className="summary-card-top">
                <span>Percentage</span>
                <div className="summary-icon">%</div>
              </div>
              <div className="summary-value">
                {formatNumber(summary.percentage)}%
              </div>
              <small>CGPA-based percentage</small>
            </div>

            <div className="result-summary-card credit-card">
              <div className="summary-card-top">
                <span>Credit Hours</span>
                <div className="summary-icon">CH</div>
              </div>
              <div className="summary-value">{summary.totalCredits || 0}</div>
              <small>Total displayed credit hours</small>
            </div>

            <div className="result-summary-card subject-card">
              <div className="summary-card-top">
                <span>Subjects</span>
                <div className="summary-icon">#</div>
              </div>
              <div className="summary-value">{summary.totalSubjects || 0}</div>
              <small>Displayed subjects</small>
            </div>
          </div>

          {semesters.length > 0 ? (
            <div className="semester-section">
              <div className="section-title-row">
                <div>
                  <span className="section-eyebrow">ACADEMIC HISTORY</span>
                  <h2>Semester Results</h2>
                  <p>
                    Delete subjects to preview updated academic calculations.
                  </p>
                </div>

                <div className="semester-total-badge">
                  {semesters.length}{" "}
                  {semesters.length === 1 ? "Semester" : "Semesters"}
                </div>
              </div>

              {semesters.map((semester, semesterIndex) => {
                const semesterSubjects = semester.subjects || [];
                const semesterName =
                  semester.semester ||
                  semester.semesterName ||
                  semester.name ||
                  "Semester";
                const semesterNumber =
                  semester.semesterNumber || semesterIndex + 1;
                const credits = getCredits(semesterSubjects);
                const qualityPoints = getQualityPoints(semesterSubjects);
                const gpa = credits > 0 ? qualityPoints / credits : 0;

                return (
                  <div
                    className="semester-result-card"
                    key={`${semesterName}-${semesterIndex}`}
                  >
                    <div className="semester-result-header">
                      <div className="semester-title">
                        <div className="semester-number">
                          {semesterNumber}
                        </div>
                        <div>
                          <span>SEMESTER {semesterNumber}</span>
                          <h3>{semesterName}</h3>
                        </div>
                      </div>

                      <div className="semester-gpa-box">
                        <span>GPA</span>
                        <strong>{formatNumber(gpa)}</strong>
                      </div>
                    </div>

                    <div className="semester-stats">
                      <div className="semester-stat">
                        <span>Subjects</span>
                        <strong>{semesterSubjects.length}</strong>
                      </div>
                      <div className="semester-stat">
                        <span>Credit Hours</span>
                        <strong>{credits}</strong>
                      </div>
                      <div className="semester-stat">
                        <span>Quality Points</span>
                        <strong>{formatNumber(qualityPoints)}</strong>
                      </div>
                    </div>

                    {semesterSubjects.length > 0 ? (
                      <>
                        <div className="result-table-container desktop-subject-table">
                          <table className="result-table">
                            <thead>
                              <tr>
                                <th>Subject</th>
                                <th>Credit Hours</th>
                                <th>Marks</th>
                                <th>Grade</th>
                                <th>Quality Points</th>
                                <th className="no-print">Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {semesterSubjects.map((subject, subjectIndex) => (
                                <tr
                                  key={`${subject.code}-${subject.name}-${subjectIndex}`}
                                >
                                  <td>
                                    <div className="subject-cell">
                                      <strong>{subject.name || "N/A"}</strong>
                                      <span>{subject.code || "N/A"}</span>
                                    </div>
                                  </td>
                                  <td>{subject.creditHours ?? "N/A"}</td>
                                  <td>
                                    <strong className="marks-value">
                                      {getMarks(subject)}
                                    </strong>
                                  </td>
                                  <td>
                                    <span className="grade-badge">
                                      {subject.grade || "N/A"}
                                    </span>
                                  </td>
                                  <td>
                                    <strong>
                                      {formatNumber(subject.qualityPoints)}
                                    </strong>
                                  </td>
                                  <td className="no-print">
                                    <button
                                      className="delete-subject-button"
                                      type="button"
                                      onClick={() =>
                                        handleDeleteSubject(
                                          semester,
                                          subjectIndex
                                        )
                                      }
                                      aria-label={`Remove ${subject.name || "subject"}`}
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>

                            <tfoot>
                              <tr>
                                <td>
                                  <strong>Semester Total</strong>
                                </td>
                                <td>
                                  <strong>{credits}</strong>
                                </td>
                                <td>—</td>
                                <td>
                                  <strong>GPA {formatNumber(gpa)}</strong>
                                </td>
                                <td>
                                  <strong>{formatNumber(qualityPoints)}</strong>
                                </td>
                                <td className="no-print" />
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        <div className="mobile-subject-list">
                          {semesterSubjects.map((subject, subjectIndex) => (
                            <article
                              className="mobile-subject-card"
                              key={`mobile-${subject.code}-${subject.name}-${subjectIndex}`}
                            >
                              <div className="mobile-subject-heading">
                                <div>
                                  <strong>{subject.name || "N/A"}</strong>
                                  <span>{subject.code || "N/A"}</span>
                                </div>
                                <span className="grade-badge">
                                  {subject.grade || "N/A"}
                                </span>
                              </div>

                              <div className="mobile-subject-details">
                                <div>
                                  <span>Credits</span>
                                  <strong>
                                    {subject.creditHours ?? "N/A"}
                                  </strong>
                                </div>
                                <div>
                                  <span>Marks</span>
                                  <strong>{getMarks(subject)}</strong>
                                </div>
                                <div>
                                  <span>Quality points</span>
                                  <strong>
                                    {formatNumber(subject.qualityPoints)}
                                  </strong>
                                </div>
                              </div>

                              <button
                                className="delete-subject-button no-print"
                                type="button"
                                onClick={() =>
                                  handleDeleteSubject(semester, subjectIndex)
                                }
                              >
                                Remove subject
                              </button>
                            </article>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="empty-result">
                        No subjects remain in this semester.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="semester-result-card">
              <div className="section-title-row">
                <div>
                  <span className="section-eyebrow">ACADEMIC RESULT</span>
                  <h2>Subject Results</h2>
                </div>
              </div>

              {(result.subjects || []).length ? (
                <div className="result-table-container">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>Semester</th>
                        <th>Course</th>
                        <th>Subject</th>
                        <th>Credits</th>
                        <th>Marks</th>
                        <th>Grade</th>
                        <th>Quality Points</th>
                        <th className="no-print">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {result.subjects.map((subject, index) => (
                        <tr key={`${subject.code}-${index}`}>
                          <td>{subject.semester || "N/A"}</td>
                          <td>{subject.code || "N/A"}</td>
                          <td>{subject.name || "N/A"}</td>
                          <td>{subject.creditHours ?? "N/A"}</td>
                          <td>{getMarks(subject)}</td>
                          <td>
                            <span className="grade-badge">
                              {subject.grade || "N/A"}
                            </span>
                          </td>
                          <td>{formatNumber(subject.qualityPoints)}</td>
                          <td className="no-print">
                            <button
                              className="delete-subject-button"
                              type="button"
                              onClick={() => handleDeleteSubject(null, index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-result">No subjects were found.</div>
              )}
            </div>
          )}

          <div className="final-summary-card">
            <div className="final-summary-content">
              <span className="section-eyebrow">FINAL ACADEMIC SUMMARY</span>
              <h2>Overall Performance</h2>
              <p>
                These figures reflect the subjects currently shown on this
                page.
              </p>
            </div>

            <div className="final-summary-values">
              <div>
                <span>CGPA</span>
                <strong>{formatNumber(summary.cgpa)}</strong>
              </div>
              <div>
                <span>Percentage</span>
                <strong>{formatNumber(summary.percentage)}%</strong>
              </div>
              <div>
                <span>Credits</span>
                <strong>{summary.totalCredits || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Results;
