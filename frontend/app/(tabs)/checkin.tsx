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
import { Heart, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getRecommendation } from '../api/recommendation';
import { routeFromRecommendation } from "../utils/recommendationRouter";

export default function CheckInScreen() {
  const { api } = useApp();
  const router = useRouter();

  const [mood, setMood] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😔', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' },
  ];

  const detailedMoodScale = Array.from({ length: 10 }, (_, i) => i + 1);

  async function handleSubmit() {
    if (!text.trim()) {
      Alert.alert(
        'Journal Entry Required',
        'Please share how you\'re feeling today.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1️⃣ Save check-in (existing logic)
      await api.addCheckin({ mood, text });

      // 2️⃣ Build RL state (simple mapping)
      const userState = [
        mood,           // mood_score
        10 - mood,      // stress_score
        3,              // breathing_sessions
        5,              // avg_breathing_duration
        40,             // workout_minutes
        7               // sleep_hours
      ];

      // 3️⃣ Call ML backend
      const interventionId = await getRecommendation(text, userState);

      // 4️⃣ Navigate WITH recommendation
      
      const route = routeFromRecommendation(interventionId);
      router.push(route as any);

      setText('');
      setMood(5);

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Heart size={32} color="#BE185D" />
        <Text style={styles.title}>Daily Check-in</Text>
        <Text style={styles.subtitle}>
          Take a moment to reflect on how you're feeling
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How are you feeling right now?</Text>
        <View style={styles.moodGrid}>
          {moodOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.moodOption,
                mood === option.value * 2 && styles.moodOptionSelected
              ]}
              onPress={() => setMood(option.value * 2)}
            >
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
              <Text style={styles.moodLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood Scale (1-10)</Text>
        <Text style={styles.currentMood}>Current: {mood}/10</Text>
        <View style={styles.scaleContainer}>
          {detailedMoodScale.map(value => (
            <TouchableOpacity
              key={value}
              style={[
                styles.scaleButton,
                mood === value && styles.scaleButtonSelected
              ]}
              onPress={() => setMood(value)}
            >
              <Text
                style={[
                  styles.scaleButtonText,
                  mood === value && styles.scaleButtonTextSelected
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's on your mind?</Text>
        <TextInput
          style={styles.journalInput}
          multiline
          placeholder="I'm feeling..."
          value={text}
          onChangeText={setText}
          maxLength={500}
        />
        <Text style={styles.characterCount}>{text.length}/500</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Send size={20} color="#FFFFFF" />
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Saving...' : 'Save Check-in'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* styles unchanged */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#FFFFFF', padding: 20, paddingTop: 60, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: 'center' },
  section: { backgroundColor: '#FFFFFF', margin: 20, padding: 20, borderRadius: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  moodGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  moodOption: { width: '30%', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 2 },
  moodOptionSelected: { borderColor: '#BE185D' },
  moodEmoji: { fontSize: 32 },
  moodLabel: { fontSize: 12 },
  currentMood: { fontSize: 16, fontWeight: '600', marginBottom: 16 },
  scaleContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  scaleButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  scaleButtonSelected: { backgroundColor: '#BE185D' },
  scaleButtonText: { fontSize: 16 },
  scaleButtonTextSelected: { color: '#FFFFFF' },
  journalInput: { borderWidth: 1, borderRadius: 12, padding: 16, minHeight: 120 },
  characterCount: { textAlign: 'right', marginTop: 8 },
  submitButton: { flexDirection: 'row', justifyContent: 'center', padding: 16, borderRadius: 12, backgroundColor: '#BE185D', margin: 20 },
  submitButtonDisabled: { backgroundColor: '#9CA3AF' },
  submitButtonText: { color: '#FFFFFF', fontSize: 18, marginLeft: 8 }
});
