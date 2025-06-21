import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { Task } from "@/entities/Task";
import { useTasksStore } from "@/services/stores/tasks/useTasksStore";
import IconFire from "@/svgs/IconFire";
import IconSuccess from "@/svgs/IconSuccess";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const { getCompletedTasksToday, completedTasksToday, loading } = useTasksStore();

    useEffect(() => {
        getCompletedTasksToday()
        console.log(completedTasksToday)
    }, [])

    const flatTasks = useMemo(() => {
        return completedTasksToday.flat();
    }, [completedTasksToday]);

    const ItemDay = ({ day, is }: { day: string, is: boolean }) => {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: is ? 'rgba(255, 180, 130, 0.97)' : 'rgba(255, 191, 154, 0.1)',
                width: 24,
                height: 24,
                borderRadius: '100%',
            }}>
                <CustomText style={{ 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    color: is ? 'rgb(255, 255, 255)' : 'rgb(255, 191, 154)', 
                    fontSize: 10,
                    }}
                    >
                    {day}
                </CustomText>
            </View>
        )
    }

    const getDayName = (days: number[]) => {
        const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        if (days.length === 0) return [];

        return dayNames.map((dayName, index) => {
            if (days.includes(index)) return <ItemDay key={index} day={dayName} is={true} />
            return <ItemDay key={index} day={dayName} is={false} />
        })
    }

    const CompletedTaskItem = ({ task, index }: { task: Task, index: number }) => {
        return (
            <View key={index}
                style={{
                    paddingVertical: 14,
                    paddingLeft: 10,
                    paddingRight: 18,
                    backgroundColor: 'rgba(34, 34, 34, 0.1)',
                    width: '100%',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    rowGap: 8,
                    borderBottomWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                }}
            >

                <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                    <IconSuccess width={16} height={16}
                        fill={'rgb(255, 191, 154)'} />
                    <CustomText style={styles.statValue}>
                        {task.title}
                    </CustomText>
                </View>
            
                {
                    task.recurrence === 'WEEKLY' && (
                        <View style={{
                            flexDirection: 'row',
                            padding: 6,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            width: '100%',
                            borderRadius: 12,
                            gap: 4,
                        }}>

                            {getDayName(task.selectedDays || [])}
                        </View>
                    )
                }

            </View>
        )
    }

    return (
        <LayoutScreen>
            <View style={styles.headerDecorationRight}></View>
            <View style={styles.headerDecorationLeft}></View>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.streakContainer}>
                    <View style={styles.fireContainer}>
                        <IconFire width={width / 4} height={width / 4} />
                    </View>

                    <GradientText
                        colors={['rgb(255, 151, 104)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
                        style={styles.streakText}
                    >
                        {loading ? '...' : `${completedTasksToday.length} ${true ? 'day' : 'days'}`}
                    </GradientText>

                    <CustomText style={styles.subtitle}>
                        Current streak
                    </CustomText>

                    <View style={styles.streakInfo}>
                        <Ionicons name="flame" size={16} color="#FF9768" />
                        <CustomText style={styles.streakInfoText}>
                            {true
                                ? `Keep it up! You're on a ${0}-day streak!`
                                : 'Start a new streak by completing tasks!'}
                        </CustomText>
                    </View>

                    <View style={styles.averageTaskInfo}>
                        <Ionicons name="push" size={16} color="rgb(104, 255, 192)" />
                        <CustomText style={styles.averageTaskInfoText}>
                            60% tasks has been completed.
                        </CustomText>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={{
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '100%',
                            flexDirection: 'row',
                            gap: 5,
                            padding: 15,
                            backgroundColor: 'rgba(100, 100, 100, 0.1)',
                            borderTopRightRadius: 16,
                            borderTopLeftRadius: 16,
                        }}>
                            <Ionicons name="flame" size={16} color="#FF9768" />
                            <CustomText>Task completed</CustomText>
                        </View>

                        {
                            completedTasksToday.length > 0 ? (
                                flatTasks.map((task, index) => (
                                    <CompletedTaskItem key={index} task={task} index={index} />
                                ))
                            ) : (
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                    paddingVertical: 20,
                                    height: 120,
                                }}>
                                    <CustomText style={{ color: 'rgb(102, 102, 102)', fontSize: 13, width: '80%', textAlign: 'center' }}>
                                        No tasks completed today.
                                        Your tasks will appear here when you complete them.
                                    </CustomText>
                                </View>
                            )
                        }

                        <View style={{
                            paddingVertical: 14,
                            paddingHorizontal: 20,
                            backgroundColor: 'rgba(34, 34, 34, 0.1)',
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                        }}>
                            <CustomText style={{
                                color: 'rgb(160, 160, 160)',
                                fontSize: 15
                            }}>See all</CustomText>
                            <Ionicons name="arrow-forward" size={16} color="rgb(160, 160, 160)" />
                        </View>

                    </View>
                </View>

            </ScrollView>
        </LayoutScreen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 40,
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 30,
    },
    statCard: {
        backgroundColor: 'rgba(100, 100, 100, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'flex-start',
        width: '100%',
    },
    statValue: {
        fontSize: 14,
        width: '100%',
        color: 'rgb(243, 236, 253)',
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    streakContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        width: '100%',
    },
    fireContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        opacity: 0.9,
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
    streakInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: 'rgba(255, 151, 104, 0.1)',
        padding: 8,
        borderRadius: 20,
    },
    averageTaskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: 'rgba(104, 255, 192, 0.1)',
        padding: 8,
        borderRadius: 20,
    },
    streakInfoText: {
        marginLeft: 8,
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    averageTaskInfoText: {
        marginLeft: 8,
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
    },
    upcomingTaskContainer: {
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 8,
    },
    taskCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    taskTitle: {
        color: '#FFF',
        fontSize: 16,
        flex: 1,
        marginRight: 15,
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.3)',
    },
    completeButtonText: {
        color: '#4CAF50',
        fontWeight: '600',
        fontSize: 14,
        marginLeft: 5,
    },
    buttonsContainer: {
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 30,
    },
    primaryButton: {
        backgroundColor: '#FF9768',
    },
    secondaryButton: {
        backgroundColor: 'rgba(184, 99, 19, 0.17)',
        borderWidth: 1,
        borderColor: 'rgba(255, 151, 104, 0.3)',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
        color: '#FFF',
        marginLeft: 10,
    },
    secondaryButtonText: {
        color: '#FF9768',
    },
    headerDecorationRight: {
        width: 200,
        height: 200,
        position: 'absolute',
        top: -120,
        right: -80,
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: 'rgba(221, 134, 63, 0.39)',
        filter: 'blur(60px)',
    },
    headerDecorationLeft: {
        width: 200,
        height: 200,
        position: 'absolute',
        top: -110,
        left: -70,
        borderRadius: 100,
        overflow: 'hidden',
        backgroundColor: 'rgba(141, 53, 255, 0.43)',
        filter: 'blur(60px)',
    }
});