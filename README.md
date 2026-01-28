# WalkWise — AI Audio Walking Tours

Create personalized, AI-generated walking tours from places you select. Discover attractions, save favorites, and generate a tour with a title, overview, and step-by-step guidance. Audio playback and maps make exploring simple and engaging.

Demo: https://youtu.be/76GhiZ8wD2k

## Tech

- Expo / React Native
- Firebase Auth & Firestore
- Google Places Autocomplete
- TripAdvisor (via RapidAPI)
- Tailwind (tailwindcss-react-native)

## Setup

1. Install: `yarn` (or `npm install`)
2. Create environment variables (Expo inlines any `EXPO_PUBLIC_` values):
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID`
   - `EXPO_PUBLIC_RAPIDAPI_KEY`
   - `EXPO_PUBLIC_GOOGLE_PLACES_API_KEY`
   - `EXPO_PUBLIC_API_BASE_URL` (your local API URL, e.g. http://localhost:3000)
3. Run: `yarn start`

Security: Keep private API keys on the server. Use the local API for OpenAI requests.

## Local API

- Start local API: `yarn api` (requires `OPENAI_API_KEY` in your shell env)
- Set `EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`
- Endpoint: `POST /api/generateTour` → returns `{ title, overview, guidance, stops[] }`.

## Security Rules

See `firestore.rules` for recommended Firestore rules:

- Users can read/write their own profile at `users/{uid}`.
- Users can read/write their own tours at `users/{uid}/tours/{tourId}`.
- All other access is denied by default.
