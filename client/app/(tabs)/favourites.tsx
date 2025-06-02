import { View, Text } from 'react-native'
import React from 'react'
import { usePetContext } from '../context/PetContext';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import FavouriteCard from '../components/FavouriteCard';
import Header from '../components/Header';
import { useRouter } from 'expo-router';


const favourites = () => {

    const router = useRouter();

    const { width: screenWidth } = Dimensions.get('window');

    const { petData, favourites } = usePetContext();

    // Use sourceId for favourites persistence
    const favouritesPets = petData.filter(pet => favourites.includes(pet.sourceId));

    const cardWidth = (screenWidth - 56) / 2;

    return (
      <View className='flex-1 justify-center items-center bg-primary'>
        <Header />
        <View className='flex-1 bg-primary justify-center items-center' 
        style={{width: screenWidth - 40}}>
        { favouritesPets.length === 0 
        ? (
          <View className='flex-1 justify-center items-center'>
            <Text className='font-galindo text-4xl text-secondary'> 
              no favs now TT
            </Text> 
          </View>
        ) : (<FlatList
          className='w-full'
          data={favouritesPets}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <FavouriteCard
              pet={item}
              width={cardWidth}
              onPressFavourite={() => router.push(`/pet/${item._id}`)}
            />
          )}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 32, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          horizontal={false}
      />)}
        </View>
      </View>
    );
}

export default favourites