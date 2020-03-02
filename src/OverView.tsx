import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  DeviceEventEmitter,
  FlatList,
} from 'react-native';
import {
  ProductSchema,
  MealSchema,
  SCHEMA_VERSION,
  Product,
} from './types/Product';
import ProductDisplay from './ProductDisplay';
import {countChance, sortChances, RENDER_ITEMS} from './helper';

type State = {
  productList: Product[];
};

type Props = {};

export default class OverView extends React.Component<Props, State> {
  private realm: Realm;

  constructor(props: Props) {
    super(props);
    this.realm = new Realm({
      schema: [ProductSchema, MealSchema],
      schemaVersion: SCHEMA_VERSION,
    });
    let products: Product[] = (this.realm
      .objects('Product')
      .filtered('used > 5')
      .slice(0, RENDER_ITEMS) as unknown) as Product[];
    products = products.sort(sortChances);
    this.state = {productList: products};
  }

  listProduct = (product: Product, index: number) => {
    return (
      <View>
        <ProductDisplay product={product} index={index}></ProductDisplay>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Ranking nietolerancji</Text>
        <View style={styles.container}>
          <FlatList
            data={this.state.productList}
            renderItem={({item, index}) => this.listProduct(item, index)}
            keyExtractor={(item) => {return item.name}}
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
  headerText: {
    fontSize: 20,
    alignSelf: 'center',
  },
});
