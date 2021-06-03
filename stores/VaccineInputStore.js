import React, {useReducer} from 'react'

export const actions = Object.freeze({
    setCenters : 'setCenters',
    setStateId : 'setStateId',
    setDistrictId : 'setDistrictId',
    setDate : 'setDate',
    togglePinCodeMode : 'togglePinCodeMode',
    setPinCode : 'setPinCode',
    toggle18PlusMode : 'toggle18PlusMode',
    toggle45PlusMode : 'toggle45PlusMode',
    resetState : 'resetState' 
})

/**
 * 
 * @param {Object} state 
 * @param {Array} state.centers
 * @param {Number} state.stateId
 * @param {Number} state.districtId
 * @param {Date} state.date,
 * @param {boolean} state.pinCodeMode
 * @param {String} state.pinCode
 * @param {boolean} state._18PlusMode
 * @param {boolean} state._45PlusMode
 * @param {Object} action
 * @param {String} action.type
 * @param {any} action.payload 
 * @returns 
 */
export function vaccineInputReducer(state,action) {
    //console.log({state,action})
    switch(action.type) {
        case actions.setCenters:
            return {...state, centers : action.payload}
        case actions.setStateId:
            return {...state, stateId : action.payload}
        case actions.setDistrictId:
            return {...state, districtId : action.payload}
        case actions.setDate:
            return {...state, date : action.payload}
        case actions.togglePinCodeMode:
            return {...state, pinCodeMode : !state.pinCodeMode}
        case actions.setPinCode:
            return {...state, pinCode : action.payload}

        /**
         * 
        state
        -----
        18 : false
        45 : false
        input
        -----
        18 : true  -> 18 : true, 45 : false
        45 : true  -> 18 : false, 45 : true

        state
        -----
        18 : true
        45 : false
        input
        -----
        18 : false -> 18 : false, 45 : false
        45 : true  -> 18 : false, 45 : true

        state
        -----
        18 : false
        45 : true
        input
        -----
        18 : true  -> 18 : true, 45 : false
        45 : false -> 18 : false, 45 : true

         */
        case actions.toggle18PlusMode:
        {
            if(!state._45PlusMode && !state._18PlusMode)
                return {...state, _18PlusMode : true}
            if(!state._45PlusMode && state._18PlusMode)
                return {...state, _18PlusMode : false, _45PlusMode : false}
            if(state._45PlusMode && !state._18PlusMode)
                return {...state, _18PlusMode : true, _45PlusMode : false}
        }
        case actions.toggle45PlusMode:
        {
            if(!state._45PlusMode && !state._18PlusMode)
                return {...state, _45PlusMode : true}
            if(!state._45PlusMode && state._18PlusMode)
                return {...state, _18PlusMode : false, _45PlusMode : true}
            if(state._45PlusMode && !state._18PlusMode)
                return {...state, _18PlusMode : false, _45PlusMode : false}
        }
        case actions.resetState:
            return initState
        default:
            state

    }
}

export const vaccineInputInitState = Object.freeze({
    centers : [],
    stateId : 0,
    districtId : 0,
    date : new Date(),
    pinCodeMode : false,
    pinCode : '',
    _18PlusMode: false,
    _45PlusMode : false
})

