const puppeteer = require("puppeteer");

// =========================================
// UAF CREDIT HOURS
// =========================================

function getCreditHours(value) {
  if (!value) return 0;

  const match = String(value).match(/^\d+/);

  return match ? parseInt(match[0], 10) : 0;
}

// =========================================
// UAF QUALITY POINTS
// Exact logic from old UAF Student Portal
// =========================================

function getUAFQualityPoints(credit, marks) {
  credit = Number(credit);
  marks = Number(marks);

  let qp = 0;

  // ---------- 1 Credit ----------
  if (credit === 1) {
    if (marks >= 16) qp = 4;
    else if (marks === 15) qp = 3.67;
    else if (marks === 14) qp = 3.33;
    else if (marks === 13) qp = 3;
    else if (marks === 12) qp = 2.67;
    else if (marks === 11) qp = 2.33;
    else if (marks === 10) qp = 2;
    else if (marks === 9) qp = 1.5;
    else if (marks === 8) qp = 1;
    else qp = 0;
  }

  // ---------- 2 Credit ----------
  else if (credit === 2) {
    if (marks >= 32) qp = 8;
    else if (marks === 31) qp = 7.67;
    else if (marks === 30) qp = 7.33;
    else if (marks === 29) qp = 7;
    else if (marks === 28) qp = 6.67;
    else if (marks === 27) qp = 6.33;
    else if (marks === 26) qp = 6;
    else if (marks === 25) qp = 5.67;
    else if (marks === 24) qp = 5.33;
    else if (marks === 23) qp = 5;
    else if (marks === 22) qp = 4.67;
    else if (marks === 21) qp = 4.33;
    else if (marks === 20) qp = 4;
    else if (marks === 19) qp = 3.5;
    else if (marks === 18) qp = 3;
    else if (marks === 17) qp = 2.5;
    else if (marks === 16) qp = 2;
    else qp = 0;
  }

  // ---------- 3 Credit ----------
  else if (credit === 3) {
    if (marks >= 48) qp = 12;
    else if (marks === 47) qp = 11.67;
    else if (marks === 46) qp = 11.33;
    else if (marks === 45) qp = 11;
    else if (marks === 44) qp = 10.67;
    else if (marks === 43) qp = 10.33;
    else if (marks === 42) qp = 10;
    else if (marks === 41) qp = 9.67;
    else if (marks === 40) qp = 9.33;
    else if (marks === 39) qp = 9;
    else if (marks === 38) qp = 8.67;
    else if (marks === 37) qp = 8.33;
    else if (marks === 36) qp = 8;
    else if (marks === 35) qp = 7.67;
    else if (marks === 34) qp = 7.33;
    else if (marks === 33) qp = 7;
    else if (marks === 32) qp = 6.67;
    else if (marks === 31) qp = 6.33;
    else if (marks === 30) qp = 6;
    else if (marks === 29) qp = 5.5;
    else if (marks === 28) qp = 5;
    else if (marks === 27) qp = 4.5;
    else if (marks === 26) qp = 4;
    else if (marks === 25) qp = 3.5;
    else if (marks === 24) qp = 3;
    else qp = 0;
  }

  // ---------- 4 Credit ----------
  else if (credit === 4) {
    if (marks >= 64) qp = 16;
    else if (marks === 63) qp = 15.67;
    else if (marks === 62) qp = 15.33;
    else if (marks === 61) qp = 15;
    else if (marks === 60) qp = 14.67;
    else if (marks === 59) qp = 14.33;
    else if (marks === 58) qp = 14;
    else if (marks === 57) qp = 13.67;
    else if (marks === 56) qp = 13.33;
    else if (marks === 55) qp = 13;
    else if (marks === 54) qp = 12.67;
    else if (marks === 53) qp = 12.33;
    else if (marks === 52) qp = 12;
    else if (marks === 51) qp = 11.67;
    else if (marks === 50) qp = 11.33;
    else if (marks === 49) qp = 11;
    else if (marks === 48) qp = 10.67;
    else if (marks === 47) qp = 10.33;
    else if (marks === 46) qp = 10;
    else if (marks === 45) qp = 9.67;
    else if (marks === 44) qp = 9.33;
    else if (marks === 43) qp = 9;
    else if (marks === 42) qp = 8.67;
    else if (marks === 41) qp = 8.33;
    else if (marks === 40) qp = 8;
    else if (marks === 39) qp = 7.5;
    else if (marks === 38) qp = 7;
    else if (marks === 37) qp = 6.5;
    else if (marks === 36) qp = 6;
    else if (marks === 35) qp = 5.5;
    else if (marks === 34) qp = 5;
    else if (marks === 33) qp = 4.5;
    else if (marks === 32) qp = 4;
    else qp = 0;
  }

  // ---------- 5 Credit ----------
  else if (credit === 5) {
    if (marks >= 80) qp = 20;
    else if (marks === 79) qp = 19.67;
    else if (marks === 78) qp = 19.33;
    else if (marks === 77) qp = 19;
    else if (marks === 76) qp = 18.67;
    else if (marks === 75) qp = 18.33;
    else if (marks === 74) qp = 18;
    else if (marks === 73) qp = 17.67;
    else if (marks === 72) qp = 17.33;
    else if (marks === 71) qp = 17;
    else if (marks === 70) qp = 16.67;
    else if (marks === 69) qp = 16.33;
    else if (marks === 68) qp = 16;
    else if (marks === 67) qp = 15.67;
    else if (marks === 66) qp = 15.33;
    else if (marks === 65) qp = 15;
    else if (marks === 64) qp = 14.67;
    else if (marks === 63) qp = 14.33;
    else if (marks === 62) qp = 14;
    else if (marks === 61) qp = 13.67;
    else if (marks === 60) qp = 13.33;
    else if (marks === 59) qp = 13;
    else if (marks === 58) qp = 12.67;
    else if (marks === 57) qp = 12.33;
    else if (marks === 56) qp = 12;
    else if (marks === 55) qp = 11.67;
    else if (marks === 54) qp = 11.33;
    else if (marks === 53) qp = 11;
    else if (marks === 52) qp = 10.67;
    else if (marks === 51) qp = 10.33;
    else if (marks === 50) qp = 10;
    else if (marks === 49) qp = 9.5;
    else if (marks === 48) qp = 9;
    else if (marks === 47) qp = 8.5;
    else if (marks === 46) qp = 8;
    else if (marks === 45) qp = 7.5;
    else if (marks === 44) qp = 7;
    else if (marks === 43) qp = 6.5;
    else if (marks === 42) qp = 6;
    else if (marks === 41) qp = 5.5;
    else if (marks === 40) qp = 4;
    else qp = 0;
  }

  return qp;
}

