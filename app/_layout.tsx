import { initDatabase } from '@/services/database';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Evita que la pantalla de carga se oculte automáticamente.
// Esto nos da control total sobre cuándo mostrar la app.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // --- TAREA 1: CARGAR FUENTES (tu código existente) ---
  const [fontsLoaded, fontError] = useFonts({
    'Onest-Regular': require('../assets/fonts/Onest.ttf'),
  });

  // --- TAREA 2: INICIALIZAR LA BASE DE DATOS ---
  // Usamos estados para rastrear el progreso de la inicialización de la BD.
  const [dbInitialized, setDbInitialized] = useState(false);
  const [dbError, setDbError] = useState<Error | null>(null);

  useEffect(() => {
    // Función para configurar la base de datos. Se ejecuta una sola vez.
    const setupDatabase = async () => {
      try {
        console.log('[Layout] Initializing database...');
        await initDatabase();
        setDbInitialized(true);
        console.log('[Layout] Database initialized successfully.');
      } catch (e) {
        console.error('[Layout] Database initialization failed:', e);
        setDbError(e as Error);
      }
    };
    
    setupDatabase();
  }, []); // El array vacío [] asegura que este efecto se ejecute solo una vez.

  // --- CONTROL DE CARGA ---
  // Este efecto se ejecutará cada vez que el estado de carga cambie.
  useEffect(() => {
    // Verificamos si AMBAS tareas han terminado (con éxito o con error).
    const isFontTaskDone = fontsLoaded || fontError;
    const isDbTaskDone = dbInitialized || dbError;

    if (isFontTaskDone && isDbTaskDone) {
      // Si todo está listo, ocultamos la pantalla de carga para mostrar la app.
      console.log('[Layout] All tasks are done. Hiding splash screen.');
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, dbInitialized, dbError]);

  // --- RENDERIZADO CONDICIONAL ---

  // Si hay un error con la base de datos, mostramos una pantalla de error.
  if (dbError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Failed to load database.</Text>
        <Text style={styles.errorText}>{dbError.message}</Text>
      </View>
    );
  }

  // Si las fuentes o la base de datos AÚN se están cargando, no renderizamos nada.
  // La pantalla de carga (SplashScreen) seguirá visible para el usuario.
  if (!fontsLoaded || !dbInitialized) {
    return null;
  }
  
  // Si llegamos aquí, significa que todo se cargó correctamente.
  // Renderizamos la aplicación principal.
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