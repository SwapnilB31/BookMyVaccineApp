import React, {useState, useReducer, useEffect, useContext} from 'react'
import {View, Text, FlatList, ScrollView, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity, RefreshControl} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import uuid from 'react-native-uuid'
import {Button, Tooltip} from 'react-native-elements'
import VaccineInput from '../components/VaccineInput'
import {actions, vaccineInputInitState, vaccineInputReducer} from '../stores/VaccineInputStore'
import {actions as centerActions} from '../stores/CenterInfoStore'
import {UserContext} from '../contexts/UserProvider'
import {CenterInfoContext} from '../contexts/CenterInfoProvider'
import {AuthContext} from '../contexts/AuthProvider'
import {headers} from '../data/headers'
import * as ReadSms from 'react-native-read-sms/ReadSms'
 

const styles = StyleSheet.create({
    container : {
        flex : 1,
        /*justifyContent: "center",
        alignItems: "center"*/
    },  
    card : {
        flex: 1,
        flexDirection : "column",
        padding: 15,
        marginVertical : 7,
        marginHorizontal: 5,
        elevation : 2,
        backgroundColor : '#fff',
        borderRadius : 8,
    },
    header : {
        fontWeight : "bold",
        fontSize: 18,
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
    slotBar : {
        flex : 1,
        flexDirection : "row",
        padding : 1,
        margin : 1,
        /*marginTop : 10,
        borderBottomColor : "#757572",
        borderBottomWidth : 1,*/ 
        alignItems : "center",
        justifyContent : "center"
    },
    date : {
        marginHorizontal: 2,
        color : "#333",
        width : '100%',
        alignItems : "center",
        justifyContent : "center"
    },
    age : {
        padding : 7,
        fontSize : 12,
        color : "#fff",
        backgroundColor : "#444",
        fontWeight : "bold",
        borderRadius : 7
    },
    vaccine : {
        color : '#00008b',
        fontWeight : "bold",
        fontSize: 12,
        textAlign: "center",
        justifyContent : "center",
        alignItems : "center"
    },
    flex1by3 : {
        flex : 0.3
    },
    flex1by4 : {
        flex : 0.25
    },
    infoView : {
        flex : 1,
        justifyContent : "flex-start",
        flexDirection : "row",
        marginBottom : 3,

    },
    feeType : {
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
    listView : {
        maxHeight : Dimensions.get("window").height
    },
    picker: {
        backgroundColor: "#fff",
        width : "90%",
        elevation: 2,
        borderRadius : 5,
        marginBottom : 4,
        marginHorizontal : "5%"
    },
    datePicker : {
        paddingVertical : 12,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        width : "90%",
        elevation: 2,
        borderRadius : 5,
        marginBottom : 4,
        marginHorizontal : "5%",
        marginTop : 10
    },
    addMarginBottom : {
        marginBottom : 7
    },
    loadingContainer : {
        display : "flex",
        flex: 1,
        justifyContent: "center",
        alignItems : "center"
    },
    noSlotsContainer : {
        display : "flex",
        flex: 1,
        justifyContent: "center",
        alignItems : "center"
    },
    noSlotsText :{
        fontSize : 18,
        fontWeight : "bold",
        color: "#00008b",
    },
    addBorderBottom :{
        paddingBottom : 1,
        marginBottom : 1,
        borderBottomColor : "lightgray",
        borderBottomWidth : 1
    }
})

const doseStyles = StyleSheet.create({
    doseContainer: {
        flexDirection: "column",
        width : '70%'
    },
    doseRow : {
        flex : 1,
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center"
    },
    doseLabel : {
        textAlign : "center",
        color: "#00008b"
    }
})

function openSlotsStyle(capacity) {
    const color = capacity > 10 ? '#027a3e' : capacity > 0 ? '#cfaf13' : '#c20c0c'

    return {
        textAlign: "center",
        color : color,
        fontWeight : "bold"
    }
}

class CenterCard extends React.PureComponent {
    constructor(props) {
        super(props)
        
    }

    render() {
        const centerObj = this.props.centerObj

        const centerId = centerObj.center_id
        const centerAddress = `${centerObj.address}, ${centerObj.block_name}, ${centerObj.district_name}, ${centerObj.district_name}, PIN Code: ${centerObj.pincode}`
        const centerName = centerObj.name
        const time = `${centerObj.from.slice(0,-3)} - ${centerObj.to.slice(0,-3)}`
        const feeType = centerObj.fee_type
        const vaccineFees = centerObj.vaccine_fees
        const infoObject = {centerId,centerAddress,centerName,time,feeType,vaccineFees}

        let sessionsObj = centerObj.sessions
        
        return (
            <View style={styles.card}>
                <Text style={styles.header}>{centerObj.name}</Text>
                <Text style={styles.address}>{`${centerObj.address}, ${centerObj.district_name}, ${centerObj.pincode}`}</Text>
                { centerObj.fee_type.toLowerCase() !== "free" &&
                    (
                    <View style={styles.infoView}>
                        <Text style={styles.feeType}>{centerObj.fee_type}</Text>
                        {
                            centerObj.vaccine_fees && centerObj.vaccine_fees.map(val => (
                                <Text style={styles.fee} key={uuid.v4()}>{val.vaccine} - ??? {val.fee}</Text>
                            ))
                        }
                    </View>
                    )
                }
                <FlatList
                    data={sessionsObj}
                    renderItem={({item}) => <SlotCard slotObj={item} centerInfo={infoObject} navigation={this.props.navigation}/>}                
                    keyExtractor={item => item.session_id}
                />
            </View>
        )
    }
}

class SlotCard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.renderGuest = this.renderGuest.bind(this)
        this.renderSignedIn = this.renderSignedIn.bind(this)
        this.goToBookAppointment = this.goToBookAppointment.bind(this)
    }

    renderGuest() {
        const slotObj = this.props.slotObj

        return (
            <View >
                <View style={styles.infoView}>
                    <Text style={styles.age}>{`${slotObj.min_age_limit}+`}</Text>
                </View>
                <View style={styles.slotBar}>
                    <Text style={[styles.date,styles.flex1by3]}>{slotObj.date}</Text>
                    <Text style={[styles.vaccine,styles.flex1by3]}>{slotObj.vaccine}</Text>
                    <View style={[doseStyles.doseContainer,styles.flex1by3]}>
                        <View style={[doseStyles.doseRow, styles.addBorderBottom]}>
                            <Text style={doseStyles.doseLabel}>Dose 1: </Text>
                            <Text style={openSlotsStyle(slotObj.available_capacity_dose1)}>{slotObj.available_capacity_dose1}</Text>
                        </View>
                        <View style={doseStyles.doseRow}>
                            <Text style={doseStyles.doseLabel}>Dose 2: </Text>
                            <Text style={openSlotsStyle(slotObj.available_capacity_dose2)}>{slotObj.available_capacity_dose2}</Text>
                        </View>                    
                    </View>
                </View>    
            </View>
        )
    }

    /**
     * 
     * @param {React.Dispatch<{type: string;payload: any;}>} dispatch 
     */
    goToBookAppointment(dispatch) {
        const infoObject = this.props.centerInfo
        const navigation = this.props.navigation
        const slotObj = this.props.slotObj

        const sessionId = slotObj.session_id
        const date = slotObj.date
        const slots = slotObj.slots
        const vaccine = slotObj.vaccine 

        dispatch({type : centerActions.setCenterId, payload : infoObject.centerId})
        dispatch({type : centerActions.setCenterName, payload : infoObject.centerName})
        dispatch({type : centerActions.setCenterAdress, payload: infoObject.centerAddress})
        dispatch({type : centerActions.setCenterFeeType, payload: infoObject.feeType})
        dispatch({type : centerActions.setCenterVaccineFees, payload: infoObject.vaccineFees})
        dispatch({type : centerActions.setCenterTime, payload : infoObject.time})
        dispatch({type : centerActions.setSessionId, payload : slotObj.session_id})
        dispatch({type : centerActions.setSessionDate, payload : slotObj.date})
        dispatch({type : centerActions.setSessionVaccine, payload : slotObj.vaccine})
        dispatch({type : centerActions.setSessionSlots, payload : slotObj.slots})
        dispatch({type : centerActions.setSessionMinAgeLimit, payload : slotObj.min_age_limit})

        navigation.navigate("Book Appointment")
    }

    renderSignedIn(CenterInfoValue, UserValue) {
        const slotObj = this.props.slotObj
        const dispatch = CenterInfoValue.dispatch
        const {state: {dose}} = UserValue
        return (
            <View >
                <View style={styles.infoView}>
                    <Text style={styles.age}>{`${slotObj.min_age_limit}+`}</Text>
                </View>
                <View style={styles.slotBar}>
                    <Text style={[styles.date,styles.flex1by4]}>{slotObj.date}</Text>
                    <Text style={[styles.vaccine,styles.flex1by4]}>{slotObj.vaccine}</Text>
                    <Text style={[openSlotsStyle(dose === 1 ? slotObj.available_capacity_dose1 : slotObj.available_capacity_dose2),styles.flex1by4]}>
                        { dose === 1 ? slotObj.available_capacity_dose1 : slotObj.available_capacity_dose2}
                    </Text>
                    <Button
                        type="clear"
                        title="Book"
                        disabled={dose === 1 ? slotObj.available_capacity_dose1 <= 0 : slotObj.available_capacity_dose2 <= 0}
                        containerStyle={styles.flex1by4}
                        onPress={() => this.goToBookAppointment(dispatch)}
                    />
                </View>    
            </View>
        )
    }

    render() {
        return (
            <UserContext.Consumer>
            { 
                UserValue => (
                    <CenterInfoContext.Consumer>
                    {
                        CenterInfoValue => (
                            UserValue.state.benificiaryId === null ? this.renderGuest() : this.renderSignedIn(CenterInfoValue,UserValue)
                        )
                    }
                    </CenterInfoContext.Consumer>
                )   

            }
            </UserContext.Consumer>
        )    
    }
}

