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
- Backend API running (I build the backend using Nest Js)

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

```
employee-manage/
├── app/
│   ├── change-pass/
│   ├── dashboard/
│   │   ├── admin-dashboard/
│   │   ├── manager-dashboard/
│   │   ├── edit-profile/
│   │   ├── leave/
│   │   │   ├── leave-application/
│   │   │   ├── leave-apply/
│   │   │   ├── leave-history/
│   │   │   ├── login/
│   │   │   ├── not-found.tsx
│   │   │   ├── notices/
│   │   │   ├── profile/
│   │   │   ├── projects/
│   │   │   │   ├── manager-projects/
│   │   │   │   └── signup/
│   │   │   │   └── admin-signup/
│   │   │   └── timesheets/
│   │   │   ├── users/
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── components/
│   │       ├── app-sidebar.tsx
│   │       ├── Footer.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── login-form.tsx
│   │       ├── Navbar.tsx
│   │       ├── NavbarWrapper.tsx
│   │       ├── RequireAuth.tsx
│   │       └── ui/
│   │           ├── alert-dialog.tsx
│   │           ├── breadcrumb.tsx
│   │           ├── button.tsx
│   │           ├── calendar.tsx
│   │           ├── card.tsx
│   │           ├── dialog.tsx
│   │           ├── dropdown-menu.tsx
│   │           ├── input.tsx
│   │           ├── label.tsx
│   │           ├── radio-group.tsx
│   │           ├── separator.tsx
│   │           ├── sheet.tsx
│   │           ├── sidebar.tsx
│   │           ├── skeleton.tsx
│   │           ├── table.tsx
│   │           └── tooltip.tsx
│   └── hooks/
│       └── use-mobile.ts
│
├── lib/
│   ├── api.ts
│   ├── auth-context.tsx
│   └── utils.ts
│
├── public/
│   ├── figma.svg
│   ├── flowbite-react.svg
│   ├── flowbite.svg
│   ├── images/
│   │   └── manage.png
│   ├── pattern-dark.svg
│   ├── pattern-light.svg
│   └── vercel.svg
│
├── README.md
│
├── components.json
│
├── eslint.config.mjs
│
├── next.config.ts
│
├── package.json
│
├── package-lock.json
│
├── postcss.config.mjs
│
├── prettier.config.mjs
│
├── tsconfig.json
```

## UI LIbrary
Some UI Library used here for design
- [Shadcn](https://ui.shadcn.com/)
- [Flowbite](https://flowbite.com/)
- [DaisyUI](https://daisyui.com/)



## Usage

- **Admins/Managers:** Manage users, projects, assignments, and notices.
- **Users:** View assigned projects, accept/reject assignments, submit timesheets, and apply for leave

## Screenshots
Here are some screenshots of project
- ![image](https://github.com/user-attachments/assets/505f86fe-f3a2-495a-be63-e2c09a85b474)
- ![image](https://github.com/user-attachments/assets/7df7daa2-dc16-420b-8ee0-e39319a1df2d)
- ![image](https://github.com/user-attachments/assets/151f57c1-8561-4aa2-ab0b-55a1c3a5986c)
- ![image](https://github.com/user-attachments/assets/f5535a50-aef8-48ce-b8f3-8833289e01b1)
- ![image](https://github.com/user-attachments/assets/87ae662a-a853-4b7c-b28c-e6e27020b24f)
- ![image](https://github.com/user-attachments/assets/6ba6795d-e7f7-45d3-a904-61f9f4f016aa)



## Contact
For any queries or support, please reach out:
**Authors:**
1. **Abdullah Shishir** - [shishir786](https://github.com/shishir786)

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit.
4. Push changes (`git push origin feature-name`).
5. Open a pull request for review.

## Acknowledgments
Thanks to the open-source community for the tools and libraries used in this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support
For any issues or questions, please open an issue in the repository or contact the project owner.
