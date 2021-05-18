import React from 'react'
import {TouchableOpacity} from 'react-native'
import {Header} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'

/**
 * 
 * @param {Object} param0
 * @param {React.Dispatch<React.SetStateAction<boolean>>} param0.setSideBarOpen 
 * @returns 
 */

function MenuItem({setSideBarOpen}) {

    const handlePress = () => {
        setSideBarOpen(prev => !prev)
    }
    return (
        <TouchableOpacity
            onPress={handlePress}    
        >
            <Icon
                name="menu"
                color="#fff"
                size={30}   
            />
        </TouchableOpacity>
    )
}


export default function HeaderComponent({setSideBarOpen}) {
    return (
        <Header
            leftComponent={<MenuItem setSideBarOpen={setSideBarOpen}/>}
            centerComponent={{ text: 'MY TITLE', style: { color: '#fff' }}}
            rightComponent={{ icon: 'home', color: '#fff' }}
        >
        </Header>
    )
}
