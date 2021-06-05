import React from 'react'
import {TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from "@react-navigation/stack"
import AccountDetails from '../pages/AccountDetails'
import EnterMobile from '../pages/EnterMobile'
import SignInProgress from '../pages/SignInProgress'
import BenificiaryList from '../pages/BenificiaryList'

const Stack = createStackNavigator()

export default function AccountNavigator({navigation}) {
    return (
            <Stack.Navigator initialRouteName="Account Details">
                <Stack.Screen 
                    name="Account Details" 
                    component={AccountDetails}
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
                <Stack.Screen name="Set/Update Mobile Number" component={EnterMobile}/>
                <Stack.Screen name="Signing In" component={SignInProgress}/>
                <Stack.Screen 
                    name="Benificiary List" 
                    component={BenificiaryList}
                    options={{
                        headerLeft : () => (
                            <TouchableOpacity
                                onPress={() => {navigation.navigate("Account",{screen : "Account Details"})}}
                                style={{
                                    marginLeft : 10
                                }}
                            >
                                <Icon
                                    name="arrow-back"
                                    color="#444"
                                    size={30}
                                />
                            </TouchableOpacity>
                        )
                    }}    
                />
            </Stack.Navigator>
    )
} 
