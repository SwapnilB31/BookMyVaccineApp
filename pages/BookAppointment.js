import React, {useState, useEffect, useContext} from 'react'
import {View, ScrollView, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator} from 'react-native'
import {CenterInfoContext} from '../contexts/CenterInfoProvider'
import {AuthContext} from '../contexts/AuthProvider'
import {UserContext} from '../contexts/UserProvider'
import SlotButton from '../components/SlotButton'
import ErrorAlert from '../components/ErrorAlert'
import {SvgXml} from 'react-native-svg'
import {headers} from '../data/headers'
import SVGFile from '../data/SVGFile'
import uuid from 'react-native-uuid'
import {Button} from 'react-native-elements'
import { Dimensions } from 'react-native'

const slotsVal = [
    "09:00AM-10:00AM",
    "10:00AM-11:00AM",
    "11:00AM-12:00PM",
    "12:00PM-02:00PM"
]

async function errorJSON(statusCode) {
    let errStr = ""
    switch(statusCode) {
        case 400:
        case 500:
            errStr = "Bad Request! Your Transaction didn't go through"
            break
        case 409:
            errStr = "This vaccination center is completely booked for the selected date."
            break
        case 401:
            errStr = "Unauthenticated Access! Access Token has expired. Sign in again."
            break
        default:
            errStr = "Oops! something went wrong"
    }
    return {
        error : errStr
    }
}

/**
 * @param {String} state.centerId
 * @param {String} state.centerName
 * @param {String} state.centerAddress
 * @param {String} state.centerTime
 * @param {String} state.centerFeeType
 * @param {Array<any>} state.centerVaccineFees
 * @param {String} state.sessionId
 * @param {String} state.sessionVaccine
 * @param {String} state.sessionDate
 * @param {Number} state.sessionMinAgeLimit
 * @param {Array<any>} state.sessionSlots 
 */

