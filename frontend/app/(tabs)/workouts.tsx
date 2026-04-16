import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  useWindowDimensions
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import {
  Dumbbell,
  Plus,
  Clock,
  Flame,
  TrendingUp,
  ArrowLeft
} from 'lucide-react-native';

const workoutTypes = [
  { name: 'Walking', icon: '🚶', calories: 5 },
  { name: 'Running', icon: '🏃', calories: 10 },
  { name: 'Cycling', icon: '🚴', calories: 8 },
  { name: 'Swimming', icon: '🏊', calories: 12 },
  { name: 'Yoga', icon: '🧘', calories: 3 },
  { name: 'Strength Training', icon: '💪', calories: 7 },
  { name: 'Dancing', icon: '💃', calories: 6 },
  { name: 'Stretching', icon: '🤸', calories: 2 }
];

export default function WorkoutsScreen() {
  const { api, state } = useApp();
  const { width } = useWindowDimensions();

  const isDesktop =
    Platform.OS === 'web' && width >= 900;

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [selectedType, setSelectedType] =
    useState('Walking');

  const [duration, setDuration] =
    useState('30');

  const handleSubmit = () => {
    if (
      !duration ||
      parseInt(duration) <= 0
    ) {
      Alert.alert(
        'Invalid Duration',
        'Please enter a valid duration in minutes.'
      );
      return;
    }

    const workoutType =
      workoutTypes.find(
        w => w.name === selectedType
      );

    const calories = workoutType
      ? Math.round(
          workoutType.calories *
            parseInt(duration)
        )
      : 0;

    api.addWorkout({
      type: selectedType,
      duration,
      calories
    });

    Alert.alert(
      'Workout Logged!',
      `Great job completing your ${selectedType.toLowerCase()}!`
    );

    setShowAddForm(false);
    setSelectedType('Walking');
    setDuration('30');
  };

  const totalWorkouts =
    state.workouts.length;

  const totalMinutes =
    state.workouts.reduce(
      (sum, w) =>
        sum + parseInt(w.duration),
      0
    );

  const totalCalories =
    state.workouts.reduce(
      (sum, w) =>
        sum + (w.calories || 0),
      0
    );

  const formatDate = (
    timestamp: number
  ) => {
    return new Date(
      timestamp
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /* ========================
     ADD WORKOUT SCREEN
  ======================== */
  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.pageWrap,
            isDesktop &&
              styles.pageWrapDesktop
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() =>
                setShowAddForm(false)
              }
            >
              <ArrowLeft
                size={20}
                color="#374151"
              />
            </TouchableOpacity>

            <Dumbbell
              size={34}
              color="#3B82F6"
            />
            <Text style={styles.title}>
              Log Workout
            </Text>
            <Text style={styles.subtitle}>
              Track your physical
              activity
            </Text>
          </View>

          <View
            style={[
              styles.desktopGrid,
              isDesktop &&
                styles.desktopGridRow
            ]}
          >
            {/* Left */}
            <View style={{ flex: 1 }}>
              <View style={styles.card}>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Activity Type
                </Text>

                <View
                  style={
                    styles.workoutGrid
                  }
                >
                  {workoutTypes.map(
                    workout => (
                      <TouchableOpacity
                        key={
                          workout.name
                        }
                        style={[
                          styles.workoutOption,
                          selectedType ===
                            workout.name &&
                            styles.workoutOptionSelected
                        ]}
                        onPress={() =>
                          setSelectedType(
                            workout.name
                          )
                        }
                      >
                        <Text
                          style={
                            styles.workoutIcon
                          }
                        >
                          {
                            workout.icon
                          }
                        </Text>
                        <Text
                          style={
                            styles.workoutName
                          }
                        >
                          {
                            workout.name
                          }
                        </Text>
                        <Text
                          style={
                            styles.workoutCalories
                          }
                        >
                          {
                            workout.calories
                          }{' '}
                          cal/min
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>

            {/* Right */}
            <View style={{ flex: 1 }}>
              <View style={styles.card}>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Duration
                  (minutes)
                </Text>

                <TextInput
                  style={
                    styles.durationInput
                  }
                  value={duration}
                  onChangeText={
                    setDuration
                  }
                  keyboardType="numeric"
                  placeholder="30"
                />

                <Text
                  style={
                    styles.calorieEstimate
                  }
                >
                  Estimated
                  calories:{' '}
                  {Math.round(
                    (workoutTypes.find(
                      w =>
                        w.name ===
                        selectedType
                    )?.calories ||
                      0) *
                      parseInt(
                        duration ||
                          '0'
                      )
                  )}
                </Text>

                <TouchableOpacity
                  style={
                    styles.submitButton
                  }
                  onPress={
                    handleSubmit
                  }
                >
                  <Plus
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text
                    style={
                      styles.submitButtonText
                    }
                  >
                    Log Workout
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.cancelButton
                  }
                  onPress={() =>
                    setShowAddForm(
                      false
                    )
                  }
                >
                  <Text
                    style={
                      styles.cancelButtonText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  /* ========================
     MAIN SCREEN
  ======================== */
  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.pageWrap,
          isDesktop &&
            styles.pageWrapDesktop
        ]}
      >
        <View style={styles.header}>
          <Dumbbell
            size={34}
            color="#3B82F6"
          />
          <Text style={styles.title}>
            Activity Tracker
          </Text>
          <Text style={styles.subtitle}>
            Keep moving for better
            mental health
          </Text>
        </View>

        <View
          style={[
            styles.statsContainer,
            isDesktop &&
              styles.statsDesktop
          ]}
        >
          <View style={styles.statCard}>
            <TrendingUp
              size={22}
              color="#10B981"
            />
            <Text
              style={styles.statValue}
            >
              {totalWorkouts}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Workouts
            </Text>
          </View>

          <View style={styles.statCard}>
            <Clock
              size={22}
              color="#3B82F6"
            />
            <Text
              style={styles.statValue}
            >
              {totalMinutes}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Minutes
            </Text>
          </View>

          <View style={styles.statCard}>
            <Flame
              size={22}
              color="#F59E0B"
            />
            <Text
              style={styles.statValue}
            >
              {totalCalories}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Calories
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            setShowAddForm(true)
          }
        >
          <Plus
            size={22}
            color="#FFFFFF"
          />
          <Text
            style={
              styles.addButtonText
            }
          >
            Log New Workout
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Recent Activities
          </Text>

          {state.workouts.length ===
          0 ? (
            <View
              style={
                styles.emptyState
              }
            >
              <Text
                style={
                  styles.emptyStateText
                }
              >
                No workouts logged
                yet
              </Text>
              <Text
                style={
                  styles.emptyStateSubtext
                }
              >
                Start tracking your
                activities to see
                progress.
              </Text>
            </View>
          ) : (
            state.workouts.map(
              workout => (
                <View
                  key={workout.id}
                  style={
                    styles.workoutItem
                  }
                >
                  <View
                    style={
                      styles.workoutInfo
                    }
                  >
                    <Text
                      style={
                        styles.workoutTypeText
                      }
                    >
                      {
                        workout.type
                      }
                    </Text>
                    <Text
                      style={
                        styles.workoutDate
                      }
                    >
                      {formatDate(
                        workout.date
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.workoutStats
                    }
                  >
                    <Text
                      style={
                        styles.smallStat
                      }
                    >
                      {
                        workout.duration
                      }
                      m
                    </Text>

                    <Text
                      style={
                        styles.smallStat
                      }
                    >
                      {
                        workout.calories
                      }{' '}
                      cal
                    </Text>
                  </View>
                </View>
              )
            )
          )}
        </View>

        <View
          style={{
            height: 40
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },

  pageWrap: {
    paddingBottom: 20
  },

  pageWrapDesktop: {
    maxWidth: 1300,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24
  },

  header: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 28,
    borderRadius: 22,
    alignItems: 'center',
    position: 'relative'
  },

  backBtn: {
    position: 'absolute',
    left: 20,
    top: 20,
    padding: 8
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 10
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8
  },

  statsContainer: {
    paddingHorizontal: 20
  },

  statsDesktop: {
    flexDirection: 'row',
    gap: 16
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 16
  },

  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8
  },

  statLabel: {
    color: '#6B7280',
    marginTop: 6
  },

  addButton: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 22,
    borderRadius: 18
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 18
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 30
  },

  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },

  emptyStateSubtext: {
    marginTop: 6,
    color: '#6B7280',
    textAlign: 'center'
  },

  workoutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },

  workoutInfo: {
    flex: 1
  },

  workoutTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },

  workoutDate: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 13
  },

  workoutStats: {
    flexDirection: 'row',
    gap: 10
  },

  smallStat: {
    fontSize: 13,
    color: '#374151'
  },

  desktopGrid: {},

  desktopGridRow: {
    flexDirection: 'row'
  },

  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  workoutOption: {
    width: '48%',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12
  },

  workoutOptionSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF'
  },

  workoutIcon: {
    fontSize: 28
  },

  workoutName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8
  },

  workoutCalories: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4
  },

  durationInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 16,
    fontSize: 22,
    textAlign: 'center'
  },

  calorieEstimate: {
    marginTop: 10,
    textAlign: 'center',
    color: '#F59E0B',
    fontWeight: '600'
  },

  submitButton: {
    marginTop: 18,
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8
  },

  cancelButton: {
    padding: 14,
    alignItems: 'center'
  },

  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600'
  }
});