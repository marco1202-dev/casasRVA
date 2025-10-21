import React, { useState, useEffect, useRef } from 'react';
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
  Alert
} from 'react-native';
import { Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLocalization } from '../../localization';
import { Theme } from '../../theme';
import AIChatService from '../../services/AIChatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SCREEN_HOR_PADDING } from '../../constants';
import { transformAIChatPropertyToListing, formatPropertyPrice } from '../../utils/PropertyUtils';

const AIChatView = ({ onPropertyPress, style, onFocusChange, isActive = true }) => {
  const { getString } = useLocalization();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [language, setLanguage] = useState('es');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [inputBarHeight, setInputBarHeight] = useState(0);
  const flatListRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const getSafeImageUrl = (val, depth = 0) => {
    if (!val || depth > 3) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return getSafeImageUrl(val[0], depth + 1);
    if (typeof val === 'object') {
      const direct = typeof val.uri === 'string' ? val.uri : (typeof val.url === 'string' ? val.url : '');
      if (direct) return direct;
      const candidates = ['image', 'src', 'source', 'main_image'];
      for (let k of candidates) {
        if (val[k]) {
          const nested = getSafeImageUrl(val[k], depth + 1);
          if (nested) return nested;
        }
      }
    }
    return '';
  };

  useEffect(() => {
    initializeChat();
  }, []);

  // Load previously selected language
  useEffect(() => {
    (async () => {
      try {
        const savedLang = await AsyncStorage.getItem('ai_chat_language');
        if (savedLang === 'es' || savedLang === 'en') {
          setLanguage(savedLang);
        }
      } catch (e) {}
    })();
  }, []);

  // Header visibility is controlled by keyboard listeners below

  useEffect(() => {
    const showEvent = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const hideEvent = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    const showSub = Keyboard.addListener(showEvent, (e) => {
      const height = e?.endCoordinates?.height ?? 0;
      setKeyboardHeight(height);
      onFocusChange && onFocusChange(true);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => { setKeyboardHeight(0); onFocusChange && onFocusChange(false); });
    return () => {
      showSub.remove();
      hideSub.remove();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, []);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      await AIChatService.loadSession();

      // Ensure language is resolved before any API call
      let preferredLanguage = language;
      try {
        const savedLang = await AsyncStorage.getItem('ai_chat_language');
        if (savedLang === 'es' || savedLang === 'en') {
          preferredLanguage = savedLang;
          if (savedLang !== language) setLanguage(savedLang);
        }
      } catch (e) {}

      // Try to load server history first
      const serverHistory = await AIChatService.getChatHistory();
      if (serverHistory?.messages && serverHistory.messages.length > 0) {
        setMessages(serverHistory.messages);
        setIsInitialized(true);
      } else {
        const conversation = AIChatService.getConversation();
        if (conversation.length > 0) {
          setMessages(conversation);
          setIsInitialized(true);
        } else {
        // Start new chat with preferred language
        const response = await AIChatService.startChat(preferredLanguage);
        setMessages([{
          role: 'assistant',
          content: response.message,
          timestamp: new Date().toISOString()
        }]);
        setIsInitialized(true);
        }
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Set a fallback message if initialization fails
      setMessages([{
        role: 'assistant',
        content: '¡Hola! Soy tu asistente de propiedades. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date().toISOString()
      }]);
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePropertyPress = (property) => {
    // Transform AI property data to listing format
    const transformedProperty = transformAIChatPropertyToListing(property);
    onPropertyPress && onPropertyPress(transformedProperty);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await AIChatService.sendMessage(inputText.trim(), language);
      
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
        action: response.action,
        properties: response.properties || null,
        escalate: response.escalate || false
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Scroll to bottom
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
        scrollTimeoutRef.current = null;
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat
      const errorMessage = {
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLanguage = async () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
    try { await AsyncStorage.setItem('ai_chat_language', next); } catch (e) {}
    // If user hasn't sent any message yet, refresh the greeting in the new language
    try {
      const hasUserMessage = messages.some(m => m.role === 'user');
      if (!hasUserMessage && messages.length <= 1) {
        setIsLoading(true);
        // Start a new session to get the correct localized welcome
        const response = await AIChatService.startChat(next);
        setMessages([
          {
            role: 'assistant',
            content: response.message,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (_) {
      // ignore and keep existing greeting if refresh fails
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    const isUser = item.role === 'user';
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {item.content}
          </Text>
          
          {/* Render properties if available */}
          {item.properties && item.properties.length > 0 && (
            <View style={styles.propertiesContainer}>
              <Text style={styles.propertiesTitle}>🏠 Propiedades Encontradas:</Text>
              {item.properties.map((property, propIndex) => (
                <TouchableOpacity
                  key={propIndex}
                  style={styles.propertyCard}
                  onPress={() => handlePropertyPress(property)}
                >
                  {(() => {
                    const rawImg = property?.main_image ?? property?.image;
                    const imageUrl = getSafeImageUrl(rawImg);
                    if (typeof imageUrl === 'string' && imageUrl.length > 0) {
                      try {
                        return (
                          <FastImage
                            source={{ uri: String(imageUrl), priority: FastImage.priority.low }}
                            style={styles.propertyImage}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        );
                      } catch (e) {
                        return (
                          <View style={[styles.propertyImage, styles.propertyImagePlaceholder]}>
                            <Text style={styles.propertyImagePlaceholderText}>No Photo</Text>
                          </View>
                        );
                      }
                    }
                    return (
                      <View style={[styles.propertyImage, styles.propertyImagePlaceholder]}>
                        <Text style={styles.propertyImagePlaceholderText}>No Photo</Text>
                      </View>
                    );
                  })()}
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyPrice}>
                      {formatPropertyPrice(property.price)}
                    </Text>
                    <Text style={styles.propertyAddress} numberOfLines={2}>
                      {property.address || 'Dirección no disponible'}
                    </Text>
                    <View style={styles.propertyDetails}>
                      <Text style={styles.propertyDetail}>
                        🛏️ {property.bedrooms || 0} dorm
                      </Text>
                      <Text style={styles.propertyDetail}>
                        🚿 {property.bathrooms || 0} baño
                      </Text>
                      {property.living_area && (
                        <Text style={styles.propertyDetail}>
                          📐 {property.living_area} ft²
                        </Text>
                      )}
                    </View>
                    {property.amenities && property.amenities.length > 0 && (
                      <View style={styles.amenitiesContainer}>
                        {property.amenities.slice(0, 3).map((amenity, amenityIndex) => (
                          <View key={amenityIndex} style={styles.amenityTag}>
                            <Text style={styles.amenityText}>{amenity}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

      const renderQuickActions = () => (
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setInputText(language === 'es' ? 'Quiero comprar una casa' : 'I want to buy a house')}
          >
            <Text style={styles.quickActionText}>{language === 'es' ? 'Comprar' : 'Buy'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setInputText(language === 'es' ? 'Quiero alquilar' : 'I want to rent')}
          >
            <Text style={styles.quickActionText}>{language === 'es' ? 'Alquilar' : 'Rent'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => setInputText(language === 'es' ? '¿Qué áreas cubren?' : 'What areas do you cover?')}
          >
            <Text style={styles.quickActionText}>{language === 'es' ? 'Áreas' : 'Areas'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.agentButton]}
            onPress={() => setInputText(language === 'es' ? 'Hablar con un agente' : 'Talk to an agent')}
          >
            <Text style={[styles.quickActionText, styles.agentButtonText]}>{language === 'es' ? 'Hablar Agente' : 'Talk to Agent'}</Text>
          </TouchableOpacity>
        </View>
      );

  if (!isInitialized) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.primary} />
          <Text style={styles.loadingText}>Inicializando chat...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {/* Language Toggle */}
      <View style={styles.langRow}>
        <View style={styles.langRowInner}>
          <TouchableOpacity
            style={[
              styles.langPill,
              { backgroundColor: language === 'es' ? '#b42029' : '#ffffff', borderColor: '#b42029' }
            ]}
            onPress={() => language !== 'es' && toggleLanguage()}
          >
            <Text style={[styles.langPillText, { color: language === 'es' ? '#ffffff' : '#b42029' }]}>🇪🇸  Español</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.langPill,
              { backgroundColor: language === 'en' ? '#b42029' : '#ffffff', borderColor: '#b42029' }
            ]}
            onPress={() => language !== 'en' && toggleLanguage()}
          >
            <Text style={[styles.langPillText, { color: language === 'en' ? '#ffffff' : '#b42029' }]}>🇺🇸  English</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Panel */}
      <KeyboardAvoidingView
        style={styles.chatPanel}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <Text style={styles.chatHeaderTitle}>{language === 'es' ? 'Asistente De Propiedades' : 'Property Assistant'}</Text>
          <View style={styles.onlineBadge}><Text style={styles.onlineBadgeText}>{language === 'es' ? 'En línea' : 'Online'}</Text></View>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `${item.role}-${index}`}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={50}
          windowSize={7}
        />

        {/* Input Container - Fixed at bottom of chat panel */}
        {isActive && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={language === 'es' ? 'Buscar casas...' : 'Search homes...'}
              placeholderTextColor={Theme.colors.lightgray}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity
              style={[styles.sendButtonRect, (!inputText.trim() || isLoading) && styles.sendButtonRectDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.sendButtonRectText}>{language === 'es' ? 'Enviar' : 'Send'}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {false && renderQuickActions()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.windowBackground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Theme.colors.text,
  },
  messagesList: {
    flex: 1,
    minHeight: 200,
    backgroundColor: '#f9fafb',
  },
  chatPanel: {
    marginHorizontal: SCREEN_HOR_PADDING,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
    position: 'relative',
  },
  messagesContent: {
    padding: SCREEN_HOR_PADDING,
    paddingTop: 60,
    paddingBottom: 100, // space for input bar
  },
  langRow: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    marginTop: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  langRowInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  langPill: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 6,
  },
  langPillActive: {
    backgroundColor: Theme.colors.primary,
    borderColor: Theme.colors.primary,
  },
  langPillText: {
    color: Theme.colors.primary,
    fontWeight: '700',
  },
  langPillTextActive: {
    color: 'white',
    fontWeight: '700',
  },
  chatHeader: {
    backgroundColor: '#b42029',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
  },
  chatHeaderTitle: {
    color: 'white',
    fontWeight: '700',
  },
  onlineBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  onlineBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: 16,
    marginTop: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#b42029',
  },
  assistantBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  assistantText: {
    color: Theme.colors.text,
  },
  propertiesContainer: {
    marginTop: 12,
  },
  propertiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.text,
    marginBottom: 8,
  },
  propertyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 150,
    backgroundColor: Theme.colors.lightgray,
  },
  propertyImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  propertyImagePlaceholderText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  propertyInfo: {
    padding: 12,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: Theme.colors.text,
    marginBottom: 8,
  },
  propertyDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  propertyDetail: {
    fontSize: 12,
    color: Theme.colors.lightgray,
    marginRight: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: Theme.colors.lightPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  amenityText: {
    fontSize: 10,
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SCREEN_HOR_PADDING,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickActionButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  agentButton: {
    backgroundColor: '#10b981',
  },
  quickActionText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  agentButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SCREEN_HOR_PADDING,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
    minHeight: 60,
  },
  textInput: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 16,
    color: Theme.colors.text,
    backgroundColor: 'white',
  },
  sendButtonRect: {
    backgroundColor: '#b42029',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  sendButtonRectDisabled: {
    backgroundColor: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    opacity: 1,
  },
  sendButtonRectText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default AIChatView;
