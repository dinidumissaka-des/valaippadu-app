import '../global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import {
  NotoSansTamil_400Regular,
  NotoSansTamil_700Bold,
} from '@expo-google-fonts/noto-sans-tamil';
import { WeatherProvider } from '../context/WeatherContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    NotoSansTamil_400Regular,
    NotoSansTamil_700Bold,
  });

  useEffect(() => { if (error) throw error; }, [error]);
  useEffect(() => { if (loaded) SplashScreen.hideAsync(); }, [loaded]);

  if (!loaded) return null;

  return (
    <WeatherProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle:      { backgroundColor: '#ffffff' },
          headerTintColor:  '#0f172a',
          headerTitleStyle: { fontFamily: 'Manrope_700Bold', fontSize: 15 },
          headerShadowVisible: true,
          contentStyle:     { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(tabs)"                options={{ headerShown: false }} />
        <Stack.Screen name="forecast"              options={{ title: '7-Day Forecast' }} />
        <Stack.Screen name="parameters"            options={{ title: "Today's Readings" }} />
        <Stack.Screen name="coordinator/simulator" options={{ title: 'CSS Simulator' }} />
      </Stack>
    </WeatherProvider>
  );
}
