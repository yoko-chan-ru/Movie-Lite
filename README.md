# Movie Lite — movie and series tracker

Movie Lite is a single-page React application for searching movies and series, adding them to a personal list, rating, taking notes, and tracking watch status. This project was created as a React course assignment.

---

## Demo

Link will be added after deployment

---

## Features

- User registration and authentication (Firebase Auth)
- Movie and series search via OMDb API
- Add movies to personal list
- Status management: Want to watch, Watching, Watched, Dropped
- Rating from 1 to 10
- Personal notes per movie
- Filtering and sorting by status, rating, year, title
- Two view modes: List view with pagination, Grouped by status with Show more button
- Detailed movie page
- Search history with individual entry deletion

---

## Tech Stack

- React 18
- React Router v6
- Firebase (Authentication + Firestore)
- OMDb API
- Fetch / Axios
- CSS Modules
- FontAwesome
- Vite

---

## Project Structure

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

---

## Setup and Run

git clone https://github.com/YOUR_USERNAME/movie-lite.git
cd movie-lite
npm install
npm run dev

---

## Environment Variables

Create .env file in the root directory: VITE_OMDB_KEY=your_omdb_key

---

## Author

yoko-chan-ru
