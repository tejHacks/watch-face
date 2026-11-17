import { Pressable, View } from 'react-native';

import { FacePreview, type FaceConfig } from '@/components/face-preview';
import { Body, Card, Label, Pill, Row, Screen } from '@/components/ui';
import { useStoredState } from '@/lib/storage';

const ACCENTS = ['#F97316', '#22D3EE', '#A3E635', '#F43F5E', '#A78BFA', '#FACC15'];

const DEFAULT: FaceConfig = { style: 'analog', accent: '#F97316', showDate: true, showSeconds: true, complication: 'activity' };

/** iPhone companion: design the face and complication, preview it live. */
export default function Designer() {
  const [config, setConfig] = useStoredState<FaceConfig>('face-config', DEFAULT);
  const set = (patch: Partial<FaceConfig>) => setConfig((c) => ({ ...c, ...patch }));

  return (
    <Screen>
      <FacePreview config={config} />

      <Card>
        <Label>Style</Label>
        <Row style={{ flexWrap: 'wrap' }}>
          {(['analog', 'digital', 'ankara'] as const).map((s) => (
            <Pill key={s} active={config.style === s} onPress={() => set({ style: s })}>
              {s[0].toUpperCase() + s.slice(1)}
            </Pill>
          ))}
        </Row>
      </Card>

      <Card>
        <Label>Accent</Label>
        <Row style={{ flexWrap: 'wrap', gap: 12 }}>
          {ACCENTS.map((a) => (
            <Pressable
              key={a}
              onPress={() => set({ accent: a })}
              accessibilityLabel={`Accent ${a}`}
              accessibilityState={{ selected: config.accent === a }}
              style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: a, borderWidth: 3, borderColor: config.accent === a ? '#fff' : 'transparent' }}
            />
          ))}
        </Row>
      </Card>

      <Card>
        <Label>Details</Label>
        <Row style={{ flexWrap: 'wrap' }}>
          <Pill active={config.showDate} onPress={() => set({ showDate: !config.showDate })}>Date</Pill>
          <Pill active={config.showSeconds} onPress={() => set({ showSeconds: !config.showSeconds })}>Seconds</Pill>
        </Row>
        <Label style={{ marginTop: 8 }}>Complication</Label>
        <Row style={{ flexWrap: 'wrap' }}>
          {(['none', 'activity', 'battery', 'next-prayer'] as const).map((c) => (
            <Pill key={c} active={config.complication === c} onPress={() => set({ complication: c })}>
              {c === 'next-prayer' ? 'Next prayer' : c[0].toUpperCase() + c.slice(1)}
            </Pill>
          ))}
        </Row>
      </Card>

      <View>
        <Body muted style={{ fontSize: 13, lineHeight: 19 }}>
          watchOS only allows Apple&apos;s own faces, so this design ships to your wrist as WidgetKit complications from the watch app target. See README.
        </Body>
      </View>
    </Screen>
  );
}
