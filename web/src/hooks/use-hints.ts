import {
  collection,
  DocumentReference,
  query,
  where,
} from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { firebaseFirestore } from '@/firebase-instance';
import { Hint, HintDocument, SecretSantaUser } from '@/types';
import { useUsers } from '@/hooks';

export interface UseHintsResponse {
  loading: boolean;
  error: Error | undefined;
  data: Hint[] | null;
}
export type UseHintsHook = (
  authUserDocRef: DocumentReference | null,
  userDocRef: DocumentReference | null
) => UseHintsResponse;

type UserMapData = Omit<SecretSantaUser, 'uid'>;
interface UserMap {
  [key: string]: UserMapData;
}

const useHints: UseHintsHook = (authUserDocRef, userDocRef) => {
  const queryConstraints =
    authUserDocRef && userDocRef
      ? authUserDocRef.id == userDocRef.id
        ? [
            where('giftee', '==', userDocRef),
            where('author', '==', authUserDocRef),
          ]
        : [where('giftee', '==', userDocRef)]
      : null;

  const hintQuery = queryConstraints
    ? query(collection(firebaseFirestore, 'hints'), ...queryConstraints)
    : null;

  const [querySnapshot, queryLoading, queryError] = useCollection(hintQuery);
  const { data: users } = useUsers();

  const usersDetails = users?.reduce<UserMap>(
    (acc, { uid, ...data }: SecretSantaUser) => {
      acc[uid] = data;
      return acc;
    },
    {}
  );

  const hints =
    querySnapshot && usersDetails
      ? querySnapshot?.docs.map(doc => {
          const docData = doc.data();

          const gifteeDoc = usersDetails[docData.giftee.id];
          const authorDoc = usersDetails[docData.author.id];

          return {
            id: doc.id,
            ...docData,
            giftee: gifteeDoc,
            author: authorDoc,
          } as Hint;
        })
      : null;

  return {
    loading: queryLoading,
    error: queryError,
    data: hints,
  };
};

export default useHints;
