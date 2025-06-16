# Anx Streak App

The story behind this app is larger than you think, but I'm going to keep it short. I had to pass through a lot of things these months, and I wanted to create something that could help me and others. I started with the idea of creating a streak app, but I soon realized that I needed to create a full-fledged app to make it work. It's been hard months, because even if you're passing through bad moments, you gotta keep working hard. It kept me sad, and with a low energy to face my day. So for that reason I decided to make a strek app, to track my daily activities and give myself that extra push to keep going. I hope you find it useful.

## 🚀 Technologies

- **Framework**: React Native using Expo 
- **Language**: TypeScript
- **State Management**: Zustand
- **HTTP Client**: secureFetch by me
- **Authentication**: Custom auth flow with JWT

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/anthonycursewl/anx-streak-app-v2.git
   cd anx-streak-app-v2
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Fix broken dependencies
   In order to fix broken dependencies, run the following command:
   ```bash
   npx expo install --fix
   ```

4. Run the development server
   ```bash
   npx expo start
   ```

5. Run the app
   ```bash
   npx expo run:android
   # or
   npx expo run:ios
   ```

## 🏗️ Project Structure

> [!NOTE]
> This app is file base routing, so it means that all folders inside app folder are routes. If you want to create a new route, just create a new folder inside app folder. If you want to create a new component, just create a new folder inside components folder and so on.

- `/app` - Main application code with Expo Router
  - `/auth` - Authentication related pages and components
- `/services` - Business logic and API services
  - `/stores` - Zustand stores
  - `/http` - HTTP client and interceptors
- `/config` - Application configuration
- `/public` - Static files

## 📦 Dependencies

- `expo` - The React Native Framework
- `react` - Core React libraries
- `typescript` - Type checking
- `zustand` - State management
- `secureFetch` - HTTP client
- `expo-router` - Router for React Native

## 🔒 Authentication

The app uses JWT-based authentication with secure HTTP-only cookies.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/name-of-your-feature`)
3. Commit your changes (`git commit -m 'Add some changes'`)
4. Push to the branch (`git push origin feature/name-of-your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
