import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, TextProps, TextStyle, View, ViewStyle } from 'react-native';

interface GradientTextProps extends TextProps {
  colors: string[];
  children: React.ReactNode;
  style?: TextStyle;
}

export const GradientText: React.FC<GradientTextProps> = ({
  colors,
  children,
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style as ViewStyle]}>
      <MaskedView
        maskElement={
          <Text style={[styles.text, style]} {...props}>
            {children}
          </Text>
        }
      >
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={[styles.text, { opacity: 0 }, style]} {...props}>
            {children}
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },            
  text: {
    backgroundColor: 'transparent',
    fontSize: 16,
  },
});
