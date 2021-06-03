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
        case actions.SET_IN_MEMORY_ACCESS_TOKEN:
            return {...state, inMemoryAccessToken : action.payload}
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
        const mobileNumber = await AsyncStorage.getItem('mobileNumber')
        dispatch({type : actions.SET_MOBILE_NUMBER, payload : mobileNumber})
        
        const age = await AsyncStorage.getItem('age')
        dispatch({type : actions.SET_AGE, payload : Number(age)})

        const benificiaryId = await AsyncStorage.getItem('benificiaryId')
        dispatch({type : actions.SET_BENIFICIARY_ID, payload : benificiaryId})
        
        const benificiaryName = await AsyncStorage.getItem('benificiaryName')
        dispatch({type : actions.SET_BENIFICIARY_NAME, payload : benificiaryName})

        const dose = await AsyncStorage.getItem('dose')
        dispatch({type : actions.SET_DOSE, payload : Number(dose)})

        const yearOfBirth = await AsyncStorage.getItem('yearOfBirth')
        dispatch({type : actions.SET_YEAR_OF_BIRTH, payload : Number(yearOfBirth)})

        const idType = await AsyncStorage.getItem('idType')
        dispatch({type : actions.SET_ID_TYPE, payload : idType})

        const idNumber = await AsyncStorage.getItem('idNumber')
        dispatch({type : actions.SET_ID_NUMBER, payload : idNumber})

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
        await AsyncStorage.setItem('mobileNumber',mobileNumber)
        dispatch({type : actions.SET_MOBILE_NUMBER, payload : mobileNumber})
    }

    async function setAge(age) {
        await AsyncStorage.setItem('age',age.toString())
        dispatch({type : actions.SET_AGE, payload : Number(age)})
    }

    async function setBenificiaryId(benificiaryId) {
        await AsyncStorage.setItem('benificiaryId',benificiaryId)
        dispatch({type : actions.SET_BENIFICIARY_ID, payload : benificiaryId})
    }

    async function setBenificiaryName(benificiaryName) {
        await AsyncStorage.setItem('benificiaryName',benificiaryName)
        dispatch({type : actions.SET_BENIFICIARY_NAME, payload : benificiaryName})
    }

    async function setDose(dose) {
        await AsyncStorage.setItem('dose',dose.toString())
        dispatch({type : actions.SET_DOSE, payload : Number(dose)})
    }

    async function setYearOfBirth(yearOfBirth) {
        await AsyncStorage.setItem('yearOfBirth',yearOfBirth)
        dispatch({type : actions.SET_YEAR_OF_BIRTH, payload : Number(yearOfBirth)})
    }

    async function setIdType(id_type) {
        await AsyncStorage.setItem('idType',id_type)
        dispatch({type : actions.SET_ID_TYPE, payload : id_type})
    }

    async function setIdNumber(idNumber) {
        await AsyncStorage.setItem('idNumber',idNumber)
        dispatch({type : actions.SET_ID_NUMBER, payload : idNumber})
    }

    const stateSetters = {setMobileNumber,setAge,setBenificiaryId,setBenificiaryName,setDose,setYearOfBirth,setIdType,setIdNumber}

    return (
        <UserContext.Provider value={{state, stateSetters}}>
        {
            children
        }
        </UserContext.Provider>
    )
}


