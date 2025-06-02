import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';

export default function landingScreen({ fadeAnim }: { fadeAnim: Animated.Value }) {

  const [ pressing, setPressing ] = useState<boolean>(false);

  return (
    <Animated.View className="absolute inset-0 flex-1 bg-primary" style={{ opacity: fadeAnim }}>
      <View className="flex-1 flex-col justify-between items-center px-6 pb-10 pt-16">
        {/* Top text */}
        <View className="w-full mt-16">
          <Text className="font-gaegu text-4xl text-secondary text-center leading-relaxed">
            A home for them.{"\n"}A bond for life.
          </Text>
        </View>

        {/* Middle image */}
        <View className="flex-1 justify-center items-center">
          <Image
            source={require('../assets/sleeping-pug.gif')}
            className="w-[300px] h-[300px]"
            resizeMode="contain"
          />
        </View>

        {/* Bottom button */}
        <View className="w-full items-center mb-[80px]">
          <Link href="/(tabs)" asChild>
            <TouchableOpacity 
              activeOpacity={1}
              onPressIn={() => setPressing(true)}
              onPressOut={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                setPressing(false)
              }}
              className={`w-4/5 rounded-xl py-3 border-2 border-secondary bg-primary shadow shadow-secondary ${pressing && "scale-95" }`}>
              <Text className={"text-secondary font-galindo text-xl text-center"}>
                Start the Journey!
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </Animated.View>
)
}