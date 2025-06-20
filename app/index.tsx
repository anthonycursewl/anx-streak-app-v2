import Button from "@/components/Button/Button";
import CustomText from "@/components/CustomText/CustomText";
import { GradientText } from "@/components/GradientText/GradientText";
import LayoutScreen from "@/components/Layout/LayoutScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function Index() {

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/dashboard');
      }
    }

    getToken();
  }, [])

  return (
    <LayoutScreen>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 20 }}>
        <Image source={require('@/assets/images/anx/anx_transparent.png')} style={{ width: 180, height: 75, resizeMode: 'cover' }}/>
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        <GradientText colors={['rgb(162, 104, 255)', 'rgb(255, 200, 221)', 'rgb(255, 141, 141)']} style={{ fontSize: 40, fontWeight: 'bold' }}>
        Welcome to Anx Streak App!
        </GradientText>
      </View>

      <View style={{ alignItems: 'flex-start', marginTop: 10 }}>
        <CustomText style={{ fontSize: 20 }}>
          Your journey to mental wellness starts here. There's no more bad days. Just a road where you can grow and progress.
          Don't be afraid. 
        </CustomText>
      </View>

      <View style={{ position: 'absolute', bottom: 20, alignItems: 'center', width: '100%' }}>
        <Button style={{ width:'100%' }} onPress={() => router.replace('/auth/login')}>Get Started</Button>
      </View>
    </LayoutScreen>
  );
}