import { createTransporter } from "../config/email.js";
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
} from "../../emailTemplates.js";
import { formatTimeForTimezone } from "../utils/timezone.js";

const transporter = createTransporter();

export const emailService = {
  async sendWelcomeEmail(email, name) {
    const mailOptions = {
      from: "Rex Vets <support@rexvets.com>",
      to: email,
      subject: "Welcome to Rex Vets!",
      html: welcomeEmailTemplate(name),
    };

    return await transporter.sendMail(mailOptions);
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
  }) {
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

    const mailOptionsDoctor = {
      from: "Rex Vets <support@rexvets.com>",
      to: doctorEmail,
      subject: "Appointment Confirmation - Rex Vets",
      html: bookingConfirmationDoctorTemplate(
        doctorName,
        parentName,
        doctorTimeDisplay,
        petName,
        meetingLink
      ),
    };

    const mailOptionsParent = {
      from: "Rex Vets <support@rexvets.com>",
      to: parentEmail,
      subject: "Your Appointment Confirmation - Rex Vets",
      html: bookingConfirmationParentTemplate(
        parentName,
        doctorName,
        parentTimeDisplay,
        petName,
        meetingLink
      ),
    };

    await Promise.all([
      transporter.sendMail(mailOptionsDoctor),
      transporter.sendMail(mailOptionsParent),
    ]);
  },

  async sendReminderEmails(reminderData) {
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
      html: reminderParentTemplate(
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
      html: reminderDoctorTemplate(
        doctorName,
        parentName,
        doctorTimeDisplay,
        meetingLink
      ),
    };

    await Promise.all([
      transporter.sendMail(parentMailOptions),
      transporter.sendMail(doctorMailOptions),
    ]);
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

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: "Donation_Receipt.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    return await transporter.sendMail(mailOptions);
  },

  async sendPaymentEmail({
    to,
    name,
    transactionId,
    amount,
    pharmacyName,
    date,
  }) {
    const mailOptions = {
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

    return await transporter.sendMail(mailOptions);
  },

  async sendRequestAcceptedEmail({
    to,
    name,
    transactionId,
    amount,
    pharmacyName,
    pharmacyAddress,
    pharmacyCity,
    pharmacyState,
    date,
  }) {
    const mailOptions = {
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

    return await transporter.sendMail(mailOptions);
  },

  async sendHelpRequestEmail({
    fullName,
    emailAddress,
    phoneNo,
    state,
    subject,
    message,
    image,
    userType,
    userID,
  }) {
    const mailOptions = {
      from: `"${fullName}" ${emailAddress}`,
      to: "<support@rexvets.com>",
      subject: `Help Request from ${fullName}`,
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

    return await transporter.sendMail(mailOptions);
  },

  async sendTestEmail() {
    const testMailOptions = {
      from: "Rex Vets <support@rexvets.com>",
      to: "support@rexvets.com",
      subject: "Email System Test - Rex Vets",
      html: "<h1>Test Email</h1><p>This is a test email to verify the email system is working.</p>",
    };

    return await transporter.sendMail(testMailOptions);
  },
};