// =========================================
// GPA CALCULATION
// =========================================

function calculateGPA(subjects) {
  let totalQualityPoints = 0;
  let totalCredits = 0;

  subjects.forEach((subject) => {
    const credit = Number(subject.creditHours) || 0;
    const qualityPoints = Number(subject.qualityPoints) || 0;

    totalQualityPoints += qualityPoints;
    totalCredits += credit;
  });

  if (totalCredits === 0) {
    return 0;
  }

  return totalQualityPoints / totalCredits;
}

// =========================================
// SEMESTER SORTING
// =========================================

function getSemesterSortValue(semesterName) {
  const name = String(semesterName || "")
    .trim()
    .toLowerCase();

  // Winter Semester 2025-26 = Semester 1
  if (
    name.includes("winter") &&
    name.includes("2025") &&
    name.includes("26")
  ) {
    return 1;
  }

  // Spring Semester 2026 = Semester 2
  if (
    name.includes("spring") &&
    name.includes("2026")
  ) {
    return 2;
  }

  // Generic fallback
  let year = 9999;

  const yearMatch = name.match(/20\d{2}/);

  if (yearMatch) {
    year = Number(yearMatch[0]);
  }

  let season = 9;

  if (name.includes("winter")) {
    season = 1;
  } else if (name.includes("spring")) {
    season = 2;
  } else if (name.includes("summer")) {
    season = 3;
  } else if (name.includes("fall")) {
    season = 4;
  } else if (name.includes("autumn")) {
    season = 4;
  }

  return year * 10 + season;
}

