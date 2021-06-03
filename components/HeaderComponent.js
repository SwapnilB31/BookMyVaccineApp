import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Header} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'

function MenuItem({navigation}) {
    return (
        <TouchableOpacity
            onPress={() => {navigation.toggleDrawer()}}    
        >
            <Icon
                name="menu"
                color="#444"
                size={30}   
            />
        </TouchableOpacity>
    )
}


export default function HeaderComponent({navigation,title}) {
    return (
        <Header
            containerStyle={{
                backgroundColor : "#fff",
            }}
            placement="left"
            leftComponent={<MenuItem navigation={navigation}/>}
            centerComponent={{ 
                text: title, 
                style: { 
                    color: '#444', 
                    fontWeight : "600", 
                    fontFamily : "sans-serif-medium", 
                    fontSize : 21, 
                    textAlignVertical : "bottom", 
                    marginLeft : 10
                }
            }}
        >
        </Header>
    )
}
