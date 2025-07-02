export const welcomeEmailTemplate = (name) => `
            <h1>Welcome to Rex Vets!</h1>
            <p>Dear ${name},</p>
            <p>Welcome to Rex Vets and thank you for choosing us for your pet's healthcare needs. We're thrilled to have you on board and look forward to helping you and your furry friend live happier, healthier lives.</p>
            <p>You're now part of a community of pet lovers who are committed to providing the best care for their pets. To schedule your first video call with one of our experienced veterinarians, simply visit the 'Home' tab in your account and click 'Book a video call', and you'll be on your way to a virtual appointment.</p>
            <p>If you have any questions or need assistance at any point along the way, please don't hesitate to reach out to our dedicated support team at support@rexvets.com. We're here to make your experience with Rex Vets as seamless and enjoyable as possible.</p>
            <p>Thank you once again for choosing Rex Vets. We can't wait to assist you in providing the best possible care for your pet.</p>
            <p>Warm regards,<br>The Team at Rex Vets</p>
            
            <!-- Add logo here -->
            <div style="background-color: #002366; padding: 10px; text-align: center;">
                <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
            </div>
        `;
// this
export const bookingConfirmationDoctorTemplate = (
  doctorName,
  parentName,
  appointmentDateTime,
  petName,
  meetingLink
) => `
             <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
    </div>
            <p>Dear ${doctorName},</p>

            <p>We're excited to confirm your upcoming video call appointment with ${parentName} at Rex Vets. Here are the details for your appointment:</p>
            <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
            <p><strong>Veterinarian:</strong> ${doctorName}</p>
            <p><strong>Parent:</strong> ${parentName}</p>
            <p><strong>Pet Name:</strong> ${petName}</p>
          
            <div style="text-align: center; margin: 20px 0;">
                <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Appointment Link
                </a>
            </div>
            <p style="text-align: center; word-break: break-all; color: #666;">
                Or copy and paste this link in your browser:<br/> ${meetingLink}
            </p>

            <p>Please make sure you're ready for the call at least a few minutes before the scheduled time.</p>

            <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>

            <p>We thank you for your dedication to pet's care.</p>

            <p>Warm regards,<br>The Team at Rex Vets</p>

            <!-- Add logo here -->
            <div style="background-color: #002366; padding: 10px; text-align: center;">
                <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
            </div>
        `;

export const rescheduleConfirmationDoctorTemplate = (
  parentName,
  doctorName,
  petName,
  oldDate,
  oldTime,
  appointmentDate,
  appointmentTime,
  meetingLink
) => `
          <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
            <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
          </div>
        
          <p>Dear ${doctorName},</p>
        
          <p>This is to notify you that your scheduled video call appointment with <strong>${parentName}</strong> at Rex Vets has been <strong>rescheduled</strong>. Please find the updated appointment details below:</p>
        
          ${
            oldDate
              ? `<p><strong>Previous Time:</strong>${oldDate} at ${oldTime}</p>`
              : ""
          }
        
          <p><strong>New Start Time:</strong> ${appointmentDate} at ${appointmentTime}</p>
          <p><strong>Veterinarian:</strong> ${doctorName}</p>
          <p><strong>Parent:</strong> ${parentName}</p>
          <p><strong>Pet Name:</strong> ${petName}</p>
        
          <div style="text-align: center; margin: 20px 0;">
            <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Join Rescheduled Appointment
            </a>
          </div>
        
          <p style="text-align: center; word-break: break-all; color: #666;">
            Or copy and paste this link in your browser:<br/> ${meetingLink}
          </p>
        
          <p>Please ensure you're available and ready for the call at the new time. If the time no longer works for you, kindly contact our support or reply to this email.</p>
        
          <p>We thank you for your flexibility and continued support.</p>
        
          <p>Warm regards,<br>The Team at Rex Vets</p>
        
          <div style="background-color: #002366; padding: 10px; text-align: center;">
            <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
          </div>
        `;

