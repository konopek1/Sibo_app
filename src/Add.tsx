import React, { cloneElement } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Keyboard,
  ViewComponent,
} from 'react-native';
import { CheckBox, Input, Button, Slider } from 'react-native-elements';
import {
  Product,
  ProductSchema,
  MealSchema,
  initLocalDB,
  SCHEMA_VERSION,
} from './types/Product';
import { addAlarm } from './types/AlarmNotifier';
import Realm from 'realm';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownAlert from 'react-native-dropdownalert';
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
  private realm: Realm;
  private dropDownAlertRef?: DropDownAlert;

  constructor(props: Props) {
    super(props);
    this.realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });

    const products = ([
      ...this.realm.objects('Product'),
    ] as unknown) as Product[];
    this.state = {
      productList: products,
      delay: 2,
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
  //render button if elemnt not in list
  renderButtonCond = () => {
    this.setState((prevState: State) => {
      return {
        addButtonVisible: !prevState.productList.some(p => {
          return p.visible;
        })
      }
    })
  };
  //incremental search
  search = (text: string) => {
    this.setState({ searchText: text });
    if (text != '') {
      this.setState((prevState: State) => {
        return {
          productList: prevState.productList.map(element => {
            return !element.name.includes(text)
              ? { ...element, visible: false }
              : { ...element, visible: true };
          }),
        };
      });
    } else {
      this.setState((prevState: State) => {
        return {
          productList: prevState.productList.map(element => {
            return { ...element, visible: true };
          }),
        };
      });
    }
    this.renderButtonCond();

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
    const newMealId: number = Number(realm.objects('Meal').max('id') || 0) + 1;

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

    console.log(fireDate);
    this.dropDownAlertRef!.alertWithType('success','Dodano',`Data alertu: ${fireDate}`);
    this.resetList();
  };

  resetList = () => {
    const products = ([
      ...this.realm.objects('Product'),
    ] as unknown) as Product[];
    this.setState({ productList: products })
  };

  addNewFood = () => {
    const realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });
    const id = Number(realm.objects('Product').max('id') || 0) + 1;

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
      return { productList: prevState.productList, searchText: '' };
    });

    this.search('');
    Keyboard.dismiss();
  };

  checkBoxById = (id: number) => {
    this.setState((prevState: State) => {
      return {
        productList: prevState.productList.map(element => {
          return element.id === id
            ? { ...element, state: !element.state }
            : element;
        }),
      } as State;
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <View><DropDownAlert ref={ref => this.dropDownAlertRef = (ref||undefined)}></DropDownAlert></View>
        <View style={styles.inputContainer}>
          <Input
            onChangeText={(text: string) => { this.search(text) }}
            placeholder="Apple ..."
            value={this.state.searchText}
            leftIcon={<Icon
              name="search"
              color="grey"
              size={21}
            />}
            leftIconContainerStyle={{ paddingRight: 5 }}
          ></Input>
        </View>

        {this.state.addButtonVisible && (
          <View style={styles.addButton}>
            <Button
              type="outline"
              icon={<Icon
                name="plus"
                size={25}
                color="green"
              />}
              buttonStyle={{ borderRadius: 10 }}
              onPress={() => {
                this.addNewFood();
              }}></Button>
          </View>
        )}

        <View style={styles.list}>
          <FlatList
            style={styles.list}
            data={this.state.productList}
            renderItem={({ item }) => this.listItem(item)}
          />
        </View>

        <View style={styles.sliderAndFriends}>
          <View>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>Otrzymasz powiadomienie za {this.state.delay} godziny.</Text>
          </View>
          <Slider
            value={this.state.delay}
            step={1}
            minimumValue={1}
            maximumValue={6}
            onValueChange={value => this.setState({ delay: value })}
            style={{ marginHorizontal: 20 }}
          />
          <View style={{ alignItems: "center" }}>
            <Button
              type="clear"
              icon={<Icon
                name="check-circle"
                size={60}
                color="#7bc043"
              />} 
              onPress={() => {
                this.onSubmit();
              }}></Button>
          </View>
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
  sliderAndFriends:{
    flex: 1, 
    justifyContent: 'center',
    minHeight:100
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
