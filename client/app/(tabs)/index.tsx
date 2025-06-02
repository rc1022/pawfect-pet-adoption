import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import PetCard from "../components/PetCard";
import Carousel from 'react-native-reanimated-carousel';
import { Dimensions } from 'react-native';
import { usePetContext } from "../context/PetContext";
import Header from "../components/Header";


export default function Index() {


  const { width: screenWidth } = Dimensions.get('window');
  const { petData, loading, favourites, toggleFavourite } = usePetContext();
  
  return (
    <View className="flex-1 justify-center items-center">
      <Header />
      <View className="flex-1 bg-primary" style={{ width: screenWidth - 40 }}>
        { !loading && petData ? (
          <Carousel
            loop={false}
            width={screenWidth - 40}
            height={700}
            data={petData}
            renderItem={({ item }) => 
              <PetCard pet={item} 
                isFavourite={favourites.includes(item.sourceId)}
                onToggleFavourite={() => toggleFavourite(item.sourceId)}
              />}
            style={{ flexGrow: 0, marginBottom:40}}
            pagingEnabled={false}
            maxScrollDistancePerSwipe={screenWidth - 40}
          />
        ) : (
          <View
            className="h-[700px] bg-secondary/30 justify-center items-center rounded-2xl mb-10 m-4"
          >
            <ActivityIndicator 
              size='large'
              color="#EA5E41" />
          </View>
        )}
      </View>
    </View>
  );
  
}
