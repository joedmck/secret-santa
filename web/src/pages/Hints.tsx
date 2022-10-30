import { FC } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Loading, Error } from '@/pages';
import { TopBar, HintCard } from '@/components';
import { useUser, useAuthenticatedUser, useHints } from '@/hooks';
import { SecretSantaUser } from '@/types';

interface HintsParams {
  username: string;
}

const Hints: FC = () => {
  const { username } = useParams<keyof HintsParams>() as HintsParams;
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    loading: userLoading,
    error: userError,
    data: userDetails,
    documentReference: userDocumentReference,
  } = useUser(username);

  const {
    loading: authUserLoading,
    error: { hasError: authUserHasError },
    data: authUserDetails,
    documentReference: authUserDocumentReference,
  } = useAuthenticatedUser();

  const {
    loading: hintsLoading,
    error: hintsError,
    data: hints,
  } = useHints(authUserDocumentReference, userDocumentReference);

  if (userLoading || authUserLoading || hintsLoading) return <Loading />;
  if (userError || authUserHasError || hintsError) return <Error />;

  return (
    <section className={`flex items-center flex-col space-y-5 m-5 w-11/12`}>
      <TopBar
        leftButton={{
          text: 'Back to Home',
          onClick: () => {
            navigate('/');
          },
        }}
      />
      <h1 className={`text-3xl mt-5`}>Hints for {userDetails?.name}</h1>
      {authUserDetails?.username === username && (
        <p className={`italic text-center`}>
          As this is your own hint list you will only see hints you have created
          for yourself.
        </p>
      )}
      <button
        className={`px-2 py-2 rounded border hover:bg-gray-100 dark:hover:bg-neutral-700`}
        onClick={() => navigate(`${pathname}/add`)}
      >
        Add a Hint
      </button>
      <hr className={`border w-full`} />
      {hints?.map(({ id, title, notes, price, url, author }) => (
        <HintCard
          key={id}
          {...{
            title,
            notes,
            price,
            link: url,
            authorName: (author as SecretSantaUser).name,
          }}
        />
      ))}
      {hints?.length == 0 && (
        <p className={`text-center`}>Nothing to show yet.</p>
      )}
    </section>
  );
};

export default Hints;
