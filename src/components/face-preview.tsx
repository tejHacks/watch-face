import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type FaceStyle = 'analog' | 'digital' | 'ankara';

export interface FaceConfig {
  style: FaceStyle;
  accent: string;
  showDate: boolean;
  showSeconds: boolean;
  complication: 'none' | 'activity' | 'battery' | 'next-prayer';
}

const COMPLICATION_LABEL: Record<FaceConfig['complication'], string> = {
  none: '',
  activity: '🔥 420 kcal',
  battery: '🔋 82%',
  'next-prayer': '🙏 Midday · 12:00',
};

/** A ticking hand rotated around the dial centre. */
function Hand({ size, angle, length, width, color }: { size: number; angle: number; length: number; width: number; color: string }) {
  return (
    <View style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${angle}deg` }] }]} pointerEvents="none">
      <View style={{ position: 'absolute', left: size / 2 - width / 2, top: size / 2 - length, width, height: length + width, borderRadius: width, backgroundColor: color }} />
    </View>
  );
}

/** Live preview of a watch face (rendered on the phone). */
export function FacePreview({ config, size = 260 }: { config: FaceConfig; size?: number }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const date = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }).toUpperCase();
  const comp = COMPLICATION_LABEL[config.complication];

  return (
    <View style={[styles.case, { width: size * 0.86, height: size * 1.04 }]}>
      <View style={[styles.screen, { width: size * 0.8, height: size * 0.98 }]}>
        {config.style === 'digital' ? (
          <View style={styles.center}>
            {config.showDate ? <Text style={[styles.date, { color: config.accent }]}>{date}</Text> : null}
            <Text style={styles.digital}>
              {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}
            </Text>
            {config.showSeconds ? <Text style={[styles.secs, { color: config.accent }]}>{String(s).padStart(2, '0')}</Text> : null}
            {comp ? <Text style={styles.comp}>{comp}</Text> : null}
          </View>
        ) : (
          <View style={{ width: size * 0.72, height: size * 0.72 }}>
            {/* Dial ticks / Ankara ring */}
            {Array.from({ length: 12 }, (_, i) => (
              <View key={i} style={[StyleSheet.absoluteFill, { transform: [{ rotate: `${i * 30}deg` }] }]}>
                <View
                  style={{
                    position: 'absolute',
                    left: (size * 0.72) / 2 - (config.style === 'ankara' ? 6 : 2),
                    top: 2,
                    width: config.style === 'ankara' ? 12 : 4,
                    height: config.style === 'ankara' ? 12 : i % 3 === 0 ? 16 : 8,
                    borderRadius: config.style === 'ankara' ? (i % 2 ? 6 : 2) : 2,
                    backgroundColor: config.style === 'ankara' ? (i % 2 ? config.accent : '#FACC15') : i % 3 === 0 ? '#fff' : '#6B7280',
                    transform: config.style === 'ankara' && i % 2 === 0 ? [{ rotate: '45deg' }] : undefined,
                  }}
                />
              </View>
            ))}
            {config.showDate ? <Text style={[styles.analogDate, { color: config.accent, top: size * 0.44 }]}>{date}</Text> : null}
            {comp ? <Text style={[styles.analogComp, { top: size * 0.2 }]}>{comp}</Text> : null}
            <Hand size={size * 0.72} angle={((h % 12) + m / 60) * 30} length={size * 0.19} width={7} color="#fff" />
            <Hand size={size * 0.72} angle={(m + s / 60) * 6} length={size * 0.29} width={5} color="#fff" />
            {config.showSeconds ? <Hand size={size * 0.72} angle={s * 6} length={size * 0.31} width={2} color={config.accent} /> : null}
            <View style={[styles.pin, { left: (size * 0.72) / 2 - 6, top: (size * 0.72) / 2 - 6, backgroundColor: config.accent }]} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  case: { backgroundColor: '#1F2937', borderRadius: 64, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  screen: { backgroundColor: '#000', borderRadius: 54, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: 4 },
  digital: { color: '#fff', fontSize: 64, fontWeight: '700', fontVariant: ['tabular-nums'] },
  secs: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  date: { fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  comp: { color: '#D1D5DB', fontSize: 13, marginTop: 6 },
  analogDate: { position: 'absolute', alignSelf: 'center', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  analogComp: { position: 'absolute', alignSelf: 'center', color: '#D1D5DB', fontSize: 11 },
  pin: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
});
