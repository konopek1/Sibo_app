import {Product} from './types/Product';
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {countChance} from './helper';

type Props = {
  product: Product;
  index: number;
};

const ProductDisplay: React.SFC<Props> = (props: Props) => {
  const product = props.product;
  const chance = countChance(product.bad, product.used);

  return (
    <View style={containerStyle(chance)}>
      <Text style={styles.textName}>
        {props.index + 1}.{product.name}
      </Text>
      <Text style={styles.textChance}>{Math.floor(chance)}%</Text>
    </View>
  );
};

const renderColor = (chance: number) => {
  if (chance < 50) return 'green';
  else if (chance < 69) return 'black';
  else return 'red';
};

const containerStyle = (chance: number) => {
  return {
    borderColor: renderColor(chance),
    ...styles.container,
  };
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    padding: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  textName: {
    fontSize:16
  },
  textChance: {
    fontSize:16
  },
});

export default ProductDisplay;
