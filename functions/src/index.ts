import {onCall} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";

initializeApp();

import authenticationHandler from "./authenticate";
export const authenticate = onCall(
    {region: "europe-west3"},
    authenticationHandler
);

import changePasswordHandler from "./changePassword";
export const changePassword = onCall(
    {region: "europe-west3"},
    changePasswordHandler
);
