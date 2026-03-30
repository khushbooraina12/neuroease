import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { User, Shield, Calendar, Award, Settings, CircleHelp as HelpCircle, LogOut, ChevronRight, Heart, Target, TrendingUp } from 'lucide-react-native';

export default function ProfileScreen() {
  const { state } = useApp();
  const { user, checkins, workouts, therapySessions } = state;
  
  const totalDays = Math.floor((Date.now() - (Date.now() - 30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));
  const averageMood = checkins.length > 0 
    ? (checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length).toFixed(1)
    : '0';
  
  const handleMenuItem = (item: string) => {
    Alert.alert(item, 'This feature is coming soon!');
  };

  const menuItems = [
    { icon: Settings, title: 'Settings', subtitle: 'Preferences and notifications' },
    { icon: Shield, title: 'Privacy & Security', subtitle: 'Data protection settings' },
    { icon: HelpCircle, title: 'Help & Support', subtitle: 'FAQs and contact support' },
  ];

  const achievements = [
    { 
      icon: '🔥', 
      title: 'Consistent Tracker', 
      description: `${checkins.length} check-ins completed`,
      earned: checkins.length >= 7
    },
    { 
      icon: '💪', 
      title: 'Active Lifestyle', 
      description: `${workouts.length} workouts logged`,
      earned: workouts.length >= 5
    },
    { 
      icon: '🧠', 
      title: 'Self-Aware', 
      description: `${therapySessions.length} therapy sessions recorded`,
      earned: therapySessions.length >= 3
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user.avatar }} 
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userSubtitle}>Wellness Journey Member</Text>
        
        <View style={styles.consentBadge}>
          <Shield size={16} color="#10B981" />
          <Text style={styles.consentText}>Data sharing consented</Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Heart size={24} color="#EF4444" />
            <Text style={styles.statValue}>{averageMood}</Text>
            <Text style={styles.statLabel}>Avg Mood</Text>
          </View>
          <View style={styles.statItem}>
            <Target size={24} color="#3B82F6" />
            <Text style={styles.statValue}>{checkins.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          <View style={styles.statItem}>
            <TrendingUp size={24} color="#10B981" />
            <Text style={styles.statValue}>{workouts.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
        </View>
      </View>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <View 
            key={index} 
            style={[
              styles.achievementItem,
              achievement.earned && styles.achievementEarned
            ]}
          >
            <Text style={styles.achievementIcon}>{achievement.icon}</Text>
            <View style={styles.achievementContent}>
              <Text style={[
                styles.achievementTitle,
                achievement.earned && styles.achievementTitleEarned
              ]}>
                {achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {achievement.description}
              </Text>
            </View>
            {achievement.earned && (
              <Award size={20} color="#F59E0B" />
            )}
          </View>
        ))}
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStatsSection}>
        <Text style={styles.sectionTitle}>This Month</Text>
        <View style={styles.quickStatItem}>
          <Calendar size={20} color="#6B7280" />
          <Text style={styles.quickStatText}>
            Member for {Math.max(1, Math.floor((Date.now() - (Date.now() - 30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)))} days
          </Text>
        </View>
        <View style={styles.quickStatItem}>
          <TrendingUp size={20} color="#6B7280" />
          <Text style={styles.quickStatText}>
            {workouts.reduce((sum, w) => sum + parseInt(w.duration), 0)} minutes of activity
          </Text>
        </View>
        <View style={styles.quickStatItem}>
          <Heart size={20} color="#6B7280" />
          <Text style={styles.quickStatText}>
            {therapySessions.length} therapy sessions recorded
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => handleMenuItem(item.title)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuItemIcon}>
                <item.icon size={20} color="#6B7280" />
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={() => Alert.alert('Sign Out', 'This feature is coming soon!')}
      >
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FCE7F3',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  consentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  consentText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
    marginLeft: 4,
  },
  statsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  achievementsSection: {
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
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    opacity: 0.5,
  },
  achievementEarned: {
    opacity: 1,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  achievementTitleEarned: {
    color: '#374151',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickStatsSection: {
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
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  quickStatText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  menuSection: {
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomSpace: {
    height: 40,
  },
});