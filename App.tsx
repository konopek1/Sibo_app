import React from 'react';
import Add from './src/Add';
import OverView from './src/OverView';
import {siboList} from './src/MockData';
import { StyleSheet, Text, View, Button, AsyncStorage } from 'react-native';
import Realm from 'realm';
import {Product,initLocalDB,ProductSchema,MealSchema} from './src/types/Product';
import ReactNativeAN from 'react-native-alarm-notification';


type State = {
  contentIndex:Content
}

enum Content {
  Add,
  Overview
}

export default class App extends React.Component<null,State>{
  
  constructor(props:null){
    super(props);
    this.state={
      contentIndex:Content.Add,
    }    
    
 
 

    // initLocalDB();
  }

    setcontentIndex(contentIndex:Content){
      const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 5000));     // set the fire date for 1 second from now

      const alarmNotifData = {
        id: "id_123456789",                                  // Required
        title: "My Notification Title",               // Required
        message: "My Notification Message",           // Required
        channel: "id_123456789",                     // Required. Same id as specified in MainApplication's onCreate method
        ticker: "My Notification Ticker",
        auto_cancel: true,                            // default: true
        vibrate: true,
        vibration: 100,                               // default: 100, no vibration if vibrate: false
        small_icon: "ic_launcher",                    // Required
        large_icon: "ic_launcher",
        play_sound: true,
        sound_name: null,                             // Plays custom notification ringtone if sound_name: null
        color: "red",
        schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
        tag: 'some_tag',
        fire_date: fireDate,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.
    
        // You can add any additional data that is important for the notification
        // It will be added to the PendingIntent along with the rest of the bundle.
        // e.g.
        data: { foo: "bar" },
    };
      ReactNativeAN.scheduleAlarm(alarmNotifData);

      this.setState({
        contentIndex:contentIndex
      })
    }

    renderContentByIndex(){
      switch (this.state.contentIndex) {
        case Content.Add:
          return (<Add />);
        
        case Content.Overview:
          return (<OverView />);

      }
    }

    mountPersistanceData(){
    }

    render() {
    return (
    <View style={styles.container}>
      <View style={styles.content}>
      {this.renderContentByIndex()}
      </View>
      <View style={styles.menu}>
      <Button title='add' onPress={()=>{this.setcontentIndex(Content.Add)}} ></Button>
      <Button title='overview' onPress={()=>{this.setcontentIndex(Content.Overview)}} ></Button>
      </View>
    </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menu:{
    height:80,
    width:160,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  content:{
    flex:1,
    alignSelf:'stretch',
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
  }
});
