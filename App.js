import 'react-native-gesture-handler'
import React, {useState} from 'react'
import UserDetails from './pages/UserDetails'
import ReadSMS from './pages/ReadSMS'
import PingAddress from './pages/PingAddress'
import AccountNavigator from './navigators/AccountNavigator'
import AppointmentNavigator from './navigators/AppointmentNavigator'
import BookAppointment from './pages/BookAppointment'
import { View, StyleSheet, Button, Text} from 'react-native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import AuthProvider from './contexts/AuthProvider'
import UserProvider from './contexts/UserProvider'
import CenterInfoProvider from './contexts/CenterInfoProvider'

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
      <AuthProvider>
        <CenterInfoProvider>
          <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen name="Home" component={Home}/>
              <Drawer.Screen name="Appointments" component={AppointmentNavigator}/>
              <Drawer.Screen name="Read SMS" component={ReadSMS}/>
              <Drawer.Screen name="Account" component={AccountNavigator}/>
            </Drawer.Navigator>
          </NavigationContainer>
        </CenterInfoProvider>
      </AuthProvider>
    </UserProvider>
  )
}
