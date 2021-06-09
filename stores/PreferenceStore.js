import React, {useReducer} from 'react'

export const actions = Object.freeze({
    togglePinCodeMode: 'togglePinCodeMode',
    setPinCodeMode : 'setPinCodeMode',
    setStateId : 'setStateId',
    setDistrictId : 'setDistrictId',
    setAgeGroup : 'setAgeGroup',
    setPinCode : 'setPinCode',
    toggleOpenSlotsOnly : 'toggleOpenSlotsOnly',
    setOpenSlotsOnly : 'setOpenSlotsOnly',
    setDose : 'setDose',
    setApiKey : 'setApiKey',
    setDefaultApiKey : 'setDefaultApiKey',
    reset : 'reset' 
})

export const defaultApiKey = "U2FsdGVkX1+XVfO0eVn4ac2hxuc4ISUHkOvQ4DB0uNGsDJNU81i2GWIiBXzBfAFQH012o+mwKZsDBh7GjEUOcg==" 

/**
 * 
 * @param {Object} state
 * @param {boolean} state.pinCodeMode 
 * @param {Number} state.stateId
 * @param {Number} state.districtId
 * @param {Number} state.ageGroup
 * @param {String} state.pinCode
 * @param {boolean} state.openSlotsOnly
 * @param {Number} state.dose
 * @param {String} state.apiKey
 * @param {Object} action
 * @param {String} action.type
 * @param {any} action.payload 
 */
export function PrefReducer(state,action) {
    switch(action.type) {
        case actions.togglePinCodeMode:
            return {...state, pinCodeMode : !state.pinCodeMode}
        case actions.setPinCodeMode:
            return {...state, pinCodeMode : action.payload}
        case actions.setStateId:
            return {...state, stateId : action.payload}
        case actions.setDistrictId:
            return {...state, districtId : action.payload}
        case actions.setAgeGroup:
            return {...state, ageGroup : action.payload}
        case actions.setPinCode:
            return {...state, pinCode : action.payload}
        case actions.toggleOpenSlotsOnly:
            return {...state, openSlotsOnly : !state.openSlotsOnly}
        case actions.setOpenSlotsOnly:
            return {...state, openSlotsOnly : action.payload}
        case actions.setDose: 
            return {...state, dose : action.payload}
        case actions.setApiKey:
            return {...state, apiKey : action.payload}
        case actions.setDefaultApiKey:
            return {...state, apiKey : defaultApiKey}
        case actions.reset:
            return PrefInitState
        default:
            return state
    }
}

export const PrefInitState = Object.freeze({
    pinCodeMode : false,
    stateId : 0,
    districtId : 0,
    ageGroup : 0,
    pinCode : '',
    openSlotsOnly : false,
    dose : 1,
    apiKey : defaultApiKey
})