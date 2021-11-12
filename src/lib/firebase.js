const projectId = process.env.FIREBASE_PROJECT_ID;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const databaseURL = process.env.FIREBASE_DATABASE_URL;

const admin = require('firebase-admin/app');
const firestore = require('firebase-admin/firestore');

admin.getApps().length === 0 && admin.initializeApp({
  credential: admin.cert({
    projectId,
    privateKey,
    clientEmail
  }),
  databaseURL
});

const firebase = {
  firestore: firestore.getFirestore()
};

module.exports = firebase;
