# Secret Santa Helper App

Simple app for managing a secret santa scheme between a group of people.

Allows for a list of 'hints' be managed for each user. The user can submit their own hints, and can only see hints they've submitted themselves. Others can submit hints and see the hints others have submitted for a given user.

Uses Firebase Firestore, Authentication, Hosting, AppCheck. Frontend written in React with TypeScript, with TailwindCSS.

Authentication handled by a custom authentication handler hosted in Cloud Functions - allows for username based authentication (rather than email or OAuth). Users are provided with three words as their secret for authentication - don't ask why, this was a weird decision I made early on that I thought would make things easier for users since security isn't exactly paramount, but now don't think is actually a good idea and haven't changed yet.

**Warning:** Not an amazing bit of code - was thrown together in a few hours. It seems to work fine, but the code is very hacky in places, typings could be improved, plenty of room for refactor and improvements of code readability. Tested manually, there are no written tests. Security is not guaranteed.

Files needed pre-deployment:

- web/google-services.json
- web/appcheck-config.json
- helpers/service-account.json
- helpers/users-to-create.json
