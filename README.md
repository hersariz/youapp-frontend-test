# YouApp Frontend Technical Challenge

This project is a mobile web application built with Next.js as part of a frontend technical challenge. The application is based on a Figma design and includes features like user registration, login, and profile viewing/editing.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 13+ (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API Communication**: [Axios](https://axios-http.com/)
- **Language**: TypeScript

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/)

### Installation & Running

1.  **Clone the repository** (or if you already have the project, navigate into the directory).

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The first page you'll see is the Login page.

## Project Structure

The project follows a feature-based structure within the `app` directory:

```
app/
├── (auth)/                 # Route group for authentication pages
│   ├── login/page.tsx      # Login page UI and logic
│   └── register/page.tsx   # Register page UI and logic
├── (main)/                 # Route group for main app pages (post-login)
│   └── profile/page.tsx    # Profile page UI and logic
├── components/             # Shared React components (if any)
├── lib/                    # Shared library/helper functions
│   └── api.ts              # Axios instance for API calls
└── layout.tsx              # Root layout for the application
```

## API Endpoints

The application connects to the following API endpoints provided by `http://techtest.youapp.ai/`:

- `POST /api/register`: For user registration.
- `POST /api/login`: For user login.
- `GET /api/profile`: To fetch user profile data.
- `PUT /api/profile`: To update user profile data.

Authentication is handled by sending an `x-access-token` in the headers after a successful login.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