export const bookingConfirmationParentTemplate = (
  parentName,
  doctorName,
  appointmentDateTime,
  petName,
  meetingLink
) => `
            <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
    </div>
            <p>Dear ${parentName},</p>

            <p>We're excited to confirm your upcoming video call appointment with <strong>${doctorName}</strong> at Rex Vets. Here are the details for your appointment:</p>
            <p><strong>Start Time:</strong> ${appointmentDateTime}</p>
            <p><strong>Veterinarian:</strong> ${doctorName}</p>
            <p><strong>Pet Name:</strong> ${petName}</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Join Appointment Now
                </a>
            </div>
            <p style="text-align: center; word-break: break-all; color: #666;">
                Or copy and paste this link in your browser:<br/> ${meetingLink}
            </p>

            <p>Please make sure you're ready for the call at least a few minutes before the scheduled time. ${doctorName} is here to address any questions or concerns you have about your pet's health.</p>

            <p>If you need to reschedule or have any other questions, please feel free to reply to this email or contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>

            <p>We look forward to assisting you with your pet's care.</p>

            <p>Warm regards,<br>The Team at Rex Vets</p>

            <!-- Add logo here -->
            <div style="background-color: #002366; padding: 10px; text-align: center;">
                <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
            </div>
        `;

export const rescheduleConfirmationParentTemplate = (
  parentName,
  doctorName,
  petName,
  oldDate,
  oldTime,
  appointmentDate,
  userDisplayTime,
  meetingLink
) => `
          <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
            <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
          </div>
        
          <p>Dear ${parentName},</p>
        
          <p>Your video call appointment with <strong>Dr. ${doctorName}</strong> at Rex Vets for <strong>${petName}</strong> has been <strong>rescheduled</strong>.</p>
        
          ${
            oldDate
              ? `<p><strong>Previous Time:</strong>${oldDate} at ${oldTime}</p>`
              : ""
          }
        
          <p><strong>New Start Time:</strong> ${appointmentDate} at ${userDisplayTime}</p>
          <p><strong>Veterinarian:</strong> Dr. ${doctorName}</p>
          <p><strong>Pet Name:</strong> ${petName}</p>
        
          <div style="text-align: center; margin: 20px 0;">
            <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Join Your Appointment
            </a>
          </div>
        
          <p style="text-align: center; word-break: break-all; color: #666;">
            Or copy and paste this link in your browser:<br/> ${meetingLink}
          </p>
        
          <p>Please make sure you're ready and in a quiet place a few minutes before your scheduled time.</p>
        
          <p>If you need to change your appointment again or have any questions, reply to this email or contact our team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>
        
          <p>We look forward to helping ${petName} feel their best!</p>
        
          <p>Warm regards,<br>The Team at Rex Vets</p>
        
          <div style="background-color: #002366; padding: 10px; text-align: center;">
            <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
          </div>
        `;

export const reminderParentTemplate = (
  parentName,
  doctorName,
  appointmentDateTime,
  meetingLink
) => `
    <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
    </div>
    <p>Dear ${parentName},</p>

    <p>This is a friendly reminder that your video call appointment with <strong> ${doctorName}</strong> at Rex Vets is starting in just 10 minutes!</p>
    
    <p><strong>Appointment Details:</strong></p>
    <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
    <p><strong>Veterinarian:</strong> ${doctorName}</p>
    
    <div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Join Appoinment Now
        </a>
    </div>
    <p style="text-align: center; word-break: break-all; color: #666;">
        Or copy and paste this link in your browser:<br/> ${meetingLink}
    </p>

    <p>Please ensure you're ready for the call and have any questions or concerns about your pet prepared for the consultation. ${doctorName} is looking forward to helping you and your furry friend.</p>

    <p>To join your appointment, simply click the meeting link above a few minutes before your scheduled time.</p>

    <p>If you experience any technical difficulties or need to reschedule, please contact our support team immediately at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>

    <p>Thank you for choosing Rex Vets for your pet's healthcare needs.</p>

    <p>Warm regards,<br>The Team at Rex Vets</p>

    <!-- Add logo here -->
    <div style="background-color: #002366; padding: 10px; text-align: center;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>
  `;

