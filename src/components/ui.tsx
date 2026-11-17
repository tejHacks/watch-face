/**
 * Small set of shared UI primitives used by every screen.
 */
import type { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { radius, space, usePalette } from '@/theme';

export function Screen({ children, scroll = true, style }: { children: ReactNode; scroll?: boolean; style?: StyleProp<ViewStyle> }) {
  const c = usePalette();
  const body = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, style]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, { flex: 1 }, style]}>{children}</View>
  );
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: c.bg }}>
      {body}
    </SafeAreaView>
  );
}

export function H1({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const c = usePalette();
  return <Text style={[styles.h1, { color: c.text }, style]}>{children}</Text>;
}

export function H2({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const c = usePalette();
  return <Text style={[styles.h2, { color: c.text }, style]}>{children}</Text>;
}

export function Body({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: StyleProp<TextStyle> }) {
  const c = usePalette();
  return <Text style={[styles.body, { color: muted ? c.muted : c.text }, style]}>{children}</Text>;
}

export function Label({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const c = usePalette();
  return <Text style={[styles.label, { color: c.subtle }, style]}>{children}</Text>;
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  const c = usePalette();
  const base = [styles.card, { backgroundColor: c.card, borderColor: c.border }, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [base, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}>
      {children}
    </Pressable>
  );
}

type ButtonProps = Omit<PressableProps, 'style'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
  big?: boolean;
};

export function Button({ title, variant = 'primary', style, big, onPress, ...rest }: ButtonProps) {
  const c = usePalette();
  const bg = variant === 'primary' ? c.primary : variant === 'danger' ? c.danger : c.card;
  const fg = variant === 'secondary' ? c.text : variant === 'primary' ? c.primaryText : '#fff';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={(e) => {
        Haptics.selectionAsync().catch(() => {});
        onPress?.(e);
      }}
      style={({ pressed }) => [
        styles.button,
        big && styles.buttonBig,
        { backgroundColor: bg, borderColor: variant === 'secondary' ? c.border : bg, opacity: rest.disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
      {...rest}>
      <Text style={[styles.buttonText, big && { fontSize: 20 }, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Pill({ children, active, onPress }: { children: ReactNode; active?: boolean; onPress?: () => void }) {
  const c = usePalette();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ selected: active }}
      style={[styles.pill, { borderColor: active ? c.primary : c.border, backgroundColor: active ? c.primary : c.card }]}>
      <Text style={{ color: active ? c.primaryText : c.muted, fontSize: 13, fontWeight: '600' }}>{children}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  const c = usePalette();
  return (
    <View style={{ gap: 6 }}>
      <Label>{label}</Label>
      <TextInput
        placeholderTextColor={c.subtle}
        {...props}
        style={[styles.input, { color: c.text, backgroundColor: c.card, borderColor: c.border }, props.multiline && { minHeight: 120, textAlignVertical: 'top' }, props.style]}
      />
    </View>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: space.sm }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: { padding: space.md, gap: space.md, paddingBottom: space.xl * 2 },
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  card: { borderWidth: StyleSheet.hairlineWidth * 2, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  button: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 14, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'center' },
  buttonBig: { paddingVertical: 22, borderRadius: radius.lg },
  buttonText: { fontSize: 16, fontWeight: '700' },
  pill: { borderWidth: 1, borderRadius: radius.pill, paddingVertical: 8, paddingHorizontal: 14 },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16 },
});
