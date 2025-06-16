import BottomTabs from "@/components/BottomTabs/Tabs";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import { tabs } from "@/components/TabsOnly/TabsOnly";
import { mainStyles } from "@/screens/mainStyles";
import { useLoginStore } from "@/services/stores/auth/useLoginStore";
import { useEffect } from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";


export default function Dashboard() {
    const { user, loading, error, getUserDetails } = useLoginStore()

    useEffect(() => {
        getUserDetails()
        console.log(user)
    }, [])

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error)
        }
    }, [error])

    if (loading) {
        return (
            <LayoutScreen>
                <View style={styles.container}>
                    <ActivityIndicator size="small" color="white" />
                </View>
            </LayoutScreen>
        )
    }

    return (
        <BottomTabs 
        tabs={tabs}
        initialTab="home"
        tabItemStyle={mainStyles.tabItem}
        tabBarStyle={mainStyles.tabBar}
        activeTabItemStyle={mainStyles.activeTabItem}
        textStyle={mainStyles.tabText}
        activeTextStyle={mainStyles.activeTabText}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
    },
})