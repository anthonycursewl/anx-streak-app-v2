import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';

type CustomTextProps = {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    onPress?: (event: GestureResponderEvent) => void;
    color?: string;
    weight?: 'normal' | '600' | 'bold' | '100' | '200' | '300' | '400' | '500' | '700' | '800' | '900';
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: 'Onest-Regular',
        color: '#f5f5f5'
    }
});

export default function CustomText({ children, style, onPress, color, weight, ellipsizeMode }: CustomTextProps) {
    const textStyle = [
        styles.text,
        color && { color },
        weight && { fontWeight: weight },
        style
    ];
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Text style={textStyle} ellipsizeMode={ellipsizeMode}>{children}</Text>
            </TouchableOpacity>
        );
    }
    return <Text style={textStyle}>{children}</Text>;
}