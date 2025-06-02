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

const PetCard = ({ pet, isFavourite, onToggleFavourite, width }: PetCardProps) => {

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      onToggleFavourite(pet.sourceId)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={doubleTap}>
      <View className="bg-accent rounded-3xl m-4 shadow-lg" style={width ? { width, alignSelf: 'center' } : undefined}>
        <View className="w-full h-full rounded-xl bg-[#ffe8df] p-4 max-h-[700px]">
        <AntDesign className='absolute top-4 right-4' name={isFavourite ? 'heart' : 'hearto'} size={30} color="#ea5e41" />

          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4">
            {pet.photos && pet.photos.length > 0 ? (
              pet.photos.map((photoUrl, index) => (
                <Image
                  key={photoUrl + index}
                  source={{ uri: photoUrl }}
                  className="w-[300px] h-[300px] mr-4 rounded-full mt-16"
                  resizeMode="cover"
                />
              ))
            ) : (
              <Text>No photos available</Text>
            )}
          </ScrollView>
          
          <View className="flex items-center m-5">
            <Text className="font-galindo text-5xl text-secondary leading-[80px]">{getEnglishName(pet.name)}</Text>
            <Text className="font-galindo text-xl m-2 text-secondary" >{pet.breed} | {getSimpleGender(pet.gender)} </Text>
            <Text className="font-galindo text-xl m-2 text-secondary" >Age: {pet.age}</Text>
            <Text className="font-galindo text-xl m-2 text-secondary" >Shelter: {pet.sourceName}</Text>
          </View>
           
        </View>
      </View>
    </GestureDetector>
  );
};

export default PetCard