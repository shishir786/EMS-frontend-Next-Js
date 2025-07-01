# Employee Management System

A web-based employee management platform built with Next.js, React, and a RESTful backend. This system allows admins and managers to create and manage projects, assign users, track project statuses, and handle leave and timesheet management.

## Features

- User authentication (login, signup, change password)
- Role-based access: Admin, Manager, User
- Project management (create, edit, delete projects)
- Assign users to projects
- Users can accept/reject project assignments
- Leave application and approval workflow
- Timesheet submission and export
- Notice board for announcements
- Responsive UI with dashboards for each role

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Backend API running (see API section below)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shishir786/employee-management-system-frontend-.git

   cd employee-manage
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

- Configure API endpoints and secrets in `.env.local` if needed.

## Project Structure

- `app/` — Next.js app directory (pages, routes, UI)
- `components/` — Reusable React components
- `lib/` — API utilities and authentication context
- `hooks/` — Custom React hooks

## API Overview

The frontend expects a RESTful backend with the following endpoints:

### Authentication

- `POST /api/users/signup` — Register a new user
- `POST /api/users/signin` — Login
- `POST /api/users/change-password` — Change password

### Projects

- `POST /api/projects` — Create a new project (admin/manager)
- `GET /api/projects` — Get all projects (role-based)
- `GET /api/projects/:id` — Get project details
- `PATCH /api/projects/:id` — Update project
- `DELETE /api/projects/:id` — Delete project
- `POST /api/projects/:id/respond` — Accept/reject assignment `{ action: "accept" | "reject" }`

### Users

- `GET /api/users/all` — List all users (admin/manager)
- `PATCH /api/users/:id/role` — Update user role

### Leave

- `POST /api/leave` — Apply for leave
- `GET /api/leave` — Get user leaves
- `GET /api/leave/all` — Get all leaves (admin/manager)
- `PATCH /api/leave/:id/approve` — Approve/reject leave

### Timesheets

- `POST /api/timesheets/create` — Submit timesheet
- `GET /api/timesheets` — Get user timesheets
- `GET /api/timesheets/all` — Get all timesheets (admin/manager)
- `GET /api/timesheets/:id` — Get timesheet details
- `PATCH /api/timesheets/:id` — Update timesheet
- `DELETE /api/timesheets/:id` — Delete timesheet
- `GET /api/timesheets/export/excel` — Export timesheets

### Notices

- `POST /api/notice` — Create notice (admin/manager)
- `GET /api/notice` — List all notices
- `PATCH /api/notice/:id` — Update notice
- `DELETE /api/notice/:id` — Delete notice

## Usage

- **Admins/Managers:** Manage users, projects, assignments, and notices.
- **Users:** View assigned projects, accept/reject assignments, submit timesheets, and apply for leave.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
