import { collection, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

import { SecretSantaUser } from '@/types';
import { firebaseFirestore } from '@/firebase-instance';

export interface UseUsersResponse {
  loading: boolean;
  error: Error | undefined;
  data: SecretSantaUser[] | null;
}
export type UseUsersHook = () => UseUsersResponse;

const useUsers: UseUsersHook = () => {
  const [usersQuerySnapshot, usersLoading, usersError] = useCollection(
    query(collection(firebaseFirestore, 'users'))
  );
  const users = usersQuerySnapshot?.docs.map(doc => {
    const data = doc.data() as SecretSantaUser;

    return {
      uid: doc.id,
      name: data.name,
      username: data.username,
    };
  }) as SecretSantaUser[];

  return {
    loading: usersLoading,
    error: usersError,
    data: users,
  };
};

export default useUsers;
