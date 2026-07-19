# Firebase LMS data setup

This app loads private LMS data from Cloud Firestore instead of shipping it in `app.js`.

## Completed app setup

- Firebase project: `pbde-lms`
- Firebase Web app: `ClassGate LMS`
- Firestore catalog document: `lms/courseCatalog`
- Firestore schedule document: `lms/lessonSchedule`
- Firestore users collection: `users/{gmail}`
- Firestore progress collection: `progress/{gmail}`
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

## Firestore data model

- `lms/courseCatalog`: course topics, lesson metadata, video IDs, notes, and checkpoint questions.
- `lms/lessonSchedule`: lesson publish timestamps.
- `users/{gmail}`: one document per Gmail, with `email`, `role`, and `active`.
- `progress/{gmail}`: cloud-synced student lesson progress, activity dates, XP, streaks, badges, and leaderboard summary.

Example user document:

```json
{
  "email": "learner@example.com",
  "role": "student",
  "active": true
}
```

Use `role: "teacher"` for teacher accounts. Active students and teachers can read the catalog, schedule, and leaderboard progress; only teachers can write catalog/schedule data. Learners can write only their own progress document.