export const reminderDoctorTemplate = (
  doctorName,
  parentName,
  appointmentDateTime,
  meetingLink
) => `
    <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
    </div>
    <p>Dear ${doctorName},</p>

    <p>This is a reminder that your video call appointment with <strong>${parentName}</strong> is starting in 10 minutes.</p>
    
    <p><strong>Appointment Details:</strong></p>
    <p><strong>Date & Time:</strong> ${appointmentDateTime}</p>
    <p><strong>Client:</strong> ${parentName}</p>
  
    <div style="text-align: center; margin: 20px 0;">
        <a href="${meetingLink}" style="background-color: #002366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Join Appoinment Now
        </a>
    </div>
    <p style="text-align: center; word-break: break-all; color: #666;">
        Or copy and paste this link in your browser:<br/> ${meetingLink}
    </p>

    <p>Please ensure you're prepared for the consultation and have your notes ready. ${parentName} is counting on your expertise to help with their pet's healthcare needs.</p>

    <p>To join the appointment, click the meeting link above when you're ready.</p>

    <p>If you encounter any technical issues or need assistance, please contact our support team at <a href="mailto:support@rexvets.com">support@rexvets.com</a>.</p>

    <p>Thank you for your dedication to providing excellent veterinary care through Rex Vets.</p>

    <p>Best regards,<br>The Rex Vets Team</p>

    <!-- Add logo here -->
    <div style="background-color: #002366; padding: 10px; text-align: center;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>
  `;

export const donationThankYouTemplate = (
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod
  // serviceValue,
  // taxDeductibleAmount
) => {
  const recurringText = isRecurring
    ? "Your recurring monthly donation will help us provide continuous care to pets in need."
    : "Your one-time donation makes an immediate impact on the lives of pets and their families.";

  return `
<div style="max-width: 700px; margin: 0 auto; background: #ffffff; font-family: Arial, sans-serif; color: #333; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
  <!-- Header -->
   <div style="background-color: #002366; padding: 10px; text-align: center;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>

  <!-- Body -->
  <div style="padding: 10px 30px;">
    <h2 style="color: #1e3a8a;">Thank You for Your Generous Donation!</h2>
    <p>Dear <strong>${donorName}</strong>,</p>
    <p>We sincerely appreciate your contribution to RexVets. ${recurringText}</p>

    <div style="margin: 30px 0; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
      <h3 style="margin-top: 0; color: #2563eb;">🧾 Donation Receipt</h3>
      <p><strong>Receipt No:</strong> ${receiptNumber}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Donation Amount:</strong> <span style="color: #16a34a; font-weight: bold;">$${amount}</span></p>
      <p><strong>Badge:</strong> <span style="font-weight: bold;">${badgeName}</span></p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <h4>Tax Statement:</h4>
      <p style="margin:0">Rex Vets Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.</p>
    </div>

   <h4 class="impact-title">A Note of Thanks:</h4>
         
          <ul class="impact-list">
            <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
            <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
            <li>With your support, we’re one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
          </ul>

    <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@rexvets.org" style="color: #2563eb;">support@rexvets.com</a>.</p>
    
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
`;
};

