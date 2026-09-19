const express = require("express");
const scrapeUAFResult = require("../services/uafScraper");

const router = express.Router();

router.get("/:registration", async (req, res) => {
  const registration = req.params.registration?.trim();

  if (!registration) {
    return res.status(400).json({
      success: false,
      message: "Registration number is required.",
    });
  }

  try {
    console.log(`Fetching UAF result for: ${registration}`);

    const result = await scrapeUAFResult(registration);

    if (!result.studentName && result.subjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No result found for this registration number.",
      });
    }

    res.json({
      success: true,

      registration: result.registration || registration,

      student: {
        name: result.studentName || "N/A",
      },

      subjects: result.subjects || [],

      semesters: result.semesters || [],

      summary: {
        totalSubjects: result.totalSubjects || 0,
        totalCredits: result.totalCredits || 0,
        totalQualityPoints: result.totalQualityPoints || 0,
        cgpa: result.cgpa || 0,
        percentage: result.percentage || 0,
      },
    });
  } catch (error) {
    console.error("UAF result scraping error:");
    console.error(error);

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch result from UAF LMS. Please try again later.",
    });
  }
});

module.exports = router;