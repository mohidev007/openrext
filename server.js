import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import moment from "moment-timezone";
import {
  welcomeEmailTemplate,
  bookingConfirmationDoctorTemplate,
  bookingConfirmationParentTemplate,
  rescheduleConfirmationParentTemplate,
  rescheduleConfirmationDoctorTemplate,
  reminderParentTemplate,
  reminderDoctorTemplate,
  messageToParentTemplate,
  messageToDoctorTemplate,
  donationThankYouTemplate,
  pharmacyRequestPaymentTemplate,
  pharmacyRequestAcceptedTemplate,
  helpRequestEmailTemplate,
} from "./emailTemplates.js";
import admin from "firebase-admin";
import convertNYToLocal from "./utils.js";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Log startup environment
console.log("🔧 Starting server with configuration:");
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${PORT}`);
console.log(
  `- Firebase Project: ${process.env.FIREBASE_PROJECT_ID || "Not configured"}`
);
console.log(`- SMTP Host: ${process.env.SMTP_HOST || "Not configured"}`);

// Configure CORS based on environment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.ALLOWED_ORIGIN || "https://www.rexvets.com",
      "https://www.rexvets.com",
      "https://rexvets.com",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ];

    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      console.log(`✅ Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
    "X-Access-Token",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: false,
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Timeout middleware - ensure requests don't hang
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(503).json({
      status: "error",
      message: "Request timeout",
    });
  });
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(
    `🔍 ${req.method} ${req.path} from origin: ${
      req.headers.origin || "no-origin"
    }`
  );
  console.log(`🔍 Headers:`, {
    "content-type": req.headers["content-type"],
    "user-agent": req.headers["user-agent"]?.substring(0, 50) + "...",
    origin: req.headers.origin,
    referer: req.headers.referer,
  });
  next();
});

// Global error handlers to prevent function crashes
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

// Setup Nodemailer with Brevo SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER, // Using environment variable for user
    pass: process.env.SMTP_PASSWORD, // Using environment variable for password---
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
  // headers: {
  //   Organization: "Rex Vets",
  //   "X-Priority": "3",
  //   "X-Mailer": "Rex Vets Email System",
  // },
});

