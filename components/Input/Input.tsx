import { StyleSheet, TextInput, TextInputProps, TextStyle } from "react-native";

type InputProps = TextInputProps & {
    style?: TextStyle;
};

export default function Input({ 
    style,
    ...props 
}: InputProps) {
    return (
        <TextInput
            style={[stylesInput.input, style]}
            placeholderTextColor="rgb(133, 133, 133)"
            cursorColor="rgb(124, 59, 199)"
            textAlignVertical={props.multiline ? 'top' : 'center'}
            {...props}
        />
    )
}

const stylesInput = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: 'rgb(51, 51, 51)',
        backgroundColor: 'rgb(25, 25, 25)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        textAlignVertical: 'top',
        fontSize: 16,
        width: '100%',
        color: '#f4f4f5',
    }
})