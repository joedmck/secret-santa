import { FC, FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { addDoc, collection } from 'firebase/firestore';

import { TopBar } from '@/components';
import { Loading, Error } from '@/pages';
import { useAuthenticatedUser, useUser } from '@/hooks';
import { getFormValue } from '@/utils';
import { firebaseFirestore } from '@/firebase-instance';

type AddHintParams = {
  username: string;
};

const AddHint: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { username } = useParams<AddHintParams>();

  const {
    loading: authUserLoading,
    error: { hasError: authUserError },
    documentReference: authUserDocumentReference,
  } = useAuthenticatedUser();
  const {
    loading: userLoading,
    error: userError,
    data: user,
    documentReference: userDocumentReference,
  } = useUser(username as string);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { elements } = e.currentTarget;

    const title = getFormValue(elements, 'hint-title');
    const notes = getFormValue(elements, 'hint-notes');
    const price = getFormValue(elements, 'hint-price');
    const url = getFormValue(elements, 'hint-url');

    try {
      const hintsCollectionReference = collection(firebaseFirestore, 'hints');
      await addDoc(hintsCollectionReference, {
        title: title,
        notes: notes,
        price: price == '' ? 0 : Number.parseFloat(price),
        url: url,
        giftee: userDocumentReference,
        author: authUserDocumentReference,
      });
      setLoading(false);
      navigate(`/hints/${user!.username}`, { replace: true });
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  if (userLoading || authUserLoading || loading) return <Loading />;
  if (userError || authUserError) return <Error />;

  return (
    <section className={`flex items-center flex-col space-y-5 m-5 w-11/12`}>
      <TopBar
        leftButton={{
          text: 'Cancel',
          onClick: () => {
            navigate(`/hints/${username}`);
          },
        }}
      />
      <h1 className={`text-3xl text-center`}>Add Hint for {user?.name}</h1>
      <form className={`w-full`} onSubmit={handleSubmit}>
        <label htmlFor={`hint-title`}>Title</label>
        <input
          type={`text`}
          name={`hint-title`}
          className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
          id='hint-title'
          placeholder={`Hint Title`}
          required
        />
        <label htmlFor={`hint-notes`}>Notes</label>
        <textarea
          name={`hint-notes`}
          className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
          id='hint-notes'
          placeholder={`Hint Notes`}
          rows={4}
        />
        <label htmlFor={`hint-notes`}>Price</label>
        <input
          type='number'
          name={`hint-price`}
          className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
          id='hint-price'
          placeholder={`Hint Price`}
          step='any'
        />
        <label htmlFor={`hint-url`}>URL</label>
        <input
          type='url'
          name={`hint-url`}
          className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
          id='hint-url'
          placeholder={`Hint URL`}
          required={false}
        />
        <div className={`flex flex-row justify-center mt-5`}>
          <button
            className={`px-10 py-2 rounded border hover:bg-gray-100 dark:hover:bg-neutral-700`}
            type='submit'
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddHint;
