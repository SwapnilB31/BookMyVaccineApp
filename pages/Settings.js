import React, {useState, useContext, useEffect} from 'react'
import {ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native'
import {Switch, Button, Overlay, Divider} from 'react-native-elements'
import {useFocusEffect} from '@react-navigation/native'
import HeaderComponent from '../components/HeaderComponent'
import Icon from 'react-native-vector-icons/Ionicons'
import uuid from 'react-native-uuid'
import {Picker} from '@react-native-picker/picker'
import BGServiceManager from '../BackgroundTasks/BGServiceManager'
import ErrorAlert from '../components/ErrorAlert'
import {PreferenceContext} from '../contexts/PreferenceProvider'
import {defaultApiKey} from '../stores/PreferenceStore'
import stateList from '../data/stateList'
import districtList from '../data/districtList'
import { Dimensions } from 'react-native'


const bgManager = new BGServiceManager()

export default function Settings({navigation}) {
    const prefValue = useContext(PreferenceContext)
    const {state : {pinCodeMode, stateId, districtId, ageGroup, pinCode, openSlotsOnly, dose, apiKey}} = prefValue
    const {stateSetters : {togglePinCodeMode, setStateId, setDistrictId, setAgeGroup, setPinCode, toggleOpenSlotsOnly, setDose, setApiKey}} = prefValue
    const [editable,setEditable] = useState(false)
    const [pinCodeLocal,setPinCodeLocal] = useState('')
    const [apiKeyLocal,setAPIKeyLocal] = useState('')
    const [pinCodeErr,setPinCodeErr] = useState('')
    const [visible,setVisible] = useState(false)
    const [olVisible,setOlVisible] = useState(false)

    useFocusEffect(() => {
        setEditable(!bgManager.isRunning())
    })

    useEffect(()=>{
        setEditable(!bgManager.isRunning())
        setPinCodeLocal(pinCode)
        setAPIKeyLocal(apiKey)
    },[])

    useEffect(() => {
        setPinCodeLocal(pinCode)
        setAPIKeyLocal(apiKey)
    },[pinCode,apiKey])

    function handlePinCodeMode() {
        togglePinCodeMode()
    }

    function handleStateId(stateId) {
        setStateId(stateId)
    }

    function handleDistrictId(districtId) {
        setDistrictId(districtId)
    }

    function handlePinCode() {
        setPinCodeErr('')
        if(pinCodeLocal === pinCode)
            return
        if(pinCodeLocal.length < 6) {
            setPinCodeErr('PIN Code must have exactly 6 digits')
            setPinCodeLocal(pinCode)
            return
        }
        setPinCode(pinCodeLocal)
    }

    function handleAgeGroup(ageGroup) {
        setAgeGroup(ageGroup)
    }

    function handleDose(dose) {
        setDose(dose)
    }

    function handleOpenSlotsOnly() {
        toggleOpenSlotsOnly()
    }

    function handleAPIKey() {
        if(apiKeyLocal === defaultApiKey || apiKeyLocal === "DEFAULT VALUE")
            setApiKey(defaultApiKey)
        else 
            setApiKey(apiKeyLocal)
    }
    
    function resetAPIKey() {
        setApiKey(defaultApiKey)
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{padding : 1}}>
            <HeaderComponent navigation={navigation} title="Settings"/>
            <View style={styles.card}>
                <View style={styles.spaceBWView}>
                    <Text style={styles.headerText}>Search Preferences</Text>
                    <TouchableOpacity style={styles.infoButton} onPress={() => setVisible(true)}>
                        <Icon
                            name="information"
                            size={14}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
                <Divider style={{height : 1.3, backgroundColor : "#ddd"}}/>
                {/*<View style={styles.rightAlignedView}>
                    
                </View>*/}
                <InformationOverlay visible={visible} setVisible={setVisible}/>
                {!editable && <ErrorAlert message="Search Preferences cannot be changed when an alert is active!"/>}
                <View style={styles.switchView}>
                    <Text style={styles.stdText}>Search By PIN Code</Text>
                    <Switch
                        value={pinCodeMode}
                        onValueChange={handlePinCodeMode}
                        disabled={!editable}
                    />  
                </View>
                <StatePicker 
                    stateId={stateId} 
                    setStateId={handleStateId} 
                    enabled={editable && !pinCodeMode}
                />
                <DistrictPicker 
                    stateId={stateId} 
                    districtId={districtId} 
                    setDistrictId={handleDistrictId} 
                    enabled={editable && !pinCodeMode}
                />
                {pinCodeErr !== '' && <ErrorAlert message={pinCodeErr}/>}
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="PIN Code"
                        value={pinCodeLocal}
                        keyboardType="numeric"
                        onChangeText={text => text.length <= 6 && setPinCodeLocal(text)}
                        editable={editable && pinCodeMode}
                    />
                    <Button
                        buttonStyle={styles.inputButton}
                        type="clear"
                        icon={
                            <Icon
                                name="checkmark"
                                size={16}
                                color={editable && pinCodeMode ? "#0ca0f0" : "#aaa"}
                            />
                        }
                        onPress={handlePinCode}
                        disabled={!editable || !pinCodeMode}
                    />
                </View>
                <AgeGroupPicker
                    ageGroup={ageGroup}
                    setAgeGroup={handleAgeGroup}
                    enabled={editable}
                />
                <DosePicker
                    dose={dose}
                    setDose={handleDose}
                    enabled={editable}
                />
                <View style={styles.switchView}>
                    <Text style={styles.stdText}>Open Slots Only</Text>
                    <Switch
                        value={openSlotsOnly}
                        disabled={!editable}
                        onValueChange={handleOpenSlotsOnly}
                    />
                </View>
            </View>
            <View style={styles.card}>
                <View style={styles.spaceBWView}>
                    <Text style={styles.headerText}>Edit API Key</Text>
                    <TouchableOpacity style={styles.infoButton} onPress={() => setOlVisible(true)}>
                        <Icon
                            name="information"
                            size={14}
                            color="#fff"
                        />
                    </TouchableOpacity>
                </View>
                <Divider style={{height : 1.3, backgroundColor : "#ddd"}}/>
                <ApiInfoOverlay visible={olVisible} setVisible={setOlVisible}/>
                <View style={[styles.inputView,{marginTop : 10}]}>
                    <TextInput
                        style={styles.inputBox}
                        placeholder="API Key"
                        value={apiKeyLocal === defaultApiKey ? "DEFAULT VALUE" : apiKeyLocal}
                        keyboardType="default"
                        onChangeText={text => setAPIKeyLocal(text)}
                    />
                    <Button
                        buttonStyle={styles.inputButton}
                        type="clear"
                        icon={
                            <Icon
                                name="checkmark"
                                size={16}
                                color="#0ca0f0"
                            />
                        }
                        onPress={handleAPIKey}
                    />
                </View>
                <View style={styles.rightAlignedView}>
                    <Button
                        type="outline"
                        title="RESET to Default Key"
                        buttonStyle={{width : 170}}
                        onPress={resetAPIKey}
                    />
                </View>
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
        borderRadius : 7
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
        borderColor : "#d4d4d4", 
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
        borderColor : "#d4d4d4",
        borderWidth : 1,
        borderRadius : 5,
    },
    headerText : {
        fontSize : 22,
        fontWeight : "bold",
        color : "#777",
        marginBottom : 4
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
    infoText : {
        color : "#00008b"
    },
    infoText16 : {
        color : "#00008b",
        fontSize : 16
    },
    stdText : {
        textAlign : "left",
        fontSize: 16
    },
})

