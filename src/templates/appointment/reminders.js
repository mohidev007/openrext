import { commonStyles, headerTemplate, footerTemplate, appointmentButtonTemplate } from '../common/styles.js';

export const reminderParentTemplate = (
  parentName,
  doctorName,
  appointmentDateTime,
  meetingLink
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Starting Soon</title>
  ${commonStyles}
</head>
<body>
  <div class="email-container">
    ${headerTemplate}
    <div class="body">
      <p>Dear ${parentName},</p>
      <p>This is a friendly reminder that your video call appointment with <strong>${doctorName}</strong> at Rex Vets is starting in just 10 minutes!</p>
      <p><strong>Appointment Details:</strong></p>
      <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
      <p><strong>Veterinarian:</strong> ${doctorName}</p>
      ${appointmentButtonTemplate(meetingLink, "Join Appointment Now")}
      <p>Please ensure you're ready for the call and have any questions or concerns about your pet prepared for the consultation. ${doctorName} is looking forward to helping you and your furry friend.</p>
      <p>To join your appointment, simply click the meeting link above a few minutes before your scheduled time.</p>
      <p>If you experience any technical difficulties or need to reschedule, please contact our support team immediately at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
      <p>Thank you for choosing Rex Vets for your pet's healthcare needs.</p>
      <p>Warm regards,<br>The Team at Rex Vets</p>
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`;

export const reminderDoctorTemplate = (
  doctorName,
  parentName,
  appointmentDateTime,
  meetingLink
) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Starting Soon</title>
  ${commonStyles}
</head>
<body>
  <div class="email-container">
    ${headerTemplate}
    <div class="body">
      <p>Dear ${doctorName},</p>
      <p>This is a reminder that your video call appointment with <strong>${parentName}</strong> is starting in 10 minutes.</p>
      <p><strong>Appointment Details:</strong></p>
      <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
      <p><strong>Client:</strong> ${parentName}</p>
      ${appointmentButtonTemplate(meetingLink, "Join Appointment Now")}
      <p>Please ensure you're prepared for the consultation and have your notes ready. ${parentName} is counting on your expertise to help with their pet's healthcare needs.</p>
      <p>To join the appointment, click the meeting link above when you're ready.</p>
      <p>If you encounter any technical issues or need assistance, please contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
      <p>Thank you for your dedication to providing excellent veterinary care through Rex Vets.</p>
      <p>Best regards,<br>The Rex Vets Team</p>
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`;