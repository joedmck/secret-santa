import {
  collection,
  doc,
  DocumentReference,
  query,
  where,
} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { SecretSantaUser } from '@/types';
import { firebaseFirestore } from '@/firebase-instance';

export interface UseUserResponse {
  loading: boolean;
  error: Error | undefined;
  data: SecretSantaUser | null;
  documentReference: DocumentReference | null;
}
export type UseUserHook = (username: string) => UseUserResponse;

const useUser: UseUserHook = username => {
  const [userQuerySnapshot, userLoading, userError] = useCollection(
    query(
      collection(firebaseFirestore, 'users'),
      where('username', '==', username)
    )
  );
  const user = (userQuerySnapshot?.docs[0].data() as SecretSantaUser) ?? null;
  const userData = user
    ? {
        id: userQuerySnapshot?.docs[0].id,
        ...user,
      }
    : null;
  const document = user
    ? doc(firebaseFirestore, 'users', userQuerySnapshot!.docs[0].id)
    : null;

  return {
    loading: userLoading,
    error: userError,
    data: userData,
    documentReference: document,
  };
};

export default useUser;
