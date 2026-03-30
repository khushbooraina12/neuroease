import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { MoodChart } from '@/components/MoodChart';
import { WellnessCard } from '@/components/WellnessCard';
import { 
  Heart, 
  Zap, 
  Dumbbell, 
  Brain, 
  Sunrise,
  TrendingUp 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { state } = useApp();
  const router = useRouter();
  const latest = state.checkins[0];
  const recentWorkouts = state.workouts.slice(0, 3);
  const unreadMessages = state.messages.filter(m => !m.read).length;

  const getMoodEmoji = (mood?: number) => {
    if (!mood) return '😐';
    if (mood <= 3) return '😔';
    if (mood <= 5) return '😐';
    if (mood <= 7) return '😊';
    return '😄';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}, {state.user.name}!</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>
        <Image 
          source={{ uri: state.user.avatar }} 
          style={styles.avatar}
        />
      </View>

      {/* Current Mood Card */}
      <View style={styles.moodCard}>
        <View style={styles.moodHeader}>
          <Sunrise size={24} color="#F59E0B" />
          <Text style={styles.moodTitle}>Today's Mood</Text>
        </View>
        <View style={styles.moodContent}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(latest?.mood)}</Text>
          <View style={styles.moodDetails}>
            <Text style={styles.moodValue}>
              {latest ? `${latest.mood}/10` : 'No data'}
            </Text>
            <Text style={styles.moodLabel}>
              {latest ? latest.analysis.label : 'Take your first check-in'}
            </Text>
          </View>
        </View>
        {latest && (
          <Text style={styles.moodNote}>"{latest.text}"</Text>
        )}
      </View>

      {/* Mood Chart */}
      <MoodChart />

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.statValue}>{state.checkins.length}</Text>
          <Text style={styles.statLabel}>Check-ins</Text>
        </View>
        <View style={styles.statCard}>
          <Dumbbell size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{state.workouts.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Brain size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{state.therapySessions.length}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <WellnessCard
        title="Daily Check-in"
        description="Share how you're feeling today"
        icon={Heart}
        onPress={() => router.push('/checkin')}
        gradient={['#FDF2F8', '#FCE7F3']}
      />
      
      <WellnessCard
        title="Wellness Tools"
        description="Try breathing exercises and mindfulness"
        icon={Zap}
        onPress={() => router.push('/interventions')}
        gradient={['#EFF6FF', '#DBEAFE']}
      />
      
      <WellnessCard
        title="Log Activity"
        description="Track your physical activities"
        icon={Dumbbell}
        onPress={() => router.push('/workouts')}
        gradient={['#F0FDF4', '#DCFCE7']}
      />

      {unreadMessages > 0 && (
        <TouchableOpacity 
          style={styles.messageAlert}
          onPress={() => router.push('/messages')}
        >
          <Text style={styles.messageAlertText}>
            You have {unreadMessages} new message{unreadMessages > 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FCE7F3',
  },
  moodCard: {
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
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  moodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  moodDetails: {
    flex: 1,
  },
  moodValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BE185D',
  },
  moodLabel: {
    fontSize: 16,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  moodNote: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  messageAlert: {
    backgroundColor: '#FEF3C7',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  messageAlertText: {
    color: '#92400E',
    fontWeight: '500',
  },
});