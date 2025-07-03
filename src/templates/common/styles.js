// Common email template styles and components
export const commonStyles = `
  <style>
    body { margin: 0; padding: 15px; font-family: Arial, sans-serif; background-color: #f5f5f5; }
    .email-container { max-width: 700px; margin: 0 auto; background: #ffffff; color: #333; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
    .header { background-color: #002366; padding: 10px; text-align: center; }
    .logo { width: 150px; height: auto; display: block; margin: 0 auto; }
    .body { padding: 20px 30px; }
    .title { color: #1e3a8a; font-size: 24px; margin: 20px 0 15px 0; }
    .button { background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
    .link-text { text-align: center; word-break: break-all; color: #666; }
    .footer { background-color: #002366; padding: 10px; text-align: center; }
    .banner { background-color: #c5f1fc; padding: 0; text-align: center; width: 100%; }
    .banner img { display: block; height: auto; border: 0; width: 100%; }
    p { line-height: 1.6; margin: 10px 0; }
    strong { font-weight: bold; }
  </style>
`;

export const headerTemplate = `
  <div class="banner">
    <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" />
  </div>
`;

export const footerTemplate = `
  <div class="footer">
    <img class="logo" src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" />
  </div>
`;

export const appointmentButtonTemplate = (meetingLink, buttonText = "Join Appointment Now") => `
  <div style="text-align: center; margin: 20px 0;">
    <a href="${meetingLink}" class="button">${buttonText}</a>
  </div>
  <p class="link-text">Or copy and paste this link in your browser:<br/> ${meetingLink}</p>
`;