export const messageToParentTemplate = (
  parentName,
  doctorName,
  appointmentHash
) => `<!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
      #MessageViewBody a { color: inherit; text-decoration: none; }
      p { line-height: inherit }
      .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
      .image_block img+div { display: none; }
      sup, sub { line-height: 0; font-size: 75%; }
      @media (max-width:660px) {
        .desktop_hide table.icons-inner, .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }
        .icons-inner { text-align: center; }
        .icons-inner td { margin: 0 auto; }
        .mobile_hide { display: none; }
        .row-content { width: 100% !important; }
        .stack .column { width: 100%; display: block; }
        .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
        .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
      }
    </style>
  </head>
  <body class="body" style="background-color: #c5f1fc; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #c5f1fc;">
      <tbody>
        <tr>
          <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="width:100%;">
                                  <div class="alignment" align="center" style="line-height:10px">
                                    <div style="max-width: 640px;"><img src="https://i.ibb.co/GTpgnRP/new-message.png" style="display: block; height: auto; border: 0; width: 100%;" width="640" alt="Dog Banner" title="Dog Banner" height="auto"></div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #ffffff; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <h1 style="margin: 0; color: #7747FF; direction: ltr; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 38px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;">
                                    <span style="word-break: break-word; color: #000000;"><strong>Dear ${parentName}</strong></span>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #ffffff; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                    <p style="margin: 0; word-break: break-word;">We hope you and your pet are doing well.</p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;">You have received a new message from your veterinarian at Rex Vets. To view your message and any related recommendations or treatment plans, please log in to your Rex Vets account using the link below:</p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;"><strong><a href="https://www.rexvets.com/AppointmentsPetParents" target="_blank">Your Appointments</a></strong></p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;">If you have any questions or concerns, feel free to reach out to us through your account or by replying to this email. We're here to support you and your pet's health every step of the way!</p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;">Thank you for trusting Rex Vets with your pet's care.</p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;">Best regards,<br><strong>The Rex Vets Team</strong></p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="button_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <a href="https://www.rexvets.com/AppointmentsPetParents" target="_blank" style="background-color:#002366;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:10px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;">
                                      <span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;">
                                        <strong>VIEW APPOINTMENTS</strong>
                                      </span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">&nbsp;</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b3d3; background-position: center top; color: #000000; width: 640px; margin: 0 auto;" width="640">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #002366; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="image_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="pad">
                              <div class="alignment" align="center" style="line-height:10px">
                                <div style="max-width: 620px;"><a href="https://www.rexvets.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://i.ibb.co/3CZBJyh/5bfa.png" style="display: block; height: auto; border: 0; width: 100%;" width="620" alt="Your Logo" title="Your Logo" height="auto"></a></div>
                              </div>
                            </td>
                          </tr>
                        </table>
                            <table class="social_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <table class="social-table" width="92px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                      <tr>
                                        <td style="padding:0 7px 0 7px;"><a href="https://www.facebook.com/rexvets" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/facebook@2x.png" width="32" height="auto" alt="Facebook" title="Facebook" style="display: block; height: auto; border: 0;"></a></td>
                                        <td style="padding:0 7px 0 7px;"><a href="https://www.instagram.com/rexvets" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/instagram@2x.png" width="32" height="auto" alt="Instagram" title="Instagram" style="display: block; height: auto; border: 0;"></a></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
                                    <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #ffffff;"><strong>Rex Vets </strong>is a <strong>non-profit organization</strong>, and our efforts are sustained by the generosity of our donors. If you would like to support our mission with a donation, we would be deeply grateful. You can make a contribution through <strong><a href="https://www.rexvets.com/PetParents" target="_blank" style="color: #ffffff;">the following link</a></strong></span></p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </body>
  </html>`;

