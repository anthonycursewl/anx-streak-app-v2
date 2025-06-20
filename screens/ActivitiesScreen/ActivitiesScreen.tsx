import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { TaskItem } from "@/components/TaskItem/TaskItem";
import { Task } from "@/entities/Task";
import { useTasksStore } from "@/services/stores/tasks/useTasksStore";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, LayoutAnimation, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ActivitiesScreen() {
  const { getTasks, tasks, setTasks, loading, isEnd, deleteTask, completeTask, error } = useTasksStore()
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
    getTasks({ reset: true });
  }, []);

  const handleRefresh = () => {
    getTasks({ reset: true });
  };

  const handleLoadMore = () => {
    if (!loading && !isEnd) {
        getTasks();
    }
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Anx | Error', error);
    }
  }, [error]);
  
  const toggleTaskExpansion = (taskId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const toggleTask = async (taskId: string, event?: any) => {
    if (loading) return

    event?.stopPropagation?.();
    await completeTask(taskId)
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTask(taskId);
            if (!success) {
              Alert.alert('Anx | Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ],
      { cancelable: true }
    );
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

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    
    const query = searchQuery.toLowerCase().replace('@', '');
    return tasks.filter(task => 
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }, [tasks, searchQuery]);

  const renderTask = ({ item }: { item: Task }) => {
    return <TaskItem item={item} 
    isExpanded={expandedTaskId === item.id} 
    onToggleExpand={() => toggleTaskExpansion(item.id)} 
    onToggleTask={(taskId: string, event?: any) => toggleTask(taskId, event)} 
    onDeleteTask={(taskId: string) => handleDeleteTask(taskId)} 
    />   
  };

  return (
    <LayoutScreen>
      <View style={styles.container}>

        <View style={styles.headerContainer}>
          <GradientText
            style={styles.headerText}
            colors={['rgb(255, 151, 104)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']}
          >
            Tasks
          </GradientText>

          <TouchableOpacity style={styles.addButton} 
          onPress={() => router.push('/tasks/new-task')}
          >
            <Ionicons name="add" size={20} color="#FF9768" />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="@ Search tasks..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            cursorColor="#FF9768"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.taskList}
          showsVerticalScrollIndicator={false}
          onEndReached={() => handleLoadMore()}
          onRefresh={() => handleRefresh()}
          refreshing={loading}
          onEndReachedThreshold={0.5}
        />

      </View>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 151, 104, 0.1)',
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 151, 104, 0.3)',
  },
  addButtonText: {
    marginLeft: 8,
    color: '#FF9768',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#f5f5f5',
  },
  taskList: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#f5f5f5',
    fontSize: 15,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 4,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },

});