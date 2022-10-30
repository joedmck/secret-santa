import { DocumentReference } from 'firebase/firestore';

export interface AssignmentDoc {
  gifter: DocumentReference;
  giftee: DocumentReference;
}
