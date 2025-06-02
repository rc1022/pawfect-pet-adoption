import { View, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import SplashScreen from './splashScreen';
import LandingScreen from './landingScreen';

const Index = () => {
  const [showFirst, setShowFirst] = useState(true);
  const splashAnim = useRef(new Animated.Value(1)).current;
  const landingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(splashAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(landingAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => setShowFirst(false));
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary">
      {showFirst && <SplashScreen fadeAnim={splashAnim} />}
      <LandingScreen fadeAnim={landingAnim} />
    </View>
  );
};

export default Index;