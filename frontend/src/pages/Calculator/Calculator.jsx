import { useState } from "react";
import "./Calculator.css";

function getQualityPoints(creditHours, marks) {
  const tables = {
    1: {
      16: 4,
      15: 3.67,
      14: 3.33,
      13: 3,
      12: 2.67,
      11: 2.33,
      10: 2,
      9: 1.5,
      8: 1,
    },
    2: {
      32: 8,
      31: 7.67,
      30: 7.33,
      29: 7,
      28: 6.67,
      27: 6.33,
      26: 6,
      25: 5.67,
      24: 5.33,
      23: 5,
      22: 4.67,
      21: 4.33,
      20: 4,
      19: 3.5,
      18: 3,
      17: 2.5,
      16: 2,
    },
    3: {
      48: 12,
      47: 11.67,
      46: 11.33,
      45: 11,
      44: 10.67,
      43: 10.33,
      42: 10,
      41: 9.67,
      40: 9.33,
      39: 9,
      38: 8.67,
      37: 8.33,
      36: 8,
      35: 7.67,
      34: 7.33,
      33: 7,
      32: 6.67,
      31: 6.33,
      30: 6,
      29: 5.5,
      28: 5,
      27: 4.5,
      26: 4,
      25: 3.5,
      24: 3,
    },
    4: {
      64: 16,
      63: 15.67,
      62: 15.33,
      61: 15,
      60: 14.67,
      59: 14.33,
      58: 14,
      57: 13.67,
      56: 13.33,
      55: 13,
      54: 12.67,
      53: 12.33,
      52: 12,
      51: 11.67,
      50: 11.33,
      49: 11,
      48: 10.67,
      47: 10.33,
      46: 10,
      45: 9.67,
      44: 9.33,
      43: 9,
      42: 8.67,
      41: 8.33,
      40: 8,
      39: 7.5,
      38: 7,
      37: 6.5,
      36: 6,
      35: 5.5,
      34: 5,
      33: 4.5,
      32: 4,
    },
    5: {
      80: 20,
      79: 19.67,
      78: 19.33,
      77: 19,
      76: 18.67,
      75: 18.33,
      74: 18,
      73: 17.67,
      72: 17.33,
      71: 17,
      70: 16.67,
      69: 16.33,
      68: 16,
      67: 15.67,
      66: 15.33,
      65: 15,
      64: 14.67,
      63: 14.33,
      62: 14,
      61: 13.67,
      60: 13.33,
      59: 13,
      58: 12.67,
      57: 12.33,
      56: 12,
      55: 11.67,
      54: 11.33,
      53: 11,
      52: 10.67,
      51: 10.33,
      50: 10,
      49: 9.5,
      48: 9,
      47: 8.5,
      46: 8,
      45: 7.5,
      44: 7,
      43: 6.5,
      42: 6,
      41: 5.5,
      40: 4,
    },
  };

  const table = tables[creditHours];

  if (!table) return 0;

  const markValues = Object.keys(table)
    .map(Number)
    .sort((a, b) => b - a);

  const matchedMark = markValues.find((mark) => marks >= mark);

  return matchedMark !== undefined ? table[matchedMark] : 0;
}

function Calculator() {
  const [subjectName, setSubjectName] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [marks, setMarks] = useState("");
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(null);

  const addCourse = () => {
    const credits = Number(creditHours);
    const obtainedMarks = Number(marks);

    if (!subjectName.trim() || !creditHours || !marks) {
      alert("Please fill all fields.");
      return;
    }

    if (credits < 1 || credits > 5) {
      alert("Credit hours must be between 1 and 5.");
      return;
    }

    if (obtainedMarks < 0 || obtainedMarks > credits * 16) {
      alert(
        `For ${credits} credit hour subject, marks should be between 0 and ${
          credits * 16
        }.`
      );
      return;
    }

    const qualityPoints = getQualityPoints(credits, obtainedMarks);

    setCourses([
      ...courses,
      {
        subjectName: subjectName.trim(),
        creditHours: credits,
        marks: obtainedMarks,
        qualityPoints,
      },
    ]);

    setSubjectName("");
    setCreditHours("");
    setMarks("");
    setGpa(null);
  };

  const removeCourse = (indexToRemove) => {
    setCourses(
      courses.filter((_, index) => index !== indexToRemove)
    );
    setGpa(null);
  };

  const calculateGPA = () => {
    if (courses.length === 0) return;

    const totalQualityPoints = courses.reduce(
      (total, course) => total + course.qualityPoints,
      0
    );

    const totalCredits = courses.reduce(
      (total, course) => total + course.creditHours,
      0
    );

    const calculatedGPA = totalQualityPoints / totalCredits;

    setGpa(calculatedGPA.toFixed(2));
  };

  const totalCredits = courses.reduce(
    (total, course) => total + course.creditHours,
    0
  );

  const totalQualityPoints = courses.reduce(
    (total, course) => total + course.qualityPoints,
    0
  );

  return (
    <section className="page calculator-page">
      <div className="page-header">
        <h1>GPA Calculator</h1>
        <p>
          Enter your subjects, credit hours and marks to calculate your
          semester GPA.
        </p>
      </div>

      <div className="calculator">
        <div className="calculator-form">
          <div className="form-group">
            <label>Subject Name</label>
            <input
              type="text"
              placeholder="e.g. Computer Science"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Credit Hours</label>
            <select
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
            >
              <option value="">Select credits</option>
              <option value="1">1 Credit</option>
              <option value="2">2 Credits</option>
              <option value="3">3 Credits</option>
              <option value="4">4 Credits</option>
              <option value="5">5 Credits</option>
            </select>
          </div>

          <div className="form-group">
            <label>Obtained Marks</label>
            <input
              type="number"
              min="0"
              placeholder="Enter marks"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />
          </div>

          <button className="secondary-btn" onClick={addCourse}>
            + Add Subject
          </button>
        </div>

        {courses.length > 0 && (
          <>
            <div className="calculator-summary">
              <div>
                <span>Subjects</span>
                <strong>{courses.length}</strong>
              </div>

              <div>
                <span>Total Credits</span>
                <strong>{totalCredits}</strong>
              </div>

              <div>
                <span>Quality Points</span>
                <strong>{totalQualityPoints.toFixed(2)}</strong>
              </div>
            </div>

            <div className="table-wrapper calculator-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Credits</th>
                    <th>Marks</th>
                    <th>Quality Points</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.subjectName}</td>
                      <td>{course.creditHours}</td>
                      <td>{course.marks}</td>
                      <td>{course.qualityPoints.toFixed(2)}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => removeCourse(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="primary-btn calculate-btn"
              onClick={calculateGPA}
            >
              Calculate GPA
            </button>
          </>
        )}

        {gpa !== null && (
          <div className="result-box">
            <p>Your Semester GPA</p>
            <strong>{gpa}</strong>
            <span>out of 4.00</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Calculator;