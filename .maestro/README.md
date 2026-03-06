# Maestro E2E Tests for Duolingo Lesson App

This directory contains Maestro E2E test flows for testing the app's user interface and user journeys.

## Prerequisites

1. Install Maestro CLI:

   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. For iOS testing, ensure Xcode and iOS Simulator are installed.
3. For Android testing, ensure Android Studio and an emulator are set up.

## Running Tests

### Run all flows:

```bash
maestro test .maestro/
```

### Run a specific flow:

```bash
maestro test .maestro/lesson-complete-flow.yaml
```

### Run with a specific device:

```bash
# iOS
maestro test --device "iPhone 15" .maestro/

# Android
maestro test --device "emulator-5554" .maestro/
```

## Test Flows

- `lesson-start-flow.yaml` - Tests starting a lesson
- `lesson-complete-flow.yaml` - Tests completing a full lesson
- `exercise-multiple-choice.yaml` - Tests multiple choice exercises
- `exercise-type-answer.yaml` - Tests typing answer exercises
- `hearts-depletion.yaml` - Tests heart/lives system
- `lesson-restart.yaml` - Tests restarting a lesson

## Writing New Tests

See [Maestro documentation](https://maestro.mobile.dev/reference/commands) for available commands.

Basic flow structure:

```yaml
appId: com.yourcompany.duolingo
---
- launchApp
- assertVisible: "Element Text"
- tapOn: "Button Text"
```
