import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '@/contexts/AppContext';

export function MoodChart() {
  const { state } = useApp();
  const recentCheckins = state.checkins.slice(0, 7).reverse();

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return '#FCA5A5'; // Light red
    if (mood <= 5) return '#FBBF24'; // Yellow
    if (mood <= 7) return '#60A5FA'; // Light blue
    return '#34D399'; // Light green
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>7-Day Mood Trend</Text>
      <View style={styles.chartContainer}>
        {recentCheckins.map((checkin, index) => (
          <View key={checkin.id} style={styles.barContainer}>
            <View 
              style={[
                styles.bar, 
                { 
                  height: (checkin.mood / 10) * 80,
                  backgroundColor: getMoodColor(checkin.mood)
                }
              ]} 
            />
            <Text style={styles.barLabel}>{index + 1}</Text>
          </View>
        ))}
      </View>
      {recentCheckins.length === 0 && (
        <Text style={styles.noData}>No mood data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#60A5FA',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  noData: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});