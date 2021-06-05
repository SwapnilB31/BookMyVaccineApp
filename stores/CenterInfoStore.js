import React from 'react'

export const actions = Object.freeze({
    setCenterId : 'setCenterId',
    setCenterName : 'setCenterName',
    setCenterAdress : 'setCenterAdress',
    setCenterTime : 'setCenterTime',
    setCenterFeeType : 'setCenterFeeType',
    setCenterVaccineFees : 'setCenterVaccineFees',
    setSessionId : 'setSessionId',
    setSessionVaccine : 'setSessionVaccine',
    setSessionDate : 'setSessionDate',
    setSessionMinAgeLimit : 'setSessionMinAgeLimit',
    setSessionSlots : 'setSessionSlots'
})

/**
 * 
 * @param {Object} state
 * @param {String} state.centerId
 * @param {String} state.centerName
 * @param {String} state.centerAddress
 * @param {String} state.centerTime
 * @param {String} state.centerFeeType
 * @param {Array<any>} state.centerVaccineFees
 * @param {String} state.sessionId
 * @param {String} state.sessionVaccine
 * @param {String} state.sessionDate
 * @param {Number} state.sessionMinAgeLimit
 * @param {Array<any>} state.sessionSlots 
 * @param {Object} action
 * @param {String} action.type
 * @param {any} action.payload 
 */
export function CenterInfoReducer(state,action) {
    switch(action.type) {
        case actions.setCenterId:
            return {...state, centerId : action.payload}
        case actions.setCenterName:
            return {...state, centerName : action.payload}
        case actions.setCenterAdress:
            return {...state, centerAddress : action.payload}
        case actions.setCenterTime:
            return {...state, centerTime : action.payload}
        case actions.setCenterFeeType:
            return {...state, centerFeeType : action.payload}
        case actions.setCenterVaccineFees:
            return {...state, centerVaccineFees : action.payload}
        case actions.setSessionId:
            return {...state, sessionId : action.payload}
        case actions.setSessionVaccine:
            return {...state, sessionVaccine : action.payload}
        case actions.setSessionDate:
            return {...state, sessionDate : action.payload}
        case actions.setSessionMinAgeLimit:
            return {...state, sessionMinAgeLimit : action.payload}
        case actions.setSessionSlots:
            return {...state, sessionSlots : action.payload}
    }
}

export const CenterInfoInitState = Object.freeze({
    centerId : '',
    centerName : '',
    centerAddress : '',
    centerTime : '',
    centerFeeType : '',
    centerVaccineFees : [],
    sessionId : '',
    sessionVaccine : '',
    sessionDate : '',
    sessionMinAgeLimit : null,
    sessionSlots : []
})

