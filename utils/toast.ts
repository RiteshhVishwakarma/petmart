import { Platform, ToastAndroid } from 'react-native';

/**
 * Simple cross-platform toast notification
 * Android: Uses native ToastAndroid
 * iOS: Uses console log (you can enhance with a custom toast component)
 */
export const showToast = (message: string, duration: 'short' | 'long' = 'short') => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(
      message,
      duration === 'short' ? ToastAndroid.SHORT : ToastAndroid.LONG
    );
  } else {
    // For iOS, log to console
    // In production, you can use a library like react-native-toast-message
    console.log('🔔 Toast:', message);
    
    // Optional: You can also use Alert for iOS if needed
    // Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
  }
};

export const showSuccessToast = (message: string) => {
  showToast(`✅ ${message}`, 'short');
};

export const showErrorToast = (message: string) => {
  showToast(`❌ ${message}`, 'short');
};
