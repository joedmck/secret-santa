import { httpsCallable } from 'firebase/functions';
import { firebaseFunctions } from '@/firebase-instance';

export interface AuthenticateRequestBody {
  username: string;
  password: string;
}
export interface AuthenticateResponse {
  authenticated: boolean;
  token: string | null;
  status: string;
}

export interface ChangePasswordRequestBody {
  username: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const authenticate = httpsCallable<
  AuthenticateRequestBody,
  AuthenticateResponse
>(firebaseFunctions, 'authenticate');

export const changePassword = httpsCallable<
  ChangePasswordRequestBody,
  ChangePasswordResponse
>(firebaseFunctions, 'changePassword');
