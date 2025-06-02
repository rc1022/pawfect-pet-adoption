import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Header = () => {
  return (
    <SafeAreaView className='w-full flex flex-row items-center bg-secondary'
        edges={['top','left','right']}>
        <Text className='pl-5 font-galindo text-primary text-3xl pb-2'>Pawfect</Text>



    </SafeAreaView>
  )
}

export default Header