/**
 * 
 * @param {[]} center 
 * @returns 
 */

function filter18(center) { return center.sessions.some(val => val.min_age_limit === 18)}
function filter18Open(center) { return center.sessions.some(val => val.min_age_limit === 18 && val.available_capacity > 0) }
function filter18OpenDose1(center) {return center.sessions.some(val => val.min_age_limit === 18 && val.available_capacity_dose1 > 0)}
function filter18OpenDose2(center) {return center.sessions.some(val => val.min_age_limit === 18 && val.available_capacity_dose2 > 0)}

function filter45(center) { return center.sessions.some(val => val.min_age_limit === 45) }
function filter45Open(center) {return center.sessions.some(val => val.min_age_limit === 45 && val.available_capacity > 0)}
function filter45OpenDose1(center) {return center.sessions.some(val => val.min_age_limit === 45 && val.available_capacity_dose1 > 0)}
function filter45OpenDose2(center) {return center.sessions.some(val => val.min_age_limit === 45 && val.available_capacity_dose2 > 0)}

function filterOpen(center) { return center.sessions.some(val => val.available_capacity > 0)}
function filterOpenDose1(center) {return center.sessions.some(val => val.available_capacity_dose1 > 0)}
function filterOpenDose2(center) {return center.sessions.some(val => val.available_capacity_dose2 > 0)}

