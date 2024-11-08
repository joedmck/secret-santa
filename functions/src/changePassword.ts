import {auth, firestore} from "firebase-admin";
import {DocumentReference} from "firebase-admin/firestore";
import {CallableRequest} from "firebase-functions/https";
import {verify, hash} from "argon2";

const db = firestore();

interface RequestBody {
  username: string;
  currentPassword: string;
  newPassword: string;
}

interface User {
  username: string;
  name: string;
  secrets: DocumentReference;
}

interface UserPrivateAttributes {
  mustChangePassword: boolean;
  user: DocumentReference;
}

interface UserSecretsDocument {
  passwordHash: string;
}

const response = (success: boolean, message: string) => ({
  success,
  message,
});

const changePasswordHandler = async (request: CallableRequest<RequestBody>) => {
  const {data} = request;

  const {username, currentPassword, newPassword} = data;

  const usernameLower = username.toLowerCase();
  const usersCollection = db.collection("users");
  const query = await usersCollection
      .where("username", "==", usernameLower)
      .get();

  if (query.empty === true) {
    console.error(`User not found ${usernameLower}.`);
    return response(false, "User not found.");
  }
  if (query.size > 1) {
    console.error(`More than one user found with username ${usernameLower}.`);
    return response(false, "Internal server error.");
  }
  const user = query.docs[0];
  const userData = user.data() as User;

  const secretsSnapshot = await userData.secrets.get();
  const secrets = secretsSnapshot.data() as UserSecretsDocument;

  const valid = await verify(secrets.passwordHash, currentPassword);

  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!regex.test(newPassword)) {
    return response(
        true,
        "Password must contain at least 1 upercase letter, 1 lowercase letter and 1 number."
    );
  }

  if (newPassword === currentPassword) {
    return response(
        true,
        "Your new password must not be the same as your current password."
    );
  }

  if (valid === true) {
    const newPasswordHash = await hash(newPassword);
    await userData.secrets.update({
      passwordHash: newPasswordHash,
    });
    await auth().revokeRefreshTokens(user.id);

    const usersPrivateCollection = db.collection("user-private");
    const userPrivateQuery = await usersPrivateCollection
        .where("user", "==", user.ref)
        .get();

    if (userPrivateQuery.empty === true) {
      console.error(`Private attributes not found for user ${usernameLower}.`);
      return response(false, "Private attributes not found for user.");
    }
    if (userPrivateQuery.size > 1) {
      console.error(
          `More than one user private attributes found for username ${usernameLower}.`
      );
      return response(
          false,
          "More than one user private attributes found for user."
      );
    }
    const userPrivateAttributes = userPrivateQuery.docs[0];
    const userPrivateAttributesData =
      userPrivateAttributes.data() as UserPrivateAttributes;

    await userPrivateAttributes.ref.update({
      mustChangePassword: false,
      user: userPrivateAttributesData.user,
    });

    return response(
        true,
        "Password successfully updated, you must now log in again."
    );
  }
  return response(false, "Invalid credentials.");
};

export default changePasswordHandler;
