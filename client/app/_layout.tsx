import { Stack } from "expo-router";
import './global.css';
import { useFonts as useGalindoFonts, Galindo_400Regular } from '@expo-google-fonts/galindo';
import { PetProvider } from '../app/context/PetContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ShelterProvider from "./context/ShelterContext";
import { useFonts as useGaeguFonts, Gaegu_700Bold } from '@expo-google-fonts/gaegu';
import { 
  useFonts as useMontserratFonts, 
  Montserrat_400Regular,  
  Montserrat_700Bold,  
  Montserrat_900Black 
} from '@expo-google-fonts/montserrat';

export default function RootLayout() {
  // Load both Galindo and Montserrat fonts
  const [galindoLoaded] = useGalindoFonts({
    Galindo_400Regular,
  });
  
  const [montserratLoaded] = useMontserratFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_900Black
  });

  const [gaeguLoaded] = useGaeguFonts({
    Gaegu_700Bold,
  });
  

  if (!galindoLoaded || !montserratLoaded || !gaeguLoaded) {
    return null;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <PetProvider>
      <ShelterProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen
            name="(tabs)"
            options={{headerShown: false}}
          />

          <Stack.Screen 
            name="index"
            options={{headerShown : false}}
          />
        </Stack>
      </ShelterProvider>
    </PetProvider>
    </GestureHandlerRootView>

  );
}