export default function BookAppointment({navigation}) {
    
    const {state} = useContext(CenterInfoContext)
    const {state : {accessToken}, isTokenValid} = useContext(AuthContext)
    const {state : {benificiaryId, dose}} = useContext(UserContext)

    const [slots,setSlots] = useState(state.sessionSlots.map(val => ({ value : val, id : uuid.v4(), active : false})))
    const [svgXML,setSvgXML] = useState(false)
    const [loading,setLoading] = useState(true)
    const [loadingError, setLoadingError] = useState(false)
    const [sendingBookReq,setSendingBookReq] = useState(false)
    const [formError,setFormError] = useState("")
    const [captchaError,setCaptchaError] = useState("")
    const [captcha,setCaptcha] = useState('')
    const [bookingError,setBookingError] = useState('')

    let timer = null

    function fetchCaptcha() {
        fetch('https://cdn-api.co-vin.in/api/v2/auth/getRecaptcha',{
            method : "POST",
            headers : {...headers, 'Authorization' : `Bearer ${accessToken.token}`}
        })
        .then(res => {
            console.log("Recieved Response")
            return res.json()
        })
        .then(data => {
            //console.log({data})
            setSvgXML(data.captcha.replace(/,/g,' '))
            setLoading(false)
            setLoadingError(false)
        })
        .catch(err => {
            console.log(err)
            setLoadingError(true)
        })
        timer = setTimeout(() => {
            console.log("Timer Went off")
            if(loading === true)
                setLoadingError(true)
        },10 * 1000)
    }

    function handleSubmit() {
        let err = false
        setFormError("")
        setCaptchaError("")
        setBookingError("")

        const selectedSlot = slots.filter(val => val.active === true)
        if(selectedSlot.length !== 1) {
            setFormError("You have to select a slot to book an appointment!")
            err=true
        }
        if(captcha.length < 4) {
            setCaptchaError("Please enter the captcha!")
            err=true
        }

        if(!err) {
            setSendingBookReq(true)
            const url = "http://192.168.43.2/api/v2/appointment/schedule"
            fetch(url,{
                method : "POST",
                body : JSON.stringify({
                    "center_id" : state.centerId,
                    "session_id" : state.sessionId,
                    "beneficiaries" : [benificiaryId],
                    "slot" : selectedSlot[0].value,
                    "captch" : captcha,
                    "dose" : dose
                }),
                headers : {...headers, 'Authorization' : `Bearer ${accessToken.token}`}
            })
            .then(res => {
                setSendingBookReq(false)
                if(res.status === 200)
                    return res.json()
                else
                    return errorJSON(res.status)
            })
            .then(data => {
                setSendingBookReq(false) 
                if(data.error) {
                    setBookingError(data.error)
                    fetchCaptcha()

                }
                else if(data.appointment_id) {
                    setBookingError('')
                    navigation.navigate('Account',{screen : 'Benificiary List', params : {addHomeButton : true}})
                } 
            })
            .catch(err => {
                setSendingBookReq(false)
                console.log(err)
            })
        }
        
    }

    useEffect(() => {
        if(accessToken === null)
            return
        if(!isTokenValid())
            navigation.navigate("SignIn Progress",{ destScreen : "Book Appointment"})
        else
            fetchCaptcha()

        return () => {
            if(timer !== null)
                clearTimeout(timer)
        }
    },[accessToken])

    let fees
    if(state.centerVaccineFees)
        fees = state.centerVaccineFees.filter(val => val.vaccine = state.sessionVaccine)[0]
    else
        fees = null
    //console.log(slots)

    return (
        <ScrollView style={styles.container} contentContainerStyle={{padding : 1}}>
            {
                loading && (
                    <View style={styles.loadingContainer}>
                        {
                            !loadingError ?
                            (
                                <View>
                                    <ActivityIndicator color="#0398fc" size="large"/>
                                    <Text>Loading...</Text>
                                </View>
                            ) : 
                            (
                                <View>
                                    <Text>Oops. Something Went Wrong!</Text>
                                    <Button 
                                        title="RELOAD" 
                                        type="outline" 
                                        onPress={fetchCaptcha}
                                        buttonStyle={{marginTop : 12}}
                                    />
                                </View>
                            )
                        }   
                    </View>
                )

            }
            {!loading && 
                (
                    <View style={styles.card}>
                        <Text style={styles.header}>{state.centerName}</Text>
                        <Text style={styles.address}>{state.centerAddress}</Text>
                        <View style={styles.block}>
                            <Text style={styles.age}>
                            {state.sessionMinAgeLimit}+
                            </Text>
                            <Text style={styles.feeType}>
                                {state.centerFeeType}
                            </Text>
                            {state.centerFeeType.toLowerCase() === "paid" ?
                                (
                                    <Text style={styles.fee}>
                                    {
                                        `${fees.vaccine} - ₹${fees.fee}`
                                    }
                                    </Text>
                                ) :
                                (
                                    <Text style={styles.fee}>
                                    {
                                        state.sessionVaccine
                                    }
                                    </Text>
                                )
                            }
                        </View>
                        <Text style={[styles.h3Text,{marginTop : 3}]}>Date : {state.sessionDate}</Text>
                        <Text style={styles.h3Text}>Time : {state.centerTime}</Text>
                        <Text style={[styles.h3BlueText,styles.addTextMargin]}>Pick a Slot:</Text>
                        {formError !== "" && <ErrorAlert message={formError}/>}
                        <View style={styles.slotView}>
                        {
                            slots.map((val,ind) => (
                                    <SlotButton 
                                        title={val.value} 
                                        key={uuid.v4()}
                                        active={val.active}
                                        onPress={() => {
                                            setSlots(prev => prev.map(prevVal => {
                                                return {
                                                    value : prevVal.value,
                                                    id : prevVal.id,
                                                    active : val.id.toString() === prevVal.id.toString() ? true : false
                                                }
                                            }))
                                        }}    
                                    />
                            ))
                        }
                        </View>
                        {captchaError !== "" && <ErrorAlert message={captchaError}/>}
                        <View style={{ display : "flex", flexDirection : "row", marginVertical : 10}}>
                            <View style={styles.svgImage}>
                                <SvgXml
                                    xml={svgXML}
                                />
                                {/*<SvgXml
                                    xml={SVGFile.captcha}
                                />*/}
                            </View>
                            <View style={styles.textView}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Enter Captcha"
                                    keyboardType="default"
                                    value={captcha}
                                    onChangeText={text => setCaptcha(text)}
                                />
                            </View>
                        </View>
                        {bookingError !== "" && <ErrorAlert message={bookingError}/>}
                        <Button title="Book Appointment" type="solid" buttonStyle={{backgroundColor : "#ac55e6"}}
                            onPress={handleSubmit}
                            loading={sendingBookReq}
                        />
                    </View>
                )
            
            }
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop : 10
    },
    loadingContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        height : Dimensions.get("window").height * 0.95,
        width : Dimensions.get("window").width * 0.95 
    },
    card : {
        marginHorizontal : 5,
        marginVertical  : 12,
        backgroundColor : "#fff",
        elevation : 2,
        padding : 15,
        borderRadius: 7
    },
    header : {
        fontSize : 18,
        fontWeight : "bold",
        width : '100%'
    },
    address : {
        fontSize : 11,
        color : "#a9a9a9",
        width : '100%',
        paddingBottom: 4,
        marginBottom: 6,
        borderBottomColor : "#757572",
        borderBottomWidth : 1,
    },
    h3Text : {
        fontSize : 14,
        fontWeight : "300",
        color: "#222",
    },
    mutedText : {
        fontSize : 14,
        fontWeight : "300",
        color: "#999",
    },
    h3BlueText : {
        fontSize : 16,
        fontWeight : "bold",
        color : "#00008b"
    },
    addTextMargin : {
        marginVertical : 3
    },
    slotView : {
        flexDirection : "column",
        marginHorizontal : 5,
        marginVertical : 4,
        width : "100%"
    },
    slotButton : {
        flex : 1,
        paddingHorizontal : 5,
        paddingVertical : 3
    },
    svgImage : {
        flex : 0.5,
        height : 52,
        borderColor : "#ccc",
        borderWidth : 1,
        borderRadius : 5,
        paddingLeft : 3,
        paddingRight : 6
    },
    textView : {
        flex : 0.5,
        paddingHorizontal : 3,
        paddingVertical : 2,
       
    },
    textInput : {
        borderBottomColor : "#777",
        borderBottomWidth : 1,
        fontSize : 16
    },
    age : {
        padding : 7,
        fontSize : 12,
        color : "#fff",
        backgroundColor : "#444",
        fontWeight : "bold",
        borderRadius : 7
    },
    feeType : {
        marginLeft : 3,
        padding : 7,
        fontSize : 12,
        color : "#fff",
        backgroundColor : "#00008b",
        fontWeight : "bold",
        borderRadius : 7
    },
    fee : {
        marginLeft : 3,
        padding : 7,
        fontSize : 12,
        color : "#fff",
        backgroundColor : "#01691d",
        fontWeight : "bold",
        borderRadius : 7
    },
    vaccine : {
        color : '#00008b',
        fontWeight : "bold",
        fontSize: 12,
        textAlign: "center",
        flex: 0.25,
        justifyContent : "center",
        alignItems : "center"
    },
    block : {
        flexDirection : "row",
        width : "100%"
    }
})