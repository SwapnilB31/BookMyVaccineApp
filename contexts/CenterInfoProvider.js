import React, {createContext, useReducer} from 'react'
import {CenterInfoInitState,CenterInfoReducer} from '../stores/CenterInfoStore'

export const CenterInfoContext = createContext()

export default function CenterInfoProvider({children}) {
    const [state,dispatch] = useReducer(CenterInfoReducer,CenterInfoInitState)

    return (
        <CenterInfoContext.Provider value={{state,dispatch}}>
        {
            children
        }
        </CenterInfoContext.Provider>
    )
}
