# DentalConnect

A modern dental lab management system built with React, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dental-connect.git
cd dental-connect
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the project:
```bash
npm run build
```

### Testing

Run tests:
```bash
npm run test
```

## Features

- Digital impression management
- Cost estimation and HKP generation
- Lab order management
- Secure file transfer
- Payment processing with Stripe
- VDDS integration for practice management systems

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Tanstack Query
- Zustand
- i18next
- Stripe
- Chart.js
- Socket.io