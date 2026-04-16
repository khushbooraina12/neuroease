import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Linking
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { useLocalSearchParams } from 'expo-router';
import {
  Wind,
  Brain,
  Sun,
  Music,
  Flower,
  CircleCheck as CheckCircle,
  ExternalLink
} from 'lucide-react-native';

/* ================================
   ML → UI Intervention Mapping
================================ */
const mlToUiMap: Record<string, string> = {
  breathing_01: 'breathing',
  grounding_01: 'grounding',
  body_scan_01: 'meditation',
  gratitude_journal_01: 'nature'
};

/* ================================
   Intervention Definitions
================================ */
const interventions = [
  {
    id: 'breathing',
    icon: Wind,
    title: '4-7-8 Breathing',
    description: 'Calm your mind with guided breathing',
    duration: '5 minutes',
    color: '#DBEAFE',
    link: 'https://www.youtube.com/watch?v=YRPh_GaiL8s',
    linkTitle: 'Watch Guided Breathing Video',
    instructions: [
      'Inhale quietly through your nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale completely through your mouth for 8 counts',
      'Repeat this cycle 4 times'
    ]
  },
  {
    id: 'grounding',
    icon: Brain,
    title: '5-4-3-2-1 Grounding',
    description: 'Ground yourself in the present moment',
    duration: '3 minutes',
    color: '#FDF4FF',
    link: 'https://www.youtube.com/watch?v=30VMIEmA114',
    linkTitle: 'Watch Grounding Exercise',
    instructions: [
      'Name 5 things you can see',
      'Name 4 things you can touch',
      'Name 3 things you can hear',
      'Name 2 things you can smell',
      'Name 1 thing you can taste'
    ]
  },
  {
    id: 'meditation',
    icon: Sun,
    title: 'Mindful Meditation',
    description: 'Focus on the present',
    duration: '10 minutes',
    color: '#FEF3C7',
    link: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    linkTitle: 'Play Guided Meditation',
    instructions: [
      'Find a comfortable sitting position',
      'Close your eyes and focus on your breath',
      'Notice thoughts without judgment',
      'Gently return focus to your breath'
    ]
  },
  {
    id: 'music',
    icon: Music,
    title: 'Calming Music',
    description: 'Listen to soothing sounds',
    duration: '15 minutes',
    color: '#ECFDF5',
    link: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
    linkTitle: 'Open Spotify Calm Playlist',
    instructions: [
      'Sit comfortably',
      'Use headphones if possible',
      'Focus on the rhythm and melody'
    ]
  },
  {
    id: 'nature',
    icon: Flower,
    title: 'Nature Visualization',
    description: 'Visualize calming natural scenes',
    duration: '8 minutes',
    color: '#FEF7ED',
    link: 'https://www.youtube.com/watch?v=lFcSrYw-ARY',
    linkTitle: 'Play Nature Relaxation Video',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
    instructions: [
      'Close your eyes',
      'Imagine a peaceful natural place',
      'Notice colors, sounds, and sensations'
    ]
  }
];

export default function InterventionsScreen() {
  const { api } = useApp();
  const { recommended } = useLocalSearchParams();

  const uiRecommendedId =
    typeof recommended === 'string'
      ? mlToUiMap[recommended]
      : null;

  const [selectedIntervention, setSelectedIntervention] =
    useState<string | null>(null);

  const [completedInterventions, setCompletedInterventions] =
    useState<Set<string>>(new Set());

  useEffect(() => {
    if (uiRecommendedId) {
      setSelectedIntervention(uiRecommendedId);
    }
  }, [uiRecommendedId]);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Unable to open link');
    }
  };

  const handleComplete = (interventionId: string) => {
    setCompletedInterventions(prev => new Set([...prev, interventionId]));
    setSelectedIntervention(null);

    Alert.alert(
      'Great job!',
      'How do you feel after completing this exercise?',
      [
        { text: 'Better', onPress: () => handleFeedback(interventionId, 'better') },
        { text: 'Same', onPress: () => handleFeedback(interventionId, 'same') },
        { text: 'Worse', onPress: () => handleFeedback(interventionId, 'worse') }
      ]
    );
  };

  const handleFeedback = (interventionId: string, feedback: string) => {
    api.addInterventionFeedback({
      interventionId,
      score: feedback,
      timestamp: Date.now()
    });
  };

  /* ================================
     SINGLE INTERVENTION VIEW
================================ */
  if (selectedIntervention) {
    const intervention = interventions.find(
      i => i.id === selectedIntervention
    );

    if (!intervention) return null;

    const Icon = intervention.icon;

    return (
      <ScrollView style={styles.container}>
        <View style={[styles.header, { backgroundColor: intervention.color }]}>
          <Icon size={40} color="#374151" />
          <Text style={styles.title}>{intervention.title}</Text>
          <Text style={styles.duration}>{intervention.duration}</Text>
        </View>

        {intervention.image && (
          <Image
            source={{ uri: intervention.image }}
            style={styles.heroImage}
          />
        )}

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Instructions</Text>

          {intervention.instructions.map((step, idx) => (
            <Text key={idx} style={styles.instructionText}>
              {idx + 1}. {step}
            </Text>
          ))}
        </View>

        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedIntervention(null)}
        >
          <Text style={styles.backButtonText}>
            ← Back to Wellness Tools
          </Text>
        </TouchableOpacity>

        {/* RESOURCE BUTTON */}
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => openLink(intervention.link)}
        >
          <ExternalLink size={18} color="#FFFFFF" />
          <Text style={styles.linkButtonText}>
            {intervention.linkTitle}
          </Text>
        </TouchableOpacity>

        {/* COMPLETE BUTTON */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleComplete(intervention.id)}
        >
          <CheckCircle size={20} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>
            Mark as Complete
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /* ================================
     GRID VIEW
================================ */
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wellness Tools</Text>
        <Text style={styles.subtitle}>
          Recommended exercises for you
        </Text>
      </View>

      {uiRecommendedId && (
        <View style={styles.recommendationBanner}>
          <Text style={styles.recommendationTitle}>
            Recommended for you
          </Text>
          <Text style={styles.recommendationText}>
            Based on your recent check-in, we selected something
            that may help right now.
          </Text>
        </View>
      )}

      <View style={styles.interventionsGrid}>
        {interventions.map(item => {
          const Icon = item.icon;
          const completed =
            completedInterventions.has(item.id);
          const isRecommended =
            uiRecommendedId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.interventionCard,
                { backgroundColor: item.color },
                completed && styles.completedCard,
                isRecommended && styles.recommendedCard
              ]}
              onPress={() =>
                setSelectedIntervention(item.id)
              }
            >
              {completed && (
                <CheckCircle
                  size={16}
                  color="#10B981"
                />
              )}

              <Icon size={32} color="#374151" />
              <Text style={styles.cardTitle}>
                {item.title}
              </Text>
              <Text style={styles.cardDuration}>
                {item.duration}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ================================
   Styles
================================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },

  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center'
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 12
  },

  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center'
  },

  duration: {
    marginTop: 8
  },

  recommendationBanner: {
    backgroundColor: '#ECFDF5',
    margin: 20,
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981'
  },

  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },

  recommendationText: {
    fontSize: 14
  },

  interventionsGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  interventionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16
  },

  recommendedCard: {
    borderWidth: 2,
    borderColor: '#10B981'
  },

  completedCard: {
    borderWidth: 2,
    borderColor: '#10B981'
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8
  },

  cardDuration: {
    fontSize: 12
  },

  heroImage: {
    width: '90%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 16,
    marginTop: 10
  },

  instructionsSection: {
    margin: 20
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16
  },

  instructionText: {
    fontSize: 16,
    marginBottom: 8
  },

  backButton: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 12
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151'
  },

  linkButton: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },

  linkButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600'
  },

  completeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  completeButtonText: {
    color: '#FFFFFF',
    marginLeft: 8
  }
});