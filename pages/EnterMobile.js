import React, {useState,useContext} from 'react'
import {Input, Button} from 'react-native-elements'
import {ScrollView, View, Text, StyleSheet} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import {AuthContext} from '../contexts/AuthProvider'
import {UserContext} from '../contexts/UserProvider'
import ErrorAlert from '../components/ErrorAlert'
import SignInProgress from './SignInProgress'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems: 'center',
        paddingVertical : 7,
        paddingHorizontal : '5%',
    },
    formContainer : {
        width : '100%',
        paddingHorizontal : 4,
        paddingVertical : 14,
        backgroundColor : "#fff",
        elevation : 3,
        borderRadius : 7
    },
    h6 : {
        fontSize : 16,
        fontWeight: "500",
        letterSpacing : 2
    },
    ul : {
        display : "flex",
        flexDirection : "row",
        marginVertical : 5
    },
    ulBullet : {
        width : 18,
    },
    ulText : {
        //flexGrow : 1
    }
})

export default function EnterMobile({navigation}) {
    const {login} = useContext(AuthContext)
    const {state : {mobileNumber, benificiaryId}} = useContext(UserContext)

    const [mobile,setMobile] = useState('')
    const [error,setError] = useState('')

    async function handleSubmit() {
        if(mobile.length !== 10) {
            setError('Enter a valid mobile Number')
        }
        else if(mobileNumber === mobile && benificiaryId !== null) {
            setError('This is number is already linked to your account')
        }
        else {
            setError('')
            navigation.navigate("Signing In",{ forceSignIn : true, inputMobileNumber : mobile, destScreen : "Benificiary List"})
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.ul}>
                    <View style={styles.ulBullet}>
                        <Text style={{fontSize : 32}}>{`\u2022`}</Text>
                    </View>
                    <Text style={[styles.ulText,styles.h6]}>
                    Enter the number you used for registration on the CoWin Portal
                    </Text>
                </View>
                {
                    error !== '' && <ErrorAlert message={error}/>
                } 
                <Input
                    label="Phone Number"
                    leftIcon={
                        <Icon
                            name="phone"
                            color="black"
                            size={15}
                        />
                    }
                    keyboardType="phone-pad"
                    placeholder="9876543210"
                    onChangeText={text => {setMobile(text)}}
                />
                <View style={{
                    display : "flex",
                    width : '100%',
                    justifyContent : "center",
                    alignItems: "center"
                }}>
                    <Button
                        title="Submit"
                        containerStyle={{
                            width : "90%"
                        }}
                        onPress={handleSubmit}
                    />
                </View>
            </View>
        </View>
    )
}
