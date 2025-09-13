import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import Toast from 'react-native-toast-message';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ animation: 'fade' }} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ animation: 'fade' }} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ animation: 'fade_from_bottom' }} />
                <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'fade' }} />
            </Stack.Navigator>
            <Toast config={{
                success: ({ text1, ...rest }) => (
                    <View style={{ padding: 14, backgroundColor: '#15201e', borderRadius: 10 }}>
                        <Text style={{ color: '#f7fff8', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                    </View>
                ),
                error: ({ text1, ...rest }) => (
                    <View style={{ padding: 14, backgroundColor: '#2b1111', borderRadius: 10 }}>
                        <Text style={{ color: '#f7fff8', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                    </View>
                ),
                info: ({ text1, ...rest }) => (
                    <View style={{ padding: 14, backgroundColor: '#2b2511', borderRadius: 10 }}>
                        <Text style={{ color: '#f7fff8', fontFamily: 'Lexend-Medium' }}>{text1}</Text>
                    </View>
                ),
            }} />

        </NavigationContainer>
    );
}

export default App;