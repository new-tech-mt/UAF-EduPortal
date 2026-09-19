const puppeteer = require("puppeteer");

async function testLMS() {
  console.log("Starting UAF Result HTML inspection...");

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
    ],
    ignoreHTTPSErrors: true,
    timeout: 60000,
  });

  const page = await browser.newPage();

  try {
    console.log("Opening UAF LMS...");

    await page.goto("https://lms.uaf.edu.pk/login/index.php", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    console.log("Login page loaded.");

    const registrationNumber = process.argv[2];

    if (!registrationNumber) {
      console.log(
        'Please provide registration number: node testLms.js "2022-ag-12114"'
      );
      return;
    }

    await page.waitForSelector("#REG", {
      timeout: 10000,
    });

    await page.type("#REG", registrationNumber);

    console.log("Registration number entered.");

    await Promise.all([
      page.waitForNavigation({
        waitUntil: "networkidle2",
        timeout: 60000,
      }).catch(() => {}),
      page.click(
        'form[action*="uaf_student_result.php"] input[type="submit"]'
      ),
    ]);

    console.log("\n================ RESULT PAGE ================");

    console.log("URL:", page.url());
    console.log("Title:", await page.title());

    // ==========================================
    // TABLE INSPECTION
    // ==========================================

    console.log("\n================ TABLES ================");

    const tables = await page.$$eval("table", (elements) =>
      elements.map((table, tableIndex) => ({
        tableIndex,
        className: table.className,
        id: table.id,
        headers: Array.from(table.querySelectorAll("th")).map(
          (th) => th.innerText.trim()
        ),
        rows: Array.from(table.querySelectorAll("tr")).map((row) =>
          Array.from(row.querySelectorAll("th, td")).map(
            (cell) => cell.innerText.trim()
          )
        ),
      }))
    );

    console.log(JSON.stringify(tables, null, 2));

    // ==========================================
    // ALL TEXT
    // ==========================================

    console.log("\n================ PAGE TEXT ================");

    const pageText = await page.evaluate(() => document.body.innerText);

    console.log(pageText);

    // ==========================================
    // HTML SIZE
    // ==========================================

    console.log("\n================ HTML INFO ================");

    const html = await page.content();

    console.log("HTML length:", html.length);

    // ==========================================
    // SAVE HTML
    // ==========================================

    const fs = require("fs");

    fs.writeFileSync(
      "uaf-result-page.html",
      html,
      "utf8"
    );

    console.log(
      "\nSaved complete result HTML to:"
    );

    console.log("backend/uaf-result-page.html");

    console.log("\nUAF Result HTML inspection completed.");
await page.screenshot({
  path: "uaf-result-page.png",
  fullPage: true,
});

console.log("Screenshot saved: backend/uaf-result-page.png");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("\nUAF Result test failed:");
    console.error(error.message);
  } finally {
    await browser.close();
  }
}

testLMS();