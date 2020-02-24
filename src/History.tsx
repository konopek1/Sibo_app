import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  DeviceEventEmitter,
  FlatList,
} from 'react-native';
import Realm from 'realm';
import {
  ProductSchema,
  MealSchema,
  Product,
  Meal,
  SCHEMA_VERSION,
} from './types/Product';
import {Header} from 'react-native/Libraries/NewAppScreen';
import {RENDER_ITEMS} from './helper';

type State = {
  mealList: Meal[];
};

type Props = {
  notificationData?: any;
};

export default class Hisotry extends React.Component<Props, State> {
  private realm: Realm;
  private meal?: Meal;
  constructor(props: Props) {
    super(props);
    this.realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });
    const meals = this.realm.objects('Meal');
    this.state = {
      mealList: ([
        ...meals.sorted('date', false).filtered('isDone = false '),
      ].slice(0, 5) as unknown) as Meal[],
    };
  }

  handleResponse = (isGood: boolean, meal: Meal) => {
    this.realm.write(() => {
      meal.isDone = true;
      meal.products.forEach((id: number) => {
        const product: Product | undefined = this.realm.objectForPrimaryKey(
          'Product',
          id,
        );
        if (product) {
          const newValue = product!.bad;
          if (!isGood) product.bad = (newValue || 0) + 1;
          product.used = (product.used || 0) + 1;
        }
      });

      this.setState((prevState: State) => {
        const meals = this.realm.objects('Meal');
        return {
          mealList: ([
            ...meals.sorted('date', false).filtered('isDone = false '),
          ].slice(0, RENDER_ITEMS) as unknown) as Meal[],
        } as State;
      });
    });
  };

  listMeal = (meal: Meal) => {
    const mealText = meal.products
      .map((productId: number) => {
        const product: Product = this.realm.objectForPrimaryKey(
          'Product',
          productId,
        ) as Product;
        if (product) return product.name;
      })
      .join(', ');

    const opinionButtons: React.SFC<Meal> = (meal: Meal) => {
      if (meal.isDone) return null;
      else
        return (
          <View style={styles.opinionButtonsContainer}>
            <Button
              title="bad"
              color="red"
              onPress={() => {
                this.handleResponse(false, meal);
              }}></Button>
            <Button
              title="good"
              color="green"
              onPress={() => {
                this.handleResponse(true, meal);
              }}></Button>
          </View>
        );
    };

    return (
      <View style={styles.listElement}>
        <View style={styles.mealText}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>
            {!meal.isDone ? mealText : null}
          </Text>
        </View>
        {opinionButtons(meal)}
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Oceń sampoczucuie po ostatnich daniach :)
        </Text>
        <View style={styles.listContainer}>
          <FlatList
            data={this.state.mealList}
            renderItem={({item}) => this.listMeal(item)}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  listContainer: {
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  opinionButtonsContainer: {
    flexDirection: 'row',
  },
  listElement: {
    flexDirection: 'row',
    paddingTop: 20,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    margin: 5,
    paddingBottom: 20,
    borderBottomWidth: 2,
  },
  mealText: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
