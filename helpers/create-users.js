const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');
const randomWords = require('random-words');

const usersToCreate = require('./users-to-create.json');

const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore(firebaseAdmin);

const usersCol = db.collection('users');
const userSecretsCol = db.collection('user-secrets');
const assignmentsCol = db.collection('assignments');

const createUser = async ({ name, username }, index) => {
  const accessWords = randomWords({ exactly: 3, maxLength: 8 });
  const secretsDocRef = await userSecretsCol.add({
    accessWords,
  });
  const userDocRef = await usersCol.add({
    username,
    name,
    secrets: secretsDocRef,
    bought: false,
  });
  usersToCreate[index].uid = userDocRef.id;
  console.log(`User ${username} successfully created.`);
};
const createAssignment = async ({ uid, username, giftee }) => {
  const userDoc = await usersCol.doc(uid).get();
  const gifteeUid = usersToCreate.find(
    ({ username }) => username == giftee
  ).uid;
  const gifteeDoc = await usersCol.doc(gifteeUid).get();
  await assignmentsCol.add({
    gifter: userDoc.ref,
    giftee: gifteeDoc.ref,
  });
  console.log(`Assignment created for ${username} with giftee ${giftee}.`);
};

(async () => {
  const userCreationPromises = usersToCreate.map((user, index) =>
    createUser(user, index)
  );
  await Promise.all(userCreationPromises);

  const assignmentPromises = usersToCreate.map(user => createAssignment(user));
  await Promise.all(assignmentPromises);
})();
