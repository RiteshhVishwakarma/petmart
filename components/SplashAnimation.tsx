import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type Props = {
  onFinish: () => void;
  primaryColor: string;
};

export default function SplashAnimation({ onFinish, primaryColor }: Props) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const zoomOutAnim = useRef(new Animated.Value(1)).current;
  const bgScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Particle animations
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Particle animations (continuous)
    Animated.loop(
      Animated.parallel([
        Animated.timing(particle1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(particle2, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(particle3, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Main sequence of animations
    Animated.sequence([
      // Scale in with rotation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Hold for a moment
      Animated.delay(500),
      // Crazy zoom out + fade out
      Animated.parallel([
        Animated.timing(zoomOutAnim, {
          toValue: 3, // Logo zoom out 3x
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bgScaleAnim, {
          toValue: 1.5, // Background zoom out 1.5x
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particle1Rotate = particle1.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const particle2Rotate = particle2.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const particle3Rotate = particle3.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: primaryColor,
          opacity: fadeAnim,
          transform: [{ scale: bgScaleAnim }],
        },
      ]}
    >
      {/* Animated Particles/Circles */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(255,255,255,0.1)',
          top: '20%',
          left: '10%',
          transform: [{ rotate: particle1Rotate }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: 'rgba(255,255,255,0.08)',
          bottom: '25%',
          right: '15%',
          transform: [{ rotate: particle2Rotate }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: 50,
          backgroundColor: 'rgba(255,255,255,0.12)',
          top: '60%',
          left: '70%',
          transform: [{ rotate: particle3Rotate }],
        }}
      />

      {/* Logo */}
      <Animated.View
        style={{
          transform: [
            { scale: Animated.multiply(scaleAnim, zoomOutAnim) }, 
            { rotate }
          ],
        }}
      >
        <Image 
          source={require('../assets/logo.png')} 
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
});
