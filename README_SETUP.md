Setup Guide
===========

Folders
- linkedin-frontend/ → React app
- server/ → Node/Express API

Environment files
1) Backend: create server/.env (copy from server/ENV_EXAMPLE.txt)

PORT=4000
MONGODB_URI=mongodb+srv://rishijeetsinha1221_db_user:hellinheaven@cluster0.46yc8je.mongodb.net/
JWT_SECRET=replace-with-strong-secret
CLIENT_ORIGIN=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id

2) Frontend: create linkedin-frontend/.env

VITE_API_URL=http://localhost:4000/api
VITE_APP_GOOGLE_AUTH_KEY=your-google-client-id

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


