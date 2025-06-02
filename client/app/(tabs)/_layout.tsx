import React from 'react'
import { Tabs } from 'expo-router'
import CustomTabBar from '../components/CustomTabBar'

const _layout = () => {
  return (
      <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent:'center',
          alignItems:'center'
        },
        tabBarStyle: route.name === 'pet/[id]' ? { display: 'none' } : {
          backgroundColor: '#F4EFE9',
          borderTopColor:'E4E0DB',
          position: 'absolute',
          overflow: 'hidden',
        },
        headerShown: false
      })}
      >
        <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="shelter"
        options={{
          title: 'shelter',
        }}
      />
        

    </Tabs>
  )
}

export default _layout