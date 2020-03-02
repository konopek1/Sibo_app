const  ReactNativeAN =require('react-native-alarm-notification');

export type Alarm = {
    id?:string,                                  // Required
    title: string,               // Required
    message: string,           // Required
    channel: string,                     // Required. Same id as specified in MainApplication's onCreate method
    ticker?: string,
    auto_cancel: boolean,                            // default: true
    vibrate: boolean,
    vibration: number,                               // default: 100, no vibration if vibrate: false
    small_icon: string,                    // Required
    large_icon?: string,
    play_sound: boolean,
    color: string,
    schedule_once: boolean,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
    tag?:string,
    fire_date: Date,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
    data: Object,
}

export const CHANNEL_ID="id_123456789";




export function addAlarm(title:string,message:string,id:string|number,color:string,fire_date:Date,tag="my tag",data:Object) {
        if (typeof id === "number") id = id.toString();
        const notifyData:Alarm={title,message,id,color,fire_date,tag,data,auto_cancel:true,small_icon:"ic_launcher",channel:CHANNEL_ID,
        vibrate:true,vibration:100,play_sound:true,schedule_once:false};
        ReactNativeAN.default.scheduleAlarm(notifyData);
    }
