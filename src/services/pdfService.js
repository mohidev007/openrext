import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// -----------------------------------------------
// Helper: Generate invoice PDF using Puppeteer
// -----------------------------------------------
export async function generateInvoicePDFPuppeteer({
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod,
}) {
  let browser = null;
  try {
    console.log("🔄 Starting PDF generation...");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Chrome executable path:", await chromium.executablePath());

    // Create HTML template for the donation receipt
    const html = createDonationReceiptHTML({
      donorName,
      amount,
      receiptNumber,
      isRecurring,
      badgeName,
      date,
      paymentMethod,
    });

    // Configure Puppeteer for Railway environment
    const puppeteerConfig = {
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-extensions",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
      defaultViewport: {
        width: 800,
        height: 1300,
        deviceScaleFactor: 1,
      },
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    };

    console.log("Launching browser with config...");
    browser = await puppeteer.launch(puppeteerConfig);

    console.log("✅ Browser launched successfully");
    const page = await browser.newPage();
    console.log("✅ New page created");

    // Set a reasonable timeout for page operations
    page.setDefaultTimeout(20000);
    page.setDefaultNavigationTimeout(20000);

    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
      timeout: 20000,
    });
    console.log("✅ Content set successfully");

    const pdfBuffer = await page.pdf({
      printBackground: true,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      timeout: 20000,
      height: "1020px",
      width: "700px",
    });
    console.log("✅ PDF generated successfully");

    return pdfBuffer;
  } catch (err) {
    console.error("❌ PDF generation error:", {
      message: err.message,
      stack: err.stack,
      name: err.name,
    });
    throw new Error(`PDF generation failed: ${err.message}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("✅ Browser closed successfully");
      } catch (closeErr) {
        console.error("❌ Error closing browser:", closeErr.message);
      }
    }
  }
}

// Donation receipt HTML template function
function createDonationReceiptHTML({
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod,
}) {
  const recurringText = isRecurring
    ? "Your recurring monthly donation helps us provide ongoing support to animals in need."
    : "Your one-time donation makes an immediate impact on the lives of animals in our care.";

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body { margin: 0; padding: 15px; font-family: Arial, sans-serif; background-color: #f5f5f5; }
  .invoice-container { max-width: 750px; margin: 0 auto; background: #ffffff; color: #333; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
  .header { background-color: #002366; padding: 8px; text-align: center; }
  .logo { width: 140px; height: auto; display: block; margin: 0 auto; }
  .body { padding: 8px 25px; }
  .title { color: #1e3a8a; font-size: 22px; margin: 15px 0 8px 0; }
  .receipt-section { margin: 20px 0; border: 1px solid #d1d5db; border-radius: 8px; padding: 15px; background-color: #f9fafb; }
  .receipt-title { margin-top: 0; color: #2563eb; font-size: 18px; margin-bottom: 12px; }
  .amount { color: #16a34a; font-weight: bold; }
  .impact-title { color: #1e3a8a; margin-top: 20px; margin-bottom: 10px; }
  .impact-list { padding-left: 20px; color: #374151; margin: 10px 0; }
  .impact-list li { margin-bottom: 8px; }
  .footer { background: rgb(200, 206, 219); padding: 12px; font-size: 12px; color: rgb(38, 79, 160); text-align: center; margin-top: 15px; }
  .footer p { margin: 3px 0; }
  .footer a { color: rgb(16, 45, 143); }
  p { line-height: 1.4; margin: 8px 0; }
  strong { font-weight: bold; }
</style></head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <img class="logo" src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo">
    </div>

    <!-- Body -->
    <div class="body">
      <h2 class="title">Thank You for Your Generous Donation!</h2>
      <p>Dear <strong>${donorName}</strong>,</p>
      <p>We sincerely appreciate your contribution to RexVets. ${recurringText}</p>

      <div class="receipt-section">
        <h3 class="receipt-title">Donation Receipt</h3>
        <p><strong>Receipt No:</strong> ${receiptNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Donation Amount:</strong> <span class="amount">$${amount}</span></p>
        ${
          badgeName
            ? `<p><strong>Badge:</strong> <strong>${badgeName}</strong></p>`
            : ""
        }
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <h4>Tax Statement:</h4>
        <p style="margin:0">Rex Vets Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.</p>
      </div>

      <h4 class="impact-title">A Note of Thanks:</h4>
     
      <ul class="impact-list">
        <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
        <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
        <li>With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
      </ul>

      <p>If you have any questions, feel free to reach out to us at support@rexvets.com.</p>
      
      <p style="margin-top: 20px;">With heartfelt thanks,</p>
      <p><em>– The RexVets Team</em></p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Rex Vets Inc</p>
      <p>📍 123 Animal Care Drive, Miami, FL 33101</p>
      <p>EIN: (123) 456-7690 | ✉️ support@rexvets.com</p>
      <p>🌐 www.rexvets.com</p>
    </div>
  </div>
</body></html>
  `;
}
