import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';

import { Loading, Error } from '@/pages';
import { TopBar } from '@/components';
import { useAuthenticatedUser, useUsers } from '@/hooks';
import { firebaseAuth } from '@/firebase-instance';

const Home: FC = () => {
  const navigate = useNavigate();
  const {
    loading: userLoading,
    error: userError,
    data: userDetails,
  } = useAuthenticatedUser();
  const { loading: usersLoading, error: usersError, data: users } = useUsers();

  if (userLoading || usersLoading) return <Loading />;
  if (userError.hasError || usersError) return <Error />;

  return (
    <section className={`flex items-center flex-col space-y-3 my-5 w-11/12`}>
      <TopBar
        leftButton={{
          text: 'Change Password',
          onClick: () => {
            navigate('/change-password');
          },
        }}
        rightButton={{
          text: 'Sign Out',
          onClick: () => {
            signOut(firebaseAuth);
            navigate('/login');
          },
        }}
      />
      <h1 className={`text-3xl text-center`}>Welcome {userDetails?.name}</h1>
      <p className={`text-lg pb-5`}>
        Your giftee is {userDetails?.giftee?.name}
      </p>
      <hr className={`border w-full`} />
      <p className={`pt-5 text-center`}>
        Click a user to add hints for their secret santa or see hints for your
        giftee.
      </p>
      {users?.map(({ username, name }) => (
        <button
          className={`text-left flex w-full border rounded-lg p-3 shadow-md hover:bg-gray-100 dark:hover:bg-neutral-700`}
          key={username}
          onClick={() => navigate(`/hints/${username}`)}
        >
          {name}
        </button>
      ))}
    </section>
  );
};

export default Home;
