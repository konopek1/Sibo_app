import React from 'react';
import Add from './src/Add';
import OverView from './src/OverView';
import History from './src/History';
import {
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
} from 'react-native';
import { Button } from 'react-native-elements';
import Realm from 'realm';
import { initLocalDB } from './src/types/Product';
import Icon from 'react-native-vector-icons/FontAwesome5';
import GestureRecognizer from 'react-native-swipe-gestures';

type State = {
  contentIndex: Content;
  event?: any;
};

enum Content {
  Add,
  History,
  Overview
}

export default class App extends React.Component<null, State> {
  constructor(props: null) {
    super(props);
    this.state = {
      contentIndex: Content.History,
    };
    this.onNotificationOpened.bind(this);

    DeviceEventEmitter.addListener('OnNotificationOpened', e => {
      this.onNotificationOpened(e);
    });

    // initLocalDB();
  }

  async onNotificationOpened(e: any) {
    console.log('Notify fire');
    this.setState({ contentIndex: Content.History, event: e });
  }

  setcontentIndex(contentIndex: Content) {
    this.setState({
      contentIndex: contentIndex,
    });
  }

  renderContentByIndex() {
    switch (this.state.contentIndex) {
      case Content.Add:
        return <Add />;

      case Content.Overview:
        return <OverView />;

      case Content.History:
        return <History />;
    }
  }

  mountPersistanceData() { }

  render() {
    return (
      <GestureRecognizer
          onSwipeRight={()=>{this.setcontentIndex((Math.abs(this.state.contentIndex + 1) % 3))}}
          onSwipeLeft={()=>{this.setcontentIndex(Math.abs(this.state.contentIndex - 1 % 3))}}
          style={styles.container}
        > 
          <View style={styles.content}>{this.renderContentByIndex()}</View>
          <View style={styles.menu} accessibilityRole="menu">
            <View accessibilityRole="menuitem" style={styles.menuButton}>
              <Button
                icon={<Icon
                  name="carrot"
                  size={30}
                  color="#fe8a71"
                />
                }
                type="outline"
                onPress={() => {
                  this.setcontentIndex(Content.Add);
                }}></Button>
            </View>
            <View accessibilityRole="menuitem" style={styles.menuButton}>
              <Button
                type="outline"
                icon={<Icon
                  name="book-dead"
                  size={30}
                  color="#4a4e4d"
                />
                }
                onPress={() => {
                  this.setcontentIndex(Content.History);
                }}></Button>
            </View>
            <View accessibilityRole="menuitem" style={styles.menuButton}>
              <Button
                type="outline"
                icon={<Icon
                  name="clipboard-list"
                  size={30}
                  color="#63ace5"
                />}
                onPress={() => {
                  this.setcontentIndex(Content.Overview);
                }}></Button>
            </View>
          </View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  menuButton: {
    width: 100
  },
  menu: {
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
