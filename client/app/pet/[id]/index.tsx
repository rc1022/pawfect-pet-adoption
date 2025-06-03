import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePetContext } from '@/app/context/PetContext'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';



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

// Hide the tab bar on this screen using Expo Router options export
export const options = {
  tabBarStyle: { display: 'none' },
};

const pet = () => {
  const [displayStory, setDisplayStory] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { petData } = usePetContext();
  const pet = petData.find( p => p._id === id)

  const characters = pet?.character.split(', ');

  const getSimpleGender = (gender: string) => {
    const g = gender.toLowerCase();
    if (g.includes('female')) return 'Female';
    if (g.includes('male')) return 'Male';
    return gender;
  };

  if (!pet) return <Text className='text-center mt-10'> Pet not found TT</Text>

  // Image sizing for horizontal ScrollView
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


  return (
    <SafeAreaView className='flex-1 bg-primary' edges={['bottom']}>
      <ImageViewing
        images={pet.photos.map(url => ({ uri: url }))}
        imageIndex={selectedIndex}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        backgroundColor="rgba(0,0,0,0.85)"
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
        <TouchableOpacity 
          className='absolute top-10 left-5 z-10 w-10 h-10 flex justify-center items-center'
          onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#F7EFE7" />
        </TouchableOpacity>

<View style={{ flex: 1, flexDirection: 'column' }}>
  <ScrollView
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    style={{ width: screenWidth }}
    contentContainerStyle={{ flexGrow: 1 }}
  >
    {pet.photos && pet.photos.length > 0 ? (
      pet.photos.map((photoUrl, index) => (
        <TouchableOpacity
          key={photoUrl + '-' + index}
          className="w-full aspect-[4/5] overflow-hidden"
          style={{ width: screenWidth }}
          activeOpacity={0.9}
          onPress={() => {
            setSelectedIndex(index);
            setModalVisible(true);
          }}
        >
          <Image
            source={{ uri: photoUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>
      ))
    ) : (
      <View className="w-full aspect-[4/5] justify-center items-center" style={{ width: screenWidth }}>
        <Text>No photos available</Text>
      </View>
    )}
  </ScrollView>

  <ScrollView 
    showsVerticalScrollIndicator={false}
    className="bg-primary rounded-t-[30px] w-full self-center p-6 shadow flex flex-col border-accent border -mt-10">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-galindo text-secondary text-4xl"
                style={{lineHeight: 50}}
          >{pet.name} </Text>

            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                router.push(`/pet/${id}/chat`)
              }}
              className='w-30 h-15 bg-accent p-3 text-center rounded-2xl'>
              <Text className='text-secondary font-galindo'>Plan a visit!</Text>
            </TouchableOpacity>
        </View>

        {/* Badges  */}
        <View className='flex flex-row justify-between mx-5 my-5'>
          
          <View className='flex items-center justify-center'>
            
            {pet.category === 'dogs' ? 
              (
                <TouchableOpacity className='w-[80px] h-[80px] rounded-full bg-secondary items-center justify-center'>
                <FontAwesome5 name="dog" size={32} color="white" /> 
              </TouchableOpacity>
              ) : (
                <TouchableOpacity className='w-[80px] h-[80px] rounded-full bg-secondary items-center justify-center'>
                <FontAwesome5 name="cat" size={32} color="white" /> 
              </TouchableOpacity>
              )
            }

              <Text className='font-galindo text-secondary mt-2'>
                {getSimpleGender(pet.gender)}
              </Text>

          </View>
          <View className='flex items-center justify-center'>
            <TouchableOpacity className='w-[80px] h-[80px] rounded-full bg-secondary items-center justify-center'>
              <FontAwesome5 name="paw" size={32} color="white" /> 
            </TouchableOpacity>
            <Text className='font-galindo text-secondary mt-2'>
              {pet.breed}
            </Text>
          </View>

          <View className='flex items-center justify-center'>
            <TouchableOpacity className='w-[80px] h-[80px] rounded-full bg-secondary items-center justify-center'>
              <FontAwesome5 name="birthday-cake" size={32} color="white" />
            </TouchableOpacity>
            <Text className='font-galindo text-secondary mt-2'>
              {getDisplayAge(pet.age)}
            </Text>
          </View>
        </View>
          
        {/* Characteristics */}
        <View>
          <View  className=' p-5 mb-5'>

          {characters?.map((character: string) => (
              <View key={character} className='flex flex-row justify-evenly m-2 p-2'>
                <Text className='font-galindo text-xl text-center grow text-secondary'> {character} </Text>
                <View className='flex flex-row ml-5'> 
                  <Ionicons name="paw-sharp" size={24} color="#EA5E41" className='mr-5'/>
                  <Ionicons name="paw-sharp" size={24} color="#EA5E41" className='mr-5'/>
                  <Ionicons name="paw-sharp" size={24} color="#EA5E41" className='mr-5'/>
                  <Ionicons name="paw-sharp" size={24} color="#EA5E41" className='mr-5'/>
                  <Ionicons name="paw-sharp" size={24} color="#EA5E41" />
                </View>
              </View> 
            )
            )}

            


          </View>
          <View className="bg-[#FFE1D6] rounded-3xl p-5 mt-4">
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => {
      setDisplayStory(prev => !prev)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    }}
  >
    <Text className="text-[#EA5E41] font-montserrat900 text-xl font-bold mb-3 text-left">
      Say Hi to {pet.name} ❤︎
    </Text>
    <View>
      {displayStory ? (
        <Text className="text-[#EA5E41] font-montserrat700 text-lg font-bold text-left">
          {pet.description}
        </Text>
      ) : (
        <Text className="text-[#EA5E41] font-montserrat700 text-lg font-bold text-left">
          {pet.description.split(' ').slice(0, 20).join(' ')}{pet.description.split(' ').length > 20 ? ' ...' : ''}
        </Text>
      )}
    </View>
  </TouchableOpacity>
</View>
          

            { pet.note && 
            <View className='border-4 border-secondary rounded-md p-2 mt-5'>
                <Text className='text-secondary font-galindo text-lg text-center' > Important Note</Text>
                <Text className='text-secondary font-galindo text-sm text-center' >{pet.note} </Text>
            </View>
            }
        </View>
        
  </ScrollView>
</View>
    </SafeAreaView>
  )
}

export default pet