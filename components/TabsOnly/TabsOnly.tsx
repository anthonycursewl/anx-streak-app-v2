import ActivitiesScreen from "@/screens/ActivitiesScreen/ActivitiesScreen";
import AnalyticsScreen from "@/screens/AnalyticsScreen/AnalyticsScreen";
import HomeScreen from "@/screens/HomeScreen/HomeScreen";
import ProfileScreen from "@/screens/ProfileScreen/ProfileScreen";
import { IconFavorites } from "@/svgs/IconFavorites";
import { IconHome } from "@/svgs/IconHome";
import { IconProfile } from "@/svgs/IconProfile";
import { IconSearch } from "@/svgs/IconSearch";

export const tabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <IconHome width={20} height={20} />,
      component: <HomeScreen />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <IconSearch width={20} height={20} />,
      component: <AnalyticsScreen />
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: <IconFavorites width={20} height={20} />,
      component: <ActivitiesScreen />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <IconProfile width={20} height={20} />,
      component: <ProfileScreen />
    }
]