import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStoredState } from '@/lib/storage';
import { usePalette } from '@/theme';

const slides: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  { icon: 'watch-outline', title: "Design your own watch face", body: "Analog, digital or Ankara-patterned. Pick a style and make it yours." },
  { icon: 'color-palette-outline', title: "Colours and details you choose", body: "Choose colours, hands and complications like the date and your next prayer time." },
  { icon: 'sparkles-outline', title: "Preview it live", body: "See your face tick in real time before you put it on your wrist." },
];

/** Shown once on first launch. */
export default function Onboarding() {
  const c = usePalette();
  const { width } = useWindowDimensions();
  const [, setSeen] = useStoredState('onboarded', false);
  const [page, setPage] = useState(0);
  const scroller = useRef<ComponentRef<typeof ScrollView>>(null);
  const last = page === slides.length - 1;
  const done = () => {
    setSeen(true);
    router.replace('/');
  };
  const next = () => {
    if (last) return done();
    scroller.current?.scrollTo({ x: (page + 1) * width, animated: true });
    setPage(page + 1);
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.bg }]}>
      <Pressable accessibilityRole="button" onPress={done} style={styles.skip} hitSlop={10}>
        <Text style={{ color: c.muted, fontWeight: '700' }}>Skip</Text>
      </Pressable>
      <ScrollView ref={scroller} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {slides.map((s) => (
          <View key={s.title} style={[styles.slide, { width }]}>
            <View style={[styles.halo, { backgroundColor: `${c.primary}1F` }]}>
              <View style={[styles.badge, { backgroundColor: c.primary }]}>
                <Ionicons name={s.icon} size={60} color={c.primaryText} />
              </View>
              <View style={[styles.dot, { backgroundColor: c.accent, right: 30, top: 34 }]} />
              <View style={[styles.dot, { backgroundColor: `${c.accent}66`, left: 26, bottom: 40, width: 30, height: 30, borderRadius: 15 }]} />
            </View>
            <Text style={[styles.title, { color: c.text }]}>{s.title}</Text>
            <Text style={[styles.body, { color: c.muted }]}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {slides.map((s, i) => (
            <View key={s.title} style={{ width: i === page ? 24 : 8, height: 8, borderRadius: 4, backgroundColor: i === page ? c.primary : c.border }} />
          ))}
        </View>
        <Pressable accessibilityRole="button" onPress={next} style={[styles.cta, { backgroundColor: c.primary }]}>
          <Text style={[styles.ctaText, { color: c.primaryText }]}>{last ? 'Get started' : 'Next'}</Text>
          <Ionicons name={last ? 'checkmark' : 'arrow-forward'} size={20} color={c.primaryText} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  skip: { alignSelf: 'flex-end', padding: 16 },
  slide: { paddingHorizontal: 28, justifyContent: 'center', gap: 20 },
  halo: { alignSelf: 'center', width: 220, height: 220, borderRadius: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  badge: { width: 128, height: 128, borderRadius: 38, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  dot: { position: 'absolute', width: 22, height: 22, borderRadius: 11 },
  title: { fontSize: 30, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  body: { fontSize: 17, lineHeight: 25, textAlign: 'center' },
  footer: { paddingHorizontal: 24, paddingBottom: 16, gap: 16, alignItems: 'center' },
  cta: { alignSelf: 'stretch', flexDirection: 'row', gap: 10, minHeight: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 18, fontWeight: '800' },
});
