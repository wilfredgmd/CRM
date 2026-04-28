# CRM System

A complete functional Customer Relationship Management (CRM) system built with React.js, featuring Zoho-like functionality.

## Features

### Core Modules
- **Dashboard**: Overview with analytics, charts, and key metrics
- **Contacts**: Full CRUD operations for managing customer contacts
- **Leads**: Pipeline management with Kanban view and stage tracking
- **Deals**: Opportunity tracking with probability and stage management
- **Tasks**: Activity management with priorities and due dates
- **Reports**: Analytics and performance metrics with visual charts

### Key Features
- Responsive design (mobile-friendly)
- Real-time state management with Zustand
- Search and filtering across all modules
- Kanban-style pipeline views for leads and deals
- Interactive charts and analytics
- Modern UI with TailwindCSS
- Clean, intuitive navigation

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Installation

1. Navigate to the project directory:
```bash
cd crm-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Usage

### Dashboard
- View key metrics and statistics
- Monitor pipeline value and recent activities
- Analyze deals by stage and leads by status

### Contacts
- Add, edit, and delete contacts
- Search contacts by name, email, or company
- Track contact status (Active/Inactive)

### Leads
- Manage leads through pipeline stages (New → Contacted → Qualified → Converted → Lost)
- Kanban view for visual pipeline management
- Track lead sources and estimated values
- Move leads between stages with one click

### Deals
- Track sales opportunities
- Monitor deal probability and expected close dates
- Pipeline view with stage progression
- Calculate weighted pipeline value

### Tasks
- Create and manage tasks
- Set priorities (Low, Medium, High)
- Track task status (Pending, In Progress, Completed)
- View overdue tasks
- Link tasks to contacts, leads, or deals

### Reports
- View performance metrics
- Analyze lead sources
- Track deal conversion rates
- Monitor task completion status
- Visual charts for data analysis

## Data Persistence

Currently, the application uses in-memory state management with Zustand. Data will reset when you refresh the page. For production use, you can integrate:
- LocalStorage for simple persistence
- Backend API (REST/GraphQL)
- Database integration (PostgreSQL, MongoDB, etc.)

## Project Structure

```
crm-system/
├── src/
│   ├── components/
│   │   └── Layout.jsx       # Main layout with sidebar navigation
│   ├── pages/
│   │   ├── Dashboard.jsx    # Dashboard with analytics
│   │   ├── Contacts.jsx     # Contacts management
│   │   ├── Leads.jsx        # Leads pipeline
│   │   ├── Deals.jsx        # Deals/opportunities
│   │   ├── Tasks.jsx        # Tasks and activities
│   │   └── Reports.jsx      # Reports and analytics
│   ├── store/
│   │   └── useStore.js      # Zustand state management
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Customization

### Adding New Fields
Edit the store in `src/store/useStore.js` to add new fields to contacts, leads, deals, or tasks.

### Changing Colors
Modify the color palette in `tailwind.config.js` under the `theme.extend.colors` section.

### Adding New Pages
1. Create a new page component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Add navigation link in `src/components/Layout.jsx`

## License

This project is open source and available for personal and commercial use.
