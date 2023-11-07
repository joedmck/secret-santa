import {config, region} from "firebase-functions";
import {initializeApp} from "firebase-admin/app";

initializeApp(config().firebase);

import authenticationHandler from "./authenticate";
export const authenticate = region("europe-west3")
    .runWith({
      enforceAppCheck: true,
    })
    .https.onCall(authenticationHandler);
