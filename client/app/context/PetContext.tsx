import { Pet } from '@/interfaces/interfaces';
import React, { PropsWithChildren, createContext, useContext, useState, useEffect } from 'react';
import { fetchPets } from '@/services/pets';
import AsyncStorage from '@react-native-async-storage/async-storage';

type PetContextType = {
    petData: Pet[];
    loading: boolean;
    favourites: string[]; // Array of sourceId
    toggleFavourite: (sourceId: string) => void;
};

const PetContext = createContext<PetContextType>({
    petData: [],
    loading: false,
    favourites: [], // Array of sourceId
    toggleFavourite: (sourceId: string) => {}, // Update toggleFavourite to take sourceId
});

export const PetProvider = ({ children }: PropsWithChildren<{}>) => {
    const [ petData, setPetData ] = useState<Pet[]>([]);
    const [ loading, setLoading ] = useState<boolean>(false);
    // Store sourceId strings for favourites
    const [ favourites, setFavourites ] = useState<string[]>([]);
    const [ loadingFavourites, setLoadingFavourites ] = useState(true);

      // shuffle array
    function shuffleArray<T>(array: T[]): T[] {
        const arr = array.slice();
        for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
        // Load pet data on mount

        useEffect(() => {
            setLoading(true);
            fetchPets()
              .then(data => {
                console.log('start fetching pets data');
                setTimeout(()=>{
                  setPetData(shuffleArray(data));
                  setLoading(false);
                }, 2000)
              })
              .catch(err => {
                alert(err.message);
                setLoading(false);
              })
            }, [])

    // Load favourites from AsyncStorage on mount
    useEffect(() => {
        const loadFavourites = async () => {
            try {
                const stored = await AsyncStorage.getItem('pawfect_favourites');
                if (stored) {
                    setFavourites(JSON.parse(stored));
                }
            } catch (e) {
                console.warn('Failed to load favourites from storage', e);
            } finally {
                setLoadingFavourites(false);
            }
        };
        loadFavourites();
    }, []);

    // Save favourites to AsyncStorage whenever it changes
    useEffect(() => {
        if (loadingFavourites) return; // Don't save on initial load
        AsyncStorage.setItem('pawfect_favourites', JSON.stringify(favourites)).catch(e => {
            console.warn('Failed to save favourites to storage', e);
        });
    }, [favourites, loadingFavourites]);

    // Use sourceId for all favourite logic
    const toggleFavourite = (sourceId: string) => {
        setFavourites(favs =>
            favs.includes(sourceId)
                ? favs.filter(id => id !== sourceId)
                : [...favs, sourceId]
        );
        // Debug logs
        console.log('Current favourites (sourceId):', favourites);
        console.log('Favourite pets:', petData.filter(pet => favourites.includes(pet.sourceId)));
    }

    return (
        <PetContext.Provider value={{
            petData,
            loading,
            favourites,
            toggleFavourite
        }}>
            {children}
        </PetContext.Provider>
    )
}

export const usePetContext = () => useContext(PetContext);

export default PetProvider;