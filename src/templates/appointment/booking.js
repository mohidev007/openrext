import { commonStyles, headerTemplate, footerTemplate, appointmentButtonTemplate } from '../common/styles.js';

export const bookingConfirmationDoctorTemplate = (
  doctorName,
  parentName,
  appointmentDateTime,
  petName,
  meetingLink
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Confirmation</title>
  ${commonStyles}
</head>
<body>
  <div class="email-container">
    ${headerTemplate}
    <div class="body">
      <p>Dear ${doctorName},</p>
      <p>We're excited to confirm your upcoming video call appointment with ${parentName} at Rex Vets. Here are the details for your appointment:</p>
      <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
      <p><strong>Veterinarian:</strong> ${doctorName}</p>
      <p><strong>Parent:</strong> ${parentName}</p>
      <p><strong>Pet Name:</strong> ${petName}</p>
      ${appointmentButtonTemplate(meetingLink, "Appointment Link")}
      <p>Please make sure you're ready for the call at least a few minutes before the scheduled time.</p>
      <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
      <p>We thank you for your dedication to pet's care.</p>
      <p>Warm regards,<br>The Team at Rex Vets</p>
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`;

export const bookingConfirmationParentTemplate = (
  parentName,
  doctorName,
  appointmentDateTime,
  petName,
  meetingLink
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Appointment Confirmation</title>
  ${commonStyles}
</head>
<body>
  <div class="email-container">
    ${headerTemplate}
    <div class="body">
      <p>Dear ${parentName},</p>
      <p>We're excited to confirm your upcoming video call appointment with <strong>${doctorName}</strong> at Rex Vets. Here are the details for your appointment:</p>
      <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
      <p><strong>Veterinarian:</strong> ${doctorName}</p>
      <p><strong>Pet Name:</strong> ${petName}</p>
      ${appointmentButtonTemplate(meetingLink)}
      <p>Please make sure you're ready for the call at least a few minutes before the scheduled time. ${doctorName} is here to address any questions or concerns you have about your pet's health.</p>
      <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
      <p>We look forward to assisting you with your pet's care.</p>
      <p>Warm regards,<br>The Team at Rex Vets</p>
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`;