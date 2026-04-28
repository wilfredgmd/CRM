# CRM Database Schema Reference

This document shows the current localStorage structure in JSON format, which serves as the reference for designing the database tables.

## Storage Keys

All data is stored in localStorage with the following keys:
- `crm_auth` - User authentication data
- `crm_settings` - User settings and preferences
- `crm_leads` - Sales leads
- `crm_contacts` - Contact information
- `crm_deals` - Sales deals
- `crm_tasks` - Task management
- `crm_calls` - Call logs
- `crm_notifications` - User notifications

---

## Table 1: users (crm_auth)

**Purpose**: Store user authentication information

```json
{
  "id": "string (UUID)",
  "email": "string (unique)",
  "name": "string",
  "role": "string (default: 'admin')"
}
```

**Database Schema**:
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## Table 2: settings (crm_settings)

**Purpose**: Store user preferences and company settings

```json
{
  "companyName": "string (default: 'My CRM')",
  "userName": "string (default: 'Admin')",
  "userEmail": "string",
  "userTitle": "string",
  "userPhone": "string",
  "companyWebsite": "string",
  "companyAddress": "string",
  "currency": "string (default: '₹')",
  "currencyCode": "string (default: 'INR')",
  "dateFormat": "string (default: 'DD/MM/YYYY')",
  "language": "string (default: 'en')",
  "theme": "string (default: 'light')",
  "notifications": {
    "newLeads": "boolean (default: true)",
    "dealUpdates": "boolean (default: true)",
    "taskReminders": "boolean (default: true)",
    "emailAlerts": "boolean (default: true)"
  }
}
```

**Database Schema**:
```sql
CREATE TABLE settings (
  user_id TEXT PRIMARY KEY,
  company_name TEXT DEFAULT 'My CRM',
  user_name TEXT DEFAULT 'Admin',
  user_email TEXT,
  user_title TEXT,
  user_phone TEXT,
  company_website TEXT,
  company_address TEXT,
  currency TEXT DEFAULT '₹',
  currency_code TEXT DEFAULT 'INR',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'light',
  notifications TEXT DEFAULT '{"newLeads":true,"dealUpdates":true,"taskReminders":true,"emailAlerts":true}',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Table 3: leads (crm_leads)

**Purpose**: Store sales leads information

```json
{
  "id": "string (UUID)",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "title": "string",
  "source": "string (enum: 'Website', 'LinkedIn', 'Referral', 'Cold Call', 'Trade Show', 'Social Media', 'Email Campaign', 'Other')",
  "value": "number (default: 0)",
  "status": "string (enum: 'new', 'contacted', 'qualified', 'converted', 'lost')",
  "score": "number (default: 70, range: 0-100)",
  "notes": "string",
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  title TEXT,
  source TEXT,
  value REAL DEFAULT 0,
  status TEXT DEFAULT 'new',
  score INTEGER DEFAULT 70,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
```

---

## Table 4: contacts (crm_contacts)

**Purpose**: Store contact information

```json
{
  "id": "string (UUID)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "title": "string",
  "address": "string",
  "status": "string (enum: 'Active', 'Inactive')",
  "notes": "string",
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  title TEXT,
  address TEXT,
  status TEXT DEFAULT 'Active',
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
```

---

## Table 5: deals (crm_deals)

**Purpose**: Store sales deals and opportunities

```json
{
  "id": "string (UUID)",
  "name": "string",
  "contactName": "string",
  "company": "string",
  "value": "number (default: 0)",
  "stage": "string (enum: 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost')",
  "probability": "number (default: 10, range: 0-100)",
  "expectedClose": "string (date)",
  "notes": "string",
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE deals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT,
  company TEXT,
  value REAL DEFAULT 0,
  stage TEXT DEFAULT 'Qualification',
  probability INTEGER DEFAULT 10,
  expected_close TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage ON deals(stage);
```

---

## Table 6: tasks (crm_tasks)

**Purpose**: Store task management data

```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string",
  "priority": "string (enum: 'High', 'Medium', 'Low')",
  "status": "string (enum: 'Pending', 'In Progress', 'Completed')",
  "dueDate": "string (date or relative: 'Today', 'Tomorrow', 'This Week')",
  "assignee": "string",
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Pending',
  due_date TEXT,
  assignee TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

---

## Table 7: calls (crm_calls)

**Purpose**: Store call logs and scheduled calls

```json
{
  "id": "string (UUID)",
  "contactName": "string",
  "phone": "string",
  "company": "string",
  "scheduledTime": "string (time)",
  "date": "string (date)",
  "type": "string (enum: 'phone', 'video')",
  "duration": "number (minutes, default: 30)",
  "status": "string (enum: 'scheduled', 'completed', 'missed')",
  "outcome": "string (enum: 'Successful', 'Follow-up needed', 'Missed', 'Cancelled')",
  "notes": "string",
  "createdAt": "string (ISO 8601 datetime)",
  "updatedAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE calls (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  scheduled_time TEXT,
  date TEXT,
  type TEXT DEFAULT 'phone',
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  outcome TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_calls_user_id ON calls(user_id);
CREATE INDEX idx_calls_status ON calls(status);
```

---

## Table 8: notifications (crm_notifications)

**Purpose**: Store user notifications

```json
{
  "id": "string (UUID)",
  "type": "string (enum: 'lead_added', 'deal_updated', 'task_reminder', etc.)",
  "title": "string",
  "message": "string",
  "icon": "string (icon name: 'UserPlus', 'TrendingUp', 'Phone', 'CheckCircle')",
  "read": "boolean (default: false)",
  "createdAt": "string (ISO 8601 datetime)"
}
```

**Database Schema**:
```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT,
  read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
```

---

## Relationships

All data tables (except users) have a foreign key relationship with the users table:
- Each user has their own isolated data
- When a user is deleted, all their related data is also deleted (CASCADE)
- This ensures multi-tenancy and data isolation

---

## Data Types Summary

| Field Type | SQLite Type | Description |
|-----------|-------------|-------------|
| id | TEXT | UUID string (primary key) |
| user_id | TEXT | Foreign key to users table |
| email | TEXT | Email address |
| name/firstName/lastName | TEXT | Text fields |
| phone | TEXT | Phone number string |
| value | REAL | Numeric value (currency) |
| score/probability | INTEGER | Integer 0-100 |
| status | TEXT | Enum values stored as text |
| date/datetime | TEXT | ISO 8601 format strings |
| boolean | INTEGER | 0 or 1 (SQLite doesn't have native boolean) |
| JSON object | TEXT | JSON string (for notifications field) |

---

## Migration Strategy

To migrate from localStorage to the database:

1. **Export existing data**: Use the export button in Settings to get JSON
2. **Create database tables**: Run the SQL schema
3. **Import data**: Parse JSON and insert into corresponding tables
4. **Update frontend**: Switch from localStorage service to API calls
5. **Remove localStorage**: Clean up old storage keys

---

## Notes

- All timestamps use ISO 8601 format: `2024-04-28T10:30:00.000Z`
- Currency values are stored as numbers (not formatted strings)
- Enum values are stored as text strings
- Boolean values are stored as integers (0 = false, 1 = true)
- JSON objects (like notifications) are stored as text strings
- All tables include `created_at` and `updated_at` timestamps
- All user-specific tables include `user_id` for data isolation
