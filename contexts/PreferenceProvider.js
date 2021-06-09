import React, {createContext, useContext, useEffect, useReducer} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {actions as PrefActions, PrefInitState, PrefReducer, defaultApiKey} from '../stores/PreferenceStore'
import {UserContext, storageKeys as userKeys} from './UserProvider'
import districtList from '../data/districtList'

export const PreferenceContext = createContext()

const keyPrefix = "preference:"

export const storageKeys = Object.freeze({
    pinCodeMode : keyPrefix+"pinCodeMode",
    stateId : keyPrefix+"stateId",
    districtId : keyPrefix+"districtId",
    ageGroup : keyPrefix+"ageGroup",
    pinCode : keyPrefix+"pinCode",
    openSlotsOnly : keyPrefix+"openSlotsOnly",
    dose : keyPrefix+"dose",
    apiKey : keyPrefix+"apiKey"
})

function stringToBool(val) {
    return val === "true" ? true : false
}

/**
 * 
 * @param {React.Dispatch<{type: string;payload: any;}>} dispatch 
 */
async function fetchDataFromStorage(dispatch,userDose,userAge) {
    try {
        const pinCodeMode = await AsyncStorage.getItem(storageKeys.pinCodeMode)
        if(pinCodeMode !== null)
            dispatch({type : PrefActions.setPinCodeMode, payload : stringToBool(pinCodeMode)})

        const stateId = await AsyncStorage.getItem(storageKeys.stateId)
        if(stateId !== null)
            dispatch({type : PrefActions.setStateId, payload : Number(stateId)})

        const districtId = await AsyncStorage.getItem(storageKeys.districtId)
        if(districtId !== null)
            dispatch({type : PrefActions.setDistrictId, payload : Number(districtId)})

        const ageGroup = await AsyncStorage.getItem(storageKeys.ageGroup)
        if(ageGroup !== null)
            dispatch({type : PrefActions.setAgeGroup, payload: Number(ageGroup)})
        else {
            if(userAge !== null) {
                const ageGrp  = userAge >= 18 && userAge < 45 ? 18 : 45
                await AsyncStorage.setItem(storageKeys.ageGroup,ageGrp.toString())
                dispatch({type : PrefActions.setAgeGroup, payload : ageGroup}) 
            }
        }

        const dose = await AsyncStorage.getItem(storageKeys.dose)
        if(dose !== null)
            dispatch({type : PrefActions.setDose, payload : Number(dose)})
        else {
            if(userDose !== null) {
                await AsyncStorage.setItem(storageKeys.dose,userDose.toString())
                dispatch({type : PrefActions.setDose, payload : userDose})
            }
        }

        const pinCode = await AsyncStorage.getItem(storageKeys.pinCode)
        if(pinCode !== null)
            dispatch({type : PrefActions.setPinCode, payload : pinCode})

        const openSlotsOnly = await AsyncStorage.getItem(storageKeys.openSlotsOnly)
        if(openSlotsOnly !== null)
            dispatch({type : PrefActions.setOpenSlotsOnly, payload : stringToBool(openSlotsOnly)})

        const apiKey = await AsyncStorage.getItem(storageKeys.apiKey)
        if(apiKey !== null)
            dispatch({type : PrefActions.setApiKey, payload : apiKey})
    } catch(err) {
        console.warn(err)
    }
} 

export default function PreferenceProvider({children}) {
    
    const [state,dispatch] = useReducer(PrefReducer,PrefInitState)
    const {state : {dose : userDose, age : userAge}} = useContext(UserContext)

    async function togglePinCodeMode() {
        await AsyncStorage.setItem(storageKeys.pinCodeMode,!state.pinCodeMode === true ? "true" : "false")
        dispatch({type : PrefActions.togglePinCodeMode})
    }

    async function setStateId(stateId) {
        dispatch({type : PrefActions.setStateId, payload : Number(stateId)})
        await AsyncStorage.setItem(storageKeys.stateId,stateId.toString())
        const hasDist = districtList[1].find(district => district.district_id === state.districtId)
        if(hasDist === undefined) {
            setDistrictId(0)
        }
    }

    async function setDistrictId(districtId) {
        dispatch({type : PrefActions.setDistrictId, payload : Number(districtId)})
        await AsyncStorage.setItem(storageKeys.districtId,districtId.toString())
    }

    async function setAgeGroup(ageGroup) {
        dispatch({type : PrefActions.setAgeGroup, payload : ageGroup})
        await AsyncStorage.setItem(storageKeys.ageGroup,ageGroup.toString())
    }

    async function setPinCode(pinCode) {
        dispatch({type : PrefActions.setPinCode, payload : pinCode})
        await AsyncStorage.setItem(storageKeys.pinCode,pinCode)
    }

    async function toggleOpenSlotsOnly(openSlotsOnly) {
        await AsyncStorage.setItem(storageKeys.openSlotsOnly,!state.openSlotsOnly === true ? "true" : "false")
        dispatch({type : PrefActions.toggleOpenSlotsOnly})
        
    }

    async function setDose(dose) {
        dispatch({type : PrefActions.setDose, payload : dose})
        await AsyncStorage.setItem(storageKeys.dose,dose.toString())
    }

    async function setApiKey(apiKey) {
        dispatch({type : PrefActions.setApiKey, payload : apiKey})
        await AsyncStorage.setItem(storageKeys.apiKey, apiKey)
    }

    useEffect(() => {
        fetchDataFromStorage(dispatch,userDose,userAge)
    },[])

    const stateSetters = {togglePinCodeMode,setStateId,setDistrictId,setPinCode,setAgeGroup,toggleOpenSlotsOnly,setDose,setApiKey}
    const value = {state, stateSetters}

    return (
        <PreferenceContext.Provider value={value}>
        {
            children
        }
        </PreferenceContext.Provider>
    )
}
