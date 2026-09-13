# Movie Lite — Movie and Series Tracker

Movie Lite is a single-page React application for searching movies and series, adding them to a personal list, rating, taking notes, and tracking watch status.

This project was created as a React course assignment.

---

## Demo

Link will be added after deployment.

---

## Features

- User registration and authentication (Firebase Auth)
- Movie and series search via OMDb API
- Add movies to personal list
- Status management: Want to watch, Watching, Watched, Dropped
- Rating from 1 to 10
- Personal notes per movie
- Filtering and sorting by status, rating, year, title
- Two view modes: List view with pagination, Grouped by status with "Show more" button
- Detailed movie page
- Search history with individual entry deletion

---

## Tech Stack

- React 18
- React Router v6
- Firebase (Authentication + Firestore)
- OMDb API
- Fetch
- CSS Modules
- FontAwesome
- Vite

---

## Project Structure

```
src/
├── assets/
├── components/
│   ├── Auth/
│   ├── Layout/
│   └── Movie/
├── context/
├── pages/
├── services/
├── styles/
└── utils/
```

---

## Setup and Run

```
git clone https://github.com/yoko-chan-ru/movie-lite.git
cd movie-lite
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory with the following keys:

```
VITE_OMDB_KEY=your_omdb_api_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## API Keys Setup

This project uses two external services that require API keys:

1. OMDb API — for searching movies and series
2. Firebase — for authentication and data storage

Both keys are stored in a `.env` file, which is not included in the repository for security reasons.

---

### How to Get the Keys

**OMDb API key:**

```
1. Go to https://www.omdbapi.com/apikey.aspx
2. Choose the FREE plan
3. Enter your email and name
4. Receive your key via email
```

**Firebase keys:**

```
1. Go to https://console.firebase.google.com/
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create a Firestore Database
5. Go to Project settings → Your apps → SDK setup and configuration
6. Copy the firebaseConfig object
```

---

### After Creating .env

Restart the development server:

```
npm run dev
```

The app should now work correctly.

---

## Author

yoko-chan-ru
