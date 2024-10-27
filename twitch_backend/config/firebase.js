const admin = require("firebase-admin");
require('dotenv').config();

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.service_account);
} catch (error) {
  console.error("Error parsing service account JSON:", error);
  process.exit(1); // Exit the process if parsing fails
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL || "https://twitchproject-9521a-default-rtdb.firebaseio.com"
  });
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase Admin SDK:", error);
}

async function testFirebaseConnection() {
  try {
    const db = admin.database();
    const ref = db.ref("test");
    await ref.set({ message: "Hello from Firebase!" });
    console.log("Test message written to Firebase successfully.");
  } catch (error) {
    console.error("Error writing to Firebase:", error);
  }
}

testFirebaseConnection();
module.exports = admin;