// Inicializar Firebase Admin
try {
  if (!admin.apps.length) {
    // Validate required Firebase environment variables
    const requiredFirebaseVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_CLIENT_ID",
      "FIREBASE_CLIENT_X509_CERT_URL",
    ];

    const missingVars = requiredFirebaseVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required Firebase environment variables: ${missingVars.join(
          ", "
        )}`
      );
    }

    // Create service account object from environment variables
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };

    console.log(
      "🔥 Initializing Firebase with project:",
      process.env.FIREBASE_PROJECT_ID
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        process.env.FIREBASE_DATABASE_URL ||
        "https://rexvets-database.firebaseio.com",
    });

    console.log("✅ Firebase initialized successfully");
  }
} catch (error) {
  console.error("❌ Error initializing Firebase Admin:", error.message);
  console.error(
    "Please check your Firebase environment variables in Vercel dashboard"
  );
  console.error("Server will continue without Firebase functionality");
}

// Initialize Firestore with error handling
let db;
try {
  db = admin.firestore();
  console.log("✅ Firestore initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firestore:", error.message);
  console.error("Firebase Admin may not be properly initialized");
}

// Middleware to check Firebase status for endpoints that need it
const requireFirebase = (req, res, next) => {
  if (!db) {
    return res.status(503).json({
      error: "Database not available",
      message:
        "Firebase is not properly initialized. Please check environment variables.",
      timestamp: new Date().toISOString(),
    });
  }
  next();
};

// TIMEZONE UTILITY FUNCTIONS
const convertFromUTC = (utcDate, timezone) => {
  try {
    const momentDate = moment.utc(utcDate).tz(timezone);
    return {
      time: momentDate.format("h:mm A"),
      date: momentDate.format("YYYY-MM-DD"),
      fullDateTime: momentDate.format("YYYY-MM-DD h:mm A"),
      abbreviation: momentDate.format("z"),
    };
  } catch (error) {
    console.error("Error converting UTC to timezone:", error);
    return {
      time: moment.utc(utcDate).format("h:mm A"),
      date: moment.utc(utcDate).format("YYYY-MM-DD"),
      fullDateTime: moment.utc(utcDate).format("YYYY-MM-DD h:mm A"),
      abbreviation: "UTC",
    };
  }
};

const formatTimeForTimezone = (
  appointmentTimeUTC,
  timezone,
  fallbackTime,
  fallbackDate
) => {
  if (appointmentTimeUTC && timezone) {
    const converted = convertFromUTC(appointmentTimeUTC, timezone);
    return `${converted.date} at ${converted.time} (${converted.abbreviation})`;
  }
  // Fallback to original format if timezone data is not available
  return `${fallbackDate} at ${fallbackTime}`;
};

// -----------------------------------------------
// Helper: Generate invoice PDF using Puppeteer
// -----------------------------------------------
async function generateInvoicePDFPuppeteer({
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
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f5f5f5;
        }
        .receipt-container {
          background-color: white;
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #002366;
          padding-bottom: 20px;
        }
        .logo {
          color: #002366;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .receipt-title {
          color: #333;
          font-size: 20px;
          margin: 0;
        }
        .receipt-details {
          margin: 30px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .detail-value {
          color: #333;
        }
        .amount {
          font-size: 18px;
          font-weight: bold;
          color: #007a2f;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 12px;
        }
        .tax-notice {
          background-color: #f0f8ff;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          font-size: 14px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <div class="logo">Rex Vets</div>
          <h1 class="receipt-title">Donation Receipt</h1>
        </div>
        
        <div class="receipt-details">
          <div class="detail-row">
            <span class="detail-label">Receipt Number:</span>
            <span class="detail-value">${receiptNumber}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Donor Name:</span>
            <span class="detail-value">${donorName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${date}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Method:</span>
            <span class="detail-value">${paymentMethod}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Donation Type:</span>
            <span class="detail-value">${
              isRecurring ? "Recurring Monthly" : "One-time"
            }</span>
          </div>
          ${
            badgeName
              ? `
          <div class="detail-row">
            <span class="detail-label">Badge Level:</span>
            <span class="detail-value">${badgeName}</span>
          </div>
          `
              : ""
          }
          <div class="detail-row">
            <span class="detail-label">Donation Amount:</span>
            <span class="detail-value amount">$${amount}</span>
          </div>
        </div>

        <div class="tax-notice">
          <strong>Tax Deduction Information:</strong><br>
          Rex Vets is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the fullest extent allowed by law. 
          Please consult your tax advisor for specific advice regarding your deduction.
          <br><br>
          <strong>EIN:</strong> [Tax ID Number]
        </div>

        <div class="footer">
          <p>Thank you for supporting Rex Vets!</p>
          <p>Email: support@rexvets.com | Website: www.rexvets.com</p>
          <p>This receipt was generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    </body>
    </html>
    `;

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
        height: 1200,
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
      format: "A4",
      printBackground: true,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      timeout: 20000,
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

// EMAILS

// Enhanced health check endpoint for Railway
app.get(["/", "/health"], (req, res) => {
  try {
    const firebaseStatus =
      admin.apps.length > 0 ? "Connected" : "Not initialized";
    const dbStatus = db ? "Connected" : "Not connected";

    res.json({
      status: "OK",
      message: "Rex Vets Email Server is running",
      timestamp: new Date().toISOString(),
      platform: "Railway",
      services: {
        firebase: firebaseStatus,
        firestore: dbStatus,
        nodemailer: "Ready",
      },
      environment: {
        hasFirebaseConfig: !!process.env.FIREBASE_PROJECT_ID,
        hasSMTPConfig: !!process.env.SMTP_HOST,
        nodeVersion: process.version,
        platform: process.platform,
        port: PORT,
      },
    });
  } catch (error) {
    console.error("❌ Health check error:", error);
    res.status(500).json({
      status: "error",
      message: "Health check failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// CORS test endpoint
app.get("/test-cors", (req, res) => {
  res.json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
  });
});

app.post("/test-cors", (req, res) => {
  res.json({
    message: "CORS POST test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    method: req.method,
    body: req.body,
  });
});

app.post("/sendWelcomeEmailParent", (req, res) => {
  console.log("Received request to send welcome email:", req.body); // Log incoming request data
  const { email, name } = req.body;

  const mailOptions = {
    from: "Rex Vets <support@rexvets.com>",
    to: email,
    subject: "Welcome to Rex Vets!",
    html: welcomeEmailTemplate(name), // Call the function with 'name'
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error); // Log email sending error
      return res.status(500).send({ message: "Failed to send email" });
    }
    console.log("Email sent:", info.response); // Log email success
    res.send({ message: "Welcome email sent successfully!" });
  });
});

// UPDATED Route to send booking confirmation emails with proper timezone handling
app.post("/sendBookingConfirmation", requireFirebase, async (req, res) => {
  console.log("Received request to send booking confirmation:", req.body);
  const {
    doctorEmail,
    doctorName,
    parentEmail,
    parentName,
    petName,
    appointmentDate,
    appointmentTime,
    appointmentTimeUTC, // NEW: UTC timestamp
    doctorTimezone, // NEW: Doctor's timezone
    userTimezone, // NEW: User's timezone
    userDisplayTime, // NEW: Time as shown to user
    meetingLink,
  } = req.body;

  // Format times for each recipient's timezone
  const doctorTimeDisplay = formatTimeForTimezone(
    appointmentTimeUTC,
    doctorTimezone,
    appointmentTime,
    appointmentDate
  );

  const parentTimeDisplay = formatTimeForTimezone(
    appointmentTimeUTC,
    userTimezone,
    userDisplayTime || appointmentTime,
    appointmentDate
  );

  // const parentTimeDisplay = formatTimeForTimezone(
  //   appointmentTimeUTC,
  //   userTimezone,
  //   userDisplayTime || appointmentTime,
  //   appointmentDate
  // );

  console.log("Doctor will see:", doctorTimeDisplay);
  console.log("Parent will see:", parentTimeDisplay);

  // Email content for doctor with doctor's timezone
  const mailOptionsDoctor = {
    from: "Rex Vets <support@rexvets.com>",
    to: doctorEmail,
    subject: "Appointment Confirmation - Rex Vets",
    html: bookingConfirmationDoctorTemplate(
      doctorName,
      parentName,
      doctorTimeDisplay, // Use doctor's timezone
      petName,
      meetingLink
    ),
  };

  // Email content for parent with parent's timezone
  const mailOptionsParent = {
    from: "Rex Vets <support@rexvets.com>",
    to: parentEmail,
    subject: "Your Appointment Confirmation - Rex Vets",
    html: bookingConfirmationParentTemplate(
      parentName,
      doctorName,
      parentTimeDisplay, // Use parent's timezone
      petName,
      meetingLink
    ),
  };

  try {
    // Send emails
    await transporter.sendMail(mailOptionsDoctor);
    await transporter.sendMail(mailOptionsParent);

    res.send({ message: "Booking confirmation emails sent successfully!" });
    console.log("Booking confirmation emails sent successfully!");

    // Store reminder in Firestore with timezone information
    console.log("🔄 Attempting to schedule reminder in Firestore...");
    try {
      const reminderData = {
        appointmentDate,
        appointmentTime,
        appointmentTimeUTC, // Store UTC timestamp
        doctorTimezone, // Store doctor's timezone
        userTimezone, // Store user's timezone
        userDisplayTime, // Store user's display time
        parentEmail,
        parentName,
        doctorName,
        doctorEmail,
        meetingLink,
        scheduledAt: new Date().toISOString(),
        reminderSent: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const reminderRef = await db
        .collection("ReminderEmails")
        .add(reminderData);
      console.log(
        "✅ Reminder scheduled in Firestore with ID:",
        reminderRef.id
      );
    } catch (firestoreError) {
      console.error("❌ Error storing reminder in Firestore:", firestoreError);
    }
  } catch (error) {
    console.error("Error sending booking confirmation emails:", error);
    res
      .status(500)
      .send({ message: "Failed to send booking confirmation emails" });
  }
});

app.post("/sendPaymentEmail", async (req, res) => {
  const { to, name, transactionId, amount, pharmacyName, date } = req.body;

  console.log("Received request to send payment email:", req.body);

  if (!to || !transactionId || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const mailOptionsParent = {
    from: "Rex Vets <support@rexvets.com>",
    to,
    subject: "Your Pharmacy Transfer Payment Receipt",
    html: pharmacyRequestPaymentTemplate({
      name,
      transactionId,
      amount,
      pharmacyName,
      date,
    }),
  };

  try {
    await transporter.sendMail(mailOptionsParent);
    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.post("/sendRequestAccpetedEmail", async (req, res) => {
  const {
    to,
    name,
    transactionId,
    amount,
    pharmacyName,
    pharmacyAddress,
    pharmacyCity,
    pharmacyState,
    date,
  } = req.body;

  console.log("Received request to send payment email:", req.body);

  if (!to || !transactionId || !amount) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const mailOptionsParent = {
    from: "Rex Vets <support@rexvets.com>",
    to,
    subject: "Your Pharmacy Transfer Request Accepted",
    html: pharmacyRequestAcceptedTemplate({
      name,
      transactionId,
      amount,
      pharmacyName,
      pharmacyAddress,
      pharmacyCity,
      pharmacyState,
      date,
    }),
  };

  try {
    await transporter.sendMail(mailOptionsParent);
    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.post("/sendHelpAskingMail", async (req, res) => {
  const {
    fullName,
    emailAddress,
    phoneNo,
    state,
    subject,
    message,
    image,
    userType,
    userID,
  } = req.body;

  console.log("Received request to send help asking email:", req.body);

  if (!fullName || !emailAddress || !subject) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const mailOptionsParent = {
    from: `"${fullName}" ${emailAddress}`,
    to: "<support@rexvets.com>",
    subject: `Help Request from ${req.body.fullName}`,
    html: helpRequestEmailTemplate({
      fullName,
      emailAddress,
      phoneNo,
      state,
      subject,
      message,
      image,
      userType,
      userID,
    }),
  };

  try {
    await transporter.sendMail(mailOptionsParent);
    res.status(200).json({ message: "Email sent!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Email failed to send" });
  }
});

app.post(
  "/sendRescheduleAppointmentConfirmation",
  requireFirebase,
  async (req, res) => {
    console.log(
      "📩 Received request to send reschedule confirmation:",
      req.body
    );

    const {
      doctorEmail,
      doctorName,
      parentEmail,
      parentName,
      petName,
      appointmentDate,
      oldTime, // must be provided
      oldDate,
      appointmentTime,
      appointmentTimeUTC, // e.g. "2025-06-20T14:00:00Z"
      doctorTimezone,
      userTimezone,
      userDisplayTime, // Optional override of display time
      meetingLink,
    } = req.body;

    console.log(
      "📤 Sending Reschedule Appointment Confirmation with the following data:"
    );
    console.log("👨‍⚕️ Doctor Email:", doctorEmail);
    console.log("👨‍⚕️ Doctor Name:", doctorName);
    console.log("👨‍👩‍👧 Parent Email:", parentEmail);
    console.log("👨‍👩‍👧 Parent Name:", parentName);
    console.log("🐾 Pet Name:", petName);
    console.log("📅 New Appointment Date:", appointmentDate);
    console.log("🕒 New Appointment Time:", appointmentTime);
    console.log("🕰️ Old Appointment Time:", oldTime);
    console.log("🕰️ Old Appointment date:", oldDate);
    console.log("🌐 UTC Timestamp:", appointmentTimeUTC);
    console.log("🧭 Doctor Timezone:", doctorTimezone);
    console.log("🧭 User Timezone:", userTimezone);
    console.log("🕓 User Display Time:", userDisplayTime);
    console.log("🔗 Meeting Link:", meetingLink);

    // Format time for each recipient
    const doctorTimeDisplay = formatTimeForTimezone(
      appointmentTimeUTC,
      doctorTimezone,
      appointmentTime,
      appointmentDate
    );

    const parentTimeDisplay = formatTimeForTimezone(
      appointmentTimeUTC,
      userTimezone,
      userDisplayTime || appointmentTime,
      appointmentDate
    );

    const userOldTime = convertNYToLocal(oldTime, oldDate);

    console.log("🕐 Doctor sees:", doctorTimeDisplay);
    console.log("🕐 Parent sees:", parentTimeDisplay);

    // Doctor Email (Reschedule)
    const mailOptionsDoctor = {
      from: "Rex Vets <support@rexvets.com>",
      to: doctorEmail,
      subject: "Appointment Rescheduled - Rex Vets",
      html: rescheduleConfirmationDoctorTemplate(
        parentName,
        doctorName,
        petName,
        oldDate,
        oldTime,
        appointmentDate,
        appointmentTime,
        meetingLink
      ),
    };

    // Parent Email (Reschedule)
    const mailOptionsParent = {
      from: "Rex Vets <support@rexvets.com>",
      to: parentEmail,
      subject: "Your Appointment Has Been Rescheduled - Rex Vets",
      html: rescheduleConfirmationParentTemplate(
        parentName,
        doctorName,
        petName,
        oldDate,
        userOldTime,
        appointmentDate,
        userDisplayTime,
        meetingLink
      ),
    };

    try {
      await transporter.sendMail(mailOptionsDoctor);
      await transporter.sendMail(mailOptionsParent);

      res.send({
        message: "Reschedule confirmation emails sent successfully!",
      });
      console.log("✅ Reschedule confirmation emails sent successfully!");

      // 🔄 Save reminder in Firestore
      try {
        const reminderData = {
          appointmentDate,
          appointmentTime,
          appointmentTimeUTC,
          doctorTimezone,
          userTimezone,
          userDisplayTime,
          parentEmail,
          parentName,
          doctorName,
          doctorEmail,
          meetingLink,
          reschedule: true,
          originalTime: oldTime,
          scheduledAt: new Date().toISOString(),
          reminderSent: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const reminderRef = await db
          .collection("ReminderEmails")
          .add(reminderData);
        console.log(
          "🗓️ Reminder updated in Firestore with ID:",
          reminderRef.id
        );
      } catch (firestoreError) {
        console.error(
          "❌ Failed to save reminder in Firestore:",
          firestoreError
        );
      }
    } catch (error) {
      console.error("❌ Failed to send reschedule emails:", error);
      res.status(500).send({ message: "Failed to send reschedule emails" });
    }
  }
);

// UPDATED Function to send 10-minute reminder emails with proper timezone handling
async function sendReminderEmails(reminderData) {
  const {
    appointmentDate,
    appointmentTime,
    appointmentTimeUTC,
    doctorTimezone,
    userTimezone,
    userDisplayTime,
    parentEmail,
    parentName,
    doctorName,
    doctorEmail,
    meetingLink,
  } = reminderData;

  console.log("📧 Starting to send 10-minute reminder emails...");

  // Format times for each recipient's timezone
  const doctorTimeDisplay = formatTimeForTimezone(
    appointmentTimeUTC,
    doctorTimezone,
    appointmentTime,
    appointmentDate
  );

  const parentTimeDisplay = formatTimeForTimezone(
    appointmentTimeUTC,
    userTimezone,
    userDisplayTime || appointmentTime,
    appointmentDate
  );

  console.log("Doctor reminder will show:", doctorTimeDisplay);
  console.log("Parent reminder will show:", parentTimeDisplay);

  // Email template for parent with parent's timezone
  const parentReminderEmail = reminderParentTemplate(
    parentName,
    doctorName,
    parentTimeDisplay, // Use parent's timezone
    meetingLink
  );

  // Email template for doctor with doctor's timezone
  const doctorReminderEmail = reminderDoctorTemplate(
    doctorName,
    parentName,
    doctorTimeDisplay, // Use doctor's timezone
    meetingLink
  );

  const parentMailOptions = {
    from: "Rex Vets <support@rexvets.com>",
    to: parentEmail,
    subject: "Appointment Starting Soon - Rex Vets",
    html: parentReminderEmail,
  };

  const doctorMailOptions = {
    from: "Rex Vets <support@rexvets.com>",
    to: doctorEmail,
    subject: "Appointment Starting Soon - Rex Vets",
    html: doctorReminderEmail,
  };

  // Send reminder email to parent
  try {
    console.log(`📤 Sending reminder email to parent: ${parentEmail}...`);
    const parentInfo = await transporter.sendMail(parentMailOptions);
    console.log(
      `✅ Reminder email sent successfully to parent: ${parentInfo.response}`
    );
  } catch (error) {
    console.error(
      `❌ Error sending reminder email to parent ${parentEmail}:`,
      error
    );
    throw error;
  }

  // Send reminder email to doctor
  try {
    console.log(`📤 Sending reminder email to doctor: ${doctorEmail}...`);
    const doctorInfo = await transporter.sendMail(doctorMailOptions);
    console.log(
      `✅ Reminder email sent successfully to doctor: ${doctorInfo.response}`
    );
  } catch (error) {
    console.error(
      `❌ Error sending reminder email to doctor ${doctorEmail}:`,
      error
    );
    throw error;
  }

  console.log("🎉 All reminder emails sent successfully!");
}

//RECORDATORIO EMAIL

const TIMEZONE = "America/New_York"; // Configura el huso horario deseado

function trackAppointments() {
  console.log("Starting appointment tracking.");
  const appointmentsCol = db.collection("Appointments");

  // Escuchar cambios en tiempo real
  console.log("Setting up real-time listener for Appointments collection...");
  appointmentsCol.onSnapshot(async (snapshot) => {
    console.log(
      `Received appointment snapshot with ${
        snapshot.docChanges().length
      } changes.`
    );
    snapshot.docChanges().forEach(async (change) => {
      const appointment = change.doc.data();
      const {
        AppointmentDate,
        AppointmentTime,
        AppointmentTimeUTC,
        DoctorTimezone,
        UserTimezone,
        UserDisplayTime,
        ParentEmail,
        ParentName,
        DoctorName,
        DoctorEmail,
        MeetingLink,
        reminderScheduled,
      } = appointment;

      console.log(
        `Processing appointment change type: ${change.type} for parent: ${ParentEmail}`
      );

      if (change.type === "added" || change.type === "modified") {
        // Check if no reminder is scheduled
        if (!reminderScheduled) {
          console.log(
            `Scheduling reminder for new/updated appointment: ${ParentEmail} (ID: ${change.doc.id})`
          );

          const reminderData = {
            appointmentDate: AppointmentDate,
            appointmentTime: AppointmentTime,
            appointmentTimeUTC: AppointmentTimeUTC,
            doctorTimezone: DoctorTimezone,
            userTimezone: UserTimezone,
            userDisplayTime: UserDisplayTime,
            parentEmail: ParentEmail,
            parentName: ParentName,
            doctorName: DoctorName,
            doctorEmail: DoctorEmail,
            meetingLink: MeetingLink,
            scheduledAt: new Date().toISOString(),
            reminderSent: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          };

          const reminderRef = await db
            .collection("ReminderEmails")
            .add(reminderData);
          console.log(
            "✅ Reminder scheduled in Firestore with ID:",
            reminderRef.id
          );

          // Actualizar la cita en la base de datos
          const appointmentRef = db
            .collection("Appointments")
            .doc(change.doc.id);
          await appointmentRef.update({ reminderScheduled: true });
        }
      }
    });

    // Add logic to find and log the next upcoming appointment-del
    const now = moment().tz(TIMEZONE);
    const upcomingAppointments = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((appointment) => {
        const appointmentMoment = moment.tz(
          `${appointment.AppointmentDate} ${appointment.AppointmentTime}`,
          "YYYY-MM-DD h:mm A",
          TIMEZONE
        );
        return appointmentMoment.isAfter(now);
      })
      .sort((a, b) => {
        const momentA = moment.tz(
          `${a.AppointmentDate} ${a.AppointmentTime}`,
          "YYYY-MM-DD h:mm A",
          TIMEZONE
        );
        const momentB = moment.tz(
          `${b.AppointmentDate} ${b.AppointmentTime}`,
          "YYYY-MM-DD h:mm A",
          TIMEZONE
        );
        return momentA.diff(now) - momentB.diff(now);
      });

    if (upcomingAppointments.length > 0) {
      const nextAppointment = upcomingAppointments[0];
      const nextMoment = moment.tz(
        `${nextAppointment.AppointmentDate} ${nextAppointment.AppointmentTime}`,
        "YYYY-MM-DD h:mm A",
        TIMEZONE
      );
      console.log(`Next upcoming appointment details:`);
      console.log(`ID: ${nextAppointment.id}`);
      console.log(`Date: ${nextAppointment.AppointmentDate}`);
      console.log(`Time: ${nextAppointment.AppointmentTime}`);
      console.log(`Parent Email: ${nextAppointment.ParentEmail}`);
      console.log(`Parent Name: ${nextAppointment.ParentName}`);
      console.log(`Doctor Name: ${nextAppointment.DoctorName}`);
      console.log(`Doctor Email: ${nextAppointment.DoctorEmail}`);
      console.log(`Meeting Link: ${nextAppointment.MeetingLink}`);
      console.log(
        `Scheduled Time (in ${TIMEZONE}): ${nextMoment.format(
          "YYYY-MM-DD h:mm A"
        )}`
      );
    } else {
      console.log("No upcoming appointments found.");
    }
  }); // delete later for testing
  console.log("Firestore onSnapshot listener setup code executed.");
}

// Inicializar el tracking de las citas - Disabled for serverless deployment
// trackAppointments();

// Función para monitorear mensajes actuales y nuevos en la subcolección de todos los appointments y enviar correos si el remitente comienza con "Dr"
function trackNewMessagesForAppointment(appointmentHash) {
  console.log(
    `Iniciando monitoreo de mensajes para el appointment con hash: ${appointmentHash}`
  );

  const appointmentDocRef = db.collection("Appointments").doc(appointmentHash);

  let initialMessagesTracked = false;
  let initialMessagesLength = 0;

  appointmentDocRef.onSnapshot((docSnapshot) => {
    if (docSnapshot.exists) {
      const appointmentData = docSnapshot.data();
      const messages = appointmentData.Messages;

      if (!initialMessagesTracked) {
        // Mark that initial messages have been tracked
        initialMessagesLength = messages ? messages.length : 0;
        initialMessagesTracked = true;
        console.log(
          `Initial messages tracked for appointment ${appointmentHash}: ${initialMessagesLength}`
        );
      } else if (messages && messages.length > initialMessagesLength) {
        const newMessages = messages.slice(initialMessagesLength);
        newMessages.forEach((message, index) => {
          console.log(
            `Nuevo mensaje ${initialMessagesLength + index}:`,
            message
          );

          if (message.sender && message.sender.startsWith("Dr")) {
            sendEmailToParent(
              appointmentData.ParentEmail,
              appointmentData.DoctorName,
              appointmentData.ParentName,
              appointmentHash,
              message
            );
          } else {
            sendEmailToDoctor(
              appointmentData.DoctorEmail,
              appointmentData.DoctorName,
              appointmentData.ParentName,
              appointmentHash,
              message
            );
          }
        });
        initialMessagesLength = messages.length;
      } else {
        console.log(`No new messages in appointment ${appointmentHash}`);
      }
    } else {
      console.log(`El appointment con hash ${appointmentHash} no existe`);
    }
  });
}

// Función para enviar un correo al cliente
function sendEmailToParent(
  parentEmail,
  doctorName,
  parentName,
  appointmentHash,
  message
) {
  let EMAILFORPATIENT = messageToParentTemplate(
    parentName,
    doctorName,
    appointmentHash
  );
  const mailOptions = {
    from: "Rex Vets <support@rexvets.com>",
    to: parentEmail,
    subject: "You Have a New Message from Your Veterinarian",

    html: EMAILFORPATIENT,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(`Error al enviar el correo: ${error}`);
    }
    console.log(`Correo enviado: ${info.response}`);
  });
}

// Función para enviar un correo al doctor
function sendEmailToDoctor(
  doctorEmail,
  doctorName,
  parentName
  // appointmentHash,
  // message
) {
  let EMAILFORDOCTORS = messageToDoctorTemplate(doctorName, parentName);
  const mailOptions = {
    from: "Rex Vets <support@rexvets.com>",
    to: doctorEmail,
    subject: `You Have a New Message from Your Client ${parentName}`,

    html: EMAILFORDOCTORS,
  };
  //test
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error(`Error al enviar el correo al doctor: ${error}`);
    }
    console.log(`Correo enviado al doctor: ${info.response}`);
  });
}

// Llamar a la función para monitorear mensajes de todos los appointments
async function trackMessagesForAllAppointments() {
  try {
    const snapshot = await db.collection("Appointments").get();
    snapshot.forEach((doc) => {
      const appointmentHash = doc.id;
      trackNewMessagesForAppointment(appointmentHash);
    });
  } catch (error) {
    console.error("Error al obtener los appointments:", error);
  }
}

// Llamada para iniciar el monitoreo de todos los appointments
// trackMessagesForAllAppointments(); // Disabled for serverless deployment

// trackAllAppointments();
// Iniciar el servidor - Disabled for serverless deployment
const server = app
  .listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔒 CORS origin: ${corsOptions.origin}`);
  })
  .on("error", (error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// UPDATED Cron job endpoint for processing reminder emails with timezone support
app.get("/api/cron/process-reminders", requireFirebase, async (req, res) => {
  console.log("🔄 Cron job triggered: Processing reminder emails...");

  try {
    const now = moment.utc(); // Use UTC for calculations
    console.log(
      `⏰ Current UTC time: ${now.format("YYYY-MM-DD HH:mm:ss")} UTC`
    );

    // Query for unsent reminders
    const remindersSnapshot = await db
      .collection("ReminderEmails")
      .where("reminderSent", "==", false)
      .get();

    console.log(`📧 Found ${remindersSnapshot.size} pending reminders`);

    let processedCount = 0;
    let sentCount = 0;

    for (const doc of remindersSnapshot.docs) {
      const reminderData = doc.data();
      processedCount++;

      let shouldSend = false;
      let appointmentUTC;

      // Use AppointmentTimeUTC if available (new format)
      if (reminderData.appointmentTimeUTC) {
        appointmentUTC = moment.utc(reminderData.appointmentTimeUTC);
      } else {
        // Fallback to old format - assume doctor's timezone or EST
        const timezone = reminderData.doctorTimezone || "America/New_York";
        appointmentUTC = moment
          .tz(
            `${reminderData.appointmentDate} ${reminderData.appointmentTime}`,
            "YYYY-MM-DD h:mm A",
            timezone
          )
          .utc();
      }

      // Send reminder 10 minutes before appointment
      const reminderTimeUTC = appointmentUTC.clone().subtract(10, "minutes");
      shouldSend = now.isAfter(reminderTimeUTC) && now.isBefore(appointmentUTC);

      console.log(
        `📅 Processing reminder for ${
          reminderData.parentEmail
        }: appointment at ${appointmentUTC.format(
          "YYYY-MM-DD HH:mm:ss"
        )} UTC, reminder time: ${reminderTimeUTC.format(
          "YYYY-MM-DD HH:mm:ss"
        )} UTC, should send: ${shouldSend}`
      );

      if (shouldSend) {
        console.log(
          `✅ Sending 10-minute reminder to ${reminderData.parentEmail} and ${reminderData.doctorEmail}...`
        );

        try {
          await sendReminderEmails(reminderData);

          // Mark as sent
          await doc.ref.update({
            reminderSent: true,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          sentCount++;
          console.log(
            `🎉 Reminder emails sent successfully to both ${reminderData.parentEmail} and ${reminderData.doctorEmail}`
          );
        } catch (emailError) {
          console.error(
            `❌ Error sending reminder emails for appointment with ${reminderData.parentEmail}:`,
            emailError
          );
          await doc.ref.update({
            reminderSent: false,
            lastError: emailError.message,
            lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }

    console.log(
      `✅ Cron job completed: Processed ${processedCount} reminders, sent ${sentCount} emails`
    );
    res.json({
      success: true,
      message: `Processed ${processedCount} reminders, sent ${sentCount} emails`,
      processedCount,
      sentCount,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in cron job:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Manual trigger endpoint for immediate testing (same as cron but can be called anytime)
app.post("/api/manual/process-reminders", requireFirebase, async (req, res) => {
  console.log("🔧 Manual trigger: Processing reminder emails...");

  try {
    const now = moment.utc(); // Use UTC for calculations
    console.log(
      `⏰ Current UTC time: ${now.format("YYYY-MM-DD HH:mm:ss")} UTC`
    );

    // Query for unsent reminders
    const remindersSnapshot = await db
      .collection("ReminderEmails")
      .where("reminderSent", "==", false)
      .get();

    console.log(`📧 Found ${remindersSnapshot.size} pending reminders`);

    let processedCount = 0;
    let sentCount = 0;

    for (const doc of remindersSnapshot.docs) {
      const reminderData = doc.data();
      processedCount++;

      let shouldSend = false;
      let appointmentUTC;

      // Use AppointmentTimeUTC if available (new format)
      if (reminderData.appointmentTimeUTC) {
        appointmentUTC = moment.utc(reminderData.appointmentTimeUTC);
      } else {
        // Fallback to old format - assume doctor's timezone or EST
        const timezone = reminderData.doctorTimezone || "America/New_York";
        appointmentUTC = moment
          .tz(
            `${reminderData.appointmentDate} ${reminderData.appointmentTime}`,
            "YYYY-MM-DD h:mm A",
            timezone
          )
          .utc();
      }

      // Send reminder 10 minutes before appointment
      const reminderTimeUTC = appointmentUTC.clone().subtract(10, "minutes");
      shouldSend = now.isAfter(reminderTimeUTC) && now.isBefore(appointmentUTC);

      console.log(
        `📅 Processing reminder for ${
          reminderData.parentEmail
        }: appointment at ${appointmentUTC.format(
          "YYYY-MM-DD HH:mm:ss"
        )} UTC, reminder time: ${reminderTimeUTC.format(
          "YYYY-MM-DD HH:mm:ss"
        )} UTC, should send: ${shouldSend}`
      );

      if (shouldSend) {
        console.log(
          `✅ Sending 10-minute reminder to ${reminderData.parentEmail} and ${reminderData.doctorEmail}...`
        );

        try {
          await sendReminderEmails(reminderData);

          // Mark as sent
          await doc.ref.update({
            reminderSent: true,
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          sentCount++;
          console.log(
            `🎉 Reminder emails sent successfully to both ${reminderData.parentEmail} and ${reminderData.doctorEmail}`
          );
        } catch (emailError) {
          console.error(
            `❌ Error sending reminder emails for appointment with ${reminderData.parentEmail}:`,
            emailError
          );
          await doc.ref.update({
            reminderSent: false,
            lastError: emailError.message,
            lastAttempt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }

    console.log(
      `✅ Manual trigger completed: Processed ${processedCount} reminders, sent ${sentCount} emails`
    );
    res.json({
      success: true,
      message: `Manual trigger: Processed ${processedCount} reminders, sent ${sentCount} emails`,
      processedCount,
      sentCount,
      timestamp: now.toISOString(),
      trigger: "manual",
    });
  } catch (error) {
    console.error("❌ Error in manual trigger:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      trigger: "manual",
    });
  }
});

// Debug endpoint to check pending reminders
app.get("/api/debug/reminders", requireFirebase, async (req, res) => {
  console.log("🔍 Debug: Checking pending reminders...");

  try {
    const now = moment().tz(TIMEZONE);

    // Get all reminders
    const allRemindersSnapshot = await db
      .collection("ReminderEmails")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    const reminders = [];

    allRemindersSnapshot.forEach((doc) => {
      const data = doc.data();
      const appointmentMoment = moment.tz(
        `${data.appointmentDate} ${data.appointmentTime}`,
        "YYYY-MM-DD h:mm A",
        TIMEZONE
      );

      let reminderTime;
      reminderTime = appointmentMoment.clone().subtract(10, "minutes");

      reminders.push({
        id: doc.id,
        parentEmail: data.parentEmail,
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        reminderSent: data.reminderSent,
        scheduledAt: data.scheduledAt,
        reminderTime: reminderTime.format("YYYY-MM-DD h:mm A"),
        shouldSendNow: now.isAfter(reminderTime),
        timeUntilReminder: reminderTime.diff(now, "minutes"),
      });
    });

    res.json({
      success: true,
      currentTime: now.format("YYYY-MM-DD h:mm A"),
      timezone: TIMEZONE,
      totalReminders: reminders.length,
      reminders,
    });
  } catch (error) {
    console.error("❌ Error in debug endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Route to send donation thank you emails - WITH FIXED PDF GENERATION
app.post("/sendDonationThankYou", async (req, res) => {
  console.log("📧 Received donation thank you request:", req.body);

  const {
    email,
    name,
    donationAmount,
    isRecurring,
    badgeName,
    donationDate,
    paymentMethod,
    transactionID,
    serviceValue,
    taxDeductibleAmount,
  } = req.body;

  // Input validation
  if (!email || !name || !donationAmount) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: email, name, or donationAmount",
    });
  }

  const receiptNumber = transactionID || `REX_${Date.now()}`;

  try {
    console.log("🔄 Starting PDF generation...");

    // Generate PDF with proper error handling
    let pdfBuffer = null;
    try {
      const pdfPromise = generateInvoicePDFPuppeteer({
        donorName: name,
        amount: donationAmount,
        receiptNumber: transactionID,
        isRecurring,
        badgeName,
        date: donationDate,
        paymentMethod,
      });

      // Set a timeout for PDF generation
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PDF generation timeout")), 45000)
      );

      // Race between PDF generation and timeout
      pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]);
      console.log("✅ PDF generated successfully");
    } catch (pdfError) {
      console.error("❌ PDF generation failed:", pdfError);
      // Continue without PDF - we'll send email without attachment
      pdfBuffer = null;
    }

    console.log("📧 Sending donation thank you email...");

    // Send email with or without PDF
    const mailOptions = {
      from: "Rex Vets <support@rexvets.com>",
      to: email,
      subject: "Thank You for Your Generous Donation - Rex Vets",
      html: donationThankYouTemplate(
        name,
        donationAmount,
        transactionID,
        isRecurring,
        badgeName,
        donationDate,
        paymentMethod
      ),
    };

    // Add PDF attachment if generation was successful
    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: "Donation_Receipt.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
      console.log("📎 PDF attachment added to email");
    } else {
      console.log("📧 Sending email without PDF attachment");
    }

    // Send email with Promise
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Error sending email:", error);
          reject(error);
        } else {
          console.log("✅ Email sent successfully:", info.response);
          resolve(info);
        }
      });
    });

    const successMessage = pdfBuffer
      ? "Donation thank you email with receipt sent successfully!"
      : "Donation thank you email sent successfully! PDF receipt will be sent separately.";

    res.status(200).json({
      success: true,
      message: successMessage,
      pdfGenerated: !!pdfBuffer,
    });

    console.log("✅ Donation email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Error processing donation email:", error);

    // Send error notification to user
    try {
      await transporter.sendMail({
        from: "Rex Vets <support@rexvets.com>",
        to: email,
        subject: "About Your Donation Receipt - Rex Vets",
        html: `<p>Dear ${name},</p><p>We encountered an issue generating your receipt. Our team has been notified and will send it to you shortly.</p><p>Thank you for your patience!</p>`,
      });
      console.log("📧 Error notification sent to user");
    } catch (emailError) {
      console.error("❌ Failed to send error notification:", emailError);
    }

    res.status(500).json({
      success: false,
      message: "Failed to send donation email. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Debug endpoint to check environment variables (for troubleshooting)
app.get("/debug/env", (req, res) => {
  const requiredVars = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_CLIENT_ID",
    "FIREBASE_CLIENT_X509_CERT_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
  ];

  const envStatus = {};
  requiredVars.forEach((varName) => {
    const value = process.env[varName];
    envStatus[varName] = {
      exists: !!value,
      hasValue: !!(value && value.trim()),
      length: value ? value.length : 0,
      preview: value ? `${value.substring(0, 10)}...` : "undefined",
    };
  });

  res.json({
    message: "Environment Variables Debug Info",
    timestamp: new Date().toISOString(),
    variables: envStatus,
    firebaseApps: admin.apps.length,
    firestoreStatus: db ? "initialized" : "not initialized",
  });
});

// Simple test endpoint for donation functionality
app.post("/test-donation", (req, res) => {
  console.log("🧪 Test donation endpoint called");
  console.log("🧪 Request body:", req.body);
  console.log("🧪 Request headers:", req.headers);
  console.log("🧪 Request origin:", req.headers.origin);

  try {
    res.status(200).json({
      success: true,
      message: "Test donation endpoint working!",
      receivedData: {
        hasBody: !!req.body,
        bodyKeys: req.body ? Object.keys(req.body) : [],
        contentType: req.headers["content-type"],
        origin: req.headers.origin,
        userAgent: req.headers["user-agent"]?.substring(0, 50) + "...",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in test-donation endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Test endpoint for PDF generation
app.post("/test-pdf", async (req, res) => {
  console.log("🧪 Test PDF generation endpoint called");

  try {
    const testData = {
      donorName: "Test User",
      amount: "25.00",
      receiptNumber: "TEST_123",
      isRecurring: false,
      badgeName: "Champion",
      date: "2025-07-01",
      paymentMethod: "Credit Card",
    };

    console.log("🔄 Starting test PDF generation...");
    const pdfBuffer = await generateInvoicePDFPuppeteer(testData);

    console.log(
      "✅ Test PDF generated successfully, size:",
      pdfBuffer.length,
      "bytes"
    );

    // Return PDF as response for testing
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="test-receipt.pdf"'
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ Test PDF generation failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});
