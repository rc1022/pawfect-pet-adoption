import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { usePetContext } from '@/app/context/PetContext'; // Assuming this path is correct
import axios from 'axios'; // Ensure axios is installed: npm install axios
import { Message } from '@/interfaces/interfaces';

// Base URL for your Node.js Express backend
// IMPORTANT: If testing on a physical device, replace 'localhost' with your computer's local IP address (e.g., 'http://192.168.1.X:3001/api')
const API_BASE_URL = 'http://192.168.50.13:4000'; // Correct base URL for backend


const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const { petData } = usePetContext(); // Access pet data from your context

  // Find the pet based on the ID
  const pet = petData.find(p => p._id === id);

  // Handle case where pet is not found
  if (!pet) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <Text className="text-lg text-secondary">Pet not found</Text>
      </SafeAreaView>
    );
  }

  // Define bot's display name, using pet's name or default 'Hunter'
  const botDisplayName = pet.name || 'Hunter';

  // State to hold the entire conversation history
  // Each message object: { _id: number, text: string, createdAt: Date, sender: 'user' | 'bot' }
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the user's current input in the text field
  const [input, setInput] = useState('');
  // State to indicate if a response from the AI is pending
  const [loading, setLoading] = useState(false);

  // Ref for the FlatList to enable auto-scrolling to the bottom
  const flatListRef = useRef<FlatList<any>>(null);

  // Initial greeting from Hunter (bot) based on the detailed persona
  const initialHunterIntro = `Hi there! I'm ${botDisplayName}. I'm here to help you get ready for pet adoption!`;

  // Effect to set the initial greeting when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: initialHunterIntro,
        createdAt: new Date(),
        sender: 'bot'
      },
    ]);
  }, []); // Empty dependency array ensures this runs only once on initial mount

  // Effect to scroll to the end of the FlatList when new messages are added
  useEffect(() => {
    // Use a timeout to ensure rendering is complete before scrolling
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100); // Small delay can help with rendering
    return () => clearTimeout(timer); // Cleanup the timer
  }, [messages]); // Re-run when the 'messages' state array changes


  // Function to handle sending a message from the user
  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMsg = {
      _id: Date.now(), // Unique ID for the user's message
      text: input,
      createdAt: new Date(),
      sender: 'user'
    };

    // Add user's message to the local chat history immediately
    setMessages(prev => [...prev, userMsg]);
    setInput(''); // Clear input field
    setLoading(true); // Show loading indicator

    try {
      // Prepare chatHistory for the backend.
      // IMPORTANT: We slice(1) to exclude the initial hardcoded bot intro message.
      // The backend's HUNTER_SYSTEM_INSTRUCTION already provides the initial context to Gemini,
      // so we only send the actual conversational turns that followed the intro.
      const chatHistoryForBackend = messages.slice(1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', // Map 'sender' to Gemini's 'role'
        parts: [{ text: msg.text }]
      }));

      // Make the API call to your Node.js backend
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        chatHistory: chatHistoryForBackend, // Send the accumulated history (excluding initial bot intro)
        newUserInput: userMsg.text,         // Send the latest user message
      });

      const botResponseText = res.data.message;

      // Add the bot's response to the local chat history
      setMessages(prev => [...prev, {
        _id: Date.now() + 1, // Unique ID for bot's message
        text: botResponseText,
        createdAt: new Date(),
        sender: 'bot',
      }]);

    } catch (err) {
      console.error('Error sending message to backend:', err);
      // Display a user-friendly error message in the chat UI
      setMessages(prev => [
        ...prev,
        {
          _id: Date.now() + 2, // Unique ID for error message
          text: `Sorry, something went wrong. ${pet.name} is taking a nap. Please try again later.`,
          createdAt: new Date(),
          sender: 'bot'
        }
      ]);
    } finally {
      setLoading(false); // Hide loading indicator regardless of success or failure
    }
  };

  // Avatar image sources
  const BOT_AVATAR = pet?.photos[0] || 'https://cdn-icons-png.flaticon.com/512/616/616408.png';
  const USER_AVATAR = 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png';

  // Function to render each message bubble in the FlatList
  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View className={`flex items-end my-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`} >
        {/* Avatar */}
        <Image
          source={{ uri: isUser ? USER_AVATAR : BOT_AVATAR }}
          className="w-9 h-9 rounded-full mx-2 border border-accent bg-white"
        />
        {/* Message bubble */}
        <View
          className={[
            "rounded-2xl px-4 py-2 my-1 max-w-[80%]",
            isUser
              ? "self-end bg-accent"
              : "self-start bg-white"
          ].join(" ")}
        >
          <Text className="font-montserrat600 leading-normal text-secondary">
            {item.text}
          </Text>
          <Text className="text-xs text-secondary mt-1 text-right font-montserrat400">
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={-12} // Reduced offset for iOS keyboard
    >
      {/* Header with app name */}
      <SafeAreaView className='w-full flex flex-row items-center bg-secondary'
        edges={['top', 'left', 'right']}>
      </SafeAreaView>

      <View className='flex justify-center items-center mt-4'>
        <Image
            source={{ uri: BOT_AVATAR }}
            className='w-[170px] h-[170px] rounded-full'
          />

        <Text className='font-galindo text-3xl text-secondary pt-4'> {pet.name} </Text>
      </View> 
      {/* Chat messages list */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
        // onContentSizeChange is useful, but combined with useEffect for scrollToEnd
        // it ensures better reliability for scrolling to the bottom.
      />

      {/* Loading indicator */}
      {loading && (
        <View className="flex-row items-center justify-center p-3 bg-secondary/20 border-t border-accent">
          <ActivityIndicator size="small" color="#EA5E41" />
          <Text className="ml-2 text-accent font-montserrat400">Hunter is thinking...</Text>
        </View>
      )}

      {/* Message input area */}
      <View className="flex-row items-center p-3 border-t border-accent bg-primary mb-3" >
        <TextInput
          className="flex-1 border border-accent rounded-full px-4 py-2 bg-white font-montserrat400 text-base text-gray-800"
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          editable={!loading} // Disable input when loading
          onSubmitEditing={sendMessage} // Send message on keyboard submit
          returnKeyType="send"
          placeholderTextColor="#EA5E41"
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !input.trim()} // Disable send button when loading or input is empty
          className={`ml-2 px-4 py-2 rounded-full ${loading || !input.trim() ? 'bg-accent/60' : 'bg-secondary'}`}
        >
          <Text className="text-white font-montserrat700 text-base">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen; // Renamed export from 'index' to 'ChatScreen' for clarity
