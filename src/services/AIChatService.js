import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants';

const SESSION_STORAGE_KEY = 'ai_chat_session_id';
const CONVERSATION_STORAGE_KEY = 'ai_chat_conversation';

class AIChatService {
  constructor() {
    this.sessionId = null;
    this.conversation = [];
  }

  // Initialize chat session
  async startChat(language = 'es') {
    try {
      const response = await axios.post(`${API_URL}/ai-chat/start`, {
        language: language
      });
      
      this.sessionId = response.data.session_id;
      this.conversation = [{
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString()
      }];
      
      // Save session to storage
      await AsyncStorage.setItem(SESSION_STORAGE_KEY, this.sessionId);
      await AsyncStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(this.conversation));
      
      return response.data;
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  }

  // Send message to AI
  async sendMessage(message, language = 'es') {
    try {
      // Load session if not exists
      if (!this.sessionId) {
        await this.loadSession();
      }

      // Add user message to conversation
      this.conversation.push({
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });

      const response = await axios.post(`${API_URL}/ai-chat/message`, {
        session_id: this.sessionId,
        message: message,
        language: language
      });

      // Add assistant response to conversation
      this.conversation.push({
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        action: response.data.action,
        properties: response.data.properties || null,
        escalate: response.data.escalate || false
      });

      // Save updated conversation
      await AsyncStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(this.conversation));

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Load existing session from storage
  async loadSession() {
    try {
      const storedSessionId = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      const storedConversation = await AsyncStorage.getItem(CONVERSATION_STORAGE_KEY);
      
      if (storedSessionId) {
        this.sessionId = storedSessionId;
      }
      
      if (storedConversation) {
        this.conversation = JSON.parse(storedConversation);
      }
    } catch (error) {
      console.error('Error loading session:', error);
    }
  }

  // Get chat history
  async getChatHistory() {
    try {
      if (!this.sessionId) {
        await this.loadSession();
      }

      if (!this.sessionId) {
        return { messages: [] };
      }

      const response = await axios.get(`${API_URL}/ai-chat/history`, {
        params: { session_id: this.sessionId }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting chat history:', error);
      return { messages: [] };
    }
  }

  // Request human agent
  async requestHumanAgent(contactInfo, message = '') {
    try {
      if (!this.sessionId) {
        await this.loadSession();
      }

      const response = await axios.post(`${API_URL}/ai-chat/request-agent`, {
        session_id: this.sessionId,
        contact_info: contactInfo,
        message: message
      });

      return response.data;
    } catch (error) {
      console.error('Error requesting human agent:', error);
      throw error;
    }
  }

  // Clear session and conversation
  async clearSession() {
    try {
      this.sessionId = null;
      this.conversation = [];
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      await AsyncStorage.removeItem(CONVERSATION_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }

  // Get current conversation
  getConversation() {
    return this.conversation;
  }

  // Get session ID
  getSessionId() {
    return this.sessionId;
  }
}

export default new AIChatService();
