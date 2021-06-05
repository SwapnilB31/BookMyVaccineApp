import React, {useState,useEffect,useContext,useCallback} from 'react'
import {useFocusEffect} from '@react-navigation/native'
import {View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator} from 'react-native'
import {Divider, Button} from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import {AuthContext} from '../contexts/AuthProvider'
import {UserContext} from '../contexts/UserProvider'
import {headers} from '../data/headers'
import InfoAlert from '../components/InfoAlert'
import { transform } from '@babel/core'

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop : 10,
        width : '100%'
    },
    card : {
        position: "relative",
        display : "flex",
        flexDirection: "column",
        width : '95%',
        backgroundColor : "#fff",
        elevation : 2,
        borderRadius: 7,
        padding: 15,
        marginBottom : 7,
        marginTop : 20,
        marginHorizontal: '2.5%',
        borderColor : "#aaa",
        borderWidth : 1
    },
    legend : {
        position : "absolute",
        left : 15,
        top : -15,
        paddingHorizontal : 15,
        paddingVertical : 4,
        borderRadius : 5,
        //elevation : 3
    },
    notVax : {
        backgroundColor : "#d1641b",
        borderColor : "#a32107",
        borderWidth : 1.3
    },
    yesVax : {
        backgroundColor : "#40b366",
        borderColor : "#0a5e26",
        borderWidth : 1.3 
    },
    legendText : {
        color : "#fff"
    },
    nameText : {
        fontSize : 18,
        fontWeight : "bold",
        color: "#00008b",
    },
    h2Text : {
        fontSize : 16,
        fontWeight : "600",
        color : "#444"
    },
    h2BlueText : {
        fontSize : 16,
        fontWeight : "bold",
        color : "#00008b"
    },
    h3Text : {
        fontSize : 14,
        fontWeight : "300",
        color: "#444",
    },
    mutedText : {
        fontSize : 14,
        fontWeight : "300",
        color: "#999",
    },
    mutedTextSmall : {
        fontSize : 10,
        fontWeight : "300",
        color: "#999",
    },
    vaxh1Text : {
        fontSize : 18,
        fontWeight : "bold",
        color: "#01691d",
    },
    vaxh3Text : {
        fontSize : 14,
        fontWeight : "300",
        color: "#01691d",
    },
    addTextMargin : {
        marginVertical : 3
    },
    vaxInfoView : {
        display : "flex",
        width : "100%",
        flexDirection : "row",
        marginVertical : 5,
        paddingTop : 4,
        borderTopColor : "#aaa",
        borderTopWidth : 1
    },
    vaxInfoIcon : {
        minWidth : 30,
        paddingRight : 10,
        display : "flex",
        justifyContent : "flex-start",
        alignItems : "flex-start"
    },
    vaxInfoText : {
        flexGrow : 1,
        display : "flex",
        flexDirection : "column"
    },
    loadingContainer : {
        display : "flex",
        flex: 1,
        justifyContent: "center",
        alignItems : "center"
    }
})

class BenificiaryCard extends React.PureComponent {
    constructor(props) {
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
    }

    async handleSelect() {
        const {setAge,setBenificiaryId,setBenificiaryName,setDose,setYearOfBirth,setIdType,setIdNumber} = this.props.stateSetters
        const benificiary = this.props.benificiary
        await setAge(new Date().getFullYear() - Number(benificiary.birth_year))
        await setBenificiaryId(benificiary.beneficiary_reference_id)
        await setBenificiaryName(benificiary.name)
        await setDose(benificiary.dose1_date === "" && benificiary.dose2_date === "" ? 1 : benificiary.dose1_date !== "" && benificiary.dose2_date === "" ? 2 : 3)
        await setYearOfBirth(benificiary.birth_year)
        await setIdType(benificiary.photo_id_type)
        await setIdNumber(benificiary.photo_id_number)
        this.props.navigation.navigate("Account Details") 
    }