function filterSession18(session) { return session.min_age_limit === 18}
function filterSession18Open(session) { return session.min_age_limit == 18 && session.available_capacity > 0}
function filterSession18OpenDose1(session) {return session.min_age_limit == 18 && session.available_capacity_dose1 > 0}
function filterSession18OpenDose2(session) {return session.min_age_limit == 18 && session.available_capacity_dose2 > 0}

function filterSession45(session) { return session.min_age_limit === 45}
function filterSession45Open(session) { return session.min_age_limit == 45 && session.available_capacity > 0}
function filterSession45OpenDose1(session) {return session.min_age_limit == 45 && session.available_capacity_dose1 > 0}
function filterSession45OpenDose2(session) {return session.min_age_limit == 45 && session.available_capacity_dose2 > 0}

function filterSessionOpen(session) { return session.available_capacity > 0}
function filterSessionOpenDose1(session) { return session.available_capacity_dose1 > 0}
function filterSessionOpenDose2(session) { return session.available_capacity_dose2 > 0}

function filterNone(center) {
    //console.log("running filter none")
    return true
}


function VaccineSlots({navigation}) {
    /** 
     * {{state : any, dispatch: React.Dispatch<{type: string;payload: any;}>}}
    */
    const [state,dispatch] = useReducer(vaccineInputReducer,vaccineInputInitState)
    
    const [loading,setLoading] = useState(false) 
    const [prefLoading,setPrefLoading] = useState(true)
    const {state : {benificiaryId,dose}} = useContext(UserContext)
    const {isTokenValid, state : {accessToken}} = useContext(AuthContext)

    function runFilters() {
        let centersArr = state.centersStatic
        if(benificiaryId === null) {
            if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                centersArr = centersArr.filter(filterOpen)
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpen)}))
            }
            if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                centersArr = centersArr.filter(filter18)
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
            }
            if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                centersArr = centersArr.filter(filter18Open)
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18Open)}))
            }
            if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                centersArr = centersArr.filter(filter45)
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
            }
            if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                centersArr = centersArr.filter(filter45Open)
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45Open)}))
            }
        }
        else {
            if(dose === 1) {
                if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filterOpenDose1)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpenDose1)}))
                }
                if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter18)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
                }
                if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter18OpenDose1)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18OpenDose1)}))
                }
                if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter45)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
                }
                if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter45OpenDose1)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45OpenDose1)}))
                }
            }
            else {
                if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filterOpenDose2)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpenDose2)}))
                }
                if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter18)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
                }
                if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter18OpenDose2)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18OpenDose2)}))
                }
                if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter45)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
                }
                if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                    centersArr = centersArr.filter(filter45OpenDose2)
                    centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45OpenDose2)}))
                }
            }
        }
        dispatch({type : actions.setCenters, payload : centersArr})
    }

    function fetchCenterData() {
        let baseUrl = `https://cdn-api.co-vin.in/api/v2/appointment/sessions`
        if(!isTokenValid()) {
            //console.log("Token Expired")
            baseUrl += '/public'
        }
        //const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=49&date=18-05-2021'
        const url = state.pinCodeMode && state.pinCode.length == 6 ? `${baseUrl}/calendarByPin?pincode=${state.pinCode}&date=${dateToStr(state.date)}` 
                                                                    : `${baseUrl}/calendarByDistrict?district_id=${state.districtId}&date=${dateToStr(state.date)}`

        //console.log(url)
        setLoading(true)
        fetch(url,{
            headers : !isTokenValid() ? { 
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
            } : {...headers, 'Authorization' : `Bearer ${accessToken.token}`}
        })
        .then( res => res.json())
        .then(data => {
            setLoading(false)
            //setCenters(data.centers);
            if(data.errCode)
            {
                dispatch({type : actions.setCentersStatic, payload : []})
                dispatch({type : actions.setCenters, payload : []})
                alert(data.error)
            }
            else {
                let centersArr = data.centers
                if(benificiaryId === null) {
                    if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                        centersArr = centersArr.filter(filterOpen)
                        centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpen)}))
                    }
                    if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                        centersArr = centersArr.filter(filter18)
                        centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
                    }
                    if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                        centersArr = centersArr.filter(filter18Open)
                        centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18Open)}))
                    }
                    if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                        centersArr = centersArr.filter(filter45)
                        centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
                    }
                    if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                        centersArr = centersArr.filter(filter45Open)
                        centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45Open)}))
                    }
                }
                else {
                    if(dose === 1) {
                        if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filterOpenDose1)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpenDose1)}))
                        }
                        if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter18)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
                        }
                        if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter18OpenDose1)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18OpenDose1)}))
                        }
                        if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter45)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
                        }
                        if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter45OpenDose1)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45OpenDose1)}))
                        }
                    }
                    else {
                        if(!state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filterOpenDose2)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSessionOpenDose2)}))
                        }
                        if(state._18PlusMode && !state._45PlusMode && !state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter18)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18)}))
                        }
                        if(state._18PlusMode && !state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter18OpenDose2)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession18OpenDose2)}))
                        }
                        if(!state._18PlusMode && state._45PlusMode && !state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter45)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45)}))
                        }
                        if(!state._18PlusMode && state._45PlusMode && state.onlyOpenSlots) {
                            centersArr = centersArr.filter(filter45OpenDose2)
                            centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(filterSession45OpenDose2)}))
                        }
                    }
                }

                dispatch({type : actions.setCentersStatic, payload : data.centers})
                dispatch({type : actions.setCenters, payload : centersArr})
            }
            //dispatch({type : actions.setCenters, payload: data.centers})
        })
        .catch(err => {
            setLoading(false)
            //setCenters([])
            dispatch({type : actions.setCentersStatic, payload : []})
            alert('Data Fetching Failed!')
        })
    }

    useEffect(()=>{
        //console.log("Use Effect Triggered")
        //console.log({districtId : state.districtId, date : state.date, pinCodeMode : state.pinCodeMode, pinCode : state.pinCode})
        if(prefLoading) return
        if(!state.pinCodeMode && state.districtId === 0) return
        if(state.pinCodeMode && state.pinCode.length !== 6) return
        
        //console.log(`Inside Useeffect, Did : ${distrctId} `)
        fetchCenterData()

    },[state.districtId, state.date, state.pinCodeMode, state.pinCode, state.onlyOpenSlots])

    useEffect(()=>{
        runFilters()
    },[state._18PlusMode,state._45PlusMode])
    
    useEffect(()=>{
        const func = async() => {
            console.log("Requesting SMS Permissions")
            await ReadSms.requestReadSMSPermission()
        }
        func()
    },[])


    return (
            <View style={styles.container}>
                {/*<HeaderComponent title="Search Vaccine Centers" navigation={navigation}/>*/}
                {/*<CustomDatePicker
                    date={date}
                    onDateChange={setDate}
                    style={styles.datePicker}
                />
                <StatePicker setStateId={setStateId}/>
                <DistrictPicker stateId={stateId} setDistrictId={setDistrictId}/>*/} 
                <VaccineInput 
                    style={[styles.datePicker,styles.addMarginBottom]}
                    state={state}
                    dispatch={dispatch}
                    prefStatus={{prefLoading,setPrefLoading}} 
                />
                {
                    loading &&
                    (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#0398fc" size="large"/>
                            <Text>Loading...</Text>
                        </View>
                    ) 
                }
                {
                    !loading && state.districtId !== 0 && state.centers.length === 0 && 
                    (
                        <View style={styles.noSlotsContainer}>
                            <Text style={styles.noSlotsText}>No Slots are available on this date!</Text>
                        </View>
                    )
                }
                {
                    !loading && state.centers.length > 0 && (
                        <FlatList 
                            style={styles.listView}
                            data={state.centers}
                            renderItem={({item}) => <CenterCard 
                                                        centerObj={item} 
                                                        navigation={navigation}
                                                        filterAge={!state._18PlusMode && !state._45PlusMode ? 0 : state._18PlusMode ? 18 : 45}
                                                    />}
                            keyExtractor={item => item.center_id}
                            refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={fetchCenterData}
                                colors={["#444"]}
                                progressBackgroundColor="#fff"
                                progressViewOffset={5}

                            />}
                        />
                    )
                }
                
            </View>
        
    )
}

/**
 * 
 * @param {Date} date 
 */
function dateToStr(date) {
    let day = date.getDate()
    day = day > 9 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 9 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}

export default VaccineSlots