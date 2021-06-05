import React, {useContext, useReducer, useEffect, createContext} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const UserContext = createContext()

const actions = Object.freeze({
    SET_MOBILE_NUMBER : 'set-mobile-number',
    SET_AGE : 'set-age',
    SET_BENIFICIARY_ID : 'set-benificiary-id',
    SET_BENIFICIARY_NAME : 'set-benificiary-name',
    SET_DOSE : 'set-dose',
    SET_YEAR_OF_BIRTH : 'set-year-of-birth',
    SET_ID_TYPE : 'set-id-type',
    SET_ID_NUMBER : 'set-id-number',
    RESET : 'reset'
})

const storageKeys = Object.freeze({
    mobileNumber : 'mobileNumber',
    age : 'age',
    benificiaryId : 'benificiaryId',
    benificiaryName: 'benificiaryName',
    dose : 'dose',
    yearOfBirth : 'yearOfBirth',
    idType : 'idType',
    idNumber: 'idNumber',
})

/**
 * 
 * @param {Object} state
 * @param {String} state.mobileNumber
 * @param {Number} state.age
 * @param {String} state.benificiaryId
 * @param {String} state.benificiaryName
 * @param {Number} state.dose  
 * @param {Number} state.yearOfBirth
 * @param {String} state.idType
 * @param {String} state.idNumber
 * @param {Object} action
 * @param {String} action.type
 * @param {any} action.payload 
 * @returns 
 */
function reducer(state,action) {
    switch(action.type) {
        case actions.SET_MOBILE_NUMBER:
            return {...state, mobileNumber : action.payload}
        case actions.SET_AGE:
            return {...state, age: action.payload}
        case actions.SET_BENIFICIARY_ID:
            return {...state, benificiaryId : action.payload}
        case actions.SET_BENIFICIARY_NAME:
            return {...state, benificiaryName : action.payload}
        case actions.SET_DOSE:
            return {...state, dose : action.payload}
        case actions.SET_YEAR_OF_BIRTH:
            return {...state, yearOfBirth : action.payload}
        case actions.SET_ID_TYPE:
            return {...state, idType : action.payload}
        case actions.SET_ID_NUMBER:
            return {...state, idNumber : action.payload}
        case actions.RESET:
            return initState
        default:
            return state
    }
}

/**
 * 
 * @param {React.Dispatch<{type: string;payload: any;}>} dispatch 
 */

async function fetchFromStorage(dispatch) {
    try {
        const mobileNumber = await AsyncStorage.getItem(storageKeys.mobileNumber)
        dispatch({type : actions.SET_MOBILE_NUMBER, payload : mobileNumber})
        
        const age = await AsyncStorage.getItem(storageKeys.age)
        dispatch({type : actions.SET_AGE, payload : Number(age)})

        const benificiaryId = await AsyncStorage.getItem(storageKeys.benificiaryId)
        dispatch({type : actions.SET_BENIFICIARY_ID, payload : benificiaryId})
        
        const benificiaryName = await AsyncStorage.getItem(storageKeys.benificiaryName)
        dispatch({type : actions.SET_BENIFICIARY_NAME, payload : benificiaryName})

        const dose = await AsyncStorage.getItem(storageKeys.dose)
        dispatch({type : actions.SET_DOSE, payload : Number(dose)})

        const yearOfBirth = await AsyncStorage.getItem(storageKeys.yearOfBirth)
        dispatch({type : actions.SET_YEAR_OF_BIRTH, payload : Number(yearOfBirth)})

        const idType = await AsyncStorage.getItem(storageKeys.idType)
        dispatch({type : actions.SET_ID_TYPE, payload : idType})

        const idNumber = await AsyncStorage.getItem(storageKeys.idNumber)
        dispatch({type : actions.SET_ID_NUMBER, payload : idNumber})

    } catch(err) {
        console.warn(err)
    }
}

/**
 * 
 * @param {React.Dispatch<{type: string;payload: any;}>} dispatch 
 */
async function removeKeysFromStorage() {
    try {
        await AsyncStorage.removeItem(storageKeys.mobileNumber)
        await AsyncStorage.removeItem(storageKeys.age)
        await AsyncStorage.removeItem(storageKeys.benificiaryId)
        await AsyncStorage.removeItem(storageKeys.benificiaryName)
        await AsyncStorage.removeItem(storageKeys.dose)
        await AsyncStorage.removeItem(storageKeys.yearOfBirth)
        await AsyncStorage.removeItem(storageKeys.idType)
        await AsyncStorage.removeItem(storageKeys.idNumber)
    } catch(err) {
        console.warn(err)
    }
}

const initState = {
    mobileNumber : null,
    age : null,
    benificiaryId : null,
    benificiaryName : null,
    dose : null,
    yearOfBirth : null,
    idType : null,
    idNumber : null,
}

export default function UserProvider({children}) {

    const [state,dispatch] = useReducer(reducer,initState)

    useEffect(() => {
        fetchFromStorage(dispatch)
    }, [])

    async function setMobileNumber(mobileNumber) {
        console.log({mobileNumber})
        dispatch({type : actions.SET_MOBILE_NUMBER, payload : mobileNumber})
        await AsyncStorage.setItem(storageKeys.mobileNumber,mobileNumber)
        return true
    }

    async function setAge(age) {
        console.log({age})
        dispatch({type : actions.SET_AGE, payload : Number(age)})
        await AsyncStorage.setItem(storageKeys.age,age.toString())
        return true
    }

    async function setBenificiaryId(benificiaryId) {
        console.log({benificiaryId})
        dispatch({type : actions.SET_BENIFICIARY_ID, payload : benificiaryId})
        await AsyncStorage.setItem(storageKeys.benificiaryId,benificiaryId)
        return true
    }

    async function setBenificiaryName(benificiaryName) {
        console.log({benificiaryName})
        dispatch({type : actions.SET_BENIFICIARY_NAME, payload : benificiaryName})
        await AsyncStorage.setItem(storageKeys.benificiaryName,benificiaryName)
        return true
    }

    async function setDose(dose) {
        console.log({dose})
        dispatch({type : actions.SET_DOSE, payload : dose})
        await AsyncStorage.setItem(storageKeys.dose,dose.toString())
    }

    async function setYearOfBirth(yearOfBirth) {
        console.log({yearOfBirth})
        dispatch({type : actions.SET_YEAR_OF_BIRTH, payload : Number(yearOfBirth)})
        await AsyncStorage.setItem(storageKeys.yearOfBirth,yearOfBirth)
        return true
    }

    async function setIdType(id_type) {
        console.log({id_type})
        dispatch({type : actions.SET_ID_TYPE, payload : id_type})
        await AsyncStorage.setItem(storageKeys.idType,id_type)
        return true
    }

    async function setIdNumber(idNumber) {
        console.log({idNumber})
        dispatch({type : actions.SET_ID_NUMBER, payload : idNumber})
        await AsyncStorage.setItem(storageKeys.idNumber,idNumber)
        return true
    }

    async function resetUserStore() {
        await removeKeysFromStorage()
        dispatch({type : actions.RESET})
        return true
    }

    const stateSetters = {setMobileNumber,setAge,setBenificiaryId,setBenificiaryName,setDose,setYearOfBirth,setIdType,setIdNumber}

    return (
        <UserContext.Provider value={{state, stateSetters, resetUserStore}}>
        {
            children
        }
        </UserContext.Provider>
    )
}


