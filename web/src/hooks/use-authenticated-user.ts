import { User } from 'firebase/auth';
import {
  collection,
  doc,
  DocumentReference,
  query,
  where,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { AssignmentDoc, SecretSantaUser } from '@/types';
import { firebaseAuth, firebaseFirestore } from '@/firebase-instance';

export interface UseAuthenticatedUserResponse {
  loading: boolean;
  error: {
    hasError: boolean;
    authState: Error | undefined;
    authDocument: Error | undefined;
    gifteeDocument: Error | undefined;
  };
  data: {
    uid: string;
    name: string;
    username: string;
    giftee: SecretSantaUser | null;
  } | null;
  documentReference: DocumentReference | null;
}
export type UseAuthenticatedUser = () => UseAuthenticatedUserResponse;

const useAuthenticatedUser: UseAuthenticatedUser = () => {
  const [authState, authStateLoading, authStateError] =
    useAuthState(firebaseAuth);
  const authUserDocRef =
    !authState || authStateLoading || authStateError
      ? null
      : doc(firebaseFirestore, 'users', (authState as User)?.uid);
  const [authUserDoc, authUserLoading, authUserError] =
    useDocument(authUserDocRef);
  const userData = authUserDoc ? (authUserDoc.data() as SecretSantaUser) : null;

  const [assignmentQuerySnapshot, assginmentsLoading, assignmentsError] =
    useCollection(
      authState
        ? query(
            collection(firebaseFirestore, 'assignments'),
            where('gifter', '==', authUserDocRef)
          )
        : null
    );
  const assignmentDocRef =
    !authState || assginmentsLoading || assignmentsError
      ? null
      : (assignmentQuerySnapshot?.docs[0].data() as AssignmentDoc).giftee;
  const [gifteeDoc, gifteeLoading, gifteeError] = useDocument(assignmentDocRef);
  const giftee = gifteeDoc ? (gifteeDoc.data() as SecretSantaUser) : null;

  return {
    loading: authStateLoading || authUserLoading || gifteeLoading,
    error: {
      hasError: !!(authStateError || authUserError || gifteeError),
      authState: authStateError,
      authDocument: authUserError,
      gifteeDocument: gifteeError,
    },
    data: userData
      ? {
          uid: (authState as User)?.uid,
          name: userData.name,
          username: userData.username,
          giftee: giftee
            ? {
                uid: gifteeDoc!.id,
                name: giftee.name,
                username: giftee.username,
              }
            : null,
        }
      : null,
    documentReference: authUserDocRef,
  };
};

export default useAuthenticatedUser;
