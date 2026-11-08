# 🚀 HireLoop – Client Side

**HireLoop** is a modern, user-friendly, and role-based job portal platform designed to connect job seekers with employers and simplify the hiring process.

The client-side application provides an intuitive and responsive user interface where job seekers can explore career opportunities, employers can manage job postings, and administrators can oversee platform activities.

Built with modern frontend technologies, HireLoop focuses on usability, performance, scalability, and a smooth user experience.

---

## 📌 Project Overview

HireLoop is designed to provide a complete digital recruitment experience through three primary user roles.

### 👥 User Roles

**1. Job Seeker (Seeker)**

Job seekers can:
- Register and create an account.
- Sign in securely.
- Explore available job opportunities.
- View detailed job descriptions.
- Apply for suitable positions.
- Manage their personal profiles.
- Track their submitted applications.

**2. Employer (Recruiter)**

Employers can:
- Register and access their accounts.
- Create and manage job postings.
- Edit and delete published jobs.
- View submitted job applications.
- Review candidate information.
- Manage recruitment activities.

**3. Administrator (Admin)**

Administrators can:
- Access the administrative dashboard.
- Manage registered users.
- Monitor job postings.
- Manage employer and job seeker accounts.
- Oversee job applications.
- Maintain platform activities and security.

---

## 🛠️ Technologies Used

The client-side application is built using modern frontend technologies.

| Technology | Purpose |
|---|---|
| Next.js 16.4.3 | React framework and application development |
| React | Component-based UI development |
| TypeScript | Type-safe development |
| Better Auth | Client-side authentication |
| JavaScript (ES Modules) | Modern JavaScript functionality |

---

## ✨ Key Features

### 🔐 Authentication System

HireLoop integrates Better Auth for secure user authentication.

Features include:
- User registration.
- Email and password authentication.
- User login.
- Authentication session management.
- Role selection during registration.
- Shared and reusable authentication form.
- Authentication callback and redirect handling.

### 🧑‍💻 Role-Based User System

The application supports three primary roles:

- `seeker`
- `employer`
- `admin`

Each role is designed to have its own features, permissions, and dashboard experience.

### 💼 Job Management

The client application is designed to support:

- Job discovery.
- Job details.
- Job posting.
- Job editing and management.
- Job application submission.
- Application tracking.

### 📱 Responsive User Experience

The application is designed to provide a consistent user experience across different screen sizes and devices.

---

## 🏗️ Application Architecture

HireLoop follows a modern client-server architecture.

```text
              HireLoop Client
                (Next.js)
                    |
          ---------------------
          |                   |
          ▼                   ▼
    Better Auth Client    API Requests
          |                   |
          ▼                   ▼
    Authentication      Express.js API
          |                Server
          |                   |
          ▼                   ▼
       MongoDB             MongoDB
         Atlas               Atlas
```

The frontend communicates with the backend API to retrieve and manage application data.

Better Auth handles the authentication workflow and session management.

---

## 🔐 Authentication Configuration

HireLoop uses Better Auth on the client side through its React integration.

The authentication client is initialized using `createAuthClient`.

Example:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});
```

Authentication methods include:

**Sign Up**

```typescript
await authClient.signUp.email({
  name,
  email,
  password,
  role: "seeker",
  callbackURL: "/",
});
```

**Sign In**

```typescript
await authClient.signIn.email({
  email,
  password,
  callbackURL: "/",
});
```

The application supports role-based registration with `seeker` as the default registration role.

---

## 📂 Project Structure

The application follows the Next.js App Router architecture.

```text
hireloop-client/
│
├── app/
│   ├── (auth)/
│   │   └── sign-up/
│   │       └── page.tsx
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── auth-form.tsx
│
├── lib/
│   └── auth-client.ts
│
├── public/
│
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

*Note: This structure represents the known application files. Additional pages, components, and folders can be added as development progresses.*

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory of the client project.

```env
NEXT_PUBLIC_BETTER_AUTH_URL=your_better_auth_base_url
```

Configure the authentication URL according to your backend Better Auth configuration.

**Important:**
- Never expose database credentials in client-side environment variables.
- Never store MongoDB username or password in the frontend.
- Only expose environment variables that are intended to be public.

---

## 🚀 Installation & Setup

Follow these steps to run the client application locally.

**1. Clone the repository**

```bash
git clone YOUR_REPOSITORY_URL
```

**2. Navigate to the client directory**

```bash
cd hireloop-client
```

**3. Install dependencies**

```bash
npm install
```

**4. Configure environment variables**

Create `.env.local` and configure the required Better Auth URL.

**5. Start the development server**

```bash
npm run dev
```

**6. Open the application**

Visit:

```text
http://localhost:3000
```

---

## 🔗 Backend Integration

HireLoop Client communicates with the Express.js backend server.

**Backend Technologies:**
- Node.js
- Express.js
- MongoDB Atlas
- MongoDB Node.js Driver
- Better Auth

**Backend Development URL:**

```text
http://localhost:5000
```

**Currently Available API:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend server status |
| GET | `/users` | Retrieve user records |

The client application can communicate with the backend API to retrieve and display user information.

---

## 🔮 Future Development Plans

HireLoop will continue to evolve into a complete recruitment platform.

Planned frontend features include:

- Modern Landing Page.
- Job Seeker Dashboard.
- Employer Dashboard.
- Admin Dashboard.
- Advanced Job Search and Filtering.
- Job Details Page.
- Job Posting Interface.
- Job Application Interface.
- Application Status Dashboard.
- User Profile Management.
- Company Profile Management.
- Protected Routes.
- Role-Based Dashboard Navigation.
- Notifications Interface.
- Pagination and Search Experience.
- Improved Loading and Error States.

---

## 🎯 Project Goals

The primary goal of HireLoop is to create a modern recruitment platform that simplifies the connection between job seekers and employers.

The application focuses on:

- Clean and intuitive user interfaces.
- Secure authentication.
- Role-based user experiences.
- Scalable application architecture.
- Efficient frontend-backend communication.
- A smooth and accessible user experience.

---

## 👨‍💻 Developer

**HireLoop – Client Side**

Built with ❤️ using Next.js, React, TypeScript, and Better Auth.

**Project:** HireLoop  
**Category:** Full-Stack Job Portal & Recruitment Platform  
**Frontend:** Next.js + React + TypeScript  
**Authentication:** Better Auth  
**Backend:** Node.js + Express.js  
**Database:** MongoDB Atlas

---

⭐ If you find this project interesting, feel free to explore the repository and follow its development journey!
