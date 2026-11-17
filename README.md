# Watch Face

> A custom face for your wrist.

## What's built

- iPhone **face designer** with a live, ticking preview: analog / digital / Ankara styles, six accents, date & seconds, complications

## Getting it onto the watch

watchOS does **not** allow third-party watch faces. What you can ship is a watchOS app with **WidgetKit
complications** that sit on Apple's faces (plus sharing a configured Apple face). Plan:

1. Add a watch target with `@bacons/apple-targets` (Swift/SwiftUI code lives in `targets/watch/`).
2. Build complications in WidgetKit using the config chosen here.
3. Sync the config phone → watch via an App Group / WatchConnectivity.

## Run it

```bash
npm install          # already done once after scaffolding
npx expo start       # then press i (iOS), a (Android) or w (web)
npm run typecheck
npx expo lint
```

Built on **Expo SDK 58** (React Native 0.88, React 19.3), Expo Router, TypeScript.
Everything is stored on-device with AsyncStorage (`src/lib/storage.ts`); there is no backend yet.

## Structure

- `src/app/` — screens (Expo Router; every file is a route)
- `src/brand.ts` — app name, brand colours, screen titles
- `src/theme.ts` — light/dark design tokens
- `src/components/ui.tsx` — shared UI primitives
