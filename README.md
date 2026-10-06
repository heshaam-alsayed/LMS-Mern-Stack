# LMS – Learning Management System (MERN)

A full-stack Learning Management System with realtime support tickets, online course delivery, secure payments, and certificate generation. Built with a Next.js frontend and an Express + Socket.io backend on MongoDB.

## Tech Stack

**Client** (`client/`)
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- TanStack Query, Redux Toolkit, React Hook Form + Zod
- Socket.io Client (realtime chat)
- Stripe.js (checkout), jspdf + html2canvas (certificates), Recharts (analytics)
- NextAuth.js (OAuth), next-themes

**Server** (`server/`)
- Node.js + Express 5 + TypeScript
- MongoDB + Mongoose
- Socket.io (realtime ticket chat)
- Redis (Upstash) for caching
- Cloudinary (file/media uploads), Multer
- Stripe (payments), VdoCipher (video streaming), Nodemailer (email)
- JWT auth + role-based authorization, express-rate-limit, node-cron

## Features

- **Roles**: student, instructor, and admin dashboards with distinct UIs.
- **Realtime support tickets**: users create tickets with attachments; admins accept/close them; the ticket page becomes a live chat (user ↔ admin) with optimistic UI, file uploads over Socket.io, and instant status updates (`ticket:accepted`, `ticket:closed`).
- **Ticket management**: user "My Tickets" page (card list, filters, pagination); admin support queue; admin "My Tickets" page listing tickets assigned to the current admin.
- **Courses**: course catalog, browse/filter, course details, video lessons (VdoCipher), course content, Q&A and reviews, enrollment.
- **Payments**: Stripe checkout, orders, invoices, purchase history.
- **Certificates**: generated/downloadable PDF certificates per course.
- **Organizations**: admin manages organizations, instructors, students and organization courses/analytics.
- **Notifications**: realtime + persisted notifications for admins/instructors.
- **Analytics**: courses, orders, users, and organization analytics dashboards with charts.
- **Auth**: email/password (JWT + refresh tokens) and Google/GitHub OAuth, email verification, password reset.
- **Admin customization**: hero, FAQ, categories, layout sections.

## Project Structure

```
lms-v2/
├── client/          # Next.js frontend (port 3000)
│   ├── app/         # Pages (user, instructor, admin, support, public)
│   ├── components/  # UI components (shared, admin, instructor, support)
│   ├── hooks/       # TanStack Query hooks
│   ├── lib/         # API clients, utils
│   ├── redux/       # Redux store
│   └── types/       # Shared TypeScript types
├── server/          # Express + Socket.io backend (port 8000)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/      # Realtime ticket handlers
│   │   └── scripts/     # Seed and maintenance scripts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20+ and npm
- MongoDB (local or Atlas)
- Redis (local or Upstash URL)
- Accounts / keys for: Cloudinary, Stripe, VdoCipher, Nodemailer/Gmail SMTP, and Google/GitHub OAuth (optional)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/heshaam-alsayed/LMS-Mern-Stack.git
cd lms-v2
```

### 2. Run the backend

```bash
cd server
npm install
cp .env.example .env   # then fill in your values
npm run dev            # starts on http://localhost:8000
```

### 3. Run the frontend

```bash
cd client
npm install
cp .env.example .env   # then fill in your values
npm run dev            # starts on http://localhost:3000
```

Open http://localhost:3000 in your browser.

### Environment variables

Server (`.env`):

| Variable | Description |
| --- | --- |
| `PORT` | API port (default `8000`) |
| `ORIGIN` | Allowed CORS origins (e.g. `http://localhost:3000`) |
| `CLIENT_URL` | Frontend URL (`http://localhost:3000`) |
| `DB_URL` | MongoDB connection string |
| `REDIS_URL` | Redis connection string (Upstash or local) |
| `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` | JWT signing secrets |
| `ACCESS_TOKEN_EXPIRE` / `REFRESH_TOKEN_EXPIRE` | Token TTLs |
| `JWT_SECRET` | JWT secret for auth flows |
| `CLOUD_NAME` / `CLOUD_API_KEY` / `CLOUD_API_SECRET` | Cloudinary credentials |
| `STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe credentials |
| `VIDEO_CIPHER_API_SECRET` | VdoCipher API secret |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SERVICE` / `SMTP_MAIL` / `SMTP_PASSWORD` | Email configuration |

Client (`.env`):

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SERVER_URI` | API base URL (`http://localhost:8000/api/v1`) |
| `SERVER_URI` | Server URI used by the Next.js API routes |
| `NEXT_PUBLIC_SOCKET_SERVER_URI` | Socket.io server URL (`http://localhost:8000`) |
| `ACCESS_TOKEN_EXPIRE` / `REFRESH_TOKEN_EXPIRE` | Refresh/access token TTLs (client refresh logic) |
| `AUTH_SECRET` | NextAuth secret |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials (optional) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials (optional) |

> **Never commit real secret values.** Keep your `.env` files out of version control and use the `.env.example` placeholders.

## Server scripts

The backend includes database seed and maintenance scripts:

```bash
npm run seed:users          # seed users
npm run seed:catalog        # seed course catalog
npm run seed:enrollments    # seed enrollments
npm run seed:certificates   # seed certificates
npm run seed:applications   # seed instructor applications
npm run seed:approve        # approve instructor applications
npm run db:clear            # clear the database
npm run db:repair           # repair relations
npm run db:status           # backfill course status
npm run db:counts           # backfill course review counts
npm run db:progress         # backfill course progress
npm run db:fix:progress     # fix certificate progress
```

## Production build

```bash
cd server && npm run build && npm run start     # serves the API from dist/
cd client && npm run build && npm run start     # serves the Next.js app
```