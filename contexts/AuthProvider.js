import React, {useState, useContext, createContext, useEffect} from 'react'
import UserProvider, {UserContext} from './UserProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ReadSms from 'react-native-read-sms/ReadSms'
import * as Crypto from 'expo-crypto'
import {headers} from '../data/headers'

export const AuthContext = createContext()


export default function AuthProvider({children}) {
    const [accessToken,setAccessToken] = useState(null)
    const [loginAttempt,setLoginAttempt] = useState(false)
    const [loginError,setLoginError] = useState(false)
    const [smsWaiting,setSmsWaiting] = useState(false)
    const { state : {mobileNumber}, stateSetters : {setBenificiaryId,setBenificiaryName,setMobileNumber}, resetUserStore} = useContext(UserContext)


    
    useEffect(() => {
        AsyncStorage.getItem('inMemoryAccessToken',(error,result) => {
            if(error)
                setAccessToken(null)
            else
                setAccessToken(JSON.parse(result))
        })
    },[])
    
    function login({inputMobileNumber}) {
        /*if(mobileNumber === null) {
            setLoginError(true)
            return
        }*/
        const mobileNumVal = inputMobileNumber || mobileNumber
        setAllAccessTokens(null)
        setLoginAttempt(false)
        setLoginError(false)
        setSmsWaiting(false)
        loginMethod(mobileNumVal,setAllAccessTokens,setLoginAttempt,setLoginError,setSmsWaiting,setMobileNumber)
        /*setTimeout(()=> {
            if(accessToken === null)
                setLoginError(true)
        },3 * 60 * 1000) */
    }

    function logout() {
        AsyncStorage.removeItem('inMemoryAccessToken',err => {
            resetUserStore()
            setAccessToken(null)
        })
    }

    function isTokenValid() {
        if(accessToken === null)
            return false
        return Date.now() - accessToken.issuedAt < 14.5 * 60 * 1000
    }

    function setAllAccessTokens(accessToken) {
        if(accessToken === null) {
            setAccessToken(null)
            AsyncStorage.removeItem('inMemoryAccessToken')
        }
        else { 
            setAccessToken(accessToken)
            AsyncStorage.setItem('inMemoryAccessToken',JSON.stringify(accessToken))
        }
    }

    const state = {accessToken,loginAttempt,loginError,smsWaiting}
    const value = {state,login,logout,isTokenValid}
    
    return (
        <AuthContext.Provider value={value}>
        {
            children
        }
        </AuthContext.Provider>
    )
}

function timeOut(time) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(true)
        },time)
    })
}

function readSmsPromiseWrapper() {
    return new Promise((resolve,reject) => {
        ReadSms.startReadSMS((status,sms,error) => {
            ReadSms.stopReadSMS()
            if(error)
                resolve(null)
            else
                resolve({status,sms})
        })
    })
}


/**
 * 
 * @param {String} mobileNumber 
 * @param {React.Dispatch<any>} setAccessToken 
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoginAttempt 
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoginError 
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSmsWaiting 
 */
async function loginMethod(mobileNumber,setAccessToken,setLoginAttempt,setLoginError,setSmsWaiting,setMobileNumber) {
    console.log({mobileNumber})
    if(mobileNumber === null)
        return
    setLoginAttempt(true)
    try {
        const res = await fetch('https://cdn-api.co-vin.in/api/v2/auth/generateMobileOTP',{
            method: "POST",
            body : JSON.stringify({
                mobile : mobileNumber, 
                secret : "U2FsdGVkX1+XVfO0eVn4ac2hxuc4ISUHkOvQ4DB0uNGsDJNU81i2GWIiBXzBfAFQH012o+mwKZsDBh7GjEUOcg=="
            }),
            headers : headers
        })
        const {txnId} = await res.json()
        console.log({txnId})
        const otp = await getOTP(setSmsWaiting) 
        console.log({otp})
        if(otp !== null) {
            await timeOut(300)
            const reqData = {otp, txnId}
            console.log("sending data...")
            console.log(reqData)
            console.log("Submitting OTP...")
            const res1 = await fetch('https://cdn-api.co-vin.in/api/v2/auth/validateMobileOtp',{
                method: "POST",
                body : JSON.stringify(reqData),
                headers : headers
            });

            console.log("Recieving OTP...")

            const {token} = await res1.json()
            timeOut(300)
            setAccessToken({token : token, issuedAt : Date.now()})
            await setMobileNumber(mobileNumber)
            setLoginAttempt(false)
        }
        else {
            console.log("Error: OTP was null...")
            setAccessToken(null)
            setSmsWaiting(false)
            setLoginError(true)
            setLoginAttempt(false)
        }
    } catch(err) {
        console.log("Error: Something went wrong...")
        console.error(err)
        setLoginError(true)
        setLoginAttempt(false)
        setAccessToken(null)
    }
}

async function getOTP(setSmsWaiting) {
    setSmsWaiting(true)
    const hasPermission = await ReadSms.requestReadSMSPermission()
    if(hasPermission) {
        const smsResp = await readSmsPromiseWrapper()
        if(smsResp !== null) {
            const {status,sms} = smsResp
            console.log({sms,status})
            if(sms.indexOf("CoWIN") > -1) {
                const OTP = sms.match(/\d{6}/)[0]
                const hashedOTP = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,OTP)
                setSmsWaiting(false)
                return hashedOTP
            }
            else {
                setSmsWaiting(false)
                return null
            }
        }
        else {
            setSmsWaiting(false)
            alert(`Oops something went wrong`)
            return null
        }
    }
    else {
        setSmsWaiting(false)
        return null
    }
}
