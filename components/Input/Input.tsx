import { KeyboardTypeOptions, StyleSheet, TextInput, TextStyle, TextInputProps } from "react-native";

type InputProps = Omit<TextInputProps, 'keyboardType'> & {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    style?: TextStyle;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
};

export default function Input({ 
    placeholder, 
    value, 
    onChangeText, 
    style, 
    keyboardType = 'default',
    secureTextEntry = false,
    ...props 
}: InputProps) {
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={[stylesInput.input, style]}
            placeholderTextColor={'rgb(133, 133, 133)'}
            cursorColor={'rgb(124, 59, 199)'}
            keyboardType={keyboardType as KeyboardTypeOptions}
            secureTextEntry={secureTextEntry}
            {...props}
        />
    )
}

const stylesInput = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'rgb(51, 51, 51)',
        backgroundColor: 'rgb(25, 25, 25)',
        borderRadius: 30,
        padding: 15,
        marginBottom: 20,
        textAlignVertical: 'top',
        fontSize: 16,
        width: '100%',
        color: '#f4f4f5',
    }
})