export const messageToDoctorTemplate = (
  doctorName,
  parentName,
  appointmentHash
) => `<!DOCTYPE html>
  <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; }
      a[x-apple-data-detectors] { color: inherit !important; text-decoration: inherit !important; }
      #MessageViewBody a { color: inherit; text-decoration: none; }
      p { line-height: inherit }
      .desktop_hide, .desktop_hide table { mso-hide: all; display: none; max-height: 0px; overflow: hidden; }
      .image_block img+div { display: none; }
      sup, sub { line-height: 0; font-size: 75%; }
      @media (max-width:660px) {
        .desktop_hide table.icons-inner, .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }
        .icons-inner { text-align: center; }
        .icons-inner td { margin: 0 auto; }
        .mobile_hide { display: none; }
        .row-content { width: 100% !important; }
        .stack .column { width: 100%; display: block; }
        .mobile_hide { min-height: 0; max-height: 0; max-width: 0; overflow: hidden; font-size: 0px; }
        .desktop_hide, .desktop_hide table { display: table !important; max-height: none !important; }
      }
    </style>
  </head>
  <body class="body" style="background-color: #c5f1fc; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
    <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #c5f1fc;">
      <tbody>
        <tr>
          <td>
            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <div class="spacer_block block-1" style="height:50px;line-height:50px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad" style="width:100%;">
                                  <div class="alignment" align="center" style="line-height:10px">
                                    <div style="max-width: 640px;"><img src="https://i.ibb.co/GTpgnRP/new-message.png" style="display: block; height: auto; border: 0; width: 100%;" width="640" alt="Dog Banner" title="Dog Banner" height="auto"></div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #ffffff; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="heading_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <h1 style="margin: 0; color: #7747FF; direction: ltr; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0; mso-line-height-alt: 45.6px;">
                                    <span style="word-break: break-word; color: #000000;"><strong>Hello ${doctorName}</strong></span>,
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                    <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 640px; margin: 0 auto;" width="640">
                      <tbody>
                        <tr>
                          <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #ffffff; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">
                                    <p style="margin: 0; word-break: break-word;">You have received a new message from your client, ${parentName}. Please log in to your Rex Vets account to review and respond.</p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;"><strong><a href="https://www.rexvets.com/AppointmentsVetsandTechs" target="_blank">Your Appointments</a></strong></p>
                                    <p style="margin: 0; word-break: break-word;">&nbsp;</p>
                                    <p style="margin: 0; word-break: break-word;">Thank you,<br><strong>The Rex Vets Team</strong></p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="button_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <a href="https://www.rexvets.com/AppointmentsVetsandTechs" target="_blank" style="background-color:#002366;border-bottom:0px solid transparent;border-left:0px solid transparent;border-radius:10px;border-right:0px solid transparent;border-top:0px solid transparent;color:#ffffff;display:inline-block;font-family:'Lato', Tahoma, Verdana, Segoe, sans-serif;font-size:16px;font-weight:undefined;mso-border-alt:none;padding-bottom:5px;padding-top:5px;text-align:center;text-decoration:none;width:auto;word-break:keep-all;">
                                      <span style="word-break: break-word; padding-left: 20px; padding-right: 20px; font-size: 16px; display: inline-block; letter-spacing: normal;">
                                        <strong>VIEW APPOINTMENTS</strong>
                                      </span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:left;mso-line-height-alt:16.8px;">&nbsp;</div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tbody>
                <tr>
                  <td>
                  <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #00b3d3; background-position: center top; color: #000000; width: 640px; margin: 0 auto;" width="640">
                  <tbody>
                    <tr>
                      <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #002366; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                        <table class="image_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                          <tr>
                            <td class="pad">
                              <div class="alignment" align="center" style="line-height:10px">
                                <div style="max-width: 620px;"><a href="https://www.rexvets.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://i.ibb.co/3CZBJyh/5bfa.png" style="display: block; height: auto; border: 0; width: 100%;" width="620" alt="Your Logo" title="Your Logo" height="auto"></a></div>
                              </div>
                            </td>
                          </tr>
                        </table>
                            <table class="social_block block-2" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <table class="social-table" width="92px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                      <tr>
                                        <td style="padding:0 7px 0 7px;"><a href="https://www.facebook.com/rexvets" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/facebook@2x.png" width="32" height="auto" alt="Facebook" title="Facebook" style="display: block; height: auto; border: 0;"></a></td>
                                        <td style="padding:0 7px 0 7px;"><a href="https://www.instagram.com/rexvets" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-circle-white/instagram@2x.png" width="32" height="auto" alt="Instagram" title="Instagram" style="display: block; height: auto; border: 0;"></a></td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table class="paragraph_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                              <tr>
                                <td class="pad">
                                  <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;font-size:14px;line-height:120%;text-align:center;mso-line-height-alt:16.8px;">
                                    <p style="margin: 0; word-break: break-word;"><span style="word-break: break-word; color: #ffffff;"><strong>Rex Vets </strong>is a <strong>non-profit organization</strong>, and our efforts are sustained by the generosity of our donors. If you would like to support our mission with a donation, we would be deeply grateful. You can make a contribution through <strong><a href="https://www.rexvets.com/PetParents" target="_blank" style="color: #ffffff;">the following link</a></strong></span></p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <div class="spacer_block block-4" style="height:30px;line-height:30px;font-size:1px;">&#8202;</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </body>
  </html>`;

export const pharmacyRequestPaymentTemplate = ({
  name,
  transactionId,
  amount,
  pharmacyName,
  date,
}) => {
  return `
      <div style="background-color: #f4f4f4; padding: 40px 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.05);">

      <!-- Banner -->
   <div style="background-color: #002366; padding: 10px; text-align: center;">
        <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1747926532/Logo_debjuj.png" alt="Rex Vets Logo" width="150" style="display: block; margin: 0 auto;" />
    </div>

      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #002366;">Hello ${name || "Pet Parent"},</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for your payment! We've successfully received your pharmacy transfer request. Below is your receipt:
        </p>

        <!-- Table -->
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Pharmacy:</strong></td>
              <td style="padding: 8px 0; color: #111;">${pharmacyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Amount Paid:</strong></td>
              <td style="padding: 8px 0; color: #111;">$${amount.toFixed(
                2
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Transaction ID:</strong></td>
              <td style="padding: 8px 0; color: #111;">${transactionId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555;"><strong>Date:</strong></td>
              <td style="padding: 8px 0; color: #111;">${new Date(
                date
              ).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <!-- Message -->
        <p style="margin-top: 30px; font-size: 15px; color: #333;">
          Our team will begin processing your pharmacy transfer right away. The typical turnaround is 2–3 business days.
        </p>

        <p style="font-size: 15px; color: #333;">
          If you have any questions or need support, feel free to reply to this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f0f0f0; text-align: center; padding: 20px; font-size: 13px; color: #777;">
        🐾 RexVets • 123 Pet Lane, Animal City, USA<br />
        <a href="mailto:support@rexvets.com" style="color: #002366;">support@rexvets.com</a>
      </div>
    </div>
  </div>
    `;
};

