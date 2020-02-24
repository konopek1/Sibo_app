import React, {cloneElement} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  Picker,
  Alert,
} from 'react-native';
import {CheckBox, Input} from 'react-native-elements';
import {
  Product,
  ProductSchema,
  MealSchema,
  initLocalDB,
  SCHEMA_VERSION,
} from './types/Product';
import {addAlarm} from './types/AlarmNotifier';
import Realm from 'realm';
const ReactNativeAN = require('react-native-alarm-notification');

type State = {
  productList: Product[];
  delay: number;
  searchText: string;
  addButtonVisible: boolean;
};

type Props = {};

export const TIME_OFFSET = 3600000; //hours

export default class Add extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // initLocalDB();
    let realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });

    const products = ([...realm.objects('Product')] as unknown) as Product[];

    this.state = {
      productList: products,
      delay: 0,
      searchText: '',
      addButtonVisible: false,
    };
  }

  checkBoxOnPress = (item: Product) => {
    this.checkBoxById(item.id);
  };

  //listing iems
  listItem = (item: Product) => {
    if (item.visible)
      return (
        <View>
          <CheckBox
            title={item.name}
            checked={item.state || false}
            onPress={() => this.checkBoxOnPress(item)}
          />
        </View>
      );
    else return null;
  };

  //incremental search
  search = (text: string) => {
    this.setState({searchText: text});
    if (text != '') {
      this.setState((prevState: State) => {
        return {
          productList: prevState.productList.map(element => {
            return !element.name.includes(text)
              ? {...element, visible: false}
              : {...element, visible: true};
          }),
        };
      });
      if (
        this.state.productList.some(p => {
          return p.visible;
        }) === false
      )
        this.setState({addButtonVisible: true});
      else this.setState({addButtonVisible: false});
    } else {
      this.setState((prevState: State) => {
        return {
          productList: prevState.productList.map(element => {
            return {...element, visible: true};
          }),
        };
      });
    }
  };

  onSubmit = () => {
    let meal: Product[] = [];

    this.state.productList.forEach((dish: Product) => {
      if (dish.state) meal.push(dish);
    });

    const realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });
    const newMealId: number = Number(realm.objects('Meal').max('id')) + 1;

    realm.write(() => {
      realm.create('Meal', {
        products: meal.map((product: Product) => {
          return product.id;
        }),
        date: new Date(),
        id: newMealId,
      });
    });

    const rawfireDate = new Date();
    const fireDate = ReactNativeAN.default.parseDate(
      new Date(rawfireDate.getTime() + this.state.delay * TIME_OFFSET),
    );
    const dishList: string = meal
      .map(ele => {
        return ele.name;
      })
      .join(', ');

    addAlarm(
      `Daj znać jak twoj sampoczucie po ostatnimm posiłku?`,
      'Twoj ostatni posiłek to  ' + dishList,
      '1',
      'green',
      fireDate,
      'srag',
      newMealId,
    );
  };

  addNewFood = () => {
    const realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });
    const id = Number(realm.objects('Product').max('id')) + 1;

    realm.write(() => {
      realm.create('Product', {
        name: this.state.searchText,
        id: id,
      });
    });
    realm.close();
    const product: Product = {
      id: id,
      name: this.state.searchText,
      state: true,
      visible: true,
    };

    this.setState((prevState: State) => {
      prevState.productList.push(product);
      return {productList: prevState.productList, searchText: ''};
    });
  };

  checkBoxById = (id: number) => {
    this.setState((prevState: State) => {
      return {
        productList: prevState.productList.map(element => {
          return element.id === id
            ? {...element, state: !element.state}
            : element;
        }),
      } as State;
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            onChangeText={(text: string) => {
              this.search(text);
            }}></Input>
        </View>

        {this.state.addButtonVisible && (
          <View style={styles.addButton}>
            <Button
              title="+"
              color="green"
              onPress={() => {
                this.addNewFood();
              }}></Button>
          </View>
        )}

        <View style={styles.list}>
          <FlatList
            style={styles.list}
            data={this.state.productList}
            renderItem={({item}) => this.listItem(item)}
          />
        </View>

        <View style={styles.submit}>
          <Text>Alert in:</Text>
          <Picker
            selectedValue={this.state.delay}
            style={{height: 100, width: 100}}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({delay: itemValue})
            }>
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
          </Picker>
          <Button
            title="Submit"
            onPress={() => {
              this.onSubmit();
            }}></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  list: {
    flex: 4,
    marginBottom: 10,
  },
  submit: {
    flexShrink: 1,
    padding: 0,
    alignSelf: 'stretch',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  inputContainer: {
    height: 80,
    marginTop: 20,
    flexDirection: 'row',
  },
  addButton: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    margin: 0,
  },
});
