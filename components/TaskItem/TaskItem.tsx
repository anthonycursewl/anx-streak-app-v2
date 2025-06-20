import { Task } from '@/entities/Task';
import { calculateNextOccurrence } from '@/screens/ActivitiesScreen/services/calculateNextOccurrence';
import { getRecurrenceLabel } from '@/screens/ActivitiesScreen/services/getRecurrentLabel';
import { getPriorityColor, getPriorityLabel } from '@/screens/ActivitiesScreen/services/switchColors';
import { useTasksStore } from '@/services/stores/tasks/useTasksStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomText from '../CustomText/CustomText';

type TaskItemProps = {
  item: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

export const TaskItem: React.FC<TaskItemProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onToggleTask,
  onDeleteTask,
}) => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notificationAnim = React.useRef(new Animated.Value(-60)).current;

  // store de la tasks
  const { enableNotification } = useTasksStore()

  const toggleEmailNotifications = async () => {

    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    
    if (newValue) {
      setShowNotification(true);
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }).start(() => {
        setTimeout(() => {
          Animated.timing(notificationAnim, {
            toValue: -60,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease)
          }).start(() => setShowNotification(false));
        }, 2000);
      });
    }

    await enableNotification(item.id, newValue);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const taskItemStyle = [
    styles.taskItem,
    { borderLeftColor: getPriorityColor(item.priority) },
    item.lastCompletedAt && styles.completedTask
  ];

  const taskTextStyle: any[] = [
    styles.taskText,
    ...(item.lastCompletedAt ? [styles.completedTaskText] : [])
  ];

  const priorityTextStyle = [
    styles.priorityText,
    { color: getPriorityColor(item.priority) },
    item.lastCompletedAt && styles.completedPriorityText
  ];

  return (
    <Animated.View style={[styles.taskContainer, isExpanded && styles.taskContainerExpanded]}>
      <TouchableOpacity 
        style={taskItemStyle}
        activeOpacity={0.8}
        onPress={onToggleExpand}
      >
        <View style={styles.taskContent}>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          <Ionicons 
            name="document-text-outline" 
            size={18} 
            color={item.lastCompletedAt ? '#888' : '#f5f5f5'} 
            style={styles.taskIcon} 
          />
          <CustomText style={taskTextStyle}>
            {item.title}
          </CustomText>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDeleteTask(item.id);
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[
            styles.checkbox,
            item.lastCompletedAt && styles.checkboxCompleted
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onToggleTask(item.id);
          }}
        >
          {item.lastCompletedAt && <CustomText style={styles.checkmark}>✓</CustomText>}
        </TouchableOpacity>
      </TouchableOpacity>
      
      {isExpanded && (
        <Animated.View style={styles.taskDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={16} color={getPriorityColor(item.priority)} />
            <Text style={[styles.detailText, { color: getPriorityColor(item.priority) }]}>
              {getPriorityLabel(item.priority)} Priority
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#888" />
            <Text style={styles.detailText}>
              Created: {formatDate(item.createdAt)}
            </Text>
          </View>
          
          <View style={[styles.detailRow, styles.notificationRow]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <Ionicons name="mail-outline" size={16} color="#888" />
              <CustomText style={[styles.detailText, { marginLeft: 8 }]}>
                Email notifications
              </CustomText>
            </View>
            
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                onPress={toggleEmailNotifications}
                style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 5 }}
              >
                <CustomText style={styles.toggleText} color={item.emailNotifications ? "#FF9768" : "#888"}>
                  {item.emailNotifications ? 'ON' : 'OFF'}
                </CustomText>
                <Ionicons 
                  name={item.emailNotifications ? "mail-outline" : "mail-outline"} 
                  size={20} 
                  color={item.emailNotifications ? "#FF9768" : "#888"} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons 
              name={
                item.recurrence === 'DAILY' ? 'repeat-outline' : 
                item.recurrence === 'WEEKLY' ? 'calendar-outline' :
                item.recurrence === 'MONTHLY' ? 'calendar-number-outline' :
                'calendar-outline'
              } 
              size={16} 
              color="#888" 
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {item.recurrence === 'WEEKLY' && item.selectedDays?.length ? (
                <>
                  <Text style={[styles.detailText, { marginRight: 8 }]}>Weekly on:</Text>
                  {getRecurrenceLabel(item.recurrence, styles, item.selectedDays)}
                </>
              ) : (
                <Text style={styles.detailText}>
                  {item.recurrence === 'DAILY' ? 'Daily' : 
                   item.recurrence === 'WEEKLY' ? 'Weekly' : 
                   item.recurrence === 'MONTHLY' ? 'Monthly' : 
                   item.recurrence === 'YEARLY' ? 'Yearly' : 'One Time'}
                </Text>
              )}
            </View>
          </View>
          
          {item.recurrence !== 'NONE' && (
            <View style={styles.detailRow}>
              <Ionicons name="arrow-redo-outline" size={16} color="#888" />
              <Text style={styles.detailText}>
                Next: {formatDate(calculateNextOccurrence(item))}
              </Text>
            </View>
          )}
          
          {item.description && (
            <View style={[styles.detailRow, { alignItems: 'flex-start' }]}>
              <Ionicons name="document-text-outline" size={16} color="#888" style={{ marginTop: 2 }} />
              <Text style={[styles.detailText, { flex: 1 }]}>{item.description}</Text>
            </View>
          )}
        </Animated.View>
      )}
      
      {showNotification && (
        <Animated.View 
          style={[
            styles.notificationBanner,
            { transform: [{ translateY: notificationAnim }] }
          ]}
        >
          <Ionicons name="notifications" size={20} color="#fff" />
          <Text style={styles.notificationText}>Notifications have been enabled</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    overflow: 'hidden',
    marginBottom: 12,
    borderRadius: 5,
  },
  taskContainerExpanded: {
    backgroundColor: 'rgba(45, 45, 45, 0.8)',
  },
  notificationBanner: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgb(20, 20, 20)',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(30, 30, 30)',
    borderRadius: 5,
    padding: 16,
    borderLeftWidth: 4,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  taskIcon: {
    marginRight: 10,
    opacity: 0.8,
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  taskText: {
    fontSize: 15,
    color: '#f5f5f5',
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 2,
  },
  priorityText: {
    fontSize: 14,
    opacity: 0.8,
  },
  completedPriorityText: {
    opacity: 0.6,
  },
  completedTask: {
    opacity: 0.6,
    borderLeftColor: '#666',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#6bcb77',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#6bcb77',
    borderColor: '#6bcb77',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskDetails: {
    padding: 10,
    paddingTop: 12,
    backgroundColor: 'rgba(30, 30, 30, 0.7)',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    flexWrap: 'wrap',
  },
  notificationRow: {
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    marginTop: 8,
    paddingTop: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'right',
  },
  detailText: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 8,
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(44, 44, 44)',
  },
  dayCircleSelected: {
    backgroundColor: 'rgb(74, 49, 112)',
    borderColor: 'rgb(98, 69, 146)',
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(197, 161, 255)',
  },
  dayLetterInactive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa',
  },
});
