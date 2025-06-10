import { Image, View, Text, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native'
import React, { useRef, useState } from 'react'
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

const getDisplayAge = (age: string | number) => {
  if (typeof age === 'number') return `${age} year-old`;
  const ageStr = String(age);
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (dateRegex.test(ageStr)) {
    const birthDate = new Date(ageStr);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let years = today.getFullYear() - birthDate.getFullYear();
      let months = today.getMonth() - birthDate.getMonth();
      if (today.getDate() < birthDate.getDate()) {
        months--;
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      if (years < 1) {
        // Show months only, at least 1 month
        const totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
        const showMonths = today.getDate() < birthDate.getDate() ? totalMonths - 1 : totalMonths;
        return `${showMonths <= 0 ? 1 : showMonths} month-old`;
      }
      return `${years} year-old`;
    }
  }
  return ageStr.includes('year-old') || ageStr.includes('month-old') ? ageStr : `${ageStr} year-old`;
};

const getEnglishName = (name: string) => {
  // Extract only English letters, numbers, spaces, and common punctuation
  const match = name.match(/[A-Za-z0-9\s.,'-]+/g);
  return match ? match.join(' ').trim() : '';
};

const PetCard = ({ pet, isFavourite, onToggleFavourite, width, height }: PetCardProps) => {
  // Heart animation state
  const heartScale = useRef(new Animated.Value(0)).current;
  const [showHeart, setShowHeart] = useState(false);

  const triggerHeartAnimation = () => {
    setShowHeart(true);
    heartScale.setValue(0);
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
        delay: 180,
      }),
    ]).start(() => setShowHeart(false));
  };

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onToggleFavourite(pet.sourceId);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      triggerHeartAnimation();
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={doubleTap}>
      <View
        className="rounded-3xl m-3 relative overflow-hidden shadow-black"
        style={{ width: width || 160, height: height || 240 }}
      >
        {pet.photos && pet.photos.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            className="absolute top-0 left-0 w-full h-full"
          >
            {pet.photos.map((photo, idx) => (
              <Image
                key={photo + idx}
                source={{ uri: photo }}
                className="w-full h-full"
                style={{ width: width || 160, height: height || 240 }}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center bg-gray-200">
            <Text>No photo</Text>
          </View>
        )}
        {/* Animated Heart Overlay */}
        {showHeart && (
          <Animated.View
            pointerEvents="none"
            className="absolute z-10"
            style={{
              top: '50%',
              left: '50%',
              transform: [
                { translateX: -36 }, // half icon size
                { translateY: -36 },
                { scale: heartScale.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1.2] }) },
              ],
              opacity: heartScale.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.7, 0.9] }),
            }}
          >
            <AntDesign name="heart" size={72} color="#ea5e41" />
          </Animated.View>
        )}
        {/* Heart Icon */}
        <TouchableOpacity
          onPress={() => onToggleFavourite(pet.sourceId)}
          className="absolute top-3 right-3 z-20"
          hitSlop={10}
        >
          <AntDesign name={isFavourite ? 'heart' : 'hearto'} size={24} color="#ea5e41" />
        </TouchableOpacity>
        {/* Overlay for name and age */}
        <View
          className="absolute left-0 bottom-0 w-full px-2.5 pb-2.5 bg-black/30 rounded-b-3xl"
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            backgroundColor: 'rgba(0,0,0,0.28)',
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Text
            className="font-galindo text-lg text-white font-bold"
            style={{ textShadowColor: '#000', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}
            numberOfLines={1}
          >
            {getEnglishName(pet.name)}, {getDisplayAge(pet.age)}
          </Text>
        </View>
      </View>
    </GestureDetector>
  );
};

export default PetCard