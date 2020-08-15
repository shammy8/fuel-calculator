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
  async (
    data: {
      email: string;
      carDoc: { docId: string; drivers: string[] };
    },
    context
  ) => {
    const carDocRef = db.doc(`cars/${data.carDoc.docId}`);
    const carDocSnap = await carDocRef.get();

    // if can't find the document throw an error
    if (carDocSnap.data() === null || carDocSnap.data() === undefined) {
      throw new functions.https.HttpsError(
        'not-found',
        'Car document not found'
      );
    }

    // if it isn't the owner sending this request throw an error
    if (carDocSnap.data()!.owner !== context.auth?.uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only owners are allowed to add drivers'
      );
    }

    const drivers = [...data.carDoc.drivers];

    // find all the documents under users collection with the email
    const user = await db
      .collection(`users`)
      .where('email', '==', data.email)
      .get();

    if (user.size === 1) {
      // if 1 document is returned then add the uid of that doc into drivers array and update cardoc
      user.forEach((doc) => drivers.push(doc.data().uid));

      return carDocRef.update({
        drivers,
      });
    } else if (user.size === 0) {
      // if 0 document is returned need to sent a email or something todo
      throw new functions.https.HttpsError('not-found', "Owner doesn't exist");
    } else {
      // if 3 docs are returned then there is an error in the database
      throw new functions.https.HttpsError(
        'unknown',
        'More than one account associated with this account, contact developer.'
      );
    }
  }
);

// export const deleteUserRecord = functions.auth.user().onDelete(user => {
//   return db.doc(`users/${user.uid}`).delete();
// });
