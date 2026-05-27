import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Zone, ZONE_COLORS } from '../constants/Colors';
import { STRINGS, Lang } from '../constants/strings';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface CSSGaugeProps {
  score:       number;
  zone:        Zone;
  size?:       number;
  showLabels?: boolean;
  lang?:       Lang;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const end      = polarToCartesian(cx, cy, r, endAngle);
  const start    = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${end.x} ${end.y} A ${r} ${r} 0 ${largeArc} 0 ${start.x} ${start.y}`;
}

export function CSSGauge({ score, zone, size = 148, showLabels = true, lang = 'ta' }: CSSGaugeProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size / 2 - 14;
  const sw = 12;

  const START_ANGLE = 135;
  const TOTAL_SWEEP = 270;

  const trackPath = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + TOTAL_SWEEP);
  const progress  = useSharedValue(0);

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

  const colors  = ZONE_COLORS[zone];
  const zoneKey = zone.toLowerCase() as 'go' | 'caution' | 'stop';

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Path d={trackPath} stroke="#e2e8f0" strokeWidth={sw} strokeLinecap="round" fill="none" />
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={colors.primary}
          strokeWidth={sw}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {showLabels && (
        <View className="items-center" pointerEvents="none">
          <Text style={{ color: colors.primary, fontFamily: 'Manrope_500Medium', fontSize: 40, lineHeight: 44 }}>
            {score}
          </Text>
          <Text style={{ color: colors.primary, fontFamily: 'Manrope_600SemiBold', fontSize: 13 }}>
            {STRINGS[lang][zoneKey]}
          </Text>
          <Text style={{ color: colors.primary, fontFamily: 'NotoSansTamil_400Regular', fontSize: 11 }}>
            {STRINGS.ta[zoneKey]}
          </Text>
        </View>
      )}
    </View>
  );
}
