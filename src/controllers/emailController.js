import { emailService } from "../services/emailService.js";
import { reminderService } from "../services/reminderService.js";
import { generateInvoicePDFPuppeteer } from "../services/pdfService.js";
import { admin } from "../config/database.js";
import convertNYToLocal from "../utils/convertNYToLocal.js";

export const emailController = {
  async sendWelcomeEmail(req, res) {
    try {
      console.log("Received request to send welcome email:", req.body);
      const { email, name } = req.body;

      await emailService.sendWelcomeEmail(email, name);
      console.log("Welcome email sent successfully");

      res.send({ message: "Welcome email sent successfully!" });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).send({ message: "Failed to send email" });
    }
  },

  async sendBookingConfirmation(req, res) {
    try {
      console.log("Received request to send booking confirmation:", req.body);
      const {
        doctorEmail,
        doctorName,
        parentEmail,
        parentName,
        petName,
        appointmentDate,
        appointmentTime,
        appointmentTimeUTC,
        doctorTimezone,
        userTimezone,
        userDisplayTime,
        meetingLink,
      } = req.body;

      await emailService.sendBookingConfirmation({
        doctorEmail,
        doctorName,
        parentEmail,
        parentName,
        petName,
        appointmentDate,
        appointmentTime,
        appointmentTimeUTC,
        doctorTimezone,
        userTimezone,
        userDisplayTime,
        meetingLink,
      });

      res.send({ message: "Booking confirmation emails sent successfully!" });
      console.log("Booking confirmation emails sent successfully!");

      // Store reminder in Firestore
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
        };

        await reminderService.createReminder(reminderData);
      } catch (firestoreError) {
        console.error(
          "❌ Error storing reminder in Firestore:",
          firestoreError
        );
      }
    } catch (error) {
      console.error("Error sending booking confirmation emails:", error);
      res
        .status(500)
        .send({ message: "Failed to send booking confirmation emails" });
    }
  },

  async sendRescheduleConfirmation(req, res) {
    try {
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
        oldTime,
        oldDate,
        appointmentTime,
        appointmentTimeUTC,
        doctorTimezone,
        userTimezone,
        userDisplayTime,
        meetingLink,
      } = req.body;

      const userOldTime = convertNYToLocal(oldTime, oldDate);

      await emailService.sendRescheduleConfirmation({
        doctorEmail,
        doctorName,
        parentEmail,
        parentName,
        petName,
        appointmentDate,
        oldTime,
        oldDate,
        appointmentTime,
        appointmentTimeUTC,
        doctorTimezone,
        userTimezone,
        userDisplayTime,
        userOldTime,
        meetingLink,
      });

      res.send({
        message: "Reschedule confirmation emails sent successfully!",
      });
      console.log("✅ Reschedule confirmation emails sent successfully!");

      // Save reminder in Firestore
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
        };

        await reminderService.createReminder(reminderData);
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
  },

  async sendPaymentEmail(req, res) {
    try {
      const { to, name, transactionId, amount, pharmacyName, date } = req.body;
      console.log("Received request to send payment email:", req.body);

      if (!to || !transactionId || !amount) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await emailService.sendPaymentEmail({
        to,
        name,
        transactionId,
        amount,
        pharmacyName,
        date,
      });

      res.status(200).json({ message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Email failed to send" });
    }
  },

  async sendRequestAcceptedEmail(req, res) {
    try {
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

      await emailService.sendRequestAcceptedEmail({
        to,
        name,
        transactionId,
        amount,
        pharmacyName,
        pharmacyAddress,
        pharmacyCity,
        pharmacyState,
        date,
      });

      res.status(200).json({ message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Email failed to send" });
    }
  },

  async sendHelpRequest(req, res) {
    try {
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

      await emailService.sendHelpRequestEmail({
        fullName,
        emailAddress,
        phoneNo,
        state,
        subject,
        message,
        image,
        userType,
        userID,
      });

      res.status(200).json({ message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Email failed to send" });
    }
  },

  async sendDonationThankYou(req, res) {
    try {
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
      } = req.body;

      if (!email || !name || !donationAmount) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: email, name, or donationAmount",
        });
      }

      const receiptNumber = transactionID || `REX_${Date.now()}`;

      try {
        console.log("🔄 Starting PDF generation...");

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

          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("PDF generation timeout")), 45000)
          );

          pdfBuffer = await Promise.race([pdfPromise, timeoutPromise]);
          console.log("✅ PDF generated successfully");
        } catch (pdfError) {
          console.error("❌ PDF generation failed:", pdfError);
          pdfBuffer = null;
        }

        console.log("📧 Sending donation thank you email...");

        await emailService.sendDonationThankYou({
          email,
          name,
          donationAmount,
          transactionID,
          isRecurring,
          badgeName,
          donationDate,
          paymentMethod,
          pdfBuffer,
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
      } catch (emailError) {
        throw emailError;
      }
    } catch (error) {
      console.error("❌ Error processing donation email:", error);

      try {
        await emailService.sendErrorNotification(email, name);
        console.log("📧 Error notification sent to user");
      } catch (emailError) {
        console.error("❌ Failed to send error notification:", emailError);
      }

      res.status(500).json({
        success: false,
        message: "Failed to send donation email. Please try again.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  async testEmail(req, res) {
    try {
      console.log("🧪 Testing email system...");
      const info = await emailService.sendTestEmail();

      res.json({
        success: true,
        message: "Test email sent successfully!",
        emailInfo: info.response,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Error sending test email:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
};
