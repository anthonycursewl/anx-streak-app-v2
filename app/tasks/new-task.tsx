import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from '@/components/GradientText/GradientText';
import Input from "@/components/Input/Input";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { Priority, Recurrence } from "@/entities/Task";
import { getPriorityColor } from "@/screens/ActivitiesScreen/services/switchColors";
import { useTasksStore } from "@/services/stores/tasks/useTasksStore";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface RecurrenceOption {
    value: Recurrence;
    label: string;
    icon: string;
}

export default function NewTask() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>('MEDIUM');
    const [recurrence, setRecurrence] = useState<Recurrence>('NONE');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    // Store Task
    const { createTask, loading, error } = useTasksStore();
    useEffect(() => {
        if (error) {
            Alert.alert('Anx | Error', error)
        }
    }, [error])


    const recurrenceOptions: RecurrenceOption[] = [
        { value: 'NONE', label: 'One Time', icon: 'calendar-outline' },
        { value: 'DAILY', label: 'Daily', icon: 'repeat-outline' },
        { value: 'WEEKLY', label: 'Weekly', icon: 'calendar-outline' },
        { value: 'MONTHLY', label: 'Monthly', icon: 'calendar-number-outline' },
        { value: 'YEARLY', label: 'Yearly', icon: 'calendar-outline' },
    ];

    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const toggleDay = (dayIndex: number) => {
        setSelectedDays(prev => {
            if (prev.includes(dayIndex)) {
                return prev.filter(d => d !== dayIndex);
            } else {
                return [...prev, dayIndex];
            }
        });
    };

    const getNextOccurrence = (baseDate: Date, rec: Recurrence, days?: number[]): Date => {
        const date = new Date(baseDate);
        
        switch (rec) {
            case 'DAILY':
                date.setDate(date.getDate() + 1);
                break;
            case 'WEEKLY':
                if (days && days.length > 0) {
                    const currentDay = date.getDay();
                    const nextDay = days.sort().find(d => d > currentDay) || days[0];
                    const daysToAdd = nextDay > currentDay 
                        ? nextDay - currentDay 
                        : 7 - (currentDay - nextDay);
                    date.setDate(date.getDate() + daysToAdd);
                } else {
                    date.setDate(date.getDate() + 7);
                }
                break;
            case 'MONTHLY':
                date.setMonth(date.getMonth() + 1);
                break;
            case 'YEARLY':
                date.setFullYear(date.getFullYear() + 1);
                break;
            default:
                break;
        }
        console.log(date)
        return date;
    };

    const handleCreateTask = async () => {
        if (!title.trim()) {
            Alert.alert('Anx | Error', 'Please enter a task title');
            return;
        }

        if (recurrence === 'WEEKLY' && selectedDays.length === 0) {
            Alert.alert('Anx | Error', 'Please select at least one day');
            return;
        }

        const taskData = {
            title,
            description,
            priority,
            recurrence,
            ...(recurrence === 'WEEKLY' && { selectedDays })
        };

        await createTask(taskData);
        router.back()
    };

    return (
            <LayoutScreen>
        <ScrollView contentContainerStyle={styles.scrollContent} style={{ flex: 1, flexGrow: 1 }}>
                <View style={styles.header}>
                    <GradientText
                        style={styles.headerText}
                        colors={['rgb(212, 147, 255)', 'rgb(255, 205, 224)', 'rgb(255, 141, 141)']}
                    >
                        Add a new Task
                    </GradientText>
                </View>

                <View style={styles.formGroup}>
                    <CustomText style={styles.label}>Title</CustomText>
                    <Input
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter task title"
                        placeholderTextColor="#666"
                    />
                </View>

                <View style={styles.formGroup}>
                    <CustomText style={styles.label}>Description (Optional)</CustomText>
                    <Input
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter task description"
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={4}
                        style={{ height: 100 }}
                    />
                </View>

                <View style={styles.formGroup}>
                    <CustomText style={styles.label}>Priority</CustomText>

                    <View style={styles.priorityContainer}>
                        {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.priorityButton,
                                    priority === level && { 
                                        backgroundColor: getPriorityColor(level) + '33',
                                        borderColor: getPriorityColor(level)
                                    }
                                ]}
                                onPress={() => setPriority(level)}
                            >
                                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(level) }]} />
                                <CustomText style={styles.priorityText}>
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </CustomText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <CustomText style={styles.label}>Recurrence</CustomText>
                    <View style={styles.recurrenceContainer}>
                        {recurrenceOptions.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.recurrenceButton,
                                    recurrence === option.value && styles.recurrenceButtonActive,
                                    { borderColor: recurrence === option.value ? getPriorityColor(priority) : '#444' }
                                ]}
                                onPress={() => setRecurrence(option.value)}
                            >
                                <Ionicons 
                                    name={option.icon as any} 
                                    size={18} 
                                    color={recurrence === option.value ? getPriorityColor(priority) : '#999'} 
                                />
                                <CustomText 
                                    style={[
                                        styles.recurrenceText,
                                        { color: recurrence === option.value ? getPriorityColor(priority) : '#f5f5f5' }
                                    ]}
                                >
                                    {option.label}
                                </CustomText>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {recurrence === 'WEEKLY' && (
                        <View style={styles.weekDaysContainer}>
                            {weekDays.map((day, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dayButton,
                                        selectedDays.includes(index) && {
                                            backgroundColor: getPriorityColor(priority) + '33',
                                            borderColor: getPriorityColor(priority)
                                        }
                                    ]}
                                    onPress={() => toggleDay(index)}
                                >
                                    <CustomText 
                                        style={[
                                            styles.dayText,
                                            selectedDays.includes(index) ? { color: getPriorityColor(priority) } : {}
                                        ]}
                                    >
                                        {day}
                                    </CustomText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {loading ? <View style={styles.loadingContainer}><ActivityIndicator size="small" color="#fff" /></View> 
                : <TouchableOpacity 
                    style={[styles.createButton, !title.trim() && styles.disabledButton]}
                    onPress={handleCreateTask}
                    disabled={!title.trim()}
                >
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <CustomText style={styles.createButtonText}>Create Task</CustomText>
                </TouchableOpacity>}
        </ScrollView>
            </LayoutScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    scrollContent: {
        paddingBottom: 40,
        height: '100%',
    },
    header: {
        marginBottom: 30,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#f5f5f5',
    },
    input: {
        backgroundColor: 'rgba(45, 45, 45, 0.8)',
        borderRadius: 8,
        padding: 12,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    priorityButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 2,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#444',
        marginHorizontal: 4,
    },
    recurrenceContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        gap: 8,
    },
    recurrenceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        backgroundColor: 'rgba(45, 45, 45, 0.6)',
    },
    recurrenceButtonActive: {
        borderWidth: 1,
    },
    recurrenceText: {
        marginLeft: 6,
        fontSize: 14,
    },
    weekDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    dayButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#444',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    dayText: {
        color: '#999',
        fontSize: 14,
        fontWeight: 'bold',
    },
    priorityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    priorityText: {
        fontSize: 14,
        color: '#f5f5f5',
        textTransform: 'capitalize',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9768',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginTop: 20,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '100%',
    },
})