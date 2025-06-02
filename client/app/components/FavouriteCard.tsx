import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Pet } from '@/interfaces/interfaces';
import * as Haptics from 'expo-haptics';


interface FavouriteCardProps {
  pet: Pet;
  width: number;
  onPressFavourite: (sourceId: string) => void;
}

const FavouriteCard = ({ pet, width, onPressFavourite }: FavouriteCardProps) => {
  
  const getSimpleGender = (gender: string) => {
    const g = gender.toLowerCase();
    if (g.includes('female')) return 'Female';
    if (g.includes('male')) return 'Male';
    return gender;
  };

  return (
    <TouchableOpacity
      style={{ width, alignSelf: 'flex-start', margin: 8, borderRadius: 16, backgroundColor: '#f9f6f2', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 }}
      activeOpacity={0.9}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        onPressFavourite(pet.sourceId)
      }}
    >
      <View className="rounded-t-2xl overflow-hidden bg-[#eee]">
        {pet.photos && pet.photos.length > 0 ? (
          <Image
            source={{ uri: pet.photos[0] }}
            className="w-full h-[120px]"
            style={{ resizeMode: 'cover' }}
          />
        ) : (
          <View className="w-full h-[120px] flex justify-center items-center">
            <Text>No photos for him/her</Text>
          </View>
        )}
      </View>
      <View className="p-2.5 flex flex-row justify-between">
        <Text className="font-galindo text-secondary text-[17px] mb-0.5">{pet.name}</Text>
        <View className="flex-row items-center mb-0.5">
          <AntDesign name={getSimpleGender(pet.gender) === 'Male' ? 'man' : 'woman'} size={14} color={getSimpleGender(pet.gender) === 'Male' ? '#3b82f6' : '#f472b6'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavouriteCard;
