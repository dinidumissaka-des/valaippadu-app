import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ZONE_COLORS } from '../../constants/Colors';
import { useWeatherContext } from '../../context/WeatherContext';

export default function TabLayout() {
  const { current } = useWeatherContext();
  const activeColor = current ? ZONE_COLORS[current.zone].primary : '#16a34a';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor:  '#e2e8f0',
          borderTopWidth:  1,
          height:          56,
        },
        tabBarActiveTintColor:   activeColor,
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel:         false,
        headerShown:             false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coordinator"
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
