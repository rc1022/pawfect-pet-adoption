import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import PetCard from "../components/PetCard";

import { Dimensions } from 'react-native';
import { usePetContext } from "../context/PetContext";
import Header from "../components/Header";
import { Pet } from "@/interfaces/interfaces";

import { ScrollView } from 'react-native';

export default function Index() {

  const { width: screenWidth } = Dimensions.get('window');
  const { petData, loading, favourites, toggleFavourite } = usePetContext();

  const column1Data: Pet[] = [];
  const column2Data: Pet[] = [];
  petData.forEach((pet: Pet, index: number) => {
    if (index % 2 === 0) {
      column1Data.push(pet);
    } else {
      column2Data.push(pet);
    }
  });

  // Calculate PetCard content width: (column_width - horizontal_margins_of_card)
  // Column width is (screenWidth - 30) / 2
  // PetCard m-3 class implies 12px margin on each side, so 24px total horizontal margin.
  const petCardContentWidth = ((screenWidth - 30) / 2) - 10;


  const getSatableHeight = ( petId: string ) => {
    return petId.charCodeAt(petId.length - 1) % 2 === 0 ? 220 : 320;
  }
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Header />
      <View className="flex-1 bg-primary" style={{ width: screenWidth - 30 }}>
        {!loading && petData && petData.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View className="flex-row w-full">
              {/* Column 1 */}
              <View className="flex-1">
                {column1Data.map((pet) => (
                  pet && (
                    <PetCard
                      key={pet._id}
                      pet={pet}
                      isFavourite={favourites.includes(pet.sourceId)}
                      onToggleFavourite={() => toggleFavourite(pet.sourceId)}
                      height={getSatableHeight(pet._id)}
                      width={petCardContentWidth}
                    />
                  )
                ))}
              </View>
              {/* Column 2 */}
              <View className="flex-1">
                {column2Data.map((pet) => (
                  pet && (
                    <PetCard
                      key={pet._id}
                      pet={pet}
                      isFavourite={favourites.includes(pet.sourceId)}
                      onToggleFavourite={() => toggleFavourite(pet.sourceId)}
                      height={getSatableHeight(pet._id)}
                      width={petCardContentWidth}
                    />
                  )
                ))}
              </View>
            </View>
          </ScrollView>
        ) : !loading && petData && petData.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-secondary font-galindo text-xl">No pets found</Text>
          </View>
        ) : (
          <View
            className="h-[700px] bg-secondary/30 justify-center items-center rounded-2xl mb-10 m-4"
          >
            <ActivityIndicator size='large' color="#EA5E41" />
          </View>
        )}
      </View>
    </View>
  );
}
