import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function LayoutScreen({ children }: { children: React.ReactNode }) {
    return (
        <SafeAreaView style={styles.layout}>
            <StatusBar style="light" />
            <View style={styles.layoutContent}>
                {children}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    layout: {
        flex: 1,
        padding: 20,
        width: '100%',
        backgroundColor: 'rgb(20, 20, 20)',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }, 
    layoutContent: {
        width: '100%',
        borderRadius: 12,
        marginTop: 20,
        flex: 1,
    }
})
