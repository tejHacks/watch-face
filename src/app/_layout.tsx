import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { brand } from '@/brand';
import { usePalette } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const scheme = useColorScheme();
  const c = usePalette();

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider value={{ ...base, colors: { ...base.colors, primary: c.primary, background: c.bg, card: c.bg, text: c.text, border: c.border } }}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: c.bg },
          headerTintColor: c.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: c.bg },
        }}>
        {brand.screens.map((s) => (
          <Stack.Screen key={s.name} name={s.name} options={{ title: s.title, headerLargeTitle: s.large, presentation: s.modal ? 'modal' : undefined }} />
        ))}
      </Stack>
    </ThemeProvider>
  );
}
