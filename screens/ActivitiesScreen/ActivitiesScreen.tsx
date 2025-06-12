import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { View } from "react-native";

export default function ActivitiesScreen() {
    return (
            <LayoutScreen>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                    <GradientText colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} style={{ fontSize: 40, fontWeight: 'bold' }}>
                        We're still working on this zone. Thanks for your patience!
                    </GradientText>
    
                    <CustomText>
                        Made with ❤️ by Anthony
                    </CustomText>
                </View>
            </LayoutScreen>
        )
}