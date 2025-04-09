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
  Alert,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import axios from 'axios'; // Import axios

const Chat = () => {
  const [messages, setMessages] = useState([
    // Initial sample data
    { id: '1', text: 'Hello! How can I help you today?', sender: 'ai', timestamp: new Date().toISOString() },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef(null);
  const { name, location, bluetoothAddress, baseURL, nearestDevice, nearestNeighbors } = useAppContext();
  

  let username = 'admin';
  let password = 'KHtj9wOh3WUtHDnM3thIzNDkmk3eDn5z';
  let token = btoa(`${username}:${password}`);
  

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
    
    // Start loading indicator
    setIsLoading(true);
    
    handleFetchAPICall();
  };

  const handleAPICall = async() => {
    try {
      // Call the API with axios (using the format from the curl command)
      const response = await axios.post('https://major.waferlabs.com:16384/chat/', {
        "nearest": "aa",
        "neighbour": [],
        "name": "AA",
        "prompt": inputText.trim()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
           'Authorization': 'YWRtaW46S0h0ajl3T2gzV1V0SERuTTN0aEl6TkRrbWszZURuNXo'
        }
      });
      console.log("api is called :: ")
      // Extract response data
      const aiResponse = response.data;
      console.log("airesponse is :: ", response)
      
      // Create AI message
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response || aiResponse.toString(),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      // Add AI message to chat
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching from API:', error);
      
      // Handle error and display message to user
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error.message}`,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleFetchAPICall = async () => {
    // const username = 'admin';
    // const password = 'KHtj9wOh3WUtHDnM3thIzNDkmk3eDn5z';
    // const token = btoa(`${username}:${password}`);
    const body = JSON.stringify({
      nearest: "aa",
      neighbour: [],
      name: name,
      prompt: inputText.trim()
    })
    try {
      const response = await fetch('https://major.waferclabs.com:16384/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${token}`
        },
        body: body
      });

    console.log("body is :: ",body)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const aiResponse = await response.json();
      console.log("AI Response is :: ", aiResponse);
  
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.response || aiResponse.toString(),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setIsLoading(false);
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      getNodes();
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  
  const getNodes = async () => { 
    const response = await fetch('https://major.waferclabs.com:16384/nodes/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${token}`
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log('Response: od node is :: ', data);
    console.log("nearest devie is:: ", nearestDevice)
    console.log("nearest negbour is :: ", nearestNeighbors)
    console.log(bluetoothAddress)
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
            <Text style={styles.loadingText}>AI is responding...</Text>
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