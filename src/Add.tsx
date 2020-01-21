import React, { cloneElement } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import {CheckBox, Input} from 'react-native-elements';
import { Product, ProductSchema, MealSchema } from './types/Product';

type State = {
  productList:Product[]
}

type Props = {

}



export default class Add extends React.Component<Props,State>{  

  constructor(props:Props){
    super(props);
    let realm = new Realm({schema:[ProductSchema,MealSchema],schemaVersion:3});
    const products = [...realm.objects('Product')] as unknown as Product[];
    console.log(products);
    this.state = {productList: products};
  }

  checkBoxOnPress = (item:Product)=>this.setState( (prevState:State) => {//nie efektywne przekminic jakby to inaczej zrobic ale elgancko
    return {productList: prevState.productList.map(
      (element)=>{ return (element.id === item.id ? {...element, state:!element.state} : element);}
    )} as State
  })

  //listing iems
  listItem = (item:Product) => {if(item.visible) return (
    <View>
      <CheckBox  
      title = {item.name}
      checked = {item.state || false}
      onPress = {()=>this.checkBoxOnPress(item)}
      />
      </View>); else return null;} 

  //incremental search
  search = (text:string) =>{
    this.setState((prevState:State)=>{
      return{
        productList: prevState.productList.map((element)=>{
           return(!element.name.includes(text)? {...element,visible:false} :{...element,visible:true}); 
          })
      }      
    })
  }

  render(){return(
  <View style={styles.container}>
    <View style={styles.input} >
      <Input onChangeText={(text:string)=>{this.search(text)}}></Input>
    </View>
    <FlatList
      style={styles.list}
      data={this.state.productList}
      renderItem={({item})=>this.listItem(item)}
    />
    <View style={styles.submit}>
      <Button title="Submit" onPress={()=>{}}></Button>
    </View>
  </View>
  );}

}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: 'red',
   alignSelf:'stretch'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  list: {
    flex: 4,
    flexBasis: 400,
    backgroundColor:'green'
  },
  submit: {
    height:80,
    backgroundColor:'purple'
  },
  input: {
    flex: 1
  }

})
