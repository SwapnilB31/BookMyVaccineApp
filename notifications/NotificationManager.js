import PushNotification, {Importance} from 'react-native-push-notification'
import uuid from 'react-native-uuid'

export default class NotificationManager {
    constructor() {
        this.channelCreated = false
        this.lastId = 0
        this.createChannel()

    }

    createChannel() {
        const parentObj = this
        this.channelId = uuid.v4().toString()

        PushNotification.createChannel({
            channelId : parentObj.channelId,
            channelName : "Main Channel",
            playSound : true,
            soundName : 'default',
            importance : Importance.HIGH,
            vibrate : true
        },(created) => {parentObj.channelCreated = true})
    }

    showLocalNotification(title,message) {
        if(!this.channelCreated)
            return

        const parentObj = this
        this.lastId++
        PushNotification.localNotification({
            channelId : parentObj.channelId,
            invokeApp : false,
            showWhen: true,
            when : Date.now(),
            //usesChronometer : true,

            id : parentObj.lastId,
            title : title,
            message : message,
            playSound : true,
            soundName : 'default',
        })
    }

    scheduledNotification(title,message) {
        if(!this.channelCreated)
            return
        console.log("Triggered schedule notification")
        const parentObj = this
        this.lastId++

        PushNotification.localNotificationSchedule({
            date : new Date(Date.now() + 2 * 1000),
            channelId : parentObj.channelId,
            invokeApp : false,
            showWhen: true,
            when : Date.now(),
            //usesChronometer : true,

            id : parentObj.lastId,
            title : title,
            message : message,
            playSound : true,
            soundName : 'default',
        })
    }
}