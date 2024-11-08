import { FC, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signOut } from 'firebase/auth';

import { firebaseAuth } from '@/firebase-instance';
import { Error, Loading } from '@/pages';
import { changePassword } from '@/services';
import { useAuthenticatedUser } from '@/hooks';
import { TopBar } from '@/components';
import useUserPrivateAttributes from '@/hooks/use-user-private-attributes';

const getFormValue = (
  elements: HTMLFormControlsCollection,
  name: string
): string => (elements.namedItem(name) as HTMLInputElement)?.value;

const ChangePassword: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const {
    loading: userPrivateAttributesLoading,
    error: userPrivateAttributesError,
    privateAttributes: userPrivateAttributes,
  } = useUserPrivateAttributes();
  const {
    loading: userLoading,
    error: userError,
    data: userDetails,
  } = useAuthenticatedUser();
  const navigate = useNavigate();

  console.log(userPrivateAttributes);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setValidationError(null);

    const { elements } = e.currentTarget;

    const currentPassword = getFormValue(elements, 'currentPassword');
    const newPassword = getFormValue(elements, 'newPassword');
    const confirmNewPassword = getFormValue(elements, 'confirmNewPassword');

    if (newPassword !== confirmNewPassword) {
      return setValidationError('Passwords do not match.');
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(newPassword)) {
      return setValidationError(
        'Password must contain at least 1 upercase letter, 1 lowercase letter and 1 number.'
      );
    }

    if (newPassword === currentPassword) {
      return setValidationError(
        'Your new password must not be the same as your current password.'
      );
    }

    setLoading(true);

    try {
      const response = await changePassword({
        username: userDetails!.username,
        currentPassword,
        newPassword,
      });

      if (response.data.success !== true) throw Error('Authentication Faliure');

      setLoading(false);

      signOut(firebaseAuth);
      navigate('/', { replace: true });
    } catch (e) {
      setLoading(false);
      console.error(e);
    }
  };

  if (loading || userLoading || userPrivateAttributesLoading)
    return <Loading />;
  if (userError.hasError || userPrivateAttributesError.hasError)
    return <Error />;

  return (
    <section
      className={`h-screen flex items-center space-y-3 pt-5 w-11/12 flex-col`}
    >
      <TopBar
        leftButton={
          userPrivateAttributes?.mustChangePassword === true
            ? undefined
            : {
                text: 'Back to Home',
                onClick: () => {
                  navigate('/');
                },
              }
        }
        rightButton={{
          text: 'Sign Out',
          onClick: () => {
            signOut(firebaseAuth);
            navigate('/login');
          },
        }}
      />
      <div
        className={`h-full w-full flex px-10 justify-center items-center flex-col`}
      >
        <h1 className={`text-3xl mb-10`}>Secret Santa</h1>
        <h2 className={`text-2xl mb-10 text-center`}>
          {userPrivateAttributes?.mustChangePassword === true
            ? 'You Must Change Your Password'
            : 'Change Your Password'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='currentPassword'>Current Password</label>
            <input
              name='currentPassword'
              type='password'
              className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
              id='currentPassword'
              placeholder='Your current password'
            />
          </div>
          <div>
            <label htmlFor='password'>New Password</label>
            <input
              name='newPassword'
              type='password'
              className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
              id='newPassword'
              placeholder='Your new password'
            />
          </div>
          <div>
            <label htmlFor='password'>Confirm New Password</label>
            <input
              name='confirmNewPassword'
              type='password'
              className={`w-full p-2 border rounded-md outline-none text-sm mb-4`}
              id='confirmNewPassword'
              placeholder='Confirm your new password'
            />
          </div>

          {validationError && (
            <p className={`text-rose-600 text-center max-w-xs	`}>
              {validationError}
            </p>
          )}

          <div className='flex justify-center items-center mt-6'>
            <button
              className={`py-2 px-4 text-sm rounded border focus:bg-light focus:text-dark`}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ChangePassword;