// =========================================
// SCRAPER
// =========================================

async function scrapeUAFResult(registrationNumber) {
  if (!registrationNumber) {
    throw new Error("Registration number is required.");
  }

  const browser = await puppeteer.launch({
    headless: true,

    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",

    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--ignore-certificate-errors",
    ],

    ignoreHTTPSErrors: true,

    timeout: 60000,
  });

  const page = await browser.newPage();

  try {
    console.log(
      `Fetching UAF result for: ${registrationNumber}`
    );

    // =========================================
    // OPEN UAF LMS
    // =========================================

    await page.goto(
      "https://lms.uaf.edu.pk/login/index.php",
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    await page.waitForSelector("#REG", {
      timeout: 10000,
    });

    // =========================================
    // ENTER REGISTRATION NUMBER
    // =========================================

    await page.type(
      "#REG",
      registrationNumber.trim()
    );

    // =========================================
    // SUBMIT RESULT FORM
    // =========================================

    await Promise.all([
      page
        .waitForNavigation({
          waitUntil: "networkidle2",
          timeout: 60000,
        })
        .catch(() => {}),

      page.click(
        'form[action*="uaf_student_result.php"] input[type="submit"]'
      ),
    ]);

    // =========================================
    // WAIT FOR RESULT TABLE
    // =========================================

    await page.waitForSelector("table", {
      timeout: 30000,
    });

    // =========================================
    // SCRAPE PAGE
    // =========================================

    const data = await page.evaluate(() => {
      const tables =
        document.querySelectorAll("table");

      let registration = "";
      let studentName = "";

      // =========================================
      // STUDENT INFORMATION
      // =========================================

      if (tables.length > 0) {
        const rows = Array.from(
          tables[0].querySelectorAll("tr")
        );

        rows.forEach((row) => {
          const cells = Array.from(
            row.querySelectorAll("td")
          ).map((cell) =>
            cell.innerText.trim()
          );

          if (cells.length >= 2) {
            if (cells[0] === "Registration #") {
              registration = cells[1];
            }

            if (
              cells[0] === "Student Full Name"
            ) {
              studentName = cells[1];
            }
          }
        });
      }

      // =========================================
      // RESULT TABLE
      // =========================================

      const resultTable = Array.from(
        tables
      ).find(
        (table) => table.rows.length > 5
      );

      const subjects = [];

      if (resultTable) {
        const rows = Array.from(
          resultTable.querySelectorAll("tr")
        );

        rows.slice(1).forEach((row) => {
          const cells = Array.from(
            row.querySelectorAll("td")
          ).map((cell) =>
            cell.innerText.trim()
          );

          if (cells.length < 12) {
            return;
          }

          subjects.push({
            semester: cells[1] || "",
            teacher: cells[2] || "",
            code: cells[3] || "",
            name: cells[4] || "",
            creditHoursText: cells[5] || "",
            mid: cells[6] || "",
            assignment: cells[7] || "",
            final: cells[8] || "",
            practical: cells[9] || "",
            total: cells[10] || "",
            grade: cells[11] || "",
          });
        });
      }

      return {
        registration,
        studentName,
        subjects,
      };
    });

    // =========================================
    // CALCULATE SUBJECT DATA
    // =========================================

    const subjects = data.subjects.map(
      (subject) => {
        const creditHours = getCreditHours(
          subject.creditHoursText
        );

        /*
         * UAF's Total column contains the
         * obtained marks used for the
         * quality-point calculation.
         */
        const marks = Number(subject.total) || 0;

        const qualityPoints =
          getUAFQualityPoints(
            creditHours,
            marks
          );

        return {
          semester: String(
            subject.semester || ""
          ).trim(),

          teacher: subject.teacher,

          code: subject.code,

          name: subject.name,

          creditHours,

          creditHoursText:
            subject.creditHoursText,

          mid: subject.mid,

          assignment:
            subject.assignment,

          final: subject.final,

          practical:
            subject.practical,

          // =====================================
          // IMPORTANT:
          // SEND MARKS AS "marks"
          // =====================================

          marks,

          // Keep total too for compatibility
          total: marks,

          grade: subject.grade,

          qualityPoints,
        };
      }
    );

    // =========================================
    // SEMESTER-WISE CALCULATION
    // =========================================

    const semesterMap = {};

    subjects.forEach((subject) => {
      const semesterName = String(
        subject.semester || ""
      ).trim();

      if (!semesterName) {
        return;
      }

      if (!semesterMap[semesterName]) {
        semesterMap[semesterName] = [];
      }

      semesterMap[semesterName].push(
        subject
      );
    });

    // =========================================
    // SORT SEMESTERS
    // =========================================

    const semesterNames =
      Object.keys(semesterMap).sort(
        (a, b) =>
          getSemesterSortValue(a) -
          getSemesterSortValue(b)
      );

    // =========================================
    // CREATE SEMESTER RESULTS
    // =========================================

    const semesters =
      semesterNames.map(
        (semesterName, index) => {
          const semesterSubjects =
            semesterMap[semesterName];

          const totalCredits =
            semesterSubjects.reduce(
              (sum, subject) =>
                sum +
                Number(
                  subject.creditHours
                ),
              0
            );

          const totalQualityPoints =
            semesterSubjects.reduce(
              (sum, subject) =>
                sum +
                Number(
                  subject.qualityPoints
                ),
              0
            );

          const gpa =
            totalCredits > 0
              ? totalQualityPoints /
                totalCredits
              : 0;

          return {
            semesterNumber:
              index + 1,

            semester:
              semesterName,

            // Also provide semesterName
            // for frontend compatibility.
            semesterName,

            subjects:
              semesterSubjects,

            totalSubjects:
              semesterSubjects.length,

            totalCredits,

            totalQualityPoints:
              Number(
                totalQualityPoints.toFixed(
                  2
                )
              ),

            gpa:
              Number(
                gpa.toFixed(2)
              ),
          };
        }
      );

    // =========================================
    // OVERALL TOTALS
    // =========================================

    const totalCredits =
      subjects.reduce(
        (sum, subject) =>
          sum +
          Number(
            subject.creditHours
          ),
        0
      );

    const totalQualityPoints =
      subjects.reduce(
        (sum, subject) =>
          sum +
          Number(
            subject.qualityPoints
          ),
        0
      );

    // =========================================
    // OVERALL CGPA
    // =========================================

    const cgpa =
      totalCredits > 0
        ? totalQualityPoints /
          totalCredits
        : 0;

    // =========================================
    // PERCENTAGE
    // Old portal formula:
    // CGPA / 4 × 100
    // =========================================

    const percentage =
      (cgpa / 4) * 100;

    // =========================================
    // FINAL RESULT
    // =========================================

    return {
      registration:
        data.registration ||
        registrationNumber,

      studentName:
        data.studentName ||
        "N/A",

      subjects,

      semesters,

      totalSubjects:
        subjects.length,

      totalCredits,

      totalQualityPoints:
        Number(
          totalQualityPoints.toFixed(
            2
          )
        ),

      cgpa:
        Number(
          cgpa.toFixed(2)
        ),

      percentage:
        Number(
          percentage.toFixed(2)
        ),
    };
  } catch (error) {
    console.error(
      "UAF scraper error:",
      error
    );

    throw error;
  } finally {
    // =========================================
    // ALWAYS CLOSE BROWSER
    // =========================================

    await browser.close();
  }
}

module.exports = scrapeUAFResult;