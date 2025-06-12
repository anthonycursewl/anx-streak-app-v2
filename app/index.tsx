import BottomTabs from "@/components/BottomTabs/Tabs";
import { StatusBar } from 'expo-status-bar';
import { tabs } from "../components/TabsOnly/TabsOnly";
import { mainStyles } from "../screens/mainStyles";

export default function Index() {
  return (
    <>
      <StatusBar style="light" />
      <BottomTabs 
        tabs={tabs}
        initialTab="home"
        style={mainStyles.container}
        tabBarStyle={mainStyles.tabBar}
        tabItemStyle={mainStyles.tabItem}
        activeTabItemStyle={mainStyles.activeTabItem}
        textStyle={mainStyles.tabText}
        activeTextStyle={mainStyles.activeTabText}
        />
    </>
  );
}