export const pharmacyRequestAcceptedTemplate = ({
  name,
  transactionId,
  amount,
  pharmacyName,
  pharmacyAddress,
  pharmacyCity,
  pharmacyState,
  date,
}) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
  <!-- Banner -->
      <div style="background-color: #c5f1fc; padding: 0; text-align: center; width: 100%;">
            <img src="https://res.cloudinary.com/di6zff0rd/image/upload/v1748961858/emailtemp1_sv6jxx.jpg" alt="Top Banner" style="display: block; height: auto; border: 0; width: 100%;" />
          </div>

  <!-- Body -->
  <div style="padding: 30px;">
    <h2 style="color: #002366;">Hi ${name},</h2>
    <p style="font-size: 16px; color: #333;">
      We're happy to let you know that your pharmacy transfer request has been <strong style="color: green;">accepted</strong>.
    </p>
    <p style="font-size: 16px; color: #333;">
      Our team is now processing your request, and we'll forward the prescription to your nearby pharmacy as soon as possible.
    </p>

    <table style="margin-top: 20px; font-size: 15px; color: #333;">
      <tr>
        <td style="padding: 4px 0;"><strong>Pharmacy:</strong></td>
        <td style="padding: 4px 0;">${pharmacyName}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;"><strong>Pharmacy Address:</strong></td>
        <td style="padding: 4px 0;">${pharmacyAddress},${pharmacyCity},${pharmacyState}</td>
      </tr>

      <tr>
        <td style="padding: 4px 0;"><strong>Amount Paid:</strong></td>
        <td style="padding: 4px 0;">${amount}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;"><strong>Transaction ID:</strong></td>
        <td style="padding: 4px 0;">${transactionId}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0;"><strong>Requested Date:</strong></td>
        <td style="padding: 4px 0;">${date}</td>
      </tr>
    </table>

    <p style="margin-top: 30px; font-size: 15px; color: #333;">
      If you have any questions or need further assistance, feel free to reply to this email. We're here to help!
    </p>

    <p style="font-size: 16px; font-weight: 600; color: #002366; margin-top: 40px;">Sincerely,<br>Rex Vets Team 🐾</p>
  </div>

  <!-- Footer -->
  <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888;">
    © ${new Date().getFullYear()} Rex Vets. All rights reserved.
  </div>
</div>

    `;
};

export function helpRequestEmailTemplate({
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
  console.log(
    "from template",
    fullName,
    emailAddress,
    phoneNo,
    state,
    subject,
    message,
    image,
    userType,
    userID
  );
  return `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #004085;">New Support Request from ${userType}</h2>
      <p>A new support request has been submitted by a ${userType}. Here are the details:</p>

      <table style="width: 100%; margin-top: 16px; font-size: 14px;">
        <tr>
          <td style="font-weight: bold; padding: 6px 0;">Full Name:</td>
          <td>${fullName || "N/A"}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 6px 0;">Email Address:</td>
          <td>${emailAddress || "N/A"}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 6px 0;">Phone No:</td>
          <td>${phoneNo || "N/A"}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 6px 0;">State:</td>
          <td>${state || "N/A"}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 6px 0;">User ID:</td>
          <td>${userID || "N/A"}</td>
        </tr>
      </table>

      <hr style="margin: 24px 0;" />

      <h3 style="margin-bottom: 8px; color: #333;">Subject: ${
        subject || "No Subject"
      }</h3>
      <p style="white-space: pre-line; line-height: 1.6;">
        ${message || "No message provided."}
      </p>

      ${
        image
          ? `<div style="margin-top: 24px;">
              <p><strong>Attached Screenshot / Image:</strong></p>
              <img src="${image}" alt="attachment" style="max-width: 100%; border: 1px solid #ccc; border-radius: 4px;" />
            </div>`
          : ""
      }

      <p style="margin-top: 40px; font-size: 13px; color: #999;">
        This request was submitted on behalf of a registered ${userType}.
      </p>
    </div>
  `;
}
