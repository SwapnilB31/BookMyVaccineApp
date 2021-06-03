import React, {useState, useReducer, useEffect} from 'react'
import {View, Text, FlatList, ScrollView, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity} from 'react-native'
import {Picker} from '@react-native-picker/picker'
import CustomDatePicker from '../components/CustomDatePicker'
import HeaderComponent from '../components/HeaderComponent'
import uuid from 'react-native-uuid'
import {Button, Tooltip} from 'react-native-elements'
import stateList from '../data/stateList.js'
import districtList from '../data/districtList.js'
import VaccineInput from '../components/VaccineInput'
import {actions, vaccineInputInitState, vaccineInputReducer} from '../stores/VaccineInputStore'


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
        flex : 0.25,
        marginHorizontal: 2,
        color : "#333",
        width : '100%',
        alignItems : "center",
        justifyContent : "center"
    },
    infoView : {
        flex : 1,
        justifyContent : "flex-start",
        flexDirection : "row",
        marginBottom : 3,

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
    bookButton : {
        flex : 0.25,
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
        flex : 0.25,
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
    const color = capacity > 10 ? 'lime' : capacity > 0 ? 'gold' : 'orangered'

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
                                <Text style={styles.fee} key={uuid.v4()}>{val.vaccine} - ₹ {val.fee}</Text>
                            ))
                        }
                    </View>
                    )
                }
                <FlatList
                    data={centerObj.sessions}
                    renderItem={({item}) => <SlotCard slotObj={item}/>}                
                    keyExtractor={item => item.session_id}
                />
            </View>
        )
    }
}

class SlotCard extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const slotObj = this.props.slotObj

        return (
            <View >
                <View style={styles.infoView}>
                    <Text style={styles.age}>{`${slotObj.min_age_limit}+`}</Text>
                </View>
                <View style={styles.slotBar}>
                    <Text style={styles.date}>{slotObj.date}</Text>
                    <Text style={styles.vaccine}>{slotObj.vaccine}</Text>
                    <View style={doseStyles.doseContainer}>
                        <View style={[doseStyles.doseRow, styles.addBorderBottom]}>
                            <Text style={doseStyles.doseLabel}>Dose 1: </Text>
                            <Text style={openSlotsStyle(slotObj.available_capacity_dose1)}>{slotObj.available_capacity_dose1}</Text>
                        </View>
                        <View style={doseStyles.doseRow}>
                            <Text style={doseStyles.doseLabel}>Dose 2: </Text>
                            <Text style={openSlotsStyle(slotObj.available_capacity_dose2)}>{slotObj.available_capacity_dose2}</Text>
                        </View>                    
                    </View>
                    <Button
                        type="clear"
                        title="Book"
                        disabled={slotObj.available_capacity <= 0}
                        containerStyle={styles.bookButton}
                    />
                </View>    
            </View>
    
        )
    }
}

function StatePicker({setStateId}) {
    return (
        <View style={styles.picker}>
            <Picker
                onValueChange={(itemValue, itemIndex) => setStateId(itemValue)}
            >
                <Picker.Item value={0} label="Pick a State"/>
                {
                    stateList.map(val => (
                        <Picker.Item value={val.state_id} label={val.state_name} key={uuid.v4()}/>
                    ))
                }
            </Picker>
        </View>
    )
}

function DistrictPicker({stateId,setDistrictId}) {
    if(stateId == 0)
        return (
            <View style={[styles.picker,styles.addMarginBottom]}>
                <Picker>
                    <Picker.Item value={0} label="Select a state first"/>
                </Picker>
            </View>
                    )
    else
    return (
        <View style={[styles.picker,styles.addMarginBottom]}>
            <Picker
                onValueChange={(itemValue,itemIndex) => setDistrictId(itemValue)}
            >
                <Picker.Item value={0} label="Select District"/>
                {
                    districtList[stateId].map(val => (
                        <Picker.Item value={val.district_id} label={val.district_name} key={uuid.v4()}/>
                    ))
                }
            </Picker>
        </View>
    )
}

function VaccineSlots({navigation}) {
    /** 
     * {{state : any, dispatch: React.Dispatch<{type: string;payload: any;}>}}
    */
    const [state,dispatch] = useReducer(vaccineInputReducer,vaccineInputInitState)
    
    const [loading,setLoading] = useState(false) 
    useEffect(()=>{
        if(state.districtId === 0) return

        //console.log(`Inside Useeffect, Did : ${distrctId} `)

        //const url = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=49&date=18-05-2021'
        const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${state.districtId}&date=${dateToStr(state.date)}`
        //console.log(url)
        setLoading(true)
        fetch(url,{
            headers : { 
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
            }
        })
        .then( res => res.json())
        .then(data => {
            setLoading(false)
            //setCenters(data.centers);
            dispatch({type : actions.setCenters, payload : data.centers})
        })
        .catch(err => {
            setLoading(false)
            //setCenters([])
            dispatch({type : actions.setCenters, payload : []})
            alert('Data Fetching Failed!')
        })

    },[state.districtId, state.date])

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
                            renderItem={({item}) => <CenterCard centerObj={item}/>}
                            keyExtractor={item => item.center_id}
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
    day = day > 10 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 10 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}

export default VaccineSlots