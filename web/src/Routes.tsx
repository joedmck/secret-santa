import { FC } from 'react';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Home,
  Signin,
  Loading,
  Hints,
  AddHint,
  Error,
  ChangePassword,
} from '@/pages';
import { firebaseAuth } from '@/firebase-instance';
import { useUserPrivateAttributes } from '@/hooks';

interface RedirectToLoginProps {
  loggedIn: boolean;
  mustChangePassword: boolean;
}

const RedirectToLogin: FC<RedirectToLoginProps> = ({
  loggedIn,
  mustChangePassword,
}) => {
  const { pathname } = useLocation();

  if (!loggedIn && pathname !== '/login')
    return <Navigate to='/login' replace />;

  if (loggedIn && mustChangePassword == true && pathname !== '/change-password')
    return <Navigate to='/change-password' replace />;
  return <></>;
};

const Routes: FC = () => {
  const [authState, authStateLoading, authStateError] =
    useAuthState(firebaseAuth);

  const {
    loading: userPrivateAttributesLoading,
    error: userPrivateAttributesError,
    privateAttributes: userPrivateAttributes,
  } = useUserPrivateAttributes();

  if (authStateLoading || userPrivateAttributesLoading) return <Loading />;
  if (authStateError || userPrivateAttributesError.hasError) return <Error />;

  return (
    <Router>
      <RedirectToLogin
        loggedIn={!!authState}
        mustChangePassword={
          !!(userPrivateAttributes?.mustChangePassword ?? false)
        }
      />
      <Switch>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Signin />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/hints/:username' element={<Hints />} />
        <Route path='/hints/:username/add' element={<AddHint />} />
        <Route path='*' element={<Error />} />
      </Switch>
    </Router>
  );
};

export default Routes;
