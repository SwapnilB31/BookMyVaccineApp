import BackgroundService from 'react-native-background-actions'
import BackgroundTimer from 'react-native-background-timer'
import NotificationManager from '../notifications/NotificationManager'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {storageKeys} from '../contexts/PreferenceProvider'
import {Linking} from 'react-native'

const manager = new NotificationManager()

function sleep(delay) {
    return new Promise((resolve,reject) => {
        const tO = setTimeout(() => {
            clearTimeout(tO)
            resolve(true)
        },delay)
    })
}

export default class BGServiceManager {
    constructor() {
        this.options = {
            taskName : "BookMyVaccine Alerts",
            taskTitle : "Alert Running",
            taskDesc : "Looking for open vaccination slots in your area",
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            linkingURI: 'bmvax://incoming', // Add this
            color: '#ff00ff',
            progressBar : {
                indeterminate : true
            }
        }
    }

    async intensiveTask() {
        const sessionStore = {}
        while(BackgroundService.isRunning()) {
            //console.log("Session Store " +new Date().toString())
            //console.log(sessionStore)
            const hour = new Date().getHours()
            if(hour >= 0 && hour < 10) {
                const yesterday = dateToStr(new Date(Date.now() - 24 * 60 * 60 * 1000))
                if(sessionStore[yesterday] !== undefined)
                    delete sessionStore[yesterday]
            }
            let pinCodeMode = false, districtId = 49, pinCode = '', ageGroup = 0, dose = 0, date = '08-06-2021'
            try {
                pinCodeMode = stringToBool(await AsyncStorage.getItem(storageKeys.pinCodeMode))
                if(pinCodeMode)
                    pinCode = await AsyncStorage.getItem(storageKeys.pinCode)
                else 
                    districtId = Number(await AsyncStorage.getItem(storageKeys.districtId))

                date = dateToStr(new Date())
                if(hour >= 10) {
                    date = dateToStr(new Date(Date.now() + 24 * 60 * 60 * 1000))
                }
                ageGroup = Number(await AsyncStorage.getItem(storageKeys.ageGroup)) || 0
                dose = Number(await AsyncStorage.getItem(storageKeys.dose)) || 1
                //openSlotsOnly = await AsyncStorage.getItem(storageKeys.openSlotsOnly) || false*/
            } catch(err) { 
                console.warn(err)
            }
            //console.log({pinCodeMode,pinCode,districtId,date,ageGroup,dose})
            const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/" + (pinCodeMode ? `calendarByPin?pincode=${pinCode}` : `calendarByDistrict?district_id=${districtId}`) + `&date=${date}` 
            //console.log(url)
            const res = await fetch(url,{
                headers : { 
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json',
                    'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
                }
            })
            //console.log(typeof fetch)
            //console.log(res) 
            const data = await res.json()
            //console.log(data)
            let centersArr = data.centers

            if(ageGroup === 0 && dose === 0) {
                centersArr = centersArr.filter(center => center.sessions.some(session => session.available_capacity > 0))
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(session => session.available_capacity > 0)}))
            }
            if(ageGroup !== 0 && dose == 0) {
                centersArr = centersArr.filter(center => center.sessions.some(session => session.available_capacity > 0 && session.min_age_limit === ageGroup))
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(session => session.available_capacity > 0 && session.min_age_limit === ageGroup)}))
            }
            if(ageGroup !== 0 && dose !== 0) {
                const capKey = dose == 1 ? "available_capacity_dose1" : "available_capacity_dose2"
                centersArr = centersArr.filter(center => center.sessions.some(session => session[capKey] > 0 && session.min_age_limit === ageGroup))
                centersArr = centersArr.map(center => ({...center, sessions : center.sessions.filter(session => session[capKey] > 0 && session.min_age_limit === ageGroup)}))
            }

            let sessionCount = 0
            //console.log(`avail centers : ${centersArr.length}`) 

            for(let i = 0; i < centersArr.length; i++) {
                for(let j = 0; j < centersArr[i].sessions.length; j++) {
                    if(!sessionStore[centersArr[i].sessions[j].date])
                        sessionStore[centersArr[i].sessions[j].date] = {}
                    if(!sessionStore[centersArr[i].sessions[j].date][centersArr[i].sessions[j].session_id]) {
                        sessionCount++
                        sessionStore[centersArr[i].sessions[j].date][centersArr[i].sessions[j].session_id] = true
                    }
                }
            }   

            if(sessionCount > 0)
                manager.scheduledNotification("Vaccine Slots Available",`New Vaccine Slots are available in your area`)

            await sleep(20 * 1000)
        }
    }

    isRunning() {
        return BackgroundService.isRunning()
    }

    async start() {
        if(BackgroundService.isRunning())
            return
        await BackgroundService.start(this.intensiveTask,this.options)
    }

    async stop() {
        if(!BackgroundService.isRunning())
            return
        /*this.interval = parseInt(await AsyncStorage.getItem('bgInterval'))*/
        //console.log("Stopping Background Service")
        /*console.log("interval value : "+this.interval)
        if(this.interval)
            BackgroundTimer.clearInterval(this.interval)*/
        await BackgroundService.stop()
        
    }
}

function stringToBool(val) {
    return val === "true" ? true : false
}

/**
 * 
 * @param {Date} date 
 */
 function dateToStr(date) {
    if(date === null) 
        return `---Pick a Date---`
    let day = date.getDate()
    day = day > 9 ? day : `0${day}`
    let month = date.getMonth() + 1
    month = month > 9 ? month : `0${month}`
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
}

function handleOpenUrl(evt) {
    console.log("Notification Clicked")
    const setIncomingFlag = async () => {
        const flagSet = await AsyncStorage.getItem("incoming")
        if(flagSet === null)
            await AsyncStorage.setItem("incoming","true")
    }
    //setIncomingFlag()
}

Linking.addEventListener('url',handleOpenUrl)
