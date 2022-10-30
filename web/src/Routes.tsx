import { FC } from 'react';
import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';

import { Home, Signin, Loading, Hints, AddHint, Error } from '@/pages';
import { firebaseAuth } from '@/firebase-instance';

interface RedirectToLoginProps {
  loggedIn: boolean;
}

const RedirectToLogin: FC<RedirectToLoginProps> = ({ loggedIn }) => {
  const { pathname } = useLocation();

  if (!loggedIn && pathname !== '/login')
    return <Navigate to='/login' replace />;
  return <></>;
};

const Routes: FC = () => {
  const [authState, authStateLoading, authStateError] =
    useAuthState(firebaseAuth);

  if (authStateLoading) return <Loading />;
  if (authStateError) return <Error />;

  return (
    <Router>
      <RedirectToLogin loggedIn={!!authState} />
      <Switch>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Signin />} />
        <Route path='/hints/:username' element={<Hints />} />
        <Route path='/hints/:username/add' element={<AddHint />} />
        <Route path='*' element={<Error />} />
      </Switch>
    </Router>
  );
};

export default Routes;
