import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import Input from "@/components/Input/Input";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { logActivity } from '@/services/database';
import { Ionicons } from "@expo/vector-icons";
import { router } from 'expo-router';
import React, { useState } from "react";
import { Alert, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Activity {
    id: number;
    description: string;
    type: string;
    intensity: string;
    duration: number;
    mood: string;
    created_at: string;
}

const { width } = Dimensions.get('window');

export default function RegisterActivity() {
    const [activity, setActivity] = useState<Omit<Activity, 'id' | 'created_at'>>({
        description: '',
        type: '',
        intensity: 'medium',
        duration: 0,
        mood: 'neutral'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!activity.description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return;
        }
        if (!activity.type.trim()) {
            Alert.alert('Error', 'Please select an activity type');
            return;
        }
        if (activity.duration <= 0) {
            Alert.alert('Error', 'Duration must be greater than 0');
            return;
        }

        setIsSubmitting(true);
        try {
            await logActivity(activity);
            
            // Reset form
            setActivity({
                description: '',
                type: '',
                intensity: 'medium',
                duration: 0,
                mood: 'neutral'
            });
            
            // Show success message
            Alert.alert(
                'Success', 
                'Activity logged successfully!',
                [
                    { 
                        text: 'OK', 
                        onPress: () => router.back() 
                    }
                ]
            );
        } catch (error) {
            console.error('Error saving activity:', error);
            Alert.alert('Error', 'Failed to save activity. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <KeyboardAvoidingView behavior="padding"
        style={{ backgroundColor: 'rgb(20, 20, 20)' }}>
        <ScrollView contentContainerStyle={{ width: '100%', alignItems: 'center' }}
            style={{ backgroundColor: 'rgb(20, 20, 20)' }}
            showsVerticalScrollIndicator={false}>
        <LayoutScreen>
            <View style={styles.headerDecorationRight}></View>
            <View style={styles.headerDecorationLeft}></View>

                <View>
                    <GradientText
                        colors={['rgb(255, 151, 104)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
                        style={styles.title}
                    >
                        Register a new Activity and keep your streak alive! 🌋🔥
                    </GradientText>
                </View>

                <View style={styles.container}>
                    <CustomText style={styles.label}>Description</CustomText>
                    <Input
                        placeholder="Description"
                        value={activity.description}
                        onChangeText={(text) => setActivity({ ...activity, description: text })}
                        keyboardType="default"
                    />

                    <CustomText style={styles.label}>Type</CustomText>
                    <Input
                        placeholder="Type"
                        value={activity.type}
                        onChangeText={(text) => setActivity({ ...activity, type: text })}
                        keyboardType="default"
                        />

                    <CustomText style={styles.label}>Intensity</CustomText>
                    <View style={styles.intensityContainer}>
                        <View style={styles.intensityButtons}>
                            {['low', 'medium', 'high'].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[
                                        styles.intensityButton,
                                        activity.intensity === level && styles.selectedIntensityButton
                                    ]}
                                    onPress={() => setActivity({ ...activity, intensity: level })}
                                >
                                    <CustomText style={styles.intensityText}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <CustomText style={styles.label}>Duration</CustomText>
                    <Input
                        placeholder="Duration (in minutes)"
                        value={activity.duration ? activity.duration.toString() : ''}
                        onChangeText={(text) => {
                            const num = parseInt(text, 10);
                            setActivity({ ...activity, duration: isNaN(num) ? 0 : num });
                        }}
                        keyboardType="numeric"
                    />

                    <CustomText style={styles.label}>Mood</CustomText>
                    <View style={styles.moodContainer}>
                        {['happy', 'neutral', 'sad', 'anxious', 'angry'].map((mood) => (
                            <TouchableOpacity
                                key={mood}
                                style={[
                                    styles.moodButton,
                                    activity.mood === mood && styles.selectedMoodButton
                                ]}
                                onPress={() => setActivity({ ...activity, mood })}
                            >
                                <CustomText style={styles.moodText}>
                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                </CustomText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleSubmit}
                            disabled={isSubmitting}
                            >
                            <Ionicons name="add-circle" size={24} color="#FF9768" />
                            <CustomText style={styles.addButtonText}>
                                {isSubmitting ? 'Saving...' : "Add Today's Activity"}
                            </CustomText>
                        </TouchableOpacity>
                    </View>
                </View> 
        </LayoutScreen> 
        </ScrollView>
    </KeyboardAvoidingView>
    )
}

export const styles = StyleSheet.create({
    headerDecorationRight: {
        width: 120, 
        height: 120,
        backgroundColor: 'rgba(170, 125, 241, 0.6)',
        position: 'absolute',
        transform: [{ translateY: -50 }, { translateX: width / 2 }],
        borderRadius: 100,
        filter: 'blur(60px)',
        pointerEvents: 'none',
        top: 0,
        left: 0,
    },
    headerDecorationLeft: {
        width: 120, 
        height: 120,
        backgroundColor: 'rgba(241, 125, 131, 0.6)',
        position: 'absolute',
        transform: [{ translateY: -50 }, { translateX: 30 }],
        borderRadius: 100,
        filter: 'blur(60px)',
        pointerEvents: 'none',
        top: 0,
        left: 0,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 151, 104, 0.1)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 151, 104, 0.3)',
        opacity: 1,
    },
    disabledButton: {
        opacity: 0.6,
    },
    addButtonText: {
        marginLeft: 10,
        color: '#FF9768',
        fontWeight: '600',
        fontSize: 16,
    },
    container: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        paddingBottom: 25,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 8,
    },
    addButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    moodContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    moodButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: 5,
        minWidth: '30%',
        alignItems: 'center',
    },
    selectedMoodButton: {
        backgroundColor: 'rgba(255, 151, 104, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 151, 104, 0.8)',
    },
    moodText: {
        color: '#fff',
    },
    intensityContainer: {
        width: '100%',
        marginBottom: 20,
    },
    intensityButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    intensityButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
    },
    selectedIntensityButton: {
        backgroundColor: 'rgba(255, 151, 104, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 151, 104, 0.8)',
    },
    intensityText: {
        color: '#fff',
    },
})