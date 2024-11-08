import { DocumentReference } from 'firebase/firestore';

export interface SecretSantaUser {
  uid: string;
  name: string;
  username: string;
}

export interface UserPrivateAttributesDoc {
  mustChangePassword: boolean;
  user: DocumentReference;
}
