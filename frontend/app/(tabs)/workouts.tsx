import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { 
  Dumbbell, 
  Plus, 
  Clock, 
  Flame,
  TrendingUp,
  Calendar
} from 'lucide-react-native';

const workoutTypes = [
  { name: 'Walking', icon: '🚶', calories: 5 },
  { name: 'Running', icon: '🏃', calories: 10 },
  { name: 'Cycling', icon: '🚴', calories: 8 },
  { name: 'Swimming', icon: '🏊', calories: 12 },
  { name: 'Yoga', icon: '🧘', calories: 3 },
  { name: 'Strength Training', icon: '💪', calories: 7 },
  { name: 'Dancing', icon: '💃', calories: 6 },
  { name: 'Stretching', icon: '🤸', calories: 2 },
];

export default function WorkoutsScreen() {
  const { api, state } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState('Walking');
  const [duration, setDuration] = useState('30');

  const handleSubmit = () => {
    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid duration in minutes.');
      return;
    }

    const workoutType = workoutTypes.find(w => w.name === selectedType);
    const calories = workoutType ? Math.round(workoutType.calories * parseInt(duration)) : 0;

    api.addWorkout({
      type: selectedType,
      duration,
      calories
    });

    Alert.alert('Workout Logged!', `Great job completing your ${selectedType.toLowerCase()}!`);
    setShowAddForm(false);
    setSelectedType('Walking');
    setDuration('30');
  };

  const totalWorkouts = state.workouts.length;
  const totalMinutes = state.workouts.reduce((sum, w) => sum + parseInt(w.duration), 0);
  const totalCalories = state.workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Dumbbell size={32} color="#3B82F6" />
          <Text style={styles.title}>Log Workout</Text>
          <Text style={styles.subtitle}>Track your physical activity</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Activity Type</Text>
          <View style={styles.workoutGrid}>
            {workoutTypes.map((workout) => (
              <TouchableOpacity
                key={workout.name}
                style={[
                  styles.workoutOption,
                  selectedType === workout.name && styles.workoutOptionSelected
                ]}
                onPress={() => setSelectedType(workout.name)}
              >
                <Text style={styles.workoutIcon}>{workout.icon}</Text>
                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutCalories}>{workout.calories} cal/min</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Duration (minutes)</Text>
          <TextInput
            style={styles.durationInput}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="30"
          />
          <Text style={styles.calorieEstimate}>
            Estimated calories: {Math.round((workoutTypes.find(w => w.name === selectedType)?.calories || 0) * parseInt(duration || '0'))}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Log Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => setShowAddForm(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Dumbbell size={32} color="#3B82F6" />
        <Text style={styles.title}>Activity Tracker</Text>
        <Text style={styles.subtitle}>Keep moving for better mental health</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#10B981" />
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#3B82F6" />
          <Text style={styles.statValue}>{totalMinutes}</Text>
          <Text style={styles.statLabel}>Minutes</Text>
        </View>
        <View style={styles.statCard}>
          <Flame size={24} color="#F59E0B" />
          <Text style={styles.statValue}>{totalCalories}</Text>
          <Text style={styles.statLabel}>Calories</Text>
        </View>
      </View>

      {/* Add Workout Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Log New Workout</Text>
      </TouchableOpacity>

      {/* Recent Workouts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {state.workouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No workouts logged yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start tracking your activities to see your progress!
            </Text>
          </View>
        ) : (
          state.workouts.map((workout) => (
            <View key={workout.id} style={styles.workoutItem}>
              <View style={styles.workoutInfo}>
                <Text style={styles.workoutTypeText}>{workout.type}</Text>
                <Text style={styles.workoutDate}>{formatDate(workout.date)}</Text>
              </View>
              <View style={styles.workoutStats}>
                <View style={styles.workoutStat}>
                  <Clock size={16} color="#6B7280" />
                  <Text style={styles.workoutStatText}>{workout.duration}m</Text>
                </View>
                {workout.calories && (
                  <View style={styles.workoutStat}>
                    <Flame size={16} color="#F59E0B" />
                    <Text style={styles.workoutStatText}>{workout.calories} cal</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  workoutDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  workoutStatText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutOption: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  workoutOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  workoutIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  workoutCalories: {
    fontSize: 10,
    color: '#6B7280',
  },
  durationInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
  },
  calorieEstimate: {
    fontSize: 14,
    color: '#F59E0B',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  actionButtons: {
    padding: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
  },
  bottomSpace: {
    height: 40,
  },
});