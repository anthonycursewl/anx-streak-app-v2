import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native';

type CustomTextProps = {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    onPress?: (event: GestureResponderEvent) => void;
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: 'Onest-Regular',
        color: '#f5f5f5'
    }
});

export default function CustomText({ children, style, onPress }: CustomTextProps) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress}>
                <Text style={[styles.text, style]}>{children}</Text>
            </TouchableOpacity>
        );
    }
    return <Text style={[styles.text, style]}>{children}</Text>;
}