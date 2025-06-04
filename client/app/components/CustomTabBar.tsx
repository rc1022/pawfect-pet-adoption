import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import * as Haptics from 'expo-haptics';

type CustomTabBarProps = {
  state: {
    index: number;
  };
};

export default function CustomTabBar({ state }: CustomTabBarProps) {
  const router = useRouter();

  // Helper for active tab styling (optional)
  const isActive = (index: number) => state.index === index;

  return (
    <View className="flex-row bg-primary h-20 rounded-t-2xl items-center justify-around absolute left-0 right-0 bottom-0 shadow-sm z-10">

      {/* Left Tab */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => {
          router.replace("/favourites")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        activeOpacity={0.8}
      >
        <AntDesign name="heart" size={32} color={isActive(0) ? "#ea6a4f" : "#c0a6a0"} />
      </TouchableOpacity>

      {/* Center Floating Tab */}
      <View className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 shadow-md">
        <TouchableOpacity
          className="w-28 h-28 rounded-full bg-[#ffe2d7] items-center justify-center"
          onPress={() => {
            router.replace("/")
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          activeOpacity={0.8}
        >
          <Fontisto name="paw" size={48} color={isActive(1) ? "#ea6a4f" : "#c0a6a0"} />
        </TouchableOpacity>
      </View>

      {/* Right Tab */}
      <TouchableOpacity
        className="flex-1 items-center justify-center"
        onPress={() => {
          router.replace("/shelter")
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        activeOpacity={0.8}
      >
        <Entypo name="home" size={32} color={isActive(2) ? "#ea6a4f" : "#c0a6a0"} />
      </TouchableOpacity>
    </View>
  );
}