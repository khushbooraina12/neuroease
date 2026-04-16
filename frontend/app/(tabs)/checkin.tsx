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
import { Heart, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getRecommendation } from '../api/recommendation';
import { routeFromRecommendation } from '../utils/recommendationRouter';

export default function CheckInScreen() {
  const { api } = useApp();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = Platform.OS === 'web' && width >= 900;

  const [mood, setMood] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😔', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' }
  ];

  const detailedMoodScale = Array.from(
    { length: 10 },
    (_, i) => i + 1
  );

  async function handleSubmit() {
    if (!text.trim()) {
      Alert.alert(
        'Journal Entry Required',
        "Please share how you're feeling today."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await api.addCheckin({ mood, text });

      const userState = [
        mood,
        10 - mood,
        3,
        5,
        40,
        7
      ];

      let interventionId = 'breathing_01';

      try {
        const result = await getRecommendation(
          text,
          userState
        );

        if (
          result &&
          typeof result === 'string'
        ) {
          interventionId = result;
        }
      } catch (err) {
        console.log(
          'Recommendation failed. Using fallback.'
        );
      }

      const route =
        routeFromRecommendation(
          interventionId
        );

      console.log(
        'Recommended:',
        interventionId
      );

      setText('');
      setMood(5);

      router.push(route as any);
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.pageWrap,
          isDesktop &&
            styles.pageWrapDesktop
        ]}
      >
        <View style={styles.header}>
          <Heart
            size={34}
            color="#BE185D"
          />

          <Text style={styles.title}>
            Daily Check-in
          </Text>

          <Text style={styles.subtitle}>
            Take a moment to reflect on how
            you're feeling
          </Text>
        </View>

        <View
          style={[
            styles.mainGrid,
            isDesktop &&
              styles.mainGridDesktop
          ]}
        >
          <View style={styles.leftColumn}>
            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                How are you feeling right now?
              </Text>

              <View
                style={styles.moodGrid}
              >
                {moodOptions.map(
                  option => (
                    <TouchableOpacity
                      key={
                        option.value
                      }
                      style={[
                        styles.moodOption,
                        mood ===
                          option.value *
                            2 &&
                          styles.moodOptionSelected
                      ]}
                      onPress={() =>
                        setMood(
                          option.value *
                            2
                        )
                      }
                    >
                      <Text
                        style={
                          styles.moodEmoji
                        }
                      >
                        {
                          option.emoji
                        }
                      </Text>

                      <Text
                        style={
                          styles.moodLabel
                        }
                      >
                        {
                          option.label
                        }
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Mood Scale (1-10)
              </Text>

              <Text
                style={
                  styles.currentMood
                }
              >
                Current: {mood}/10
              </Text>

              <View
                style={
                  styles.scaleContainer
                }
              >
                {detailedMoodScale.map(
                  value => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.scaleButton,
                        mood ===
                          value &&
                          styles.scaleButtonSelected
                      ]}
                      onPress={() =>
                        setMood(
                          value
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.scaleButtonText,
                          mood ===
                            value &&
                            styles.scaleButtonTextSelected
                        ]}
                      >
                        {value}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </View>

          <View
            style={
              styles.rightColumn
            }
          >
            <View style={styles.card}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                What's on your mind?
              </Text>

              <TextInput
                style={
                  styles.journalInput
                }
                multiline
                placeholder="I'm feeling..."
                value={text}
                onChangeText={
                  setText
                }
                maxLength={500}
                textAlignVertical="top"
              />

              <Text
                style={
                  styles.characterCount
                }
              >
                {text.length}/500
              </Text>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isSubmitting &&
                    styles.submitButtonDisabled
                ]}
                onPress={
                  handleSubmit
                }
                disabled={
                  isSubmitting
                }
              >
                <Send
                  size={20}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.submitButtonText
                  }
                >
                  {isSubmitting
                    ? 'Saving...'
                    : 'Save Check-in'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{ height: 40 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      '#F9FAFB'
  },

  pageWrap: {
    paddingBottom: 30
  },

  pageWrapDesktop: {
    maxWidth: 1300,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24
  },

  header: {
    backgroundColor:
      '#FFFFFF',
    margin: 20,
    padding: 28,
    borderRadius: 22,
    alignItems: 'center'
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 10,
    color: '#1F2937'
  },

  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center'
  },

  mainGrid: {
    flexDirection: 'column'
  },

  mainGridDesktop: {
    flexDirection: 'row',
    alignItems:
      'flex-start'
  },

  leftColumn: {
    flex: 1
  },

  rightColumn: {
    flex: 1
  },

  card: {
    backgroundColor:
      '#FFFFFF',
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

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:
      'space-between'
  },

  moodOption: {
    width: '48%',
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor:
      '#E5E7EB',
    alignItems: 'center',
    marginBottom: 12
  },

  moodOptionSelected: {
    borderColor:
      '#BE185D',
    backgroundColor:
      '#FDF2F8'
  },

  moodEmoji: {
    fontSize: 30
  },

  moodLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500'
  },

  currentMood: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16
  },

  scaleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },

  scaleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor:
      '#D1D5DB',
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom: 10
  },

  scaleButtonSelected: {
    backgroundColor:
      '#BE185D',
    borderColor:
      '#BE185D'
  },

  scaleButtonText: {
    fontSize: 15,
    fontWeight: '600'
  },

  scaleButtonTextSelected: {
    color: '#FFFFFF'
  },

  journalInput: {
    borderWidth: 1,
    borderColor:
      '#E5E7EB',
    borderRadius: 14,
    padding: 16,
    minHeight: 240,
    fontSize: 16,
    backgroundColor:
      '#FAFAFA'
  },

  characterCount: {
    textAlign: 'right',
    marginTop: 8,
    color: '#6B7280'
  },

  submitButton: {
    marginTop: 18,
    backgroundColor:
      '#BE185D',
    padding: 18,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent:
      'center',
    alignItems: 'center'
  },

  submitButtonDisabled: {
    backgroundColor:
      '#9CA3AF'
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8
  }
});