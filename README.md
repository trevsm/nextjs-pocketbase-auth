# Next.js PocketBase Auth Example

A Next.js boilerplate for quickly setting up user authentication with PocketBase. This project provides basic sign-up and login pages, integrates with Material-UI for styling, and is fully typed with TypeScript.

## Features

- **PocketBase Integration:** Easily manage user authentication using PocketBase.
- **Pre-built Auth Pages:** Includes basic sign-up and login pages.
- **Material-UI Styling:** Components styled with Material-UI for a responsive design.
- **TypeScript Support:** Ensures type safety across the project.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v14 or later)
- npm or yarn
- PocketBase instance

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/nextjs-pocketbase-auth.git
```

Navigate to the project directory:

```bash
cd nextjs-pocketbase-auth
```

Install dependencies:

```bash
npm install
```

or

```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
DATABASE_URL = "https://my_pocketbase_url.com"
PB_TOKEN = "eyJh...."

REFRESH_TOKEN_SECRET = "secret"
ACCESS_TOKEN_SECRET = "secret"

NEXT_PUBLIC_BASE_URL = "http://localhost:3000"

SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "example@gmail.com"
SMTP_PASS = "password123"
```

### PocketBase Configuration

1. **Create a New PocketBase Instance:**

   - Download and set up PocketBase by following the official documentation: [PocketBase Documentation](https://pocketbase.io/docs/).

2. **Import Schema:**

   - In your PocketBase admin dashboard, import the `pb_schema.json` file from this repository. This file contains all the necessary collections and schema required for the authentication system to work.

3. **Start Your PocketBase Instance:**
   - Run your PocketBase instance and ensure it's accessible at the URL you've configured in the `DATABASE_URL` environment variable.

### Running the Development Server

Start the development server:

```bash
npm run dev
```

or

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### Building for Production

To create a production build:

```bash
npm run build
```

or

```bash
yarn build
```

### Running the Production Build

After building, you can start the production server with:

```bash
npm start
```

or

```bash
yarn start
```

## Project Structure

```plaintext
├── .next/                # Next.js build output (auto-generated)
├── node_modules/         # Project dependencies (auto-generated)
├── public/               # Public assets
├── src/                  # Source files
│   ├── app/              # Next.js app directory
│   │   ├── (frontend)/   # Public-facing pages
│   │   │   ├── auth/     # Authentication pages
│   │   │   │   ├── forgot-password/ # Forgot password page
│   │   │   │   ├── login/           # Login page
│   │   │   │   ├── register/        # Registration page
│   │   │   └── dashboard/           # Protected dashboard page
│   │   │       ├── layout.tsx       # Dashboard layout
│   │   │       └── page.tsx
│   │   ├── (protected)/ # Protected routes
│   │   │   ├── dashboard/ # Dashboard page
│   │   └── api/         # API routes
│   │       ├── auth/    # Authentication API routes
│   │       │   ├── forgot/   # Forgot password API
│   │       │   ├── login/    # Login API
│   │       │   ├── logout/   # Logout API
│   │       │   ├── refresh/  # Refresh token API
│   │       │   ├── reset/    # Password reset API
│   │       │   ├── signup/   # Sign-up API
│   │       │   └── me/       # Get user info API
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Libraries and utilities
│   ├── stores/       # Global state management (e.g., Zustand)
│   ├── constants.ts  # Global constants
│   ├── env.ts        # Environment variable handling
│   ├── utils.ts      # Utility functions
│   ├── types.ts      # TypeScript types
├── .env                    # Environment variables
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Files and directories to ignore in Git
├── .prettierrc.json        # Prettier configuration
├── next.config.mjs         # Next.js configuration
├── next-env.d.ts           # Next.js TypeScript environment declaration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project metadata and scripts
├── yarn.lock               # Yarn lockfile (for dependencies)
└── README.md               # Project documentation
```

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the MIT License.