/**
 * 
 * @param {Object} param0 
 * @param {Number} param0.stateId
 * @param {(stateId : Number) => void} param0.setStateId
 * @param {boolean} param0.enabled
 */
function StatePicker({stateId,setStateId,enabled}) {

    return (
        <View style={styles.pickerView}>
            <Picker
                enabled={enabled}
                onValueChange={(itemValue, itemIndex) => {
                    setStateId(itemValue)
                }}
                selectedValue={stateId}
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

/**
 * 
 * @param {Object} param0 
 * @param {Number} param0.stateId
 * @param {Number} param0.districtId
 * @param {(districtId : Number) => void} param0.setDistrictId
 * @param {boolean} param0.enabled
 */
function DistrictPicker({stateId, districtId, setDistrictId, enabled}) {
    if(stateId == 0)
        return (
            <View style={styles.pickerView}>
                <Picker
                    enabled={enabled}
                >
                    <Picker.Item value={0} label="Select a state first"/>
                </Picker>
            </View>
        )
    else
    return (
        <View style={styles.pickerView}>
            <Picker
                enabled={enabled}
                onValueChange={(itemValue,itemIndex) => {
                    setDistrictId(itemValue)
                }}
                selectedValue={districtId}
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

/**
 * 
 * @param {Object} param0 
 * @param {Number} param0.ageGroup
 * @param {(ageGroup : Number) => void} param0.setAgeGroup 
 * @param {boolean} param0.enabled 
 */
function AgeGroupPicker({ageGroup,setAgeGroup,enabled}) {
    return (
        <View style={styles.pickerView}>
            <Picker
                enabled={enabled}
                selectedValue={ageGroup}
                onValueChange={(itemValue,itemIndex) => {
                    setAgeGroup(itemValue)
                }}
                selectedValue={ageGroup}
            >
                <Picker.Item value={0} label="Select Your Age Group"/>
                <Picker.Item value={18} label="18 - 44"/>
                <Picker.Item value={45} label="45 and Above"/>
            </Picker>
        </View>
    )
}

function DosePicker({dose,setDose,enabled}) {
    return (
        <View style={styles.pickerView}>
            <Picker
                enabled={enabled}
                selectedValue={dose}
                onValueChange={(itemValue,itemIndex) => {
                    setDose(itemValue)
                }}
                selectedValue={dose}
            >
                <Picker.Item value={0} label="Select the Dose You want to take"/>
                <Picker.Item value={1} label="Dose 1"/>
                <Picker.Item value={2} label="Dose 2"/>
            </Picker>
        </View>
    )
}

/**
 * 
 * @param {Object} param0
 * @param {boolean} param0.visible
 * @param {(visible : boolean) => void} param0.setVisible
 */
 function InformationOverlay({visible,setVisible}){
    return (
        <Overlay overlayStyle={olStyles.container} visible={visible} onBackdropPress={() => setVisible(false)}>
            <ScrollView>
            <Text style={olStyles.stdText}>Search Preferences determine the results you see when you search for vaccination centers or create an alert</Text>
            <Divider style={{height : 1, backgroundColor : "#bbb"}}/>
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>Search By PIN Code</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            When enabled, the application looks for vaccination centers in the PIN Code specified by you.
                            When Disabled, the application looks for vaccination centers in the district you selected.
                        </Text>
                    }
                />
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>District</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            The District where you want to find vaccination centers. 
                            You can get a list of districts for a state by selecting the state from the dropdown menu.
                        </Text>
                    }
                />
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>PIN Code</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            The Postal Code for which the application fetches vaccination center results.
                        </Text>
                    }
                />
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>Age Group</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            The Age group you belong to. This is used to filter the search results and only show you slots for your age group. 
                            When not specified, slots for all age groups are included in the search results.
                        </Text>
                    }
                />
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>Dose</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            Used in alerts only. The Dose Number is used to filter the results based on the availability of the particular dose of a vaccine in a vaccination center.
                        </Text>
                    }
                />
                <InfoRow 
                    col1Comp={
                        <Text style={olStyles.col1Text}>Open Slots Only</Text>
                    }
                    col2Comp= {
                        <Text style={olStyles.col2Text}>
                            When Enabled, the search results only show centers with available (open) booking slots only.
                        </Text>
                    }
                />
            </ScrollView>
        </Overlay>
    )
}

