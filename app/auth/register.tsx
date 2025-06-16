import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import Input from "@/components/Input/Input";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

type RegistrationStep = 'name' | 'email' | 'username' | 'password' | 'confirm';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    created_at: Date;
    password: string;
}

export default function Register() {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('name');
    const [user, setUser] = useState<Omit<User, 'id' | 'created_at' | 'role'>>({
        name: '',
        email: '',
        password: '',
        username: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const questions = {
        name: "What's your name?",
        email: 'What\'s your email address?',
        username: 'Choose a username',
        password: 'Create a secure password',
        confirm: 'Confirm your password'
    };

    const validateStep = (step: RegistrationStep): boolean => {
        switch (step) {
            case 'name':
                if (!user.name.trim()) {
                    Alert.alert('Error', 'Please enter your name');
                    return false;
                }
                return true;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!user.email) {
                    Alert.alert('Error', 'Please enter your email');
                    return false;
                }
                if (!emailRegex.test(user.email)) {
                    Alert.alert('Error', 'Please enter a valid email address');
                    return false;
                }
                return true;
            case 'username':
                if (!user.username.trim()) {
                    Alert.alert('Error', 'Please choose a username');
                    return false;
                }
                if (user.username.length < 3) {
                    Alert.alert('Error', 'Username must be at least 3 characters long');
                    return false;
                }
                return true;
            case 'password':
                if (!user.password) {
                    Alert.alert('Error', 'Please enter a password');
                    return false;
                }
                if (user.password.length < 6) {
                    Alert.alert('Error', 'Password must be at least 6 characters long');
                    return false;
                }
                return true;
            case 'confirm':
                if (user.password !== confirmPassword) {
                    Alert.alert('Error', 'Passwords do not match');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateStep(currentStep)) return;
        
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            const steps: RegistrationStep[] = ['name', 'email', 'username', 'password', 'confirm'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1]);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else {
                handleRegister();
            }
        });
    };

    const handleBack = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            const steps: RegistrationStep[] = ['name', 'email', 'username', 'password', 'confirm'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex > 0) {
                setCurrentStep(steps[currentIndex - 1]);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            } else {
                router.back();
            }
        });
    };

    const handleRegister = async () => {
        setLoading(true);
        try {   
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Registration successful:', { user });
            router.replace('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 'name':
                return (
                    <Input
                        value={user.name}
                        onChangeText={(name) => setUser({ ...user, name })}
                        placeholder="Enter your full name"
                        autoFocus
                        onSubmitEditing={handleNext}
                        returnKeyType="next"
                    />
                );
            case 'email':
                return (
                    <Input
                        value={user.email}
                        onChangeText={(email) => setUser({ ...user, email })}
                        placeholder="your.email@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoFocus
                        onSubmitEditing={handleNext}
                        returnKeyType="next"
                    />
                );
            case 'username':
                return (
                    <Input
                        value={user.username}
                        onChangeText={(username) => setUser({ ...user, username })}
                        placeholder="Choose a username"
                        autoCapitalize="none"
                        autoFocus
                        onSubmitEditing={handleNext}
                        returnKeyType="next"
                    />
                );
            case 'password':
                return (
                    <Input
                        value={user.password}
                        onChangeText={(password) => setUser({ ...user, password })}
                        placeholder="Create a strong password"
                        secureTextEntry
                        autoFocus
                        onSubmitEditing={handleNext}
                        returnKeyType="next"
                    />
                );
            case 'confirm':
                return (
                    <Input
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        secureTextEntry
                        autoFocus
                        onSubmitEditing={handleNext}
                        returnKeyType="go"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <LayoutScreen>
                <View style={styles.formContainer}>
                    <View style={styles.logoContainer}>
                        <Image 
                            source={require('@/assets/images/anx/anx_transparent.png')} 
                            style={styles.logo} 
                        />
                    </View>
                    
                    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
                        <GradientText
                            colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
                            style={styles.questionText}
                        >
                            {questions[currentStep]}
                        </GradientText>
                        
                        <View style={styles.inputContainer}>
                            {renderStep()}
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                onPress={handleBack} 
                                style={[styles.navButton, styles.backButton]}
                            >
                                <CustomText color="white" weight="600">
                                    {currentStep === 'name' ? 'Cancel' : 'Back'}
                                </CustomText>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={handleNext}
                                disabled={loading}
                                style={[
                                    styles.navButton, 
                                    styles.nextButton,
                                    loading && styles.disabledButton
                                ]}
                            >
                                <CustomText color="white" weight="600">
                                    {loading ? '...' : currentStep === 'confirm' ? 'Finish' : 'Next'}
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.progressContainer}>
                            {['name', 'email', 'username', 'password', 'confirm'].map((step, index) => (
                                <View 
                                    key={step}
                                    style={[
                                        styles.progressDot,
                                        currentStep === step && styles.activeDot,
                                        index < ['name', 'email', 'username', 'password', 'confirm'].indexOf(currentStep) && styles.completedDot
                                    ]}
                                />
                            ))}
                        </View>
                    </Animated.View>
                </View>
            </LayoutScreen>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        width: '100%',
    },
    formContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 130, 
        height: 65, 
        resizeMode: 'cover'
    },
    stepContainer: {
        width: '100%',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '600',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 30,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 40,
    },
    navButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666',
    },
    nextButton: {
        backgroundColor: 'rgb(162, 104, 255)',
    },

    disabledButton: {
        opacity: 0.6,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    progressDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: 'rgb(162, 104, 255)',
        transform: [{ scale: 1.2 }],
    },
    completedDot: {
        backgroundColor: 'rgb(162, 104, 255)',
    },
});