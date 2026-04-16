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
  Brain,
  Plus,
  Calendar,
  TrendingUp,
  Heart,
  ArrowLeft
} from 'lucide-react-native';

export default function TherapyScreen() {
  const { api, state } = useApp();
  const { width } = useWindowDimensions();

  const isDesktop =
    Platform.OS === 'web' && width >= 900;

  const [showAddForm, setShowAddForm] =
    useState(false);

  const [summary, setSummary] =
    useState('');

  const [moodBefore, setMoodBefore] =
    useState('');

  const [moodAfter, setMoodAfter] =
    useState('');

  const handleSubmit = () => {
    if (!summary.trim()) {
      Alert.alert(
        'Session Summary Required',
        'Please add a summary of your therapy session.'
      );
      return;
    }

    api.addTherapySession({
      summary: summary.trim(),
      mood_before: moodBefore
        ? parseInt(moodBefore)
        : undefined,
      mood_after: moodAfter
        ? parseInt(moodAfter)
        : undefined
    });

    Alert.alert(
      'Session Recorded!',
      'Your therapy session has been saved.'
    );

    setSummary('');
    setMoodBefore('');
    setMoodAfter('');
    setShowAddForm(false);
  };

  const formatDate = (
    timestamp: number
  ) =>
    new Date(timestamp).toLocaleDateString(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
    );

  const formatTime = (
    timestamp: number
  ) =>
    new Date(timestamp).toLocaleTimeString(
      'en-US',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  const getMoodImprovement = (
    before?: number,
    after?: number
  ) => {
    if (!before || !after) return null;
    return after - before;
  };

  const totalSessions =
    state.therapySessions.length;

  const improvedCount =
    state.therapySessions.filter(
      s =>
        s.mood_after &&
        s.mood_before &&
        s.mood_after >
          s.mood_before
    ).length;

  const avgMood =
    Math.round(
      state.therapySessions
        .filter(s => s.mood_after)
        .reduce(
          (acc, s) =>
            acc +
            (s.mood_after || 0),
          0
        ) /
        state.therapySessions.filter(
          s => s.mood_after
        ).length
    ) || 0;

  const recentSessions =
    state.therapySessions.slice(0, 5);

  /* =======================
     FORM SCREEN
  ======================= */
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

            <Brain
              size={34}
              color="#8B5CF6"
            />
            <Text style={styles.title}>
              Record Session
            </Text>
            <Text style={styles.subtitle}>
              Document your therapy
              progress
            </Text>
          </View>

          <View
            style={[
              styles.formGrid,
              isDesktop &&
                styles.formGridDesktop
            ]}
          >
            {/* LEFT */}
            <View style={{ flex: 1 }}>
              <View style={styles.card}>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Mood Before
                  Session
                </Text>

                <TextInput
                  style={
                    styles.input
                  }
                  value={moodBefore}
                  onChangeText={
                    setMoodBefore
                  }
                  keyboardType="numeric"
                  placeholder="1-10"
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      marginTop: 18
                    }
                  ]}
                >
                  Mood After
                  Session
                </Text>

                <TextInput
                  style={
                    styles.input
                  }
                  value={moodAfter}
                  onChangeText={
                    setMoodAfter
                  }
                  keyboardType="numeric"
                  placeholder="1-10"
                />
              </View>
            </View>

            {/* RIGHT */}
            <View style={{ flex: 1 }}>
              <View style={styles.card}>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Session Summary
                </Text>

                <Text
                  style={
                    styles.inputHint
                  }
                >
                  What did you
                  discuss? What did
                  you learn? How do
                  you feel now?
                </Text>

                <TextInput
                  style={
                    styles.summaryInput
                  }
                  multiline
                  value={summary}
                  onChangeText={
                    setSummary
                  }
                  placeholder="Today we talked about..."
                  maxLength={1000}
                />

                <Text
                  style={
                    styles.characterCount
                  }
                >
                  {summary.length}
                  /1000
                </Text>

                <TouchableOpacity
                  style={
                    styles.addButton
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
                      styles.addButtonText
                    }
                  >
                    Save Session
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.cancelBtn
                  }
                  onPress={() =>
                    setShowAddForm(
                      false
                    )
                  }
                >
                  <Text
                    style={
                      styles.cancelText
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

  /* =======================
     MAIN SCREEN
  ======================= */
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
          <Brain
            size={34}
            color="#8B5CF6"
          />
          <Text style={styles.title}>
            Therapy Journal
          </Text>
          <Text style={styles.subtitle}>
            Track your healing
            journey
          </Text>
        </View>

        <View
          style={[
            styles.statsRow,
            isDesktop &&
              styles.statsDesktop
          ]}
        >
          <View style={styles.statCard}>
            <Calendar
              size={20}
              color="#8B5CF6"
            />
            <Text
              style={styles.statValue}
            >
              {totalSessions}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Sessions
            </Text>
          </View>

          <View style={styles.statCard}>
            <TrendingUp
              size={20}
              color="#10B981"
            />
            <Text
              style={styles.statValue}
            >
              {improvedCount}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Improved
            </Text>
          </View>

          <View style={styles.statCard}>
            <Heart
              size={20}
              color="#EF4444"
            />
            <Text
              style={styles.statValue}
            >
              {avgMood}
            </Text>
            <Text
              style={styles.statLabel}
            >
              Avg Mood
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
            Record New Session
          </Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Session History
          </Text>

          {recentSessions.length ===
          0 ? (
            <View
              style={
                styles.emptyState
              }
            >
              <Text
                style={
                  styles.emptyTitle
                }
              >
                No sessions
                recorded yet
              </Text>
              <Text
                style={
                  styles.emptySub
                }
              >
                Start documenting
                your journey.
              </Text>
            </View>
          ) : (
            recentSessions.map(
              session => {
                const change =
                  getMoodImprovement(
                    session.mood_before,
                    session.mood_after
                  );

                return (
                  <View
                    key={
                      session.id
                    }
                    style={
                      styles.sessionItem
                    }
                  >
                    <View
                      style={
                        styles.sessionTop
                      }
                    >
                      <Text
                        style={
                          styles.sessionDate
                        }
                      >
                        {formatDate(
                          session.date
                        )}
                      </Text>

                      <Text
                        style={
                          styles.sessionTime
                        }
                      >
                        {formatTime(
                          session.date
                        )}
                      </Text>
                    </View>

                    <Text
                      style={
                        styles.sessionSummary
                      }
                    >
                      {
                        session.summary
                      }
                    </Text>

                    <View
                      style={
                        styles.badgeRow
                      }
                    >
                      {session.mood_before && (
                        <Text
                          style={
                            styles.badge
                          }
                        >
                          Before{' '}
                          {
                            session.mood_before
                          }
                          /10
                        </Text>
                      )}

                      {session.mood_after && (
                        <Text
                          style={
                            styles.badge
                          }
                        >
                          After{' '}
                          {
                            session.mood_after
                          }
                          /10
                        </Text>
                      )}

                      {change !==
                        null && (
                        <Text
                          style={[
                            styles.badge,
                            {
                              color:
                                change >
                                0
                                  ? '#10B981'
                                  : change <
                                    0
                                  ? '#EF4444'
                                  : '#6B7280'
                            }
                          ]}
                        >
                          {change >
                          0
                            ? '+'
                            : ''}
                          {
                            change
                          }
                        </Text>
                      )}
                    </View>
                  </View>
                );
              }
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

  statsRow: {
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
    backgroundColor: '#8B5CF6',
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
    fontSize: 16,
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
    marginBottom: 14
  },

  formGrid: {},

  formGridDesktop: {
    flexDirection: 'row',
    gap: 18
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 16,
    fontSize: 18
  },

  inputHint: {
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20
  },

  summaryInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    padding: 16,
    minHeight: 180,
    textAlignVertical: 'top'
  },

  characterCount: {
    textAlign: 'right',
    color: '#9CA3AF',
    marginTop: 8
  },

  cancelBtn: {
    padding: 14,
    alignItems: 'center'
  },

  cancelText: {
    color: '#6B7280',
    fontWeight: '600'
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 30
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },

  emptySub: {
    marginTop: 6,
    color: '#6B7280'
  },

  sessionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },

  sessionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  sessionDate: {
    fontWeight: '600',
    color: '#1F2937'
  },

  sessionTime: {
    color: '#6B7280',
    fontSize: 13
  },

  sessionSummary: {
    color: '#4B5563',
    marginTop: 10,
    lineHeight: 22
  },

  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },

  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    color: '#374151',
    fontWeight: '600'
  }
});