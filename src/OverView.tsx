import React from 'react';
import { StyleSheet, Text, View, Button, DeviceEventEmitter, FlatList } from 'react-native';
import { ProductSchema, MealSchema, SCHEMA_VERSION, Product } from './types/Product';

type State = {
  productList:Product[]
}

type Props = {

}

export default class OverView extends React.Component<Props,State>{  
  
  private realm:Realm;

  constructor(props:Props){
    super(props);
    this.realm = new Realm({schema:[ProductSchema,MealSchema],schemaVersion:SCHEMA_VERSION});
    const products:Product[] = this.realm.objects('Product').filtered("used > 5").slice(0,5) as unknown as Product[];
    this.state={productList:products};
  }
  

  listProduct = (product:Product)=>{
    const usedBadPercentage = Math.floor((product.bad||0) /(product.used||1) *100);
    return (<View><Text>{product.name} {usedBadPercentage}%</Text></View>);
  }

  render(){return(
    <View style={styles.container}>
      <Text>Oceń sampoczucuie po ostatnich daniach :)</Text>
      <View style={styles.container}>
      <FlatList
      data={this.state.productList}
      renderItem={({item})=>this.listProduct(item)}
    /></View>
    </View>
  );}
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:200,
    alignContent:"center",    
  }});