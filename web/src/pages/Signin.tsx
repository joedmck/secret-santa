import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signInWithCustomToken } from 'firebase/auth';

import { firebaseAuth } from '@/firebase-instance';
import { Loading } from '@/pages';
import { authenticate } from '@/services';

const getFormValue = (
  elements: HTMLFormControlsCollection,
  name: string
): string => (elements.namedItem(name) as HTMLInputElement)?.value;

const Signin: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const { elements } = e.currentTarget;

    const username = getFormValue(elements, 'username');
    const password = getFormValue(elements, 'password');

    try {
      const response = await authenticate({
        username,
        password,
      });

      if (response.data.authenticated !== true)
        throw Error('Authentication Faliure');

      const token = response.data.token as string;
      await signInWithCustomToken(firebaseAuth, token);

      setLoading(false);
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  if (loading) return <Loading />;

  return (
    <section
      className={`h-screen v-screen flex justify-center items-center flex-col`}
    >
      <h1 className={`text-3xl mb-10`}>Secret Santa</h1>
      <h2 className={`text-2xl mb-10`}>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            name='username'
            type='username'
            className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
            id='username'
            placeholder='Your username'
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            name='password'
            type='password'
            className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
            id='password'
            placeholder='Your password'
          />
        </div>

        <div className='flex justify-center items-center mt-6'>
          <button
            className={`py-2 px-4 text-sm rounded border focus:bg-light focus:text-dark`}
          >
            Login
          </button>
        </div>
      </form>
    </section>
  );
};

export default Signin;
