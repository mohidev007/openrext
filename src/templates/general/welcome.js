import { commonStyles, footerTemplate } from '../common/styles.js';

export const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Rex Vets!</title>
  ${commonStyles}
</head>
<body>
  <div class="email-container">
    <div class="body">
      <h1>Welcome to Rex Vets!</h1>
      <p>Dear ${name},</p>
      <p>Welcome to Rex Vets and thank you for choosing us for your pet's healthcare needs. We're thrilled to have you on board and look forward to helping you and your furry friend live happier, healthier lives.</p>
      <p>You're now part of a community of pet lovers who are committed to providing the best care for their pets. To schedule your first video call with one of our experienced veterinarians, simply visit the 'Home' tab in your account and click 'Book a video call', and you'll be on your way to a virtual appointment.</p>
      <p>If you have any questions or need assistance at any point along the way, please don't hesitate to reach out to our dedicated support team at support@rexvets.com. We're here to make your experience with Rex Vets as seamless and enjoyable as possible.</p>
      <p>Thank you once again for choosing Rex Vets. We can't wait to assist you in providing the best possible care for your pet.</p>
      <p>Warm regards,<br>The Team at Rex Vets</p>
    </div>
    ${footerTemplate}
  </div>
</body>
</html>
`;