import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

import firebaseConfig from '@/google-services.json';
import appcheckConfig from '@/appcheck-config.json';

const app = initializeApp(firebaseConfig as FirebaseOptions);

export const firebaseAppCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(appcheckConfig.siteKey),
  isTokenAutoRefreshEnabled: true,
});

export const firebaseAuth = getAuth(app);
export const firebaseFunctions = getFunctions(app, 'europe-west3');
export const firebaseFirestore = getFirestore(app);
