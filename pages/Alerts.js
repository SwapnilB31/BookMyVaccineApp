import React, {useState,useEffect,useContext,useCallback} from 'react'
import {View,ScrollView,Text,StyleSheet} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {PreferenceContext} from '../contexts/PreferenceProvider'
import {Overlay, Divider, Icon} from 'react-native-elements'
import BGServiceManager from '../BackgroundTasks/BGServiceManager'
import HeaderComponent from '../components/HeaderComponent'
import ErrorAlert from '../components/ErrorAlert'
import { Dimensions } from 'react-native'
import stateList from '../data/stateList'
import districtList from '../data/districtList'

const bgManager = new BGServiceManager()

export default function Alerts({navigation}) {

    const [alertRunning,setAlertRunning] = useState(bgManager.isRunning())
    const [setupError,setSetupError] = useState('')
    const {state : {pinCodeMode, stateId, districtId, pinCode}} = useContext(PreferenceContext)
    const [date,setDate] = useState(new Date())
    const [overlayVisible,setOverlayVisible] = useState(false)
    //console.log({stateId})
    let districtName = 'Not Selected' 
    const hasDistrict = stateId > 0 ? districtList[stateId].find(district => district.district_id === districtId) : undefined
    if(hasDistrict)
        districtName = districtList[stateId].find(district => district.district_id === districtId).district_name

    function handleStartStopAlert() {
        if(bgManager.isRunning())
            bgManager.stop()
        else
            bgManager.start()
        setAlertRunning(prev => !prev)
    }

    useEffect(() => {
        if(date.getHours() >= 10)
            setDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
        setAlertRunning(bgManager.isRunning())
    },[])

    useFocusEffect(() => {
        /*if(date.getHours() >= 8)
            setDate(new Date(Date.now() + 24 * 60 * 60 * 1000))*/
        setAlertRunning(bgManager.isRunning())
    })

    useFocusEffect(
        useCallback(() => {
                if(minSetUpDone())
                    setSetupError('')
            },[pinCodeMode,pinCode,stateId,districtId])
    )

    function minSetUpDone() {
        return pinCodeMode ? pinCode !== ''  : districtId !== 0 && stateId !== 0 && hasDistrict !== undefined
        //return false
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{padding : 1}}>
            <HeaderComponent title="Alerts" navigation={navigation}/>
            <View style={styles.card}>
                <View style={styles.spaceBWView}>
                    <Text style={styles.headerText}>Start/Stop Alert</Text>
                    <View style={{display : "flex", flexDirection : "row"}}>
                        {!minSetUpDone() && <Icon
                            raised={true}
                            color="#ff5436"
                            reverse={true}
                            name="plus"
                            type="foundation"
                            size={10}
                            disabled={alertRunning || minSetUpDone()}
                            onPress={() => {
                                if(!minSetUpDone()) {
                                    if(pinCodeMode)
                                        setSetupError('Please enter your PIN Code in \'Settings > Search Preferences\', before creating an alert')
                                    else
                                        setSetupError('Please select your State and District in \'Settings > Search Preferences\', before creating an alert')
                                }
                                else {
                                    setupError('')
                                }
                               
                            }}
                        />}
                        <Icon
                            raised={true}
                            color="#48c2fa"
                            reverse={true}
                            name="info"
                            type="entypo"
                            size={10}
                            onPress={() => setOverlayVisible(true)}
                        />
                    </View>
                </View>
                <Overlay overlayStyle={styles.olCard} visible={overlayVisible} onBackdropPress={() => setOverlayVisible(false)}>
                    <Text style={styles.infoText}>
                        Alert runs a background service that periodically (every 20 seconds) queries the CoWIN Public API and pushes notifications
                        on your phone when vaccination slots become available in PIN/District specified by you in <Text style={[styles.infoText,{fontWeight : "bold"}]}>Settings > Search Preferences</Text>.
                        You need to specify one of PIN Code or District in the search preferences before you can create an alert. You can also select other filters in the Settings
                        to improve the search results. <Text style={{fontWeight : "bold"}}>You can only run one alert at a time.</Text>

                    </Text>
                </Overlay>
                <Divider style={{height : 1.3, backgroundColor : "#ddd"}}/>
                {setupError !== '' && <ErrorAlert message={setupError}/>}
                {
                    !alertRunning && !minSetUpDone() && (
                        <Text style={styles.infoText16}>No Alerts are active at this moment.</Text>
                    )
                }
                {minSetUpDone() && <View style={styles.alertCard}>
                     <Text numberOfLines={1} style={styles.stdText}>{dateToStr(date)} | {pinCodeMode ? pinCode : districtName.length > 20 ? districtName.slice(0,20) + '...' : districtName}</Text>
                     <View style={styles.flexRow}>
                        <Icon
                            containerStyle={{marginRight : 15}}
                            name={!alertRunning ? "stop" : "timer-sand"}
                            type={!alertRunning? "octicon" : "material-community"}
                            color={!alertRunning? "#ff5436" : "#09b872"}
                            size={!alertRunning ? 28 : 34}
                        />
                        <Icon
                            containerStyle={{marginRight : 4}}
                            name={!alertRunning ? "play-circle" : "pause-circle"}
                            type={!alertRunning ? "foundation" : "feather"}
                            color={!alertRunning ? "#09b872" : "#ff5436"}
                            size={!alertRunning ? 36 : 28}
                            onPress={handleStartStopAlert}
                        />
                     </View>
                </View>
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    card : {
        marginHorizontal : 6,
        marginVertical : 10,
        backgroundColor : "#fff",
        elevation : 2,
        padding : 15,
        borderRadius : 7,
        //minHeight : Dimensions.get("window").height * 0.25
    },
    switchView : {
        paddingVertical : 13,
        paddingLeft : 10,
        marginVertical : 4,
        flexDirection : "row",
        justifyContent : "space-between",
        width : "100%",
        /*width : '100%',
        borderWidth : 1,
        borderColor : "#aaa",
        borderRadius : 5,*/
    },
    inputView : {
        paddingVertical : 3,
        paddingHorizontal : 1,
        marginVertical : 2,
        flexDirection : "row",
        width : '100%',
        borderWidth : 1,
        borderColor : "#aaa",
        borderRadius : 5,
        //marginRight : 2
    },
    inputBox : {
        flexGrow : 1,
        paddingHorizontal : 10,
        paddingVertical : 10,

    },
    inputButton : {
        width : 50,
        paddingVertical : 15
    },
    pickerView : {
        marginVertical : 2,
        borderColor : "#aaa",
        borderWidth : 1,
        borderRadius : 5,
    },
    headerText : {
        fontSize : 22,
        fontWeight : "bold",
        color : "#777",
        marginBottom : 0
    },
    rightAlignedView : {
        width : "100%",
        flexDirection : "row",
        justifyContent : "flex-end",
        paddingVertical : 3,
        paddingHorizontal : 1,
        marginTop : 4
    },
    spaceBWView : {
        display : "flex",
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center"
    },
    infoButton : {
        borderColor : "#0a88cc",
        backgroundColor : "#0a88cc",
        borderWidth : 1,
        borderRadius : 20,
        paddingVertical : 3,
        paddingHorizontal : 4,
        marginRight : 7
    },
    infoText16 : {
        color : "#00008b",
        fontSize : 19,
        fontWeight : "700",
        fontFamily : "Roboto",
        marginTop : 10,
        marginBottom : 7
    },
    infoText : {
        color : "#00008b",
        fontSize : 16
    },
    stdText18 : {
        textAlign : "left",
        fontSize: 18,
        color : "#444"
    },
    stdText : {
        textAlign : "left",
        fontSize: 14
    },
    alertCard : {
        width : '100%',
        /* marginHorizontal : '2.5%', */
        paddingHorizontal : 7,
        paddingVertical : 9,
        marginVertical : 15,
        display : "flex",
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        backgroundColor : "#fff",
        elevation : 2,
        borderRadius : 5
    },
    flexRow : {
        display : "flex",
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center"
    },
    olCard : {
        width : Dimensions.get("window").width * 0.8,

    }
})

/**
 * 
 * @param {Date} date 
 */
 function dateToStr(date) {
    if(date === null) 
        return `---Pick a Date---`
    let day = date.getDate()
    day = day > 9 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 9 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}