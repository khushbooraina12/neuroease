import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  consent: boolean;
  clinicianId: string;
  avatar?: string;
}

interface CheckIn {
  id: string;
  mood: number;
  text: string;
  timestamp: number;
  analysis: {
    label: string;
    confidence: number;
  };
}

interface Intervention {
  id: string;
  type: string;
  title: string;
  description: string;
  feedback?: 'better' | 'same' | 'worse';
  timestamp: number;
}

interface Workout {
  id: string;
  type: string;
  duration: string;
  date: number;
  calories?: number;
}

interface TherapySession {
  id: string;
  summary: string;
  date: number;
  mood_before?: number;
  mood_after?: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'clinician';
  timestamp: number;
  read: boolean;
}

interface AppState {
  user: User;
  checkins: CheckIn[];
  interventions: Intervention[];
  workouts: Workout[];
  therapySessions: TherapySession[];
  messages: Message[];
}

interface AppAPI {
  getState: () => AppState;
  addCheckin: (entry: Partial<CheckIn>) => Promise<CheckIn>;
  addInterventionFeedback: (feedback: any) => void;
  addWorkout: (workout: Partial<Workout>) => void;
  addTherapySession: (session: Partial<TherapySession>) => void;
  sendMessage: (message: Partial<Message>) => void;
  markMessageAsRead: (messageId: string) => void;
}

interface AppContextType {
  state: AppState;
  api: AppAPI;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

const defaultState: AppState = {
  user: { 
    id: 'u1', 
    name: 'Alex', 
    consent: true, 
    clinicianId: 'c1',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  checkins: [
    {
      id: 'ci_1',
      mood: 7,
      text: 'Feeling better after yesterday\'s therapy session. Morning walk helped too.',
      timestamp: Date.now() - 86400000,
      analysis: { label: 'calm', confidence: 0.82 }
    }
  ],
  interventions: [
    {
      id: 'int_1',
      type: 'breathing',
      title: '4-7-8 Breathing Exercise',
      description: 'Inhale for 4, hold for 7, exhale for 8. Repeat 4 times.',
      timestamp: Date.now()
    }
  ],
  workouts: [
    {
      id: 'w_1',
      type: 'Morning Walk',
      duration: '30',
      date: Date.now() - 3600000,
      calories: 150
    }
  ],
  therapySessions: [],
  messages: [
    {
      id: 'm_1',
      text: 'How are you feeling today? Remember to take your check-in.',
      sender: 'clinician',
      timestamp: Date.now() - 7200000,
      read: false
    }
  ],
};

async function analyzeMood(text: string, moodValue: number) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let label = 'neutral';
  if (moodValue <= 3) label = 'struggling';
  else if (moodValue <= 5) label = 'managing';
  else if (moodValue <= 7) label = 'positive';
  else label = 'thriving';
  
  return { label, confidence: Math.random() * 0.3 + 0.7 };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const api: AppAPI = {
    getState: () => state,
    
    addCheckin: async (entry: Partial<CheckIn>) => {
      const analysis = await analyzeMood(entry.text || '', entry.mood || 5);
      const newEntry: CheckIn = {
        id: `ci_${Date.now()}`,
        mood: entry.mood || 5,
        text: entry.text || '',
        timestamp: Date.now(),
        analysis,
      };
      setState(s => ({ ...s, checkins: [newEntry, ...s.checkins] }));
      return newEntry;
    },
    
    addInterventionFeedback: (feedback: any) => {
      setState(s => ({ 
        ...s, 
        interventions: s.interventions.map(int => 
          int.id === feedback.interventionId 
            ? { ...int, feedback: feedback.score }
            : int
        )
      }));
    },
    
    addWorkout: (workout: Partial<Workout>) => {
      const newWorkout: Workout = {
        id: `w_${Date.now()}`,
        type: workout.type || 'Exercise',
        duration: workout.duration || '0',
        date: Date.now(),
        calories: workout.calories,
      };
      setState(s => ({ ...s, workouts: [newWorkout, ...s.workouts] }));
    },
    
    addTherapySession: (session: Partial<TherapySession>) => {
      const newSession: TherapySession = {
        id: `t_${Date.now()}`,
        summary: session.summary || '',
        date: Date.now(),
        mood_before: session.mood_before,
        mood_after: session.mood_after,
      };
      setState(s => ({ ...s, therapySessions: [newSession, ...s.therapySessions] }));
    },
    
    sendMessage: (message: Partial<Message>) => {
      const newMessage: Message = {
        id: `m_${Date.now()}`,
        text: message.text || '',
        sender: message.sender || 'user',
        timestamp: Date.now(),
        read: false,
      };
      setState(s => ({ ...s, messages: [newMessage, ...s.messages] }));
    },

    markMessageAsRead: (messageId: string) => {
      setState(s => ({
        ...s,
        messages: s.messages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      }));
    }
  };

  return (
    <AppContext.Provider value={{ state, api }}>
      {children}
    </AppContext.Provider>
  );
}