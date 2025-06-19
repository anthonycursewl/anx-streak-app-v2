import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Onest-Regular': require('../assets/fonts/Onest.ttf'),
  });

  
  useEffect(() => {
    const isFontTaskDone = fontsLoaded || fontError;

    if (isFontTaskDone) {
      console.log('[Layout] All tasks are done. Hiding splash screen.');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);


  if (fontError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load fonts.</Text>
        <Text style={styles.errorText}>{fontError.message}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  }
});