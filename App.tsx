import React from 'react';
import Add from './src/Add';
import OverView from './src/OverView';
import History from './src/History';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  DeviceEventEmitter,
} from 'react-native';
import Realm from 'realm';
import {initLocalDB} from './src/types/Product';

type State = {
  contentIndex: Content;
  event?: any;
};

enum Content {
  Add,
  Overview,
  History,
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
    this.setState({contentIndex: Content.History, event: e});
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

  mountPersistanceData() {}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>{this.renderContentByIndex()}</View>
        <View style={styles.menu} accessibilityRole="menu">
          <View accessibilityRole="menuitem" style={styles.menuButton}>
            <Button
              title="add"
              onPress={() => {
                this.setcontentIndex(Content.Add);
              }}></Button>
          </View>
          <View accessibilityRole="menuitem" style={styles.menuButton}>
            <Button
              title="history"
              onPress={() => {
                this.setcontentIndex(Content.History);
              }}></Button>
          </View>
          <View accessibilityRole="menuitem" style={styles.menuButton}>
            <Button
              title="overview"
              onPress={() => {
                this.setcontentIndex(Content.Overview);
              }}></Button>
          </View>
          {/* <View accessibilityRole='menuitem' ><Icon name='add_box'></Icon></View> */}
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
  menuButton: {
    width: 100,
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
