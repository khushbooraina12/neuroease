import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform
} from 'react-native';
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
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';
  const isDesktop = width >= 900;

  const latest = state.checkins[0];
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.pageWrap,
          isDesktop && styles.pageWrapDesktop
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {state.user.name}!
            </Text>
            <Text style={styles.subtitle}>
              How are you feeling today?
            </Text>
          </View>

          <Image
            source={{ uri: state.user.avatar }}
            style={styles.avatar}
          />
        </View>

        {/* Main Grid */}
        <View
          style={[
            styles.mainGrid,
            isDesktop && styles.mainGridDesktop
          ]}
        >
          {/* Left Section */}
          <View style={styles.leftColumn}>
            {/* Mood Card */}
            <View style={styles.card}>
              <View style={styles.row}>
                <Sunrise size={22} color="#F59E0B" />
                <Text style={styles.cardTitle}>
                  Today's Mood
                </Text>
              </View>

              <View style={[styles.row, { marginTop: 18 }]}>
                <Text style={styles.moodEmoji}>
                  {getMoodEmoji(latest?.mood)}
                </Text>

                <View>
                  <Text style={styles.moodValue}>
                    {latest
                      ? `${latest.mood}/10`
                      : 'No Data'}
                  </Text>

                  <Text style={styles.moodLabel}>
                    {latest
                      ? latest.analysis.label
                      : 'Take your first check-in'}
                  </Text>
                </View>
              </View>

              {latest && (
                <Text style={styles.note}>
                  "{latest.text}"
                </Text>
              )}
            </View>

            {/* Mood Chart */}
            <MoodChart />
          </View>

          {/* Right Section */}
          <View style={styles.rightColumn}>
            {/* Stats */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={styles.statValue}>
                  {state.checkins.length}
                </Text>
                <Text style={styles.statLabel}>
                  Check-ins
                </Text>
              </View>

              <View style={styles.statCard}>
                <Dumbbell size={20} color="#3B82F6" />
                <Text style={styles.statValue}>
                  {state.workouts.length}
                </Text>
                <Text style={styles.statLabel}>
                  Workouts
                </Text>
              </View>

              <View style={styles.statCard}>
                <Brain size={20} color="#8B5CF6" />
                <Text style={styles.statValue}>
                  {state.therapySessions.length}
                </Text>
                <Text style={styles.statLabel}>
                  Sessions
                </Text>
              </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>

            <WellnessCard
              title="Daily Check-in"
              description="Share how you're feeling today"
              icon={Heart}
              onPress={() => router.push('/checkin')}
              gradient={['#FDF2F8', '#FCE7F3']}
            />

            <WellnessCard
              title="Wellness Tools"
              description="Try breathing & mindfulness"
              icon={Zap}
              onPress={() => router.push('/interventions')}
              gradient={['#EFF6FF', '#DBEAFE']}
            />

            <WellnessCard
              title="Log Activity"
              description="Track physical activity"
              icon={Dumbbell}
              onPress={() => router.push('/workouts')}
              gradient={['#F0FDF4', '#DCFCE7']}
            />

            {unreadMessages > 0 && (
              <TouchableOpacity
                style={styles.alert}
                onPress={() =>
                  router.push('/messages')
                }
              >
                <Text style={styles.alertText}>
                  You have {unreadMessages} unread
                  message
                  {unreadMessages > 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
    paddingBottom: 40
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
    padding: 24,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  greeting: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F2937'
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 6
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29
  },

  mainGrid: {
    flexDirection: 'column'
  },

  mainGridDesktop: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  leftColumn: {
    flex: 1
  },

  rightColumn: {
    flex: 1,
    paddingHorizontal: 20
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 22,
    borderRadius: 18
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  cardTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151'
  },

  moodEmoji: {
    fontSize: 52,
    marginRight: 16
  },

  moodValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#BE185D'
  },

  moodLabel: {
    fontSize: 15,
    color: '#6B7280',
    textTransform: 'capitalize'
  },

  note: {
    marginTop: 16,
    fontStyle: 'italic',
    color: '#6B7280',
    lineHeight: 22
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4
  },

  statValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937'
  },

  statLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#6B7280'
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12
  },

  alert: {
    marginTop: 14,
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 14
  },

  alertText: {
    color: '#92400E',
    fontWeight: '600'
  }
});