Setup Guide
===========

Folders
- linkedin-frontend/ → React app
- server/ → Node/Express API

Run
Backend:
  cd server
  npm install
  npm run dev

Frontend:
  cd linkedin-frontend
  npm install
  npm run dev -- --host --port 5173

Troubleshooting blank page
- Ensure both servers are running.
- Confirm VITE_API_URL and JWT token exist; login first.
- Check browser console for errors; a 401 indicates the API needs a valid token.


