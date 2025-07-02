# Rex Vets Email Server

A professional Node.js/Express backend server for handling email notifications, appointment reminders, and PDF generation for the Rex Vets application.

## 🏗️ Architecture

This project follows a clean, modular architecture with proper separation of concerns:

```
src/
├── config/          # Configuration files
│   ├── cors.js      # CORS settings
│   ├── database.js  # Firebase/Firestore setup
│   └── email.js     # Email transporter config
├── controllers/     # Request handlers
│   ├── emailController.js
│   └── healthController.js
├── middleware/      # Custom middleware
│   ├── auth.js      # Firebase authentication
│   └── errorHandler.js # Error handling & logging
├── services/        # Business logic
│   ├── cronService.js    # Cron job management
│   ├── emailService.js   # Email operations
│   ├── pdfService.js     # PDF generation
│   └── reminderService.js # Reminder processing
└── utils/           # Utility functions
    ├── convertNYToLocal.js
    └── timezone.js
```

## 🚀 Features

- **Email Management**: Welcome emails, booking confirmations, reminders
- **PDF Generation**: Donation receipts with Puppeteer
- **Appointment Reminders**: Automated cron-based reminder system
- **Health Monitoring**: Comprehensive health checks and monitoring
- **Error Handling**: Robust error handling and logging
- **CORS Support**: Configured for multi-origin access

## 📦 Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see Configuration section)

4. Start the server:
   ```bash
   npm start
   ```

## ⚙️ Configuration

Required environment variables:

### Firebase Configuration

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_CLIENT_X509_CERT_URL=your-cert-url
```

### Email Configuration

```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

### Optional

```
NODE_ENV=production
PORT=5000
ALLOWED_ORIGIN=https://www.rexvets.com
```

## 🛠️ API Endpoints

### Health & Monitoring

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /api/heartbeat` - Simple heartbeat

### Email Services

- `POST /sendWelcomeEmailParent` - Send welcome email
- `POST /sendBookingConfirmation` - Send booking confirmation
- `POST /sendDonationThankYou` - Send donation thank you with PDF

### Cron & Reminders

- `GET /api/cron/process-reminders` - Process pending reminders
- `GET /api/cron/status` - Cron system status

### Testing

- `GET /test-cors` - Test CORS configuration
- `POST /test-pdf` - Test PDF generation
- `GET /test-email` - Test email system

## 🚀 Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set up environment variables in Railway dashboard
3. Deploy automatically with Git push

The project includes:

- `Procfile` for process management
- `railway.json` for Railway-specific configuration
- `railway.cron` for cron job setup

### Production Checklist

- ✅ All environment variables configured
- ✅ Firebase service account properly set up
- ✅ SMTP credentials configured
- ✅ CORS origins properly configured
- ✅ Health checks responding

## 🔧 Development

### Local Development

```bash
npm run dev  # Uses nodemon for auto-restart
```

### Testing

```bash
# Test syntax
node --check server.js

# Test specific endpoints
curl http://localhost:5000/health
curl http://localhost:5000/test-cors
```

## 📊 Monitoring

The server includes comprehensive monitoring:

- Health checks at `/health`
- Heartbeat monitoring at `/api/heartbeat`
- Cron job status at `/api/cron/status`
- Debug endpoints for troubleshooting

## 🔒 Security

- CORS properly configured for allowed origins
- Environment variables for sensitive data
- Input validation and error handling
- Request timeouts and rate limiting

## 📝 Logging

The server provides detailed logging for:

- Request/response cycles
- Email sending operations
- Cron job execution
- Error conditions
- Firebase operations

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Connection**: Check environment variables
2. **Email Sending**: Verify SMTP credentials
3. **PDF Generation**: Ensure Chromium/Puppeteer setup
4. **CORS Errors**: Check allowed origins configuration

### Debug Endpoints

- `/debug/env` - Environment variable status
- `/api/debug/reminders` - Reminder system status
- `/api/debug/cron-status` - Cron scheduler status

## 🔄 Cron Jobs

The server runs internal cron jobs for:

- Processing appointment reminders (every 2 minutes)
- Health checks (every 5 minutes)

External cron jobs via Railway:

- Reminder processing (every 5 minutes)
- Heartbeat checks (every minute)

## 📚 Dependencies

### Production

- Express.js - Web framework
- Firebase Admin - Database operations
- Nodemailer - Email sending
- Puppeteer - PDF generation
- Moment.js - Date/time handling
- Node-cron - Scheduled tasks

### Development

- Nodemon - Development auto-restart

## 📄 License

This project is part of the Rex Vets application suite.
