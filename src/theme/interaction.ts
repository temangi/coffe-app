import type { PressableStateCallbackType, StyleProp, ViewStyle } from 'react-native';

const pressedFeedback: ViewStyle = {
  opacity: 0.9,
  transform: [{ scale: 0.98 }],
};

export const withPressFeedback = (baseStyle: StyleProp<ViewStyle>, activeStyle?: StyleProp<ViewStyle>) => {
  return ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
    baseStyle,
    pressed ? pressedFeedback : null,
    pressed ? activeStyle : null,
  ];
};
