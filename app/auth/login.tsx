import Button from "@/components/Button/Button";
import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import Input from "@/components/Input/Input";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { useLoginStore } from '@/services/stores/auth/useLoginStore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const { login, loading, error } = useLoginStore()

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
            return;
        }

        const v = await login(email, password)
        if (v) {
            router.replace('/dashboard')
        }
    };

    const handleRegisterNavigation = () => {
        router.push('/auth/register');
    };

    useEffect(() => {
        if (error) {
            Alert.alert('Anx | Error', error);
        }
    }, [error]);

    return (
        <LayoutScreen>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.formContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                        <Image source={require('@/assets/images/anx/anx_transparent.png')} style={{ width: 150, height: 65, resizeMode: 'cover' }} />
                    </View>
                    
                    <View style={{ gap: 10, justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start' }}>
                        <GradientText
                        colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
                        style={{ fontSize: 20 }}
                        >Email</GradientText>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder="youremail@email.com"
                            keyboardType="email-address"
                        />
                    </View>
                    
                    <View style={{ gap: 10, justifyContent: 'flex-start', width: '100%', alignItems: 'flex-start' }}>
                        <GradientText
                        colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
                        style={{ fontSize: 20 }}
                        >Password</GradientText>
                        <Input
                            value={password}
                            onChangeText={setPassword}
                            placeholder="••••••••"
                            keyboardType="default"
                            secureTextEntry
                        />
                    </View>
                    
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Button style={styles.buttonText} onPress={handleLogin}>
                            Sign In
                        </Button>
                        )}
                    
                    <View style={styles.registerContainer}>
                        <CustomText style={styles.registerText}>Don't have an account? </CustomText>
                        <TouchableOpacity onPress={handleRegisterNavigation}>
                            <CustomText style={[styles.registerText, styles.registerLink]}>
                                Sign Up
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                </View>

            </KeyboardAvoidingView>
        </LayoutScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginButton: {
        marginTop: 24,
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        width: '100%',
        marginTop: 20
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerText: {
        fontSize: 16,
    },
    registerLink: {
        color: '#007AFF',
        fontWeight: '600',
    },
});