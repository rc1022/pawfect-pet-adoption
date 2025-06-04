import { Image, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { Pet } from '@/interfaces/interfaces'
import AntDesign from '@expo/vector-icons/AntDesign';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

type PetCardProps = {
    pet: Pet;
    isFavourite: boolean;
    onToggleFavourite: (sourceId: string) => void;
    width?: number;
    height?: number;
};

const getSimpleGender = (gender: string) => {
  const g = gender.toLowerCase();
  if (g.includes('female')) return 'Female';
  if (g.includes('male')) return 'Male';
  return gender;
};

const getEnglishName = (name: string) => {
  // Extract only English letters, numbers, spaces, and common punctuation
  const match = name.match(/[A-Za-z0-9\s.,'-]+/g);
  return match ? match.join(' ').trim() : '';
};

const PetCard = ({ pet, isFavourite, onToggleFavourite, width, height }: PetCardProps) => {

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onToggleFavourite(pet.sourceId)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={doubleTap}>
      <View
        className="bg-accent rounded-3xl m-3 shadow-lg"
        style={{ width: width || 160, height: height || 240, overflow: 'hidden', position: 'relative' }}
      >
        {pet.photos && pet.photos.length > 0 ? (
          <Image
            source={{ uri: pet.photos[0] }}
            style={{ width: '100%', height: '100%' }}
            className="absolute top-0 left-0 w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-200">
            <Text>No photo</Text>
          </View>
        )}
        {/* Heart Icon */}
        <TouchableOpacity
          onPress={() => onToggleFavourite(pet.sourceId)}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
          hitSlop={10}
        >
          <AntDesign name={isFavourite ? 'heart' : 'hearto'} size={24} color="#ea5e41" />
        </TouchableOpacity>
        {/* Overlay for name and age */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            padding: 10,
            backgroundColor: 'rgba(0,0,0,0.28)',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Text
            className="font-galindo text-lg"
            style={{ color: 'white', fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
            numberOfLines={1}
          >
            {getEnglishName(pet.name)}, {pet.age}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
};

export default PetCard