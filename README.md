# ✦ Praise — Church Music & Community Platform

A full-stack web application for church music communities.

## Tech Stack
| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Backend   | Django 5 + Django REST Framework + SimpleJWT |
| Frontend  | React 18 + Vite + Redux Toolkit + Tailwind  |
| Database  | PostgreSQL                                  |
| Auth      | JWT (access + refresh tokens)               |

---

## Project Structure
```
church-platform/
├── backend/          # Django project
│   ├── church_platform/   # Core settings & URLs
│   ├── users/        # Auth, profiles, follow system
│   ├── posts/        # Song posts with chord/lyrics
│   ├── communities/  # Church communities & roles
│   ├── reactions/    # Like / Love / Amen
│   ├── saves/        # Bookmarked posts
│   └── songbook/     # Admin-managed song library
└── frontend/         # React + Vite app
    └── src/
        ├── api/          # Axios instance + interceptors
        ├── store/slices/ # Redux Toolkit slices
        ├── hooks/        # useAuth hook
        ├── components/   # chord, posts, communities, layout
        └── pages/        # Full page components
```

---

## Quick Start (Local)

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL running locally

---

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DB credentials

# Create the database
createdb church_platform       # or use psql / pgAdmin

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed sample data
python manage.py seed_data

# Start server (port 8000)
python manage.py runserver
```

Backend API base: `http://localhost:8000/api`  
Django Admin:     `http://localhost:8000/admin`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# .env is already created — edit VITE_API_URL if needed

# Start dev server (port 5173)
npm run dev
```

Frontend: `http://localhost:5173`

---

## Seed Accounts

| Role           | Email                  | Password    |
|----------------|------------------------|-------------|
| Platform Admin | admin@church.com       | Admin@1234  |
| Regular User   | john@church.com        | User@1234   |

---

## Docker Setup (Optional)

```bash
# From project root
docker-compose up --build
```

- Frontend: http://localhost:5173  
- Backend:  http://localhost:8000  
- Adminer:  http://localhost:8080

---

## API Reference

### Auth
| Method | Endpoint                  | Description        |
|--------|---------------------------|--------------------|
| POST   | /api/auth/register/       | Register           |
| POST   | /api/auth/login/          | Login → JWT tokens |
| POST   | /api/auth/token/refresh/  | Refresh token      |
| GET    | /api/auth/profile/        | My profile         |
| PATCH  | /api/auth/profile/        | Update profile     |

### Posts
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| GET    | /api/posts/          | List posts (feed)    |
| POST   | /api/posts/          | Create post          |
| GET    | /api/posts/{id}/     | Post detail          |
| PATCH  | /api/posts/{id}/     | Edit post (owner)    |
| DELETE | /api/posts/{id}/     | Delete post (owner)  |

### Reactions
| Method | Endpoint                           | Description |
|--------|------------------------------------|-------------|
| POST   | /api/reactions/posts/{id}/react/   | Toggle reaction (like/love/amen) |

### Saves
| Method | Endpoint                        | Description    |
|--------|---------------------------------|----------------|
| GET    | /api/saves/                     | My saved posts |
| POST   | /api/saves/posts/{id}/toggle/   | Save / unsave  |

### Communities
| Method | Endpoint                                    | Description     |
|--------|---------------------------------------------|-----------------|
| GET    | /api/communities/                           | List            |
| POST   | /api/communities/                           | Create          |
| POST   | /api/communities/{id}/join/                 | Join / leave    |
| GET    | /api/communities/{id}/members/              | Member list     |
| PATCH  | /api/communities/{id}/members/{uid}/role/   | Assign role     |

### Songbook (Admin only for write)
| Method | Endpoint             | Description  |
|--------|----------------------|--------------|
| GET    | /api/songbook/       | List songs   |
| POST   | /api/songbook/       | Add song     |
| PATCH  | /api/songbook/{id}/  | Edit song    |
| DELETE | /api/songbook/{id}/  | Delete song  |

---

## Chord / Lyrics Data Format

Lyrics are stored as structured JSON enabling precise chord placement above text:

```json
[
  {
    "line": "Amazing grace how sweet the sound",
    "chords": [
      { "chord": "G", "position": 0 },
      { "chord": "C", "position": 8 },
      { "chord": "G", "position": 15 }
    ]
  },
  {
    "line": "That saved a wretch like me",
    "chords": [
      { "chord": "G", "position": 0 },
      { "chord": "D", "position": 11 }
    ]
  }
]
```

`position` is the **character index** in the line where the chord appears above.  
The React `LyricsDisplay` component renders chords absolutely positioned above each lyric line using monospace math.

---

## Community Roles

| Role         | Permissions                                 |
|--------------|---------------------------------------------|
| admin        | Manage members, assign roles, edit community |
| pastor       | Full posting access                         |
| youth_leader | Youth-focused posting                       |
| choir_member | Posting access                              |
| member       | Standard access                             |

---

## Production Build

```bash
# Frontend
cd frontend && npm run build   # outputs to dist/

# Backend — collect static files
cd backend && python manage.py collectstatic
```

Set `DEBUG=False`, use gunicorn + nginx for production deployment.
