import { TouchableOpacity, ViewStyle } from "react-native";
import CustomText from "../CustomText/CustomText";

export default function Button({ children, onPress, fontSize = 18, style }: { children?: string, onPress?: () => void, fontSize?: number, style?: ViewStyle }) {
    return (
        <TouchableOpacity
            style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: 'rgb(180, 134, 255)',
                borderRadius: 20,
                ...style
            }}
            onPress={onPress}>
            <CustomText
                style={
                    {
                        color: 'white',
                        fontSize,
                        textAlign: 'center',
                    }
                }>{children || 'Button'}</CustomText>
        </TouchableOpacity>
    )
}