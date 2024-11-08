import {firestore, auth} from "firebase-admin";
import {DocumentReference} from "firebase-admin/firestore";
import {CallableRequest} from "firebase-functions/https";
import {verify} from "argon2";

const db = firestore();

interface RequestBody {
  username: string;
  password: string;
}

interface User {
  username: string;
  name: string;
  secrets: DocumentReference;
  mustChangePassword: boolean;
}

interface UserSecretsDocument {
  passwordHash: string;
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

const authenticationHandler = async (request: CallableRequest<RequestBody>) => {
  const {data} = request;

  const {username, password} = data;

  const usernameLower = username.toLowerCase();
  const usersCollection = db.collection("users");
  const query = await usersCollection
      .where("username", "==", usernameLower)
      .get();

  if (query.empty === true) {
    console.error(`User not found ${usernameLower}.`);
    return response(false, null, "User not found.");
  }
  if (query.size > 1) {
    console.error(`More than one user found with username ${usernameLower}.`);
    return response(false, null, "Internal server error.");
  }
  const user = query.docs[0];
  const userData = user.data() as User;

  const secretsSnapshot = await userData.secrets.get();
  const secrets = secretsSnapshot.data() as UserSecretsDocument;

  const valid = await verify(secrets.passwordHash, password);

  if (valid === true) {
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
