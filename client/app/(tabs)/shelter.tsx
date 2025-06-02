import { View, Text, Dimensions, FlatList } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import ShelterCard from '../components/ShelterCard'
import { useShelterContext } from '../context/ShelterContext'

const shelter = () => {

  const { shelterData } = useShelterContext();

  return (
    <View className="items-center justify-center bg-primary h-full w-full">
      <Header />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={shelterData}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <ShelterCard
            id={item.id} 
            name={item.name}
            logo={item.logo}
          />)}
        numColumns={1}
      />
    </View>
  )
}

export default shelter