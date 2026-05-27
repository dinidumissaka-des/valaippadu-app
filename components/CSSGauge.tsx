import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Zone, ZONE_COLORS, PALETTE } from '../constants/Colors';
import { STRINGS } from '../constants/strings';
import { Lang } from '../constants/strings';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CSSGaugeProps {
  score:      number;
  zone:       Zone;
  size?:      number;
  showLabels?: boolean;
  lang?:      Lang;
}

// 270° arc starting from bottom-left (225°) going clockwise
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start     = polarToCartesian(cx, cy, r, endAngle);
  const end       = polarToCartesian(cx, cy, r, startAngle);
  const largeArc  = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

export function CSSGauge({ score, zone, size = 280, showLabels = true, lang = 'en' }: CSSGaugeProps) {
  const cx    = size / 2;
  const cy    = size / 2;
  const r     = size / 2 - 20;
  const sw    = 16;

  const START_ANGLE = 135;   // bottom-left
  const TOTAL_SWEEP = 270;

  const trackPath = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + TOTAL_SWEEP);

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(100, score)) / 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const endAngle = START_ANGLE + progress.value * TOTAL_SWEEP;
    return { d: describeArc(cx, cy, r, START_ANGLE, endAngle) };
  });

  const colors = ZONE_COLORS[zone];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background track */}
        <Path
          d={trackPath}
          stroke={PALETTE.border}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
        {/* Animated fill */}
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={colors.primary}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {showLabels && (
        <View style={styles.center} pointerEvents="none">
          <Text style={[styles.score, { color: colors.primary }]}>{score}</Text>
          <Text style={[styles.zoneEN, { color: colors.primary }]}>
            {STRINGS[lang][zone.toLowerCase() as 'go' | 'caution' | 'stop']}
          </Text>
          {lang === 'en' && (
            <Text style={[styles.zoneTA, { color: colors.text }]}>
              {STRINGS.ta[zone.toLowerCase() as 'go' | 'caution' | 'stop']}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  center:    { position: 'absolute', alignItems: 'center' },
  score:     { fontSize: 64, fontFamily: 'IBMPlexMono_700Bold', lineHeight: 70 },
  zoneEN:    { fontSize: 16, fontWeight: '600', letterSpacing: 2, marginTop: 4 },
  zoneTA:    { fontSize: 14, marginTop: 2 },
});
