# Language Learning App

A modern, interactive language learning mobile application built with React Native and Expo. This app provides an engaging, gamified learning experience with multiple exercise types, progress tracking, and real-time feedback.

## Overview

This application delivers a comprehensive language learning platform featuring diverse interactive exercises, streak tracking, and a reward system to keep learners motivated. Built with cutting-edge mobile technologies, it offers a smooth, native experience on both iOS and Android platforms.

## Key Features

### 🎯 Interactive Exercises

- **Multiple Choice** - Select the correct answer from multiple options
- **Type Answer** - Practice writing skills with keyboard input exercises
- **Word Bank** - Construct sentences by selecting words in the correct order
- **Match Pairs** - Connect related words, phrases, or translations
- **Draggable Word Bank** - Interactive drag-and-drop sentence construction

### 💪 Engagement & Motivation

- **Streak System** - Track daily learning consistency with fire icons
- **Hearts Mechanic** - Lives system that encourages careful learning
- **Progress Tracking** - Visual progress bars showing lesson completion
- **Completion Screens** - Celebratory feedback with confetti animations
- **Real-time Feedback** - Immediate visual and haptic feedback on answers

### 🌍 Internationalization

- Multi-language support built-in
- Easy content localization with i18n framework
- Support for English and Spanish interfaces

### 🎨 Modern UI/UX

- Clean, intuitive interface inspired by leading language learning platforms
- Smooth animations and transitions
- Responsive design optimized for various screen sizes
- Custom icon library with themed components

## Technology Stack

### Core Technologies

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe code with enhanced developer experience
- **Expo Router** - File-based navigation system

### State Management & Data

- **Zustand** - Lightweight state management for lesson progress
- **AsyncStorage** - Local data persistence
- **Context API** - App-wide state sharing

### Development & Quality

- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking
- **Expo Dev Client** - Enhanced development experience

## Project Structure

```
├── app/                      # Main application screens and routing
│   ├── (tabs)/              # Tab-based navigation
│   ├── lesson.tsx           # Lesson player screen
│   └── _layout.tsx          # Root layout configuration
├── features/                 # Feature-based modules
│   ├── home/                # Home screen features
│   └── lesson/              # Lesson-related components
│       └── components/      # Exercise type components
├── components/              # Reusable UI components
│   ├── ui/                  # Core UI elements
│   └── icons/               # Custom icon library
├── store/                   # State management
│   ├── lesson-store.ts      # Lesson state with Zustand
│   └── storage.ts           # Persistent storage utilities
├── constants/               # App-wide constants and themes
├── i18n/                    # Internationalization files
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
└── assets/                  # Static assets and data
    ├── data/                # Lesson content and exercises
    └── images/              # Image assets
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- iOS Simulator (for macOS) or Android Emulator
- Expo Go app (optional, for quick testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Duolingo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device testing

### Building for Production

#### iOS

```bash
npx expo build:ios
```

#### Android

```bash
npx expo build:android
```

## Development

### Running Tests

```bash
npm test
```

### Code Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Customization

### Adding New Lessons

Edit the lesson content in `assets/data/lesson.json` following the existing structure:

```json
{
  "exercises": [
    {
      "type": "multipleChoice",
      "question": "Your question here",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1"
    }
  ]
}
```

### Supported Exercise Types

- `multipleChoice` - Multiple choice questions
- `typeAnswer` - Text input exercises
- `wordBank` - Word selection exercises
- `matchPairs` - Matching exercises
- `draggableWordBank` - Drag and drop sentence construction

### Theming

Modify colors and styles in `constants/Colors.ts` and `constants/theme.ts` to match your brand identity.

### Localization

Add new languages by creating translation files in the `i18n/` directory following the existing pattern.

## Architecture Highlights

### State Management

- **Lesson Store**: Manages exercise progress, answers, and lesson state
- **Persistent Storage**: Saves user progress, streaks, and hearts
- **Context Providers**: Share authentication and settings across the app

### Component Design

- **Feature-based organization**: Related components grouped by feature
- **Reusable UI library**: Consistent design system components
- **Exercise abstraction**: Easy to add new exercise types

### Performance

- **Optimized renders**: Memoization and efficient state updates
- **Lazy loading**: Dynamic imports for reduced initial bundle size
- **Native animations**: Smooth, performant UI transitions

## Contributing

This project follows standard React Native and TypeScript best practices. When contributing:

1. Follow the existing code style and ESLint rules
2. Add TypeScript types for all new code
3. Test on both iOS and Android platforms
4. Update documentation for new features

## License

[Your License Here]

## Support

For questions, issues, or feature requests, please contact the development team or open an issue in the repository.

---

**Built with ❤️ using React Native and Expo**
