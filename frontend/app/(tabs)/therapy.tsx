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
  Brain, 
  Plus, 
  Calendar,
  FileText,
  TrendingUp,
  Smile,
  Heart
} from 'lucide-react-native';

export default function TherapyScreen() {
  const { api, state } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [summary, setSummary] = useState('');
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');

  const handleSubmit = () => {
    if (!summary.trim()) {
      Alert.alert('Session Summary Required', 'Please add a summary of your therapy session.');
      return;
    }

    api.addTherapySession({
      summary: summary.trim(),
      mood_before: moodBefore ? parseInt(moodBefore) : undefined,
      mood_after: moodAfter ? parseInt(moodAfter) : undefined,
    });

    Alert.alert('Session Recorded!', 'Your therapy session has been saved successfully.');
    setSummary('');
    setMoodBefore('');
    setMoodAfter('');
    setShowAddForm(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodImprovement = (before?: number, after?: number) => {
    if (!before || !after) return null;
    return after - before;
  };

  const totalSessions = state.therapySessions.length;
  const recentSessions = state.therapySessions.slice(0, 5);

  if (showAddForm) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Brain size={32} color="#8B5CF6" />
          <Text style={styles.title}>Record Session</Text>
          <Text style={styles.subtitle}>Document your therapy progress</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Mood Before Session (1-10)</Text>
          <TextInput
            style={styles.moodInput}
            value={moodBefore}
            onChangeText={setMoodBefore}
            keyboardType="numeric"
            placeholder="Optional"
            maxLength={2}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Session Summary</Text>
          <Text style={styles.inputHint}>
            What did you discuss? What insights did you gain? How did you feel?
          </Text>
          <TextInput
            style={styles.summaryInput}
            multiline
            placeholder="Today we talked about..."
            value={summary}
            onChangeText={setSummary}
            maxLength={1000}
          />
          <Text style={styles.characterCount}>{summary.length}/1000</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Mood After Session (1-10)</Text>
          <TextInput
            style={styles.moodInput}
            value={moodAfter}
            onChangeText={setMoodAfter}
            keyboardType="numeric"
            placeholder="Optional"
            maxLength={2}
          />
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Save Session</Text>
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
        <Brain size={32} color="#8B5CF6" />
        <Text style={styles.title}>Therapy Journal</Text>
        <Text style={styles.subtitle}>Track your healing journey</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Calendar size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.statValue}>
            {state.therapySessions.filter(s => s.mood_after && s.mood_before && s.mood_after > s.mood_before).length}
          </Text>
          <Text style={styles.statLabel}>Improved</Text>
        </View>
        <View style={styles.statCard}>
          <Heart size={20} color="#EF4444" />
          <Text style={styles.statValue}>
            {Math.round(state.therapySessions.filter(s => s.mood_after).reduce((acc, s) => acc + (s.mood_after || 0), 0) / state.therapySessions.filter(s => s.mood_after).length) || 0}
          </Text>
          <Text style={styles.statLabel}>Avg Mood</Text>
        </View>
      </View>

      {/* Add Session Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => setShowAddForm(true)}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Record New Session</Text>
      </TouchableOpacity>

      {/* Session History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Session History</Text>
        {state.therapySessions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No sessions recorded yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Start documenting your therapy journey to track your progress
            </Text>
          </View>
        ) : (
          recentSessions.map((session) => {
            const improvement = getMoodImprovement(session.mood_before, session.mood_after);
            
            return (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
                  <Text style={styles.sessionTime}>{formatTime(session.date)}</Text>
                </View>
                
                <Text style={styles.sessionSummary} numberOfLines={3}>
                  {session.summary}
                </Text>
                
                {(session.mood_before || session.mood_after) && (
                  <View style={styles.moodRow}>
                    {session.mood_before && (
                      <View style={styles.moodIndicator}>
                        <Text style={styles.moodLabel}>Before: </Text>
                        <Text style={styles.moodValue}>{session.mood_before}/10</Text>
                      </View>
                    )}
                    {session.mood_after && (
                      <View style={styles.moodIndicator}>
                        <Text style={styles.moodLabel}>After: </Text>
                        <Text style={styles.moodValue}>{session.mood_after}/10</Text>
                      </View>
                    )}
                    {improvement !== null && (
                      <View style={styles.improvementBadge}>
                        <Text style={[
                          styles.improvementText,
                          improvement > 0 ? styles.positiveImprovement : 
                          improvement < 0 ? styles.negativeImprovement : styles.neutralImprovement
                        ]}>
                          {improvement > 0 ? '+' : ''}{improvement}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
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
    fontSize: 20,
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
    backgroundColor: '#8B5CF6',
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
  sessionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  sessionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionSummary: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  moodLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  moodValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  improvementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  improvementText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  positiveImprovement: {
    color: '#10B981',
  },
  negativeImprovement: {
    color: '#EF4444',
  },
  neutralImprovement: {
    color: '#6B7280',
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
    lineHeight: 20,
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
  inputHint: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  moodInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
  },
  summaryInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
  actionButtons: {
    padding: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
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