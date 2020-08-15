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
      // if 1 document is returned then add the uid of that doc into drivers array and update cardoc
      user.forEach((doc) => drivers.push(doc.data().uid));

      return carDocRef.update({
        drivers,
      });
    } else if (user.size === 0) {
      // if 0 document is returned need to sent a email
      try {
        await db.collection('mail').add({
          to: data.email,
          template: {
            name: 'addFuel',
            data: {
              displayName: context.auth?.token.email,
            },
          },
        });
        return 'Email sent';
      } catch (err) {
        return err;
      }
    } else {
      // if more than 1 docs are returned then there is an error in the database
      throw new functions.https.HttpsError(
        'unknown',
        'More than one email associated with this account, contact developer.'
      );
    }
  }
);
