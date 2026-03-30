import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { 
  MessageCircle, 
  Send, 
  User,
  Stethoscope
} from 'lucide-react-native';

export default function MessagesScreen() {
  const { api, state } = useApp();
  const [text, setText] = useState('');
  
  // Mark messages as read when screen is viewed
  useEffect(() => {
    state.messages
      .filter(m => !m.read && m.sender === 'clinician')
      .forEach(m => api.markMessageAsRead(m.id));
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    
    api.sendMessage({
      text: text.trim(),
      sender: 'user'
    });
    setText('');
    
    // Simulate clinician response after a delay
    setTimeout(() => {
      const responses = [
        "Thank you for sharing. How has that been affecting your daily activities?",
        "I appreciate you reaching out. Would you like to schedule a session to discuss this further?",
        "That sounds challenging. Remember to use the coping strategies we've discussed.",
        "It's great that you're staying connected. Keep up the good work!",
        "I'm glad to hear from you. How are you feeling right now?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      api.sendMessage({
        text: randomResponse,
        sender: 'clinician'
      });
    }, 2000);
  };

  const formatTime = (timestamp: number) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <MessageCircle size={32} color="#059669" />
        <Text style={styles.title}>Secure Messages</Text>
        <Text style={styles.subtitle}>Connect with your care team</Text>
      </View>

      <ScrollView 
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {state.messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Send your first message to start communicating with your clinician
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
                  styles.messageContainer,
                  message.sender === 'user' 
                    ? styles.userMessageContainer 
                    : styles.clinicianMessageContainer
                ]}
              >
                <View style={styles.messageHeader}>
                  <View style={styles.senderInfo}>
                    {message.sender === 'user' ? (
                      <User size={16} color="#BE185D" />
                    ) : (
                      <Stethoscope size={16} color="#059669" />
                    )}
                    <Text style={styles.senderName}>
                      {message.sender === 'user' ? 'You' : 'Dr. Sarah Chen'}
                    </Text>
                  </View>
                  <Text style={styles.messageTime}>
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
                
                <View style={[
                  styles.messageBubble,
                  message.sender === 'user' 
                    ? styles.userMessageBubble 
                    : styles.clinicianMessageBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.sender === 'user' 
                      ? styles.userMessageText 
                      : styles.clinicianMessageText
                  ]}>
                    {message.text}
                  </Text>
                </View>
              </View>
            ))
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Type your message..."
          value={text}
          onChangeText={setText}
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {text.length > 0 && (
        <Text style={styles.characterCount}>{text.length}/500</Text>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  clinicianMessageContainer: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginBottom: 8,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userMessageBubble: {
    backgroundColor: '#BE185D',
    borderBottomRightRadius: 4,
  },
  clinicianMessageBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  clinicianMessageText: {
    color: '#374151',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 120,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
  },
  sendButton: {
    backgroundColor: '#059669',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
});