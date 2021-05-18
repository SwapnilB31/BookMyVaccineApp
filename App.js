import React, {useState} from 'react'
import SideBar from './components/SideBar.js'
import Header from './components/HeaderComponent.js'
import { View, StyleSheet, Button} from 'react-native'
 


export default function App() {
  const [sideBarOpen,setSideBarOpen] = useState(false)
  function handlePress() {
    //alert('hi')
    setSideBarOpen(prev => !prev)
  }
  console.log('it works') 
  return (
    <View style={{flex : 1}}>
      <Header setSideBarOpen={setSideBarOpen}/>
      {sideBarOpen && <SideBar/>}
    </View>
    
  )
}
