import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

const db = admin.firestore();

// when a new user first signs up create a doc in users collection
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

// when an anonymous user links to a email, update the user doc in users collection
export const linkAnonymous = functions.https.onCall(
  async (data: { uid: string; displayName: string; email: string }) => {
    const userRef = db.doc(`users/${data.uid}`);

    return userRef.update({
      name: data.displayName,
      email: data.email,
    });
  }
);

// when a user deletes his account, delete his associated doc in users collection
export const deleteUserRecord = functions.auth.user().onDelete((user) => {
  return db.doc(`users/${user.uid}`).delete();
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
      // if 1 document is returned
      if (drivers.includes(user.docs[0].data().uid)) {
        // if uid is already inside the drivers array then tell the front end
        return `Driver - ${
          user.docs[0].data().name
        } - already exists for this car.`;
      }

      // if uid is not already inside the drivers array then add it and update the carDoc
      drivers.push(user.docs[0].data().uid);
      await carDocRef.update({
        drivers,
      });

      return `Driver - ${user.docs[0].data().name} - added!`;
    } else if (user.size === 0) {
      // if 0 document is returned tell user to email the driver
      return 'Driver not sign up';
    } else {
      // if more than 1 docs are returned then there is an error in the database
      throw new functions.https.HttpsError(
        'unknown',
        'More than one email associated with this account, contact developer.'
      );
    }
  }
);
