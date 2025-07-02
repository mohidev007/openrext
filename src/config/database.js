import admin from "firebase-admin";

let db;

export const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      // Validate required Firebase environment variables
      const requiredFirebaseVars = [
        "FIREBASE_PROJECT_ID",
        "FIREBASE_PRIVATE_KEY_ID",
        "FIREBASE_PRIVATE_KEY",
        "FIREBASE_CLIENT_EMAIL",
        "FIREBASE_CLIENT_ID",
        "FIREBASE_CLIENT_X509_CERT_URL",
      ];

      const missingVars = requiredFirebaseVars.filter(
        (varName) => !process.env[varName]
      );

      if (missingVars.length > 0) {
        throw new Error(
          `Missing required Firebase environment variables: ${missingVars.join(
            ", "
          )}`
        );
      }

      // Create service account object from environment variables
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      };

      console.log(
        "🔥 Initializing Firebase with project:",
        process.env.FIREBASE_PROJECT_ID
      );

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:
          process.env.FIREBASE_DATABASE_URL ||
          "https://rexvets-database.firebaseio.com",
      });

      console.log("✅ Firebase initialized successfully");
    }

    // Initialize Firestore
    db = admin.firestore();
    console.log("✅ Firestore initialized successfully");

    return db;
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error.message);
    console.error(
      "Please check your Firebase environment variables in deployment dashboard"
    );
    throw error;
  }
};

export const getFirestore = () => {
  if (!db) {
    throw new Error(
      "Firestore not initialized. Call initializeFirebase() first."
    );
  }
  return db;
};

export { admin };
