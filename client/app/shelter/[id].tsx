import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, Dimensions, Linking, TouchableOpacity, ActionSheetIOS, Platform } from 'react-native'
import Header from '../components/Header';
import { useShelterContext } from '../context/ShelterContext';
import { ScrollView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Centre } from '@/interfaces/interfaces';

export default function ShelterDetailScreen() {

    const params = useLocalSearchParams();
    const id = params.id as string;
    const { shelterData } = useShelterContext();
    const shelter = shelterData.find( s => s.id === id)
    if (!shelter) return <Text>Shelter info missing!</Text>

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    const handleLocationPress = ( centre: Centre) => {

        let contactWord = 'Call';
        
        if (/[A-za-z]/.test(centre.contact)) { contactWord = 'Email'}
        
        if ( Platform.OS === 'ios' ) {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', contactWord, 'Show on Google Maps'],
                    cancelButtonIndex: 0
                },
                (buttonIndex) => {
                    if ( buttonIndex === 1 ) {
                        if ( contactWord === 'Email' ) {
                            Linking.openURL(`mailto:${centre.contact}`);
                        } else {
                            Linking.openURL(`tel:${centre.contact}`);
                        }
                    } else if (buttonIndex === 2 ) {
                        const encodedAddress = encodeURIComponent(centre.address);
                        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
                    }
                }
            )
        }
    }
    
    return (
      <View className="flex-1 bg-primary">
        <Header />
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
          {/* Logo */}
          <View className="mt-8 mb-4 justify-center items-center h-[180px] w-[180px]">
            <Image
              source={shelter.logo}
              className="w-[140px] h-[140px]"
              resizeMode="contain"
            />
          </View>

          {/* Shelter Name */}
          <Text className="text-secondary text-5xl font-galindo mb-4 text-center leading-[70px]">
            {shelter.name}
          </Text>

          {/* ABOUT Section */}
          <View className=" w-11/12 rounded-3xl p-5 mb-6 min-h-[120px] justify-center items-center">
            <Text className="text-secondary font-montserrat700 text-base text-left opacity-80">
              {/* Replace this with actual about info if available */}
              {shelter.about}
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row w-full justify-evenly mb-8">
            <View className="flex-1 items-center">
              <Text
                className="bg-secondary text-primary font-galindo text-lg rounded-full px-8 py-2 mx-2"
                onPress={() => shelter.website && Linking.openURL(shelter.website)}
              >
                website
              </Text>
            </View>
            <View className="flex-1 items-center">
              <Text
                className="bg-secondary text-primary font-galindo text-lg rounded-full px-8 py-2 mx-2"
                onPress={() => {shelter.donate && Linking.openURL(shelter.donate)}}
              >
                donate
              </Text>
            </View>
          </View>

          {/* Centres Section */}
          <View className='bg-accent w-full flex flex-col justify-center items-center p-5'>
          <Text className=" text-secondary text-xl font-galindo mb-2 tracking-wider text-center">Locations</Text>
          {Array.isArray(shelter.contact) && shelter.contact.length > 0 ? (
            shelter.contact.map((centre, idx) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                    handleLocationPress(centre)
                }}
                key={idx}
                className="bg-white w-11/12 rounded-3xl p-4 mb-6 shadow-lg justify-center items-center"
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}
              >
                <Text className="text-secondary text-lg font-montserrat700 text-center mb-2">
                  {centre.name}
                </Text>

                <View className="w-full">
                  <View className="flex-row items-start mb-1">
                    <Text className="text-secondary font-montserrat700 text-sm text-left mr-1">Address:</Text>
                    <Text className="text-secondary font-montserrat700 text-sm text-center flex-1">{centre.address}</Text>
                  </View>
                  <View className="flex-row items-start">
                    <Text className="text-secondary font-montserrat700 text-sm text-left mr-1">Contact:</Text>
                    <Text className="text-secondary font-montserrat700 text-sm text-center flex-1">{centre.contact}</Text>
                  </View>
                </View>

              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-secondary text-base text-center opacity-80 mb-8">
              No centre info.
            </Text>
          )}
          </View>
        </ScrollView>
      </View>
    );
}