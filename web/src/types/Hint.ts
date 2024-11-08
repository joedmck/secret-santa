import { DocumentReference } from 'firebase/firestore';
import { SecretSantaUser } from './User';

export interface HintDocument {
  id: string;
  title: string;
  notes: string;
  price: number;
  url: string;
  giftee: DocumentReference;
  author: DocumentReference;
  timestamp: number;
}

export type Hint = Omit<HintDocument, 'giftee|author'> & {
  giftee: SecretSantaUser;
  author: SecretSantaUser;
};
