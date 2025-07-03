import { createTransporter } from "../config/email.js";
import { templateLoader } from "../templates/templateLoader.js";
import { formatTimeForTimezone } from "../utils/timezone.js";

const transporter = createTransporter();

// Optimized email service with lazy template loading
export const optimizedEmailService = {
  async sendWelcomeEmail(email, name) {
    try {
      const welcomeTemplate = await templateLoader.loadTemplate('welcome', 'welcomeEmailTemplate');
      
      const mailOptions = {
        from: "Rex Vets <support@rexvets.com>",
        to: email,
        subject: "Welcome to Rex Vets!",
        html: welcomeTemplate(name),
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
      throw error;
    }
  },

  async sendBookingConfirmation({
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
    pdfAttachment,
  }) {
    try {
      // Load templates in parallel
      const [doctorTemplate, parentTemplate] = await Promise.all([
        templateLoader.loadTemplate('booking', 'bookingConfirmationDoctorTemplate'),
        templateLoader.loadTemplate('booking', 'bookingConfirmationParentTemplate')
      ]);

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

      const attachments = pdfAttachment
        ? [
            {
              filename: "Donation-Receipt-RexVets.pdf",
              content: pdfAttachment,
              contentType: "application/pdf",
            },
          ]
        : [];

      const mailOptionsDoctor = {
        from: "Rex Vets <support@rexvets.com>",
        to: doctorEmail,
        subject: "Appointment Confirmation - Rex Vets",
        html: doctorTemplate(
          doctorName,
          parentName,
          doctorTimeDisplay,
          petName,
          meetingLink
        ),
        attachments,
      };

      const mailOptionsParent = {
        from: "Rex Vets <support@rexvets.com>",
        to: parentEmail,
        subject: "Your Appointment Confirmation - Rex Vets",
        html: parentTemplate(
          parentName,
          doctorName,
          parentTimeDisplay,
          petName,
          meetingLink
        ),
        attachments,
      };

      // Send emails in parallel
      const results = await Promise.all([
        transporter.sendMail(mailOptionsDoctor),
        transporter.sendMail(mailOptionsParent),
      ]);

      console.log(`✅ Booking confirmation emails sent to ${doctorEmail} and ${parentEmail}`);
      return results;
    } catch (error) {
      console.error(`❌ Failed to send booking confirmation emails:`, error.message);
      throw error;
    }
  },

  async sendReminderEmails(reminderData) {
    try {
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

      // Load reminder templates in parallel
      const [parentTemplate, doctorTemplate] = await Promise.all([
        templateLoader.loadTemplate('reminder', 'reminderParentTemplate'),
        templateLoader.loadTemplate('reminder', 'reminderDoctorTemplate')
      ]);

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

      const parentMailOptions = {
        from: "Rex Vets <support@rexvets.com>",
        to: parentEmail,
        subject: "Appointment Starting Soon - Rex Vets",
        html: parentTemplate(
          parentName,
          doctorName,
          parentTimeDisplay,
          meetingLink
        ),
      };

      const doctorMailOptions = {
        from: "Rex Vets <support@rexvets.com>",
        to: doctorEmail,
        subject: "Appointment Starting Soon - Rex Vets",
        html: doctorTemplate(
          doctorName,
          parentName,
          doctorTimeDisplay,
          meetingLink
        ),
      };

      // Send reminders in parallel
      const results = await Promise.all([
        transporter.sendMail(parentMailOptions),
        transporter.sendMail(doctorMailOptions),
      ]);

      console.log(`✅ Reminder emails sent to ${parentEmail} and ${doctorEmail}`);
      return results;
    } catch (error) {
      console.error(`❌ Failed to send reminder emails:`, error.message);
      throw error;
    }
  },

  async sendDonationThankYou({
    email,
    name,
    donationAmount,
    transactionID,
    isRecurring,
    badgeName,
    donationDate,
    paymentMethod,
    pdfBuffer = null,
  }) {
    try {
      const donationTemplate = await templateLoader.loadTemplate('donation', 'donationThankYouTemplate');
      
      const mailOptions = {
        from: "Rex Vets <support@rexvets.com>",
        to: email,
        subject: "Thank You for Your Generous Donation - Rex Vets",
        html: donationTemplate(
          name,
          donationAmount,
          transactionID,
          isRecurring,
          badgeName,
          donationDate,
          paymentMethod
        ),
      };

      if (pdfBuffer) {
        mailOptions.attachments = [
          {
            filename: "Donation_Receipt.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ];
      }

      const result = await transporter.sendMail(mailOptions);
      console.log(`✅ Donation thank you email sent to ${email}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send donation thank you email to ${email}:`, error.message);
      throw error;
    }
  },

  async sendTestEmail() {
    try {
      const testMailOptions = {
        from: "Rex Vets <support@rexvets.com>",
        to: "support@rexvets.com",
        subject: "Email System Test - Rex Vets (Optimized)",
        html: `
          <h1>✅ Optimized Email System Test</h1>
          <p>This is a test email to verify the optimized email system is working.</p>
          <p><strong>Optimizations active:</strong></p>
          <ul>
            <li>✅ Lazy template loading</li>
            <li>✅ Template caching</li>
            <li>✅ Parallel email processing</li>
            <li>✅ Performance monitoring</li>
          </ul>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
      };

      const result = await transporter.sendMail(testMailOptions);
      console.log(`✅ Test email sent successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send test email:`, error.message);
      throw error;
    }
  },

  // Bulk email functionality with rate limiting
  async sendBulkEmails(emails, templateType, templateName, templateData) {
    const BATCH_SIZE = 10; // Send 10 emails at a time
    const DELAY_BETWEEN_BATCHES = 1000; // 1 second delay between batches
    
    try {
      const template = await templateLoader.loadTemplate(templateType, templateName);
      const results = [];
      
      console.log(`📧 Starting bulk email send: ${emails.length} emails`);
      
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE);
        
        const batchPromises = batch.map(async (emailData) => {
          try {
            const mailOptions = {
              from: "Rex Vets <support@rexvets.com>",
              to: emailData.email,
              subject: emailData.subject,
              html: template(emailData, templateData),
            };
            
            return await transporter.sendMail(mailOptions);
          } catch (error) {
            console.error(`❌ Failed to send email to ${emailData.email}:`, error.message);
            return { error: error.message, email: emailData.email };
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        console.log(`📬 Batch ${Math.floor(i / BATCH_SIZE) + 1} sent (${batch.length} emails)`);
        
        // Delay between batches to avoid overwhelming the SMTP server
        if (i + BATCH_SIZE < emails.length) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }
      
      const successful = results.filter(r => !r.error).length;
      const failed = results.filter(r => r.error).length;
      
      console.log(`✅ Bulk email completed: ${successful} sent, ${failed} failed`);
      
      return {
        total: emails.length,
        successful,
        failed,
        results
      };
    } catch (error) {
      console.error(`❌ Bulk email failed:`, error.message);
      throw error;
    }
  },

  // Get email service statistics
  getStats() {
    return {
      templateStats: templateLoader.getStats(),
      transporterReady: !!transporter,
      serviceHealth: 'healthy'
    };
  }
};

// Preload common templates on module load for better performance
templateLoader.preloadCommonTemplates().catch(err => 
  console.warn('⚠️  Failed to preload templates:', err.message)
);