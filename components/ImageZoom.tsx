import React, { useState } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type Props = {
  imageUri: string;
  visible: boolean;
  onClose: () => void;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ImageZoom({ imageUri, visible, onClose }: Props) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Background overlay */}
        <TouchableOpacity
          style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.95)' }]}
          activeOpacity={1}
          onPress={onClose}
        >
          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={onClose}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Zoomable Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Hint text */}
          <View style={styles.hintContainer}>
            <Ionicons name="hand-left-outline" size={20} color="rgba(255,255,255,0.6)" />
            <Ionicons
              name="expand-outline"
              size={16}
              color="rgba(255,255,255,0.6)"
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
