# Backend Server

Standalone backend server for handling form submissions.

## Setup

1. Install dependencies:
```bash
cd backend
pnpm install
```

2. Make sure you have a `.env` file in the root directory with:
```
DATABASE_URL=your_database_connection_string
BACKEND_PORT=3001
FRONTEND_URL=http://localhost:8080
```

## Running

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

## API Endpoints

### Health Check
- `GET /health` - Check if server is running

### Waitlist
- `POST /api/waitlist` - Submit waitlist form
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "suggestion": "Optional suggestion"
  }
  ```
- `GET /api/waitlist` - Get all waitlist entries (admin)

### Form Submissions
- `POST /api/form/submit` - Generic form submission
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Your message here",
    "subject": "Optional subject",
    "phone": "Optional phone"
  }
  ```

- `POST /api/form/contact` - Contact form submission
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Your message here",
    "subject": "Optional subject",
    "phone": "Optional phone"
  }
  ```

## Configuration

The server runs on port 3001 by default (configurable via `BACKEND_PORT` environment variable).

CORS is configured to allow requests from the frontend URL specified in `FRONTEND_URL`.

