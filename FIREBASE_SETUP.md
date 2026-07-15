# Firebase schedule sync setup

This app can sync lesson schedules across devices with Cloud Firestore.

1. Create a Firebase project on the Spark plan.
2. Add a Web app in Firebase project settings.
3. Copy the Firebase config object into `firebaseConfig` at the top of `app.js`.
4. Create a Firestore database.
5. Publish the rules in `firestore.rules`.
6. Add these authorized domains in Firebase Authentication:
   - `prasadc8de.github.io`
   - `127.0.0.1`
   - `localhost`

The schedule is stored at:

```text
lms/lessonSchedule
```

Students read this document on page load. Teachers write it when they schedule lessons.
