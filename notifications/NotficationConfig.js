import PushNotification from 'react-native-push-notification'
import {Platform} from 'react-native'

PushNotification.configure({

    onRegister: function (token) {
        //console.log("TOKEN:", token);
    },


    onNotification : function(notification) {
        //console.log("NOTIFICATION:", notification);

        //notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    onAction: function (notification) {
        //console.log("ACTION:", notification.action);
        //console.log("NOTIFICATION:", notification);
    
        // process the action
    },
    
    permissions : {
        alert : true,
        badge : true,
        sound : true,
    },

    popInitialNotification: true,

    requestPermissions: Platform.OS === "ios"
})