function InfoRow({col1Comp, col2Comp}) {
    return (
        <View style={olStyles.rowView}>
            <View style={olStyles.col1}>
            {col1Comp}
            </View>
            <View style={olStyles.col2}>
            {col2Comp}
            </View>
        </View>
    )
}

/**
 * 
 * @param {Object} param0
 * @param {boolean} param0.visible
 * @param {(visible : boolean) => void} param0.setVisible
 */
function ApiInfoOverlay({visible,setVisible}) {
    return(
        <Overlay overlayStyle={olStyles.card} visible={visible} onBackdropPress={() => setVisible(false)}>
            <Text style={styles.infoText16}>
                <Text style={{fontWeight : "bold"}}>Advanced Setting:</Text> API Keys are used to establish client credentials to 
                the Server. API Keys may require updatation if and when they become stale (marked out of use by the server). In 
                that case, you won't be able to login from the app anymore. In that case you may want to get a fresh one. A step 
                by step guide for getting a fresh API Key can be found in the Github Repository of this App. If the new key doesn't
                work out, you can always go back to the default key by pressing the RESET button, or typing 'DEFAULT VALUE' into the
                Text Input and submitting it.
            </Text>
        </Overlay>
    )
}

const olStyles = StyleSheet.create({
    container : {
        width : Dimensions.get("window").width * 0.95,
        maxHeight : Dimensions.get("window").height * 0.85,
        paddingHorizontal : 10,
        paddingVertical : 15
    },
    card : {
        width : Dimensions.get("window").width * 0.8
    },
    stdText : {
        marginVertical : 4,
        fontSize : 12,
        color : "#00008b"
    },
    rowView : {
        width : "100%",
        paddingHorizontal : 3,
        paddingVertical : 3,
        flexDirection : "row",
        marginVertical : 2,
        borderBottomColor : "#bbb",
        borderBottomWidth : 1
    },
    col1 : {
        flex : 0.35,
        justifyContent : "flex-start",
        alignItems : "flex-start",
        padding : 2,
        borderRightColor : "#bbb",
        borderRightWidth : 1
    },
    col1Text : {
        fontSize : 12,
        fontWeight : "bold",
        textAlign : "left",
        color : "#00008b"
    },
    col2 : {
        flex : 0.65,
        alignItems : "center",
        justifyContent : "flex-start",
        paddingLeft : 6
    },
    col2Text : {
        fontSize : 12,
        textAlign : "left",
        color : "#00008b"
    }
})