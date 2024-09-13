import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp({
  credential: admin.credential.cert({
    privateKey: functions.config().private.key.replace(/\\n/g, "\n"),
    projectId: functions.config().project.id,
    clientEmail: functions.config().client.email,
  }),
  storageBucket: "empresta-gym-cb9c2.appspot.com",
  databaseURL: "https://empresta-gym-cb9c2-default-rtdb.firebaseio.com",
});

const db = admin.firestore();
const storage = admin.storage();
const baseUrl = "https://us-central1-empresta-gym-cb9c2.cloudfunctions.net/app";

export {admin, db, storage, baseUrl};
