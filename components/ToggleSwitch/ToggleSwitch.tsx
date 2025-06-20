import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated, Easing, Vibration } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor, runOnJS } from 'react-native-reanimated';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: {
    false?: string;
    true?: string;
  };
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isOn,
  onToggle,
  trackColor = {
    false: '#e0e0e0',
    true: '#4CAF50',
  },
  thumbColor = {
    false: '#f5f5f5',
    true: '#f5f5f5',
  },
  size = 'medium',
  disabled = false,
}) => {
  const trackWidth = {
    small: 40,
    medium: 50,
    large: 60,
  }[size];

  const trackHeight = {
    small: 20,
    medium: 25,
    large: 30,
  }[size];

  const thumbSize = {
    small: 16,
    medium: 21,
    large: 26,
  }[size];

  const translateX = useSharedValue(isOn ? trackWidth - thumbSize - 4 : 2);
  const pulseAnim = useSharedValue(1);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: withSpring(translateX.value, {
            damping: 15,
            stiffness: 120,
          }) 
        },
        { scale: pulseAnim.value }
      ],
      backgroundColor: interpolateColor(
        translateX.value,
        [2, trackWidth - thumbSize - 4],
        [thumbColor.false || '#f5f5f5', thumbColor.true || '#f5f5f5']
      ),
    };
  });

  const trackAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [2, trackWidth - thumbSize - 4],
        [trackColor.false || '#3a3a3a', trackColor.true || '#FF9768']
      ),
    };
  });

  const onPress = () => {
    if (disabled) return;
    
    // Vibración táctil
    Vibration.vibrate(5);
    
    const newValue = !isOn;
    
    // Animación de pulso
    pulseAnim.value = withTiming(1.2, { duration: 100 }, () => {
      pulseAnim.value = withTiming(1, { duration: 100 });
    });
    
    // Animación de deslizamiento
    translateX.value = withSpring(
      newValue ? trackWidth - thumbSize - 4 : 2,
      {
        damping: 15,
        stiffness: 120,
      },
      () => {
        // Callback cuando termina la animación
        runOnJS(onToggle)(newValue);
      }
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.track,
        {
          width: trackWidth,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          opacity: disabled ? 0.6 : 1,
        },
        trackAnimatedStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 3,
          },
          animatedStyles,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
});

export default ToggleSwitch;
