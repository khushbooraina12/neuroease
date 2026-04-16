import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import {
  Shield,
  Calendar,
  Award,
  Settings,
  CircleHelp as HelpCircle,
  LogOut,
  ChevronRight,
  Heart,
  Target,
  TrendingUp,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { state } = useApp();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  const { user, checkins, workouts, therapySessions } = state;

  const averageMood =
    checkins.length > 0
      ? (
          checkins.reduce((sum, c) => sum + c.mood, 0) /
          checkins.length
        ).toFixed(1)
      : '0';

  const totalMinutes = workouts.reduce(
    (sum, w) => sum + parseInt(w.duration),
    0
  );

  const memberDays = 30;

  const handleMenuItem = (item: string) => {
    Alert.alert(item, 'This feature is coming soon!');
  };

  const menuItems = [
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'Preferences and notifications',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      subtitle: 'Data protection settings',
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'FAQs and contact support',
    },
  ];

  const achievements = [
    {
      icon: '🔥',
      title: 'Consistent Tracker',
      description: `${checkins.length} check-ins completed`,
      earned: checkins.length >= 7,
    },
    {
      icon: '💪',
      title: 'Active Lifestyle',
      description: `${workouts.length} workouts logged`,
      earned: workouts.length >= 5,
    },
    {
      icon: '🧠',
      title: 'Self-Aware',
      description: `${therapySessions.length} therapy sessions recorded`,
      earned: therapySessions.length >= 3,
    },
  ];

  const StatCard = ({
    icon,
    value,
    label,
  }: any) => (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          isDesktop && styles.headerDesktop,
        ]}
      >
        <Image
          source={{ uri: user.avatar }}
          style={styles.profileImage}
        />

        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userSubtitle}>
          Wellness Journey Member
        </Text>

        <View style={styles.badge}>
          <Shield size={15} color="#10B981" />
          <Text style={styles.badgeText}>
            Data sharing consented
          </Text>
        </View>
      </View>

      {/* Desktop Grid */}
      {isDesktop ? (
        <View style={styles.desktopGrid}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Your Progress
              </Text>

              <View style={styles.statsRow}>
                <StatCard
                  icon={
                    <Heart
                      size={22}
                      color="#EF4444"
                    />
                  }
                  value={averageMood}
                  label="Avg Mood"
                />

                <StatCard
                  icon={
                    <Target
                      size={22}
                      color="#3B82F6"
                    />
                  }
                  value={checkins.length}
                  label="Check-ins"
                />

                <StatCard
                  icon={
                    <TrendingUp
                      size={22}
                      color="#10B981"
                    />
                  }
                  value={workouts.length}
                  label="Workouts"
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Achievements
              </Text>

              {achievements.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.achievementRow,
                    !item.earned &&
                      styles.lockedAchievement,
                  ]}
                >
                  <Text
                    style={
                      styles.achievementEmoji
                    }
                  >
                    {item.icon}
                  </Text>

                  <View style={{ flex: 1 }}>
                    <Text
                      style={
                        styles.achievementTitle
                      }
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={
                        styles.achievementDesc
                      }
                    >
                      {item.description}
                    </Text>
                  </View>

                  {item.earned && (
                    <Award
                      size={18}
                      color="#F59E0B"
                    />
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                This Month
              </Text>

              <View style={styles.quickItem}>
                <Calendar
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.quickText}>
                  Member for {memberDays} days
                </Text>
              </View>

              <View style={styles.quickItem}>
                <TrendingUp
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.quickText}>
                  {totalMinutes} minutes of activity
                </Text>
              </View>

              <View style={styles.quickItem}>
                <Heart
                  size={18}
                  color="#6B7280"
                />
                <Text style={styles.quickText}>
                  {therapySessions.length}{' '}
                  therapy sessions recorded
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Account
              </Text>

              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuRow}
                  onPress={() =>
                    handleMenuItem(
                      item.title
                    )
                  }
                >
                  <View
                    style={
                      styles.menuIconWrap
                    }
                  >
                    <item.icon
                      size={18}
                      color="#6B7280"
                    />
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      style={
                        styles.menuTitle
                      }
                    >
                      {item.title}
                    </Text>
                    <Text
                      style={
                        styles.menuSub
                      }
                    >
                      {item.subtitle}
                    </Text>
                  </View>

                  <ChevronRight
                    size={16}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={
                styles.signOutButton
              }
              onPress={() =>
                Alert.alert(
                  'Sign Out',
                  'This feature is coming soon!'
                )
              }
            >
              <LogOut
                size={18}
                color="#EF4444"
              />
              <Text
                style={
                  styles.signOutText
                }
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {/* MOBILE VIEW */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Your Progress
            </Text>

            <View style={styles.statsRow}>
              <StatCard
                icon={
                  <Heart
                    size={22}
                    color="#EF4444"
                  />
                }
                value={averageMood}
                label="Avg Mood"
              />
              <StatCard
                icon={
                  <Target
                    size={22}
                    color="#3B82F6"
                  />
                }
                value={checkins.length}
                label="Check-ins"
              />
              <StatCard
                icon={
                  <TrendingUp
                    size={22}
                    color="#10B981"
                  />
                }
                value={workouts.length}
                label="Workouts"
              />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
  },

  headerDesktop: {
    maxWidth: 1400,
    alignSelf: 'center',
    width: '94%',
    borderRadius: 28,
    marginTop: 20,
  },

  profileImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 4,
    borderColor: '#FCE7F3',
    marginBottom: 16,
  },

  userName: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
  },

  userSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 6,
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
  },

  badgeText: {
    marginLeft: 6,
    color: '#059669',
    fontWeight: '600',
    fontSize: 13,
  },

  desktopGrid: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    maxWidth: 1400,
    width: '94%',
    alignSelf: 'center',
  },

  leftColumn: {
    flex: 2,
    gap: 20,
  },

  rightColumn: {
    flex: 1.2,
    gap: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    marginHorizontal: 20,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 18,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    color: '#0F172A',
  },

  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  lockedAchievement: {
    opacity: 0.45,
  },

  achievementEmoji: {
    fontSize: 24,
    marginRight: 14,
  },

  achievementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  achievementDesc: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  quickText: {
    marginLeft: 10,
    color: '#334155',
    fontSize: 14,
  },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  menuSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },

  signOutButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signOutText: {
    marginLeft: 8,
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 15,
  },
});