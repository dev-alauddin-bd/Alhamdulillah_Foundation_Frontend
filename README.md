# Alhamdulillah Foundation - Frontend

The frontend of the Alhamdulillah Foundation platform is a modern, high-performance web application built with **Next.js 15+**, **React 19**, and **Tailwind CSS**. It provides an intuitive interface for managing investments, tracking projects, and facilitating community membership.

## ✨ Features

- **🚀 Modern Dashboard**: Comprehensive analytics and project tracking for members and admins.
- **🔐 Secure Authentication**: Integrated with JWT and Redux-based state preservation.
- **📅 Project Management**: Browse and join investment projects with detailed status tracking.
- **💰 Financial Transparency**: Real-time fund tracking, income/expense reports, and invoice generation.
- **💳 Multi-Gateway Payments**: 
  - **SSLCommerz** for domestic transactions in Bangladesh.
  - **Stripe** for international payments.
  - Manual Bkash verification flow.
- **🌍 Internationalization**: Supports multiple languages (English/Bengali) using i18next.
- **📊 Interactive Charts**: Visual data representation using Recharts.
- **📄 Document Generation**: Generate and download PDFs for invoices and reports (jsPDF).
- **🔔 Real-time Notifications**: Instant feedback with Sonner and React-Toastify.
- **🌗 Theme Support**: Native dark and light mode support.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & Redux Persist
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Data Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📂 Folder Structure

```
app/              # Next.js App Router (Routes & Pages)
├── (auth)        # Authentication routes
├── (common)      # Landing pages, Notices, Projects
└── (dashboard)   # User & Admin dashboards
components/       # Reusable UI components (buttons, cards, etc.)
hooks/            # Custom React hooks
lib/              # Utility functions and configurations
providers/        # Context providers (Redux, Theme, etc.)
redux/            # State management logic and API slices
public/           # Static assets (images, fonts)
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Backend API running (see [Backend Setup](../Alhamdulillah-foundation-backend/README.md))

### Installation

1. Clone the repository and navigate to the frontend folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:5000/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks
- `npm run format` - Format code with Prettier

## 📄 License

This project is licensed under the MIT License.

