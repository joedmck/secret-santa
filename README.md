# Secret Santa Helper App

Simple app for managing a secret santa scheme between a group of people.

Allows for a list of 'hints' be managed for each user. The user can submit their own hints, and can only see hints they've submitted themselves. Others can submit hints and see the hints others have submitted for a given user.

Uses Firebase Firestore, Authentication, Hosting, AppCheck. Frontend written in React with TypeScript, with TailwindCSS.

Authentication handled by a custom authentication handler hosted in Cloud Functions - allows for username/password based authentication (rather than email, phone or OAuth).

Files needed pre-deployment:

- web/google-services.json
- web/appcheck-config.json
- helpers/service-account.json
- helpers/users-to-create.json
