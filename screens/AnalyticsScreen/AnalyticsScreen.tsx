import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

// Sample data - in a real app, this would come from your state management or API
// Move sample data outside component to prevent recreation on re-render
const SAMPLE_TASKS = [
  { id: '1', title: 'Complete project', priority: 'high', completed: true, created_at: '2025-06-10T10:00:00', recurrence: 'weekly' },
  { id: '2', title: 'Buy groceries', priority: 'medium', completed: true, created_at: '2025-06-12T15:30:00', recurrence: 'weekly' },
  { id: '3', title: 'Go for a run', priority: 'low', completed: false, created_at: '2025-06-15T18:45:00', recurrence: 'daily' },
  { id: '4', title: 'Team meeting', priority: 'medium', completed: true, created_at: '2025-06-01T09:00:00', recurrence: 'monthly' },
  { id: '5', title: 'Review code', priority: 'high', completed: false, created_at: '2025-06-16T14:00:00', recurrence: 'none' },
];

// Memoize AnalyticsCard to prevent unnecessary re-renders
const AnalyticsCard = React.memo(({ title, children, style = {} }: { title: string; children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>
    <CustomText style={styles.cardTitle}>{title}</CustomText>
    {children}
  </View>
));

const StatBox = ({ value, label, icon, color }: { value: string | number; label: string; icon: string; color: string }) => (
  <View style={styles.statBox}>
    <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <View>
      <CustomText style={styles.statValue}>{value}</CustomText>
      <CustomText style={styles.statLabel}>{label}</CustomText>
    </View>
  </View>
);

// Memoize the chart config to prevent recreation on every render
const CHART_CONFIG = {
  backgroundColor: '#1e1e1e',
  backgroundGradientFrom: '#1e1e1e',
  backgroundGradientTo: '#1e1e1e',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#7c3bc7',
  },
};

// Memoized component for rendering activity items
const ActivityItem = React.memo(({ item, isLast }: { item: any; isLast: boolean }) => (
  <View style={[styles.activityItem, isLast && styles.activityItemBorder]}>
    <View style={[styles.activityDot, { backgroundColor: item.completed ? '#6bcb77' : '#ffd93d' }]} />
    <View style={styles.activityContent}>
      <CustomText style={styles.activityTitle} ellipsizeMode="tail">
        {item.title}
      </CustomText>
      <View style={styles.activityMeta}>
        <CustomText style={styles.activityDate} ellipsizeMode="tail">
          {new Date(item.created_at).toLocaleDateString()}
        </CustomText>
        <View style={[
          styles.priorityBadge, 
          { 
            backgroundColor: item.priority === 'high' ? '#ff6b6b40' : 
                          item.priority === 'medium' ? '#ffd93d40' : '#6bcb7740' 
          }
        ]}>
          <CustomText style={[
            styles.priorityText, 
            { 
              color: item.priority === 'high' ? '#ff6b6b' : 
                            item.priority === 'medium' ? '#ffd93d' : '#6bcb77' 
            }
          ]}>
            {item.priority}
          </CustomText>
        </View>
      </View>
    </View>
    <Ionicons 
      name={item.completed ? 'checkmark-circle' : 'time'} 
      size={24} 
      color={item.completed ? '#6bcb77' : '#888'} 
    />
  </View>
));

export default function AnalyticsScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks] = useState(SAMPLE_TASKS);
  const scrollY = useSharedValue(0);
  // Memoize calculations to prevent recalculation on every render
  const { totalTasks, completedTasks, completionRate } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    return {
      totalTasks: total,
      completedTasks: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);
  
  // Memoize priority data
  const priorityData = useMemo(() => [
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: '#ff6b6b', legendFontColor: '#fff' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: '#ffd93d', legendFontColor: '#fff' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: '#6bcb77', legendFontColor: '#fff' },
  ], [tasks]);

  // Memoize recurrence data
  const recurrenceData = useMemo(() => [
    { name: 'One-time', count: tasks.filter(t => t.recurrence === 'none').length, color: '#9c88ff' },
    { name: 'Daily', count: tasks.filter(t => t.recurrence === 'daily').length, color: '#00cec9' },
    { name: 'Weekly', count: tasks.filter(t => t.recurrence === 'weekly').length, color: '#fd79a8' },
    { name: 'Monthly', count: tasks.filter(t => t.recurrence === 'monthly').length, color: '#fdcb6e' },
  ], [tasks]);

  // Memoize weekly data
  const weeklyData = useMemo(() => ({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [2, 3, 1, 4, 2, 1, 0],
      color: (opacity = 1) => `rgba(124, 59, 199, ${opacity})`,
    }]
  }), []);

  // Memoize the renderItem function
  const renderActivityItem = useCallback<ListRenderItem<any>>(({ item, index }) => (
    <ActivityItem 
      item={item} 
      isLast={index === 0} // Only show border after first item
    />
  ), []);

  // Only calculate recent tasks when tasks change
  const recentTasks = useMemo(() => tasks.slice(0, 3), [tasks]);

  const { width } = useWindowDimensions();
  const chartWidth = useMemo(() => width - 10, [width]);
  const pieChartSize = useMemo(() => width - 64, [width]);

  return (
    <LayoutScreen>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={e => {
          scrollY.value = e.nativeEvent.contentOffset.y;
        }}
      >
        <GradientText 
          colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} 
          style={styles.title}
        >
          Task Analytics
        </GradientText>

        <AnalyticsCard title="Recent Activity" style={styles.section}>
          <FlatList
            data={recentTasks}
            renderItem={renderActivityItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            removeClippedSubviews
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={50}
            windowSize={5}
            initialNumToRender={3}
          />
        </AnalyticsCard>

        {/* Stats Overview */}
        <View style={styles.statsRow}>
          <StatBox 
            value={`${completionRate}%`} 
            label="Completion Rate" 
            icon="checkmark-circle" 
            color="#6bcb77"
          />
          <StatBox 
            value={completedTasks} 
            label="Completed" 
            icon="checkmark-done" 
            color="#4d96ff" 
          />
          <StatBox 
            value={totalTasks - completedTasks} 
            label="Pending" 
            icon="time" 
            color="#ffd93d" 
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LayoutScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  chartsColumn: {
    width: '100%',
    gap: 16,
  },
  fullWidthCard: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#f5f5f5',
  },
  statsRow: {
    flexDirection: 'column',
    marginBottom: 16,
    width: '100%',
    gap: 8,
  },
  statBox: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f5f5f5',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityItemBorder: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#f5f5f5',
    fontSize: 14,
    marginBottom: 4,
    flexShrink: 1,
    marginRight: 8,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    color: '#888',
    fontSize: 12,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});