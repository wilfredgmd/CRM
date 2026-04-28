# CRM Backend API

Production-grade Node.js/Express backend for the CRM system.

## Features

- **RESTful API** for all CRM entities (Leads, Contacts, Deals, Tasks, Calls)
- **JWT Authentication** with secure password hashing
- **SQLite Database** with WAL mode for performance
- **Rate Limiting** to prevent abuse
- **CORS Support** for frontend integration
- **Security Headers** via Helmet
- **Request Compression** for better performance
- **Structured Error Handling**
- **User Isolation** - all data is scoped to authenticated users

## Installation

```bash
cd backend
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/crm.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Leads
- `GET /api/leads` - Get all leads (requires auth)
- `GET /api/leads/:id` - Get single lead (requires auth)
- `POST /api/leads` - Create lead (requires auth)
- `PUT /api/leads/:id` - Update lead (requires auth)
- `DELETE /api/leads/:id` - Delete lead (requires auth)

### Contacts
- `GET /api/contacts` - Get all contacts (requires auth)
- `GET /api/contacts/:id` - Get single contact (requires auth)
- `POST /api/contacts` - Create contact (requires auth)
- `PUT /api/contacts/:id` - Update contact (requires auth)
- `DELETE /api/contacts/:id` - Delete contact (requires auth)

### Deals
- `GET /api/deals` - Get all deals (requires auth)
- `GET /api/deals/:id` - Get single deal (requires auth)
- `POST /api/deals` - Create deal (requires auth)
- `PUT /api/deals/:id` - Update deal (requires auth)
- `DELETE /api/deals/:id` - Delete deal (requires auth)

### Tasks
- `GET /api/tasks` - Get all tasks (requires auth)
- `GET /api/tasks/:id` - Get single task (requires auth)
- `POST /api/tasks` - Create task (requires auth)
- `PUT /api/tasks/:id` - Update task (requires auth)
- `DELETE /api/tasks/:id` - Delete task (requires auth)

### Calls
- `GET /api/calls` - Get all calls (requires auth)
- `GET /api/calls/:id` - Get single call (requires auth)
- `POST /api/calls` - Create call (requires auth)
- `PUT /api/calls/:id` - Update call (requires auth)
- `DELETE /api/calls/:id` - Delete call (requires auth)

### Settings
- `GET /api/settings` - Get user settings (requires auth)
- `PUT /api/settings` - Update user settings (requires auth)

### Notifications
- `GET /api/notifications` - Get all notifications (requires auth)
- `GET /api/notifications/unread/count` - Get unread count (requires auth)
- `PUT /api/notifications/:id/read` - Mark as read (requires auth)
- `PUT /api/notifications/read-all` - Mark all as read (requires auth)
- `DELETE /api/notifications/:id` - Delete notification (requires auth)
- `DELETE /api/notifications` - Clear all notifications (requires auth)

### Health Check
- `GET /health` - Server health status

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database

The backend uses SQLite with the following tables:
- `users` - User accounts
- `settings` - User preferences
- `leads` - Sales leads
- `contacts` - Contact information
- `deals` - Sales deals
- `tasks` - Task management
- `calls` - Call logs
- `notifications` - User notifications

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- SQL injection prevention (parameterized queries)
- User data isolation

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper `CORS_ORIGIN`
4. Use a reverse proxy (nginx) for SSL
5. Set up proper logging
6. Configure database backups

## License

MIT
