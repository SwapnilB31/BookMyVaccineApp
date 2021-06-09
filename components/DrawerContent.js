import React, {useContext} from 'react'
import {View,Text,StyleSheet,Linking} from 'react-native'
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import {UserContext} from '../contexts/UserProvider'
import {AuthContext} from '../contexts/AuthProvider'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'

export default function DrawerContent(props) {

    const {isTokenValid,logout} = useContext(AuthContext)
    const {state : {benificiaryName}} = useContext(UserContext)
    
    //console.log(props.state.history)
    //console.log(props.state.routes)
    let activeKey
    let activeRoute 
    if(props.state.history) {
        if(props.state.history.length >= 2) {
            activeKey = props.state.history[props.state.history.length - 2].key
            activeRoute = props.state.routes.find(route => route.key === activeKey).name
        }
    }
    else
        activeRoute = "Appointments"
    //console.log(activeKey)
    //console.log(activeRoute)
    return (
        <View style={styles.container}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <Text style={styles.nameText}>{benificiaryName !== null ? benificiaryName : 'Guest User'}</Text>
                        <Text style={styles.authStateText}>{benificiaryName === null ? 'Not Signed In' : isTokenValid() ? 'Access Token Active' : 'Access Token Expired'}</Text>
                    </View>
                    <View>
                        <DrawerItem
                            focused={activeRoute === "Appointments"}
                            labelStyle={styles.itemLabel}
                            label={({focused,color}) => <Text style={{color : color}}>Appointments</Text>}
                            activeTintColor="#ac80d9"
                            icon={({focused,color}) => <Icon name="account-clock-outline" size={20} color={color}/>}
                            onPress={() => props.navigation.navigate("Appointments")}
                        />
                        <DrawerItem
                            focused={activeRoute === "Account"}
                            labelStyle={styles.itemLabel}
                            label={({focused,color}) => <Text style={{color : color}}>Account</Text>}
                            activeTintColor="#ac80d9"
                            icon={({focused,color}) => <Icon name="account-check" size={20} color={color}/>}
                            onPress={() => props.navigation.navigate("Account")}
                        />
                        <DrawerItem
                            focused={activeRoute === "Alerts"}
                            labelStyle={styles.itemLabel}
                            label={({focused,color}) => <Text style={{color : color}}>Alerts</Text>}
                            activeTintColor="#ac80d9"
                            icon={({focused,color}) => <Icon name="clock-check-outline" size={20} color={color}/>}
                            onPress={() => {props.navigation.navigate("Alerts")}}
                        />
                        <DrawerItem
                            focused={activeRoute === "Settings"}
                            labelStyle={styles.itemLabel}
                            label={({focused,color}) => <Text style={{color : color}}>Settings</Text>}
                            activeTintColor="#ac80d9"
                            icon={({focused,color}) => <Icon2 name="settings" size={20} color={color}/>}
                            onPress={() => props.navigation.navigate("Settings")}
                        />
                        <DrawerItem
                            labelStyle={styles.itemLabel}
                            label={({focused,color}) => <Text style={{color : color}}>Visit CoWIN Portal</Text>}
                            activeTintColor="#ac80d9"
                            icon={({focused,color}) => <Icon name="web" size={20} color={color}/>}
                            onPress={async () => {await Linking.openURL("https://selfregistration.cowin.gov.in")}}
                        />
                    </View>
                </View>
            </DrawerContentScrollView>
            <View style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Login to CoWIN"
                    icon={({focus,color}) => <Icon name="login" size={20} color={color}/>}
                    onPress={() => {
                        if(benificiaryName === null) {
                            props.navigation.navigate("Account",{screen : "Set/Update Mobile Number"})
                        }
                        else if(!isTokenValid())
                            props.navigation.navigate("SignIn Progress",{destScreen : "Find Vaccination Centers"})
                        else
                            return
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1
    },
    drawerContent : {
        flexGrow : 1
    },
    userInfoSection : {
        paddingLeft : 15,
        paddingVertical : 20,
        borderBottomColor : "#f4f4f4",
        borderBottomWidth : 1,
        marginBottom : 5
    },
    nameText : {
        fontSize : 22,
        fontFamily : "Roboto",
        fontWeight : "700",
        fontStyle : "italic",
        color : "#8b19ff",
        paddingVertical : 2
    },
    authStateText : {
        fontSize : 16,
        fontFamily : "Roboto",
        fontStyle : "italic",
        color : "#888"
    },
    drawerSection : {
        paddingTop : 15
    },
    itemLabel : {
        fontFamily : "Roboto",
        color : "#666",
        fontSize : 17,
        fontWeight : "500"
    },
    bottomDrawerSection : {
        marginVertical : 10,
        paddingVertical : 4,
        borderTopColor : "#f4f4f4",
        borderTopWidth : 1
    }
})
