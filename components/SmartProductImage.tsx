import React from 'react';
import { View, Image, ImageStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';

type Props = {
  uri: string;
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Smart Product Image Component
 * 
 * Features:
 * - Auto-adjusts any image size/ratio to fit frame
 * - Adds blurred background for transparent PNGs
 * - Professional product display
 * - Works with any aspect ratio
 */
export default function SmartProductImage({ uri, width, height, borderRadius = 0, style }: Props) {
  return (
    <View style={{ 
      width, 
      height, 
      borderRadius, 
      overflow: 'hidden',
      backgroundColor: '#f5f5f5',
      position: 'relative',
    }}>
      {/* Blurred Background Layer */}
      <Image 
        source={{ uri }} 
        style={{ 
          position: 'absolute',
          width: '100%', 
          height: '100%',
          resizeMode: 'cover',
        }}
        blurRadius={20}
      />
      
      {/* Overlay for better contrast */}
      <View style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
      }} />
      
      {/* Main Product Image - Centered & Contained */}
      <Image 
        source={{ uri }} 
        style={[
          { 
            width: '100%', 
            height: '100%',
            resizeMode: 'contain', // Shows full product without crop
          },
          style
        ]}
      />
    </View>
  );
}
