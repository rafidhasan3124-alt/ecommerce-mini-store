# Nexora - Premium E-Commerce Platform

Nexora is a fully-featured, modern e-commerce platform built with Next.js, React, Tailwind CSS, and Prisma. It includes a beautiful, fully responsive frontend, user authentication, a shopping cart, a checkout system, and a comprehensive admin panel.

## Features

- **Responsive Design**: Beautiful UI that looks stunning on desktops, tablets, and mobile devices.
- **Admin Panel**: Manage products, users, and view orders in a dedicated dashboard.
- **Shopping Cart**: Fully functional cart state management using Zustand.
- **Authentication**: JWT-based user authentication and route protection.
- **Database**: Prisma ORM with SQLite (ready to scale to PostgreSQL).

## Getting Started

First, ensure you have copied the `.env.example` file to `.env` and set up your environment variables.

```bash
cp .env.example .env
```

Next, install dependencies:

```bash
npm install
```

Run database migrations to initialize SQLite:

```bash
npx prisma db push
```

Run the seed script to create a default admin user and sample products:

```bash
npx ts-node scripts/create-admin.ts
npx ts-node scripts/seed-products.ts
```

Finally, start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the store.

## Admin Access
- The default admin email is `admin@nexora.com`.
- You can access the admin dashboard at `/admin`.
