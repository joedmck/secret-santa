import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken } from 'firebase/auth';

import { firebaseFunctions, firebaseAuth } from '@/firebase-instance';
import { Loading } from '@/pages';

type Passphrases = [string, string, string];
interface AuthenticateRequestBody {
  username: string;
  passphrases: Passphrases;
}
interface AuthenticateResponse {
  authenticated: boolean;
  token: string | null;
  status: string;
}
interface PassphraseFieldProps {
  number: string;
}

const PassphraseField: FC<PassphraseFieldProps> = ({ number }) => {
  return (
    <div>
      <label htmlFor={`passphrase-${number}`}>Passphrase {number}</label>
      <input
        type='text'
        name={`passphrase-${number}`}
        className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
        id='password'
        placeholder={`Passphrase ${number}`}
      />
    </div>
  );
};

const authenticate = httpsCallable<
  AuthenticateRequestBody,
  AuthenticateResponse
>(firebaseFunctions, 'authenticate');

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
    const passphrase1 = getFormValue(elements, 'passphrase-1');
    const passphrase2 = getFormValue(elements, 'passphrase-2');
    const passphrase3 = getFormValue(elements, 'passphrase-3');

    try {
      const response = await authenticate({
        username,
        passphrases: [passphrase1, passphrase2, passphrase3],
      });

      if (response.data.authenticated !== true)
        throw new Error('Authentication Faliure');

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
      <h1 className={`text-3xl pb-10`}>Secret Santa</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username</label>
          <input
            name='username'
            type='username'
            className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
            id='username'
            placeholder='Your Username'
          />
        </div>
        <PassphraseField number='1' />
        <PassphraseField number='2' />
        <PassphraseField number='3' />

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
