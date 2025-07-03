import { commonStyles, footerTemplate } from '../common/styles.js';

export const donationThankYouTemplate = (
  donorName,
  amount,
  receiptNumber,
  isRecurring,
  badgeName,
  date,
  paymentMethod
) => {
  const recurringText = isRecurring
    ? "Your recurring monthly donation will help us provide continuous care to pets in need."
    : "Your one-time donation makes an immediate impact on the lives of pets and their families.";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank You for Your Donation</title>
  ${commonStyles}
  <style>
    .receipt-section {
      margin: 30px 0;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 20px;
      background-color: #f9fafb;
    }
    .receipt-title {
      margin-top: 0;
      color: #2563eb;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .amount {
      color: #16a34a;
      font-weight: bold;
      font-size: 18px;
    }
    .impact-list {
      padding-left: 20px;
      color: #374151;
      margin: 15px 0;
    }
    .impact-list li {
      margin-bottom: 10px;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="body">
      <h2 class="title">Thank You for Your Generous Donation!</h2>
      <p>Dear <strong>${donorName}</strong>,</p>
      <p>We sincerely appreciate your contribution to RexVets. ${recurringText}</p>

      <div class="receipt-section">
        <h3 class="receipt-title">🧾 Donation Receipt</h3>
        <p><strong>Receipt No:</strong> ${receiptNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Donation Amount:</strong> <span class="amount">$${amount}</span></p>
        <p><strong>Badge:</strong> <span style="font-weight: bold;">${badgeName}</span></p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <h4>Tax Statement:</h4>
        <p style="margin:0">Rex Vets Inc is a 501(c)(3) non-profit organization. No goods or services were received in exchange for this gift. It may be considered tax-deductible to the full extent of the law. Please retain this receipt for your records.</p>
      </div>

      <h4 style="color: #1e3a8a; margin-top: 20px;">A Note of Thanks:</h4>
      <ul class="impact-list">
        <li>Your donation directly supports animals in need by helping us provide free and low-cost virtual veterinary care to pets in underserved communities.</li>
        <li>Every dollar helps us reach more families and save more lives — from emergency consultations to routine care.</li>
        <li>With your support, we're one step closer to making quality vet care accessible for every pet, regardless of circumstance.</li>
      </ul>

      <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@rexvets.org" style="color: #2563eb;">support@rexvets.com</a>.</p>
      
      <p style="margin-top: 20px;">With heartfelt thanks,</p>
      <p><em>– The RexVets Team</em></p>
    </div>
    
    <div style="background: rgb(200, 206, 219); padding: 15px; font-size: 14px; color: rgb(38, 79, 160); text-align: center; margin-top: 20px;">
      <p style="margin: 5px 0;">Rex Vets Inc</p>
      <p style="margin: 5px 0;">📍 123 Animal Care Drive, Miami, FL 33101</p>
      <p style="margin: 5px 0;">EIN: (123) 456-7690 | ✉️ support@rexvets.com</p>
      <p style="margin: 5px 0;">🌐 www.rexvets.com</p>
    </div>
  </div>
</body>
</html>
`;
};