import { Text, Animated } from 'react-native';
import React from 'react';

const splashScreen = ({ fadeAnim }: { fadeAnim: Animated.Value }) => (
  <Animated.View className="absolute inset-0 flex-1 bg-[#F6EFE7] justify-center items-center" style={{ opacity: fadeAnim }}>
    <Text className="font-galindo text-[64px] text-secondary leading-[80px]">Pawfect</Text>
  </Animated.View>
);

export default splashScreen