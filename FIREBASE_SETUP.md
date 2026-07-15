# Firebase schedule sync setup

This app can sync lesson schedules across devices with Cloud Firestore.

## Completed app setup

- Firebase project: `pbde-lms`
- Firebase Web app: `ClassGate LMS`
- Firestore schedule document: `lms/lessonSchedule`
- Rules file: `firestore.rules`

## Required Firebase console setup

1. Create a Firestore database in production mode.
2. Enable Firebase Authentication > Sign-in method > Google.
3. Add these authorized domains in Firebase Authentication:
   - `prasadc8de.github.io`
   - `127.0.0.1`
   - `localhost`
4. Publish the rules in `firestore.rules`.

After logging in to the Firebase CLI once, rules can be deployed with:

```bash
npx firebase-tools deploy --only firestore:rules --project pbde-lms
```

Students read this document on page load. Teachers write it when they schedule lessons.
