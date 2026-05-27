import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PALETTE, ZONE_COLORS } from '../../constants/Colors';
import { useWeatherContext } from '../../context/WeatherContext';

export default function TabLayout() {
  const { current } = useWeatherContext();
  const activeColor = current ? ZONE_COLORS[current.zone].primary : PALETTE.live;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#0f172a',
          borderTopColor:  PALETTE.border,
          borderTopWidth:  1,
          height:          56,
        },
        tabBarActiveTintColor:   activeColor,
        tabBarInactiveTintColor: '#475569',
        tabBarShowLabel:         false,
        headerShown:             false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coordinator"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
