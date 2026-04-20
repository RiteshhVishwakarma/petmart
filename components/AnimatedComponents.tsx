import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

/**
 * Fade In Animation
 * Usage: <FadeIn><YourComponent /></FadeIn>
 */
export const FadeIn = ({ 
  children, 
  duration = 500, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

/**
 * Slide In From Bottom
 * Usage: <SlideInBottom><YourComponent /></SlideInBottom>
 */
export const SlideInBottom = ({ 
  children, 
  duration = 400, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Scale In Animation (Pop effect)
 * Usage: <ScaleIn><YourComponent /></ScaleIn>
 */
export const ScaleIn = ({ 
  children, 
  duration = 300, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration * 0.7,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Slide In From Left
 * Usage: <SlideInLeft><YourComponent /></SlideInLeft>
 */
export const SlideInLeft = ({ 
  children, 
  duration = 400, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  duration?: number; 
  delay?: number;
}) => {
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ translateX: slideAnim }],
        opacity: fadeAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Pulse Animation (for badges, notifications)
 * Usage: <Pulse><YourComponent /></Pulse>
 */
export const Pulse = ({ 
  children,
  scale = 1.1,
  duration = 1000,
}: { 
  children: React.ReactNode;
  scale?: number;
  duration?: number;
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: scale,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: pulseAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Staggered List Animation
 * Usage: Wrap FlatList items with this
 */
export const StaggeredItem = ({ 
  children, 
  index = 0,
  staggerDelay = 100,
}: { 
  children: React.ReactNode; 
  index?: number;
  staggerDelay?: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * staggerDelay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * staggerDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

/**
 * Bounce Animation (for buttons)
 * Usage: Call this function on button press
 */
export const useBounceAnimation = () => {
  const bounceAnim = useRef(new Animated.Value(1)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { bounceAnim, bounce };
};

/**
 * Animated Pressable (Button with scale effect)
 */
export const AnimatedPressable = ({ 
  children, 
  onPress, 
  style 
}: { 
  children: React.ReactNode; 
  onPress: () => void;
  style?: ViewStyle;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        onTouchCancel={handlePressOut}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};
