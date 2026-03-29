# Student Community + Notes Sharing Platform

A full-stack notes sharing platform for students built with React, Node.js, Express, MongoDB, JWT authentication, Multer, and Cloudinary.

## Tech Stack

### Frontend
- React with hooks
- React Router
- Axios
- Basic custom CSS

### Backend
- Node.js
- Express with MVC architecture
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- Cloudinary for document storage
- express-validator for input validation

## Features

- User registration and login with hashed passwords
- JWT-based protected routes
- Upload PDF, DOC, and DOCX notes
- Search notes by title, description, and tags
- Filter notes by tags with pagination
- Like and comment on notes
- Profile page showing user details and uploaded notes
- Admin dashboard for user and note moderation
- Rate limiting, CORS, Helmet, Mongo sanitization, and HPP protection

## Project Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- controllers
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- scripts
|   |   |-- utils
|   |   `-- validators
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- context
|   |   |-- hooks
|   |   |-- pages
|   |   `-- styles
|   |-- .env.example
|   |-- index.html
|   `-- package.json
`-- README.md
```

## Backend Setup

1. Open a terminal in [backend](C:/Users/HP/Documents/New%20project/backend).
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and update the values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student-community?retryWrites=true&w=majority&appName=Cluster0
DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

For MongoDB Atlas:

- make sure your current IP is allowed in Atlas Network Access
- make sure the database user in the URI is correct
- URL-encode special characters in the password
- if your network or proxy DNS is flaky, set `DNS_SERVERS=8.8.8.8,1.1.1.1` so Node uses public DNS
- for deployed frontend access, set `CLIENT_URLS` to a comma-separated allowlist such as `http://localhost:5173,https://your-frontend.vercel.app`

4. Start the backend:

```bash
npm run dev
```

## Frontend Setup

1. Open a terminal in [frontend](C:/Users/HP/Documents/New%20project/frontend).
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the frontend:

```bash
npm run dev
```

## Admin Access

You can either create/reset the admin account directly:

```bash
npm run set-admin -- "Platform Admin" admin@example.com admin123456
```

Or, after creating a normal user account, promote that user to admin from the backend:

```bash
npm run make-admin -- admin@example.com
```

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`

### Notes
- `POST /api/notes/upload`
- `GET /api/notes`
- `GET /api/notes/:id`
- `DELETE /api/notes/:id`
- `PUT /api/notes/like/:id`

### Comments
- `POST /api/comments/:noteId`
- `GET /api/comments/:noteId`

### Admin
- `GET /api/admin/users`
- `DELETE /api/admin/user/:id`
- `GET /api/admin/notes`

## Notes

- The upload route expects the file field name to be `file`.
- Cloudinary stores note files and the secure URL is saved in MongoDB.
- Protected frontend routes rely on the JWT stored in `localStorage`.
- To use the admin dashboard, the signed-in user must have `role: "admin"`.
- Admins can sign in from the frontend route `/admin/login`.
