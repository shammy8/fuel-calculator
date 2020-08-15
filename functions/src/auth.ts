import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();

export const createUserRecord = functions.auth
  .user()
  .onCreate((user, context) => {
    const userRef = db.doc(`users/${user.uid}`);

    return userRef.set({
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      createdAt: context.timestamp,
    });
  });

export const addDriver = functions.https.onCall(
  async (data: {
    email: string;
    carDoc: { docId: string; drivers: string[] };
  }) => {
    const drivers = [...data.carDoc.drivers];

    const user = await db
      .collection(`users`)
      .where('email', '==', data.email)
      .get();

    if (user.size === 1) {
      user.forEach((doc) => drivers.push(doc.data().uid));

      return db.doc(`cars/${data.carDoc.docId}`).update({
        drivers,
      });
    } else {
      throw new functions.https.HttpsError('not-found', 'error');
    }
  }
);

// export const deleteUserRecord = functions.auth.user().onDelete(user => {
//   return db.doc(`users/${user.uid}`).delete();
// });
