// components/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

const Chat = () => {
  const [messages, setMessages] = useState([
    // Initial sample data
    { id: '1', text: 'Hello! How can I help you today?', sender: 'ai', timestamp: new Date().toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);

  // Sample AI responses for testing
  const sampleResponses = [
    "I'm a sample AI assistant. In the future, I'll be powered by Ollama!",
    "That's an interesting question. Let me provide some information on that topic.",
    "I can help you with various tasks like answering questions, providing explanations, or generating text.",
    "The Ollama integration will allow me to use different language models to generate more accurate responses.",
  ];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Function to handle sending messages
  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add user message to the chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    
    // Simulate AI response (will be replaced with Ollama API call)
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Get random sample response
      const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  // Function that will be used for Ollama API integration
  const fetchOllamaResponse = async (prompt) => {
    // This is a placeholder function for future Ollama API integration
    // Example implementation might look like:
    /*
    try {
      const response = await fetch('YOUR_OLLAMA_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'YOUR_MODEL_NAME',
          prompt: prompt,
          stream: false,
        }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching from Ollama:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
    */
    
    // For now, return a sample response
    return sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render chat message item
  const renderItem = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0d6efd" />
            <Text style={styles.loadingText}>AI is typing...</Text>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            maxHeight={100}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: "#b3d9ff"
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 2,
  },
  userBubble: {
    backgroundColor: '#0d6efd',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#e9ecef',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#212529',
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
    marginHorizontal: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#6c757d',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0d6efd',
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default Chat;