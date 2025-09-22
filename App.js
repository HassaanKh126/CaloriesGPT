import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';
import FoodScreen from './screens/FoodScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import UserScreen from './screens/UserScreen';
import FoodsScreen from './screens/FoodsScreen';
import SettingsScreen from './screens/SettingsScreen';
import Purchases from 'react-native-purchases';
import { useEffect } from 'react';
import SuccessScreen from './screens/SuccessScreen';
import SubscribeScreen from './screens/SubscribeScreen';

const Stack = createNativeStackNavigator();

const App = () => {

    useEffect(() => {
        Purchases.configure({ apiKey: SECRETKEY });
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: "#efeee9" }}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ animation: 'fade_from_bottom' }} />
                    <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="FoodScreen" component={FoodScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="UserScreen" component={UserScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="FoodsScreen" component={FoodsScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="SubscribeScreen" component={SubscribeScreen} options={{ animation: 'fade' }} />
                    <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{ animation: 'fade' }} />
                </Stack.Navigator>
                <Toast config={{
                    success: ({ text1, ...rest }) => (
                        <View style={{ padding: 14, backgroundColor: '#15201e', borderRadius: 10 }}>
                            <Text style={{ color: '#ffffff', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                        </View>
                    ),
                    error: ({ text1, ...rest }) => (
                        <View style={{ padding: 14, backgroundColor: '#2b1111', borderRadius: 10 }}>
                            <Text style={{ color: '#ffffff', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                        </View>
                    ),
                    info: ({ text1, ...rest }) => (
                        <View style={{ padding: 14, backgroundColor: '#2b2511', borderRadius: 10 }}>
                            <Text style={{ color: '#ffffff', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                        </View>
                    ),
                }} />

            </NavigationContainer>
        </View>
    );
}

export default App;