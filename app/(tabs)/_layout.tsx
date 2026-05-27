import { Tabs } from 'expo-router';
import { View, type ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ZONE_COLORS } from '../../constants/Colors';
import { useWeatherContext } from '../../context/WeatherContext';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, color, focused, activeColor }: {
  name: IoniconName;
  color: ColorValue;
  focused: boolean;
  activeColor: string;
}) {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4 }}>
      <Ionicons name={name} size={22} color={color} />
      {focused && (
        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: activeColor, marginTop: 3 }} />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { current } = useWeatherContext();
  const activeColor = (current ? ZONE_COLORS[current.zone].primary : '#16a34a') as string;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor:  '#e2e8f0',
          borderTopWidth:  1,
          height:          60,
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
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" color={color} focused={focused} activeColor={activeColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="calendar-outline" color={color} focused={focused} activeColor={activeColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="parameters"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="analytics-outline" color={color} focused={focused} activeColor={activeColor} />
          ),
        }}
      />
      <Tabs.Screen
        name="coordinator"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings-outline" color={color} focused={focused} activeColor={activeColor} />
          ),
        }}
      />
    </Tabs>
  );
}
