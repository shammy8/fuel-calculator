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

// export const deleteUserRecord = functions.auth.user().onDelete(user => {
//   return db.doc(`users/${user.uid}`).delete();
// });
