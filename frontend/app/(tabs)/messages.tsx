import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import {
  MessageCircle,
  Send,
  User,
  Stethoscope,
} from 'lucide-react-native';

export default function MessagesScreen() {
  const { api, state } = useApp();
  const [text, setText] = useState('');
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;

  useEffect(() => {
    state.messages
      .filter((m) => !m.read && m.sender === 'clinician')
      .forEach((m) => api.markMessageAsRead(m.id));
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;

    api.sendMessage({
      text: text.trim(),
      sender: 'user',
    });

    setText('');

    setTimeout(() => {
      const responses = [
        'Thank you for sharing. How has that been affecting your daily activities?',
        'I appreciate you reaching out. Would you like to schedule a session?',
        'That sounds challenging. Remember to use your coping tools.',
        'You are doing well by staying connected.',
        'How are you feeling right now?',
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      api.sendMessage({
        text: randomResponse,
        sender: 'clinician',
      });
    }, 1800);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessages = () => (
    <ScrollView
      style={styles.messagesContainer}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {state.messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No messages yet</Text>
          <Text style={styles.emptyStateText}>
            Start a conversation with your therapist.
          </Text>
        </View>
      ) : (
        state.messages
          .slice()
          .reverse()
          .map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.sender === 'user'
                  ? styles.userRow
                  : styles.clinicianRow,
              ]}
            >
              {message.sender === 'clinician' && (
                <View style={styles.avatarSmall}>
                  <Stethoscope size={16} color="#059669" />
                </View>
              )}

              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user'
                    ? styles.userBubble
                    : styles.clinicianBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user'
                      ? styles.userText
                      : styles.clinicianText,
                  ]}
                >
                  {message.text}
                </Text>

                <Text
                  style={[
                    styles.timeText,
                    message.sender === 'user'
                      ? styles.userTime
                      : styles.clinicianTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>

              {message.sender === 'user' && (
                <View style={styles.avatarUser}>
                  <User size={16} color="#BE185D" />
                </View>
              )}
            </View>
          ))
      )}
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <MessageCircle size={32} color="#059669" />
        <Text style={styles.title}>Secure Messages</Text>
        <Text style={styles.subtitle}>
          Connect with your care team
        </Text>
      </View>

      {isDesktop ? (
        <View style={styles.desktopWrapper}>
          {/* Left Panel */}
          <View style={styles.sidebar}>
            <View style={styles.profileCard}>
              <View style={styles.doctorAvatar}>
                <Stethoscope size={24} color="#059669" />
              </View>
              <Text style={styles.doctorName}>Dr. Sarah Chen</Text>
              <Text style={styles.doctorStatus}>
                Therapist • Online
              </Text>
            </View>

            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>Support Tips</Text>
              <Text style={styles.tipText}>
                Share openly. Your notes stay private in this
                demo environment.
              </Text>
            </View>
          </View>

          {/* Chat Area */}
          <View style={styles.chatArea}>
            {renderMessages()}

            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={text}
                onChangeText={setText}
                multiline
              />

              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  !text.trim() && styles.sendDisabled,
                ]}
                onPress={handleSend}
                disabled={!text.trim()}
              >
                <Send size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <>
          {renderMessages()}

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={text}
              onChangeText={setText}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.sendBtn,
                !text.trim() && styles.sendDisabled,
              ]}
              onPress={handleSend}
              disabled={!text.trim()}
            >
              <Send size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
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
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
  },

  desktopWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 18,
  },

  sidebar: {
    width: 280,
    gap: 18,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },

  doctorAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  doctorStatus: {
    marginTop: 8,
    color: '#64748B',
  },

  tipCard: {
    backgroundColor: '#DCFCE7',
    padding: 22,
    borderRadius: 18,
  },

  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 10,
  },

  tipText: {
    color: '#065F46',
    lineHeight: 22,
  },

  chatArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    overflow: 'hidden',
  },

  messagesContainer: {
    flex: 1,
    padding: 20,
  },

  messageRow: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'flex-end',
  },

  userRow: {
    justifyContent: 'flex-end',
  },

  clinicianRow: {
    justifyContent: 'flex-start',
  },

  avatarSmall: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  avatarUser: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FCE7F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  messageBubble: {
    maxWidth: '72%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },

  clinicianBubble: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 4,
  },

  userBubble: {
    backgroundColor: '#BE185D',
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },

  clinicianText: {
    color: '#1E293B',
  },

  userText: {
    color: '#FFFFFF',
  },

  timeText: {
    fontSize: 11,
    marginTop: 8,
  },

  clinicianTime: {
    color: '#94A3B8',
  },

  userTime: {
    color: '#FBCFE8',
    textAlign: 'right',
  },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },

  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    maxHeight: 120,
    marginRight: 12,
  },

  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendDisabled: {
    backgroundColor: '#94A3B8',
  },

  emptyState: {
    paddingTop: 80,
    alignItems: 'center',
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
  },

  emptyStateText: {
    marginTop: 10,
    color: '#64748B',
  },
});