    render() {
        const benificiary = this.props.benificiary

        return (
            <View style={styles.card}>
                <View style={[styles.legend, benificiary.vaccination_status === "Not Vaccinated" ? styles.notVax : styles.yesVax]}>
                    <Text style={styles.legendText}>{benificiary.vaccination_status}</Text>
                </View>
                <Text style={[styles.nameText,styles.addTextMargin]}>{benificiary.name}</Text>
                <Text style={[styles.h3Text,styles.addTextMargin]}>REF ID: {benificiary.beneficiary_reference_id}</Text>
                <Text style={styles.mutedText}>Year Of Birth: {benificiary.birth_year}</Text>
                <Text style={styles.mutedText}>Photo ID: {benificiary.photo_id_type}</Text>
                <Text style={[styles.mutedText,{marginBottom : 5}]}>ID Number: XXXX-{benificiary.photo_id_number.slice(-4)}</Text>
                {
                    benificiary.dose1_date !== "" && (

                        <View style={styles.vaxInfoView}>
                            <View style={[styles.vaxInfoIcon,{paddingTop : 8}]}>
                                <Icon
                                    name="syringe"
                                    color="#28c3f7"
                                    size={40}
                                    style={{transform : [{rotate : '135deg'}]}}
                                />
                            </View>
                            <View style={styles.vaxInfoText}>
                                <Text style={[styles.h2BlueText]}>Dose 1 | {benificiary.vaccine}</Text>
                                <Text style={styles.h3}>{benificiary.dose1_date}</Text>
                                <InfoAlert message="To download the Vaccination Certificate, please visit the CoWIN Portal"/>
                            </View>
                        </View>
                    )
                }
                {
                    benificiary.dose2_date !== "" && (

                        <View style={styles.vaxInfoView}>
                            <View style={styles.vaxInfoIcon}>
                                <Icon
                                    name="syringe"
                                    color="#28c3f7"
                                    size={40}
                                    style={{transform : [{rotate : '135deg'}]}}
                                />
                            </View>
                            <View style={styles.vaxInfoText}>
                            <Text style={[styles.h2BlueText]}>Dose 2 | {benificiary.vaccine}</Text>
                                <Text style={styles.h3}>{benificiary.dose2_date}</Text>
                                <InfoAlert message="To download the Vaccination Certificate, please visit the CoWIN Portal"/>
                            </View>
                        </View>
                    )
                } 
                {
                    benificiary.appointments.length > 0 && (
                        <View style={styles.vaxInfoView}>
                            <View style={styles.vaxInfoIcon}>
                                <Icon2
                                    name="timer-sand"
                                    color="#ff5980"
                                    size={40}
                                />
                            </View>
                            <View style={styles.vaxInfoText}>
            
                                <Text style={styles.h2BlueText}>{benificiary.appointments[0].name} | {`Dose ${benificiary.appointments[0].dose}`}</Text>
                                <Text style={[styles.h3Text,styles.addTextMargin]}>
                                    {benificiary.appointments[0].block_name}, {benificiary.appointments[0].district_name}, {benificiary.appointments[0].state_name}
                                </Text>
                                <Text style={styles.mutedText}>Date: {benificiary.appointments[0].date}</Text>
                                <Text style={styles.mutedText}>Time: {benificiary.appointments[0].from} - {benificiary.appointments[0].to}</Text>
                                <Text style={styles.mutedText}>Slot: {benificiary.appointments[0].slot}</Text>
                                <InfoAlert message="To download the Appointment Slip or Reschedule this Appointment, please visit the CoWIN Portal"/>
                            </View>
                        </View>
                    )
                }
                <Divider style={{height : 1, backgroundColor : "#aaa"}}/>
                <View
                    style={{
                        display:"flex",
                        alignItems : "flex-start",
                        marginTop : 5
                    }}
                >
                    <Button 
                        type="clear" 
                        title="SELECT"
                        onPress={() => this.handleSelect()}
                    />
                </View>
                
            </View>
        )
    }
}

/*const initBenificiary = {
    "beneficiaries":[
        {
            "beneficiary_reference_id":"66603661854680",
            "name":"Swapnil Bhattacharjee",
            "birth_year":"1996",
            "gender":"Male",
            "mobile_number":"8097",
            "photo_id_type":"Aadhaar Card",
            "photo_id_number":"819040449406",
            "comorbidity_ind":"N"
            ,"vaccination_status":"Partially Vaccinated",
            "vaccine":"COVISHIELD",
            "dose1_date":"31-05-2021",
            "dose2_date":"",
            "appointments":[]
        }
    ]
}*/

function ListEmptyCard() {
    return (
        <View style={{
            flex : 1,
            justifyContent : "center",
            alignItems : "center",
            paddingVertical : 48,
            paddingHorizontal : 14,
            backgroundColor : "#fff",
            borderColor : "#aaa",
            borderWidth : 1,
            elevation : 3,
            width : "95%",
            marginHorizontal : "2.5%",
            borderRadius : 5
        }}>
            <Text style={{
                fontSize : 16,
                fontWeight :"900",
                color : "#00008b"
            }}>
                You havent't added any benificiaries. Go to the CoWin Portal and add benificiaries to go ahead.
            </Text>
        </View>
    )
}


export default function BenificiaryList({route,navigation}) {
    const [benificiary,setBenificiary] = useState([])
    const [loading,setLoading] = useState(false)
    const [addHomeButton,setAddHomeButton] = useState(false)
    //const {state : {accessToken},isTokenValid} = useContext(AuthContext)
    const authValue = useContext(AuthContext)
    const userValue = useContext(UserContext)
    const {state : {accessToken}, isTokenValid} = authValue
    const {stateSetters} = userValue


    useFocusEffect(
        useCallback(()=> {
            const homeButtonVal = route && route.params && route.params.addHomeButton || false
            setAddHomeButton(homeButtonVal)
        },[benificiary]),
    )

    useEffect(() => {
        if(!isTokenValid()) 
            navigation.navigate("Signing In",{destScreen : "Benificiary List"})
        else {
            setLoading(true)
            fetch('https://cdn-api.co-vin.in/api/v2/appointment/beneficiaries',{
                method : "GET",
                headers : {...headers, 'Authorization' : `Bearer ${accessToken.token}`}
            })
            .then(res => res.json())
            .then(data => {
                setBenificiary(data.beneficiaries)
                //console.log(data.beneficiaries)
                setLoading(false)
            })
            .catch(err => {
                setBenificiary([])
                alert("Data Fetching Failed")
            })
        }
    },[accessToken])
    
    return (
        <View style={styles.container}>
            {/*<Text>{JSON.stringify(accessToken)}</Text>*/}
            {loading && ( 
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#0398fc" size="large"/>
                    <Text>Loading...</Text>
                </View> 
            )}
            {!loading && (
                    <FlatList
                        data={benificiary}
                        renderItem={({item}) => <BenificiaryCard 
                                                    benificiary={item} 
                                                    stateSetters={stateSetters}
                                                    navigation={navigation}
                                                />}
                        keyExtractor={item => item.beneficiary_reference_id}
                        ListEmptyComponent={ListEmptyCard}
                    />
                )
            }
            {!loading && addHomeButton && (
                <Button
                    title="Go Back"
                    titleStyle={{marginLeft : 10}}
                    buttonStyle={{
                        marginTop : 2
                    }}
                    type="clear"
                    icon={<Icon2
                        name="keyboard-backspace"
                        size={18}
                        color="#007bff"
                    />}
                    onPress={() => navigation.navigate('Account Details')}
                />

            )}
            
        </View>
    )
}
