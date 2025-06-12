// HomeScreen.tsx

import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { getCurrentStreak } from "@/services/database";
import IconFire from "@/svgs/IconFire";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react"; // Añade useCallback
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const [streakDays, setStreakDays] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    // Tu animación de `useEffect` está perfecta y puede quedarse como está.
    useEffect(() => {
        const pulse = () => {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
            ]).start(pulse);
        };
        pulse();

        Animated.timing(opacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        
        // No es necesario limpiar aquí si el pulse es infinito
    }, []);

    // ▼▼▼ 2. USA `useFocusEffect` PARA CARGAR LOS DATOS DE LA RACHA ▼▼▼
    useFocusEffect(
      // `useCallback` es una optimización recomendada para `useFocusEffect`
      useCallback(() => {
        const loadStreakData = async () => {
          setIsLoading(true); // Muestra el indicador de carga
          try {
            const currentStreak = await getCurrentStreak();
            setStreakDays(currentStreak);
            console.log(`Streak loaded: ${currentStreak} days.`);
          } catch (error) {
            console.error("Failed to load streak from HomeScreen:", error);
            setStreakDays(0); // En caso de error, mostramos 0
          } finally {
            setIsLoading(false); // Oculta el indicador de carga
          }
        };

        loadStreakData();

        // No se necesita una función de limpieza para una carga de datos simple
      }, []) // El array vacío asegura que la función `loadStreakData` no se recree innecesariamente
    );

    return (
        <LayoutScreen>
            <View style={styles.headerDecorationRight}></View>
            <View style={styles.headerDecorationLeft}></View>

            <View style={styles.container}>
                <View style={styles.streakContainer}>
                    <Animated.View 
                        style={[
                            styles.fireContainer,
                            { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
                        ]}
                    >
                        <IconFire width={width / 3.5} height={width / 3.5} />
                    </Animated.View>
                    
                    <GradientText 
                        colors={['rgb(255, 151, 104)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} 
                        style={styles.streakText}
                    >
                        {/* ▼▼▼ 3. LA LÓGICA DE LA UI YA ESTÁ LISTA PARA MOSTRAR LOS DATOS ▼▼▼ */}
                        {isLoading ? '...' : `${streakDays} day${streakDays !== 1 ? 's' : ''}`}
                    </GradientText>

                    <CustomText style={styles.subtitle}>
                        Of current streak
                    </CustomText>
                    
                    <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => router.push('/activities/register-activity')}
                    >
                        <Ionicons name="add-circle" size={24} color="#FF9768" />
                        <CustomText style={styles.addButtonText}>
                            Add Today's Activity
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </View>
        </LayoutScreen>
    )
}

// Los estilos permanecen iguales
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    streakContainer: {
        alignItems: 'center',   
        justifyContent: 'center',
        padding: 20,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 151, 104, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 40,
        borderWidth: 1,
        borderColor: 'rgba(255, 151, 104, 0.3)',
    },
    addButtonText: {
        marginLeft: 10,
        color: '#FF9768',
        fontWeight: '600',
        fontSize: 16,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 100,
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
    },
    saveButton: {
        backgroundColor: '#FF9768',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    fireContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    streakText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#f4f4f5',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: 'rgb(243, 236, 253)',
        marginTop: 5,
    },
    headerDecorationRight: {
        width: 120, 
        height: 120,
        backgroundColor: 'rgba(170, 125, 241, 0.9)',
        position: 'absolute',
        transform: [{ translateY: -50 }, { translateX: width / 2 }],
        borderRadius: 100,
        filter: 'blur(60px)',
        pointerEvents: 'none',
    },
    headerDecorationLeft: {
        width: 120, 
        height: 120,
        backgroundColor: 'rgba(241, 125, 131, 0.9)',
        position: 'absolute',
        transform: [{ translateY: -50 }, { translateX: 30 }],
        borderRadius: 100,
        filter: 'blur(60px)',
        pointerEvents: 'none',
    }
});