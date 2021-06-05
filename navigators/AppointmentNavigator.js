import React from 'react'
import {TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import CenterInfoProvider from '../contexts/CenterInfoProvider'
import VaccineSlots from '../pages/VaccineSlots'
import BookAppointment from '../pages/BookAppointment'
import SignInProgress from '../pages/SignInProgress'

const Stack = createStackNavigator()

export default function AppointmentNavigator({navigation}) {
    return (
        <Stack.Navigator initialRouteName="Find Vaccination Centers">
            <Stack.Screen 
                name="Find Vaccination Centers"
                component={VaccineSlots}
                options={{
                    headerLeft : () => (
                        <TouchableOpacity
                            onPress={() => {navigation.toggleDrawer()}}
                            style={{
                                marginLeft : 10
                            }}
                        >
                            <Icon
                                name="menu"
                                color="#444"
                                size={30}
                            />
                        </TouchableOpacity>
                    )
                }}
            />
            <Stack.Screen name="SignIn Progress" component={SignInProgress} options={{title : "Signing In"}}/>
            <Stack.Screen name="Book Appointment" component={BookAppointment}/>
        </Stack.Navigator>
    )
}