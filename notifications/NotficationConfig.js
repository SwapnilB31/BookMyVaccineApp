import PushNotification from 'react-native-push-notification'
import {Platform} from 'react-native'

PushNotification.configure({
    permissions : {
        alert : true,
        badge : true,
        sound : true,
    },

    popInitialNotification: true,

    requestPermissions: Platform.OS === "ios"
})