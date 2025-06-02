import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

interface ShelterProps {
    id: string;
    name: string;
    logo: any;
}

const ShelterCard = ( { id, name, logo } : ShelterProps) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const cardWidth = screenWidth - 56;
  const cardHeight = screenHeight / 5;
  const router = useRouter();

    return (
    <TouchableOpacity
            onPress={() => router.push(`/shelter/${id}`)}
            activeOpacity={0.7}
            className="bg-accent rounded-3xl flex-row items-center px-6 my-4"
            style={{ width: cardWidth, height: cardHeight }}
          >
            <View className="bg-primary rounded-full justify-center items-center mr-8" style={{ width: cardHeight * 0.7, height: cardHeight * 0.7 }}>
              <Image
                source={logo}
                style={{ width: cardHeight * 0.45, height: cardHeight * 0.45, resizeMode: 'contain' }}
              />
            </View>
            <Text className="text-secondary font-galindo text-5xl leading-[70px]" >
              {name}
            </Text>
          </TouchableOpacity>
  )
}

export default ShelterCard