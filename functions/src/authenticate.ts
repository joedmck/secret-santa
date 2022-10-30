import {https} from "firebase-functions";
import {firestore, auth} from "firebase-admin";
import {DocumentReference} from "firebase-admin/firestore";

const db = firestore();

interface RequestBody {
  username: string;
  passphrases: AccessWords;
}

type AccessWords = [string, string, string];

interface User {
  username: string;
  name: string;
  secrets: DocumentReference;
}

interface UserSecretsDocument {
  accessWords: AccessWords;
}

const response = (
    authenticated: boolean,
    token: string | null,
    status: string
) => ({
  authenticated,
  token,
  status,
});

const validateAccessWords = (
    submitted: AccessWords,
    stored: AccessWords
): boolean => {
  return (
    submitted.length === stored.length &&
    submitted.every((val, index) => val === stored[index])
  );
};

const authenticationHandler = async (
    data: RequestBody,
    context: https.CallableContext
) => {
  const username = data.username.toLowerCase();
  const accessWords = data.passphrases
      .map((phrase: string) => phrase.toLowerCase())
      .sort() as AccessWords;

  const usersCollection = db.collection("users");
  const query = await usersCollection.where("username", "==", username).get();

  if (query.empty === true) {
    console.error(`User not found ${username}.`);
    return response(false, null, "User not found.");
  }
  if (query.size > 1) {
    console.error(`More than one user found with username ${username}.`);
    return response(false, null, "Internal server error.");
  }
  const user = query.docs[0];
  const userData = query.docs[0].data() as User;

  const referenceAccessWordsSnapshot = await userData.secrets.get();
  const referenceAccessWordsUnsorted =
    await (referenceAccessWordsSnapshot.data() as UserSecretsDocument);
  const referenceAccessWords = referenceAccessWordsUnsorted.accessWords.sort();

  if (validateAccessWords(accessWords, referenceAccessWords) == true) {
    const token = await auth().createCustomToken(user.id, {
      name: userData.name,
      username: userData.username,
    });
    return response(true, token, "Successfully authenticated.");
  }

  // else
  console.error(`Invalid credentials for ${username}.`);
  return response(false, null, "Invalid credentials.");
};

export default authenticationHandler;
