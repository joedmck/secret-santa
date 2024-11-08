import { User } from 'firebase/auth';
import { collection, doc, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { UserPrivateAttributesDoc } from '@/types';
import { firebaseAuth, firebaseFirestore } from '@/firebase-instance';

export interface UseUserPrivateAttributesResponse {
  loading: boolean;
  error: {
    hasError: boolean;
    authState: Error | undefined;
    userPrivateAttributes: Error | undefined;
  };
  privateAttributes: UserPrivateAttributesDoc | null;
}
export type UseUserPrivateAttributes = () => UseUserPrivateAttributesResponse;

const useUserPrivateAttributes: UseUserPrivateAttributes = () => {
  const [authState, authStateLoading, authStateError] =
    useAuthState(firebaseAuth);
  const authUserDocRef =
    !authState || authStateLoading || authStateError
      ? null
      : doc(firebaseFirestore, 'users', (authState as User)?.uid);

  const [
    userPrivateAttributesQuerySnapshot,
    userPrivateAttributesLoading,
    userPrivateAttributesError,
  ] = useCollection(
    authState
      ? query(
          collection(firebaseFirestore, 'user-private'),
          where('user', '==', authUserDocRef)
        )
      : null
  );
  const userPrivateAttributesDoc =
    !authState || userPrivateAttributesLoading || userPrivateAttributesError
      ? null
      : (userPrivateAttributesQuerySnapshot?.docs[0].data() as UserPrivateAttributesDoc);

  return {
    loading: authStateLoading || userPrivateAttributesLoading,
    error: {
      hasError: !!(authStateError || userPrivateAttributesError),
      authState: authStateError,
      userPrivateAttributes: userPrivateAttributesError,
    },
    privateAttributes: userPrivateAttributesDoc,
  };
};

export default useUserPrivateAttributes;
