import * as React from 'react';
import { Text, View, StyleSheet, Alert, Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './components/LoginScreen';
import { PantallasProvider } from './components/ContextProvider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Check from './components/Check';
import Historic from './components/Historic';
import Calendar from './components/Calendar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PantallasProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name=""
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Screen1"
            component={Tabs}
            options={{
              title: 'Check-In',
              headerStyle: { backgroundColor: '#0E66AA' },
              headerTitleStyle: { color: '#F3FFFF' },

              headerLeft: () => {
                return null;
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PantallasProvider>
  );
}
const Tabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: '#0E66AA',
        height: Dimensions.get('window').height / 11,
        borderTopWidth: 2,
        borderTopColor: 'white',
        headerShown: false
      },
      tabBarIcon: ({ color }) => {
        let iconName;

        switch (route.name) {
          case 'Check':
            iconName = 'check';
            break;

          case 'Historic':
            iconName = 'list';
            break;

          case 'Calendar':
            iconName = "calendar";
            break;
        }
        
        return <FontAwesome name={iconName} size={40} color={color} />;
      },
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: '#344955',
      tabBarShowLabel: false,
    })}>
    <Tab.Screen options={{ headerShown: false }}
      name="Check"
      component={Check}
    />
    <Tab.Screen options={{ headerShown: false }} name="Historic" component={Historic} />
    <Tab.Screen options={{ headerShown: false }} name="Calendar" component={Calendar}/>
   
  </Tab.Navigator>
);
