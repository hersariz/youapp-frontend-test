# YouApp Frontend Technical Challenge

This project is a mobile web application built with Next.js 13+ as part of the YouApp frontend technical challenge. The application follows the provided Figma design and includes features like user registration, login, profile management, and interest selection.

## 📱 Live Demo

[View the deployed application](https://youapp-frontend-test.vercel.app/) (If deployed)

## ✨ Features

### Authentication
- User registration with email/username/password validation
- User login with credential (email or username) support
- Token-based authentication
- Auto-redirect after successful login

### Profile Management
- View and edit profile information
- Update personal details (name, birthday, height, weight)
- Gender selection
- About/bio section
- Profile picture upload (preview functionality)
- Interest selection and management

### Additional Features
- Zodiac sign calculation (Western and Chinese) based on birthday
- Animated borders and glow effects
- Responsive design for mobile devices
- Local data persistence
- Form validation
- Loading states and error handling

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 13+ with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom configuration
- **API Communication**: [Axios](https://axios-http.com/)
- **Language**: TypeScript
- **Image Handling**: React Image Crop

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hersariz/youapp-frontend-test.git
   cd youapp-frontend-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## 📂 Project Structure

```
app/
├── (auth)/                      # Route group for authentication pages
│   ├── login/page.tsx           # Login page UI and logic
│   └── register/page.tsx        # Register page UI and logic
├── (main)/                      # Route group for main app pages (post-login)
│   └── profile/                 # Profile-related pages
│       ├── page.tsx             # Profile view/edit page
│       └── interest/page.tsx    # Interest selection page
├── lib/                         # Shared utility functions
│   ├── api.ts                   # API service with Axios
│   └── zodiac.ts               # Zodiac calculation functions
└── globals.css                  # Global styles
```

## 🔌 API Integration

The application connects to the YouApp API through a Next.js proxy:

- `POST /api/login`: User authentication
- `POST /api/register`: User registration
- `GET /api/getProfile`: Fetch user profile data
- `PUT /api/updateProfile`: Update user profile data
- `POST /api/createProfile`: Create new user profile

Authentication is handled by sending an `x-access-token` in the headers after login.

## 🌟 Technical Implementation

### Architecture
- Component-based architecture with separation of concerns
- Custom hooks for state management
- Centralized API layer with interceptors
- Token-based authentication flow

### UI/UX Features
- Tailwind CSS with custom configuration
- Animated borders and glow effects
- Responsive design for mobile devices
- Form validation and error handling
- Loading states

### Data Management
- Local storage for persistent data
- Token management
- State handling for form inputs

## 📝 Development Notes

- The application includes fallback data handling when API is unavailable
- Custom calculation for zodiac signs based on birth date
- Mobile-first approach with proper responsive layouts

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🚀 Deployment

This application can be easily deployed on [Vercel](https://vercel.com) or any other hosting platform that supports Next.js.
