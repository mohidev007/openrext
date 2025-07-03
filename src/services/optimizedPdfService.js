import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

// Browser pool management
class BrowserPool {
  constructor(maxSize = 3) {
    this.pool = [];
    this.maxSize = maxSize;
    this.activeCount = 0;
    this.totalCreated = 0;
    this.totalReused = 0;
  }

  async getBrowser() {
    // Try to get browser from pool
    if (this.pool.length > 0) {
      const browser = this.pool.pop();
      this.totalReused++;
      console.log(
        `♻️  Reusing browser from pool (reused: ${this.totalReused})`
      );
      return browser;
    }

    // Create new browser if pool is empty
    const browser = await this.createBrowser();
    this.totalCreated++;
    this.activeCount++;
    console.log(
      `🆕 Created new browser (total: ${this.totalCreated}, active: ${this.activeCount})`
    );
    return browser;
  }

  async releaseBrowser(browser) {
    try {
      // Check if browser is still connected
      if (!browser.isConnected()) {
        console.log("🔌 Browser disconnected, not returning to pool");
        this.activeCount--;
        return;
      }

      // Close all pages except the first one to free memory
      const pages = await browser.pages();
      for (let i = 1; i < pages.length; i++) {
        await pages[i].close();
      }

      // Return to pool if not full
      if (this.pool.length < this.maxSize) {
        this.pool.push(browser);
        console.log(
          `🔄 Returned browser to pool (pool size: ${this.pool.length})`
        );
      } else {
        await browser.close();
        this.activeCount--;
        console.log("🗑️  Pool full, closed browser");
      }
    } catch (error) {
      console.error("❌ Error releasing browser:", error.message);
      this.activeCount--;
      try {
        await browser.close();
      } catch (closeError) {
        console.error("❌ Error closing browser:", closeError.message);
      }
    }
  }

  async createBrowser() {
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
        // Memory optimization flags
        "--memory-pressure-off",
        "--max_old_space_size=512",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
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

    return await puppeteer.launch(puppeteerConfig);
  }

  async closeAll() {
    console.log(
      `🧹 Closing all browsers in pool (${this.pool.length} browsers)`
    );
    const closePromises = this.pool.map((browser) => browser.close());
    await Promise.all(closePromises);
    this.pool = [];
    this.activeCount = 0;
  }

  getStats() {
    return {
      poolSize: this.pool.length,
      maxSize: this.maxSize,
      activeCount: this.activeCount,
      totalCreated: this.totalCreated,
      totalReused: this.totalReused,
      reuseRate:
        this.totalCreated > 0
          ? ((this.totalReused / this.totalCreated) * 100).toFixed(1) + "%"
          : "0%",
    };
  }
}

const browserPool = new BrowserPool(3);

// Optimized PDF generation with browser pooling
export async function generateInvoicePDFPuppeteer({
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod,
}) {
  const startTime = performance.now();
  let browser = null;
  let page = null;

  try {
    console.log("🔄 Starting optimized PDF generation...");

    // Get browser from pool
    browser = await browserPool.getBrowser();
    console.log("✅ Browser acquired from pool");

    // Create or reuse page
    const pages = await browser.pages();
    page = pages.length > 0 ? pages[0] : await browser.newPage();

    // Clear any existing content
    await page.goto("about:blank");

    // Set timeout and configure page
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(15000);

    // Create optimized HTML template
    const html = createOptimizedDonationReceiptHTML({
      donorName,
      amount,
      receiptNumber,
      isRecurring,
      badgeName,
      date,
      paymentMethod,
    });

    console.log("📄 Setting PDF content...");
    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
      timeout: 15000,
    });

    console.log("🎯 Generating PDF...");
    const pdfBuffer = await page.pdf({
      printBackground: true,
      margin: { top: 10, right: 20, bottom: 20, left: 20 },
      timeout: 15000,
      height: "1050px",
      width: "700px",
      preferCSSPageSize: true,
    });

    const totalTime = performance.now() - startTime;
    console.log(`✅ PDF generated successfully in ${totalTime.toFixed(2)}ms`);

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
      // Return browser to pool instead of closing
      await browserPool.releaseBrowser(browser);
    }
  }
}

// Optimized HTML template with reduced size
function createOptimizedDonationReceiptHTML({
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

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{margin:0;padding:15px;font-family:Arial,sans-serif;background:#f5f5f5}
  .container{max-width:750px;margin:0 auto;background:#fff;color:#333;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden}
  .header{background:#002366;padding:8px;text-align:center}
  .logo{width:140px;height:auto;display:block;margin:0 auto}
  .body{padding:8px 25px}
  .title{color:#1e3a8a;font-size:22px;margin:15px 0 8px 0}
  .receipt{margin:20px 0;border:1px solid #d1d5db;border-radius:8px;padding:15px;background:#f9fafb}
  .receipt-title{margin-top:0;color:#2563eb;font-size:18px;margin-bottom:12px}
  .amount{color:#16a34a;font-weight:bold}
  .footer{background:#c8ced4;padding:12px;font-size:12px;color:#264fa0;text-align:center;margin-top:15px}
  .footer p{margin:3px 0}
  p{line-height:1.4;margin:8px 0}
  ul{padding-left:20px;color:#374151;margin:10px 0}
  li{margin-bottom:8px}
</style></head>
<body>
  <div class="container">
    <div class="header">
      <img class="logo" src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo">
    </div>
    <div class="body">
      <h2 class="title">Thank You for Your Generous Donation!</h2>
      <p>Dear <strong>${donorName}</strong>,</p>
      <p>We sincerely appreciate your contribution to RexVets. ${recurringText}</p>
      <div class="receipt">
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
      <h4>A Note of Thanks:</h4>
      <ul>
        <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
        <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
        <li>With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
      </ul>
      <p>If you have any questions, feel free to reach out to us at support@rexvets.com.</p>
      <p style="margin-top:20px">With heartfelt thanks,</p>
      <p><em>– The RexVets Team</em></p>
    </div>
    <div class="footer">
      <p>Rex Vets Inc</p>
      <p>📍 123 Animal Care Drive, Miami, FL 33101</p>
      <p>EIN: (123) 456-7690 | ✉️ support@rexvets.com</p>
      <p>🌐 www.rexvets.com</p>
    </div>
  </div>
</body></html>`;
}

// Get browser pool statistics
export function getPDFServiceStats() {
  return browserPool.getStats();
}

// Cleanup function for graceful shutdown
export async function closePDFService() {
  await browserPool.closeAll();
  console.log("✅ PDF service closed gracefully");
}

// Health check for browser pool
export async function checkPDFServiceHealth() {
  try {
    const stats = browserPool.getStats();
    return {
      status: "healthy",
      stats,
      memoryUsage: process.memoryUsage(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error.message,
    };
  }
}
