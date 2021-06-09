import 'react-native-gesture-handler'
import React, {useState} from 'react'
import AccountNavigator from './navigators/AccountNavigator'
import AppointmentNavigator from './navigators/AppointmentNavigator'
import Alerts from './pages/Alerts'
import DrawerContent from './components/DrawerContent'
import Settings from './pages/Settings'
import { View, StyleSheet, Button, Text} from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import AuthProvider from './contexts/AuthProvider'
import UserProvider from './contexts/UserProvider'
import CenterInfoProvider from './contexts/CenterInfoProvider'
import PreferenceProvider from './contexts/PreferenceProvider'

function Home({navigator}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text style={{
        fontSize : 24,
        fontWeight : "600"
      }}>Home</Text>
    </View>
  )
}

export default function App() {

  const Drawer = createDrawerNavigator()
  
  return (
    <UserProvider>
      <PreferenceProvider>
        <AuthProvider>
          <CenterInfoProvider>
            <NavigationContainer>
              <Drawer.Navigator initialRouteName="Appointments" drawerContent={(props) => <DrawerContent {...props}/>} screenOptions={{swipeEnabled : false}}>
                <Drawer.Screen name="Appointments" component={AppointmentNavigator}/>
                <Drawer.Screen name="Alerts" component={Alerts}/>
                <Drawer.Screen name="Account" component={AccountNavigator}/>
                <Drawer.Screen name="Settings" component={Settings}/>
              </Drawer.Navigator>
            </NavigationContainer>
          </CenterInfoProvider>
        </AuthProvider>
      </PreferenceProvider>
    </UserProvider>
  )
}
