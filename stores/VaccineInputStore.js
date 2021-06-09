import React, {useReducer} from 'react'

export const actions = Object.freeze({
    setCentersStatic : 'setCentersStatic',
    setCenters : 'setCenters',
    setStateId : 'setStateId',
    setDistrictId : 'setDistrictId',
    setDate : 'setDate',
    togglePinCodeMode : 'togglePinCodeMode',
    setPinCodeMode : 'setPinCodeMode',
    setPinCode : 'setPinCode',
    toggle18PlusMode : 'toggle18PlusMode',
    set18PlusMode : 'set18PlusMode',
    toggle45PlusMode : 'toggle45PlusMode',
    set45PlusMode : 'set45PlusMode',
    toggleOnlyOpenSlot : 'toggleOnlyOpenSlot',
    setOnlyOpenSlots : 'setOnlyOpenSlots',
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
 * @param {boolean} state.onlyOpenSlots
 * @param {Object} action
 * @param {String} action.type
 * @param {any} action.payload 
 * @returns 
 */
export function vaccineInputReducer(state,action) {
    //console.log({state,action})
    switch(action.type) {
        case actions.setCentersStatic:
            return {...state, centersStatic : action.payload}
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
        case actions.setPinCodeMode:
            return {...state, pinCodeMode : action.payload}
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
        case actions.set18PlusMode: {
            /* console.log("In set 18PlusMode...")
            console.log({_18PlusMode : state._18PlusMode, _45PlusMode : state._45PlusMode, payload : action.payload}) */
            if(!state._18PlusMode && !state._45PlusMode) {
                /* console.log("Store set to -")
                console.log({_18PlusMode : action.payload, _45PlusMode : state._45PlusMode}) */
                return {...state, _18PlusMode : action.payload}
            }
            if(state._18PlusMode && !state._45PlusMode && !action.payload) {
                /* console.log("Store set to -")
                console.log({_18PlusMode : false, _45PlusMode : false}) */
                return {...state, _18PlusMode : false, _45PlusMode : false}
            }
            if(!state._18PlusMode && state._45PlusMode && action.payload) {
                /* console.log("Store set to -")
                console.log({_18PlusMode : true, _45PlusMode : false}) */
                return {...state, _18PlusMode : true, _45PlusMode : false}
            }
            else 
                return state
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
        case actions.set45PlusMode:
        { 
            /* console.log("In set 45PlusMode...")
            console.log({_18PlusMode : state._18PlusMode, _45PlusMode : state._45PlusMode, payload : action.payload}) */
            if(!state._18PlusMode && !state._45PlusMode) {
                /* console.log("Store set to -")
                console.log({_18PlusMode : state._18PlusMode, _45PlusMode : action.payload}) */
                return {...state, _45PlusMode : action.payload}
            }
            if(!state._18PlusMode && state._45PlusMode && !action.payload){
                /* console.log("Store set to -")
                console.log({_18PlusMode : false, _45PlusMode : true}) */
                return {...state, _18PlusMode : false, _45PlusMode : true}
            }
            if(state._18PlusMode && !state._45PlusMode && action.payload) {
                /* console.log("Store set to -")
                console.log({_18PlusMode : false, _45PlusMode : true}) */
                return {...state, _18PlusMode : false, _45PlusMode : true}
            }
            else 
                return state
        }
        case actions.toggleOnlyOpenSlot:
            return {...state, onlyOpenSlots : !state.onlyOpenSlots}
        case actions.setOnlyOpenSlots:
            return {...state, onlyOpenSlots : action.payload}
        case actions.resetState:
            return initState
        default:
            state

    }
}

export const vaccineInputInitState = Object.freeze({
    centersStatic : [],
    centers : [],
    stateId : 0,
    districtId : 0,
    date : new Date(),
    pinCodeMode : false,
    pinCode : '',
    _18PlusMode: false,
    _45PlusMode : false,
    onlyOpenSlots : false
})

