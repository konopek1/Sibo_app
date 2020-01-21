import Realm from 'realm';

export type Product = {
    id:number
    name:string
    used?:number
    bad?:number
    state?:boolean
    visible?:boolean
 }

 const ProductSchema = {
    name: 'Product',
    primaryKey:'id',
    properties: {
      used: {type:'int', default:0},
      bad: {type:'int',default:0},
      id: 'int',
      name: 'string',
      state: 'bool?',
      visible: {type:'bool',default:true}
    }
  };

export {ProductSchema};

const MealSchema = {
    name: 'Meal',
    primaryKey:'id',
    properties: {
        products:{type:'list',objectType:'Product',default:[]},
        date: {type:'date',default: new Date()},
        id: 'int'
    }
} 
export {MealSchema};

function initLocalDB(){

Realm.open({schema: [ProductSchema],schemaVersion: 3});

let realm = new Realm({schema: [MealSchema,ProductSchema],schemaVersion:3});

realm.write(()=>{
        let a=[];
        a.push(realm.create('Product', {name: 'Jabłko',id:1}));
        a.push(realm.create('Product', {name: 'Gruszka',id:2}));
        a.push(realm.create('Product', {name: 'Banan',id:3}));
        a.push(realm.create('Product', {name: 'Pomarancza',id:4}));
        a.push(realm.create('Product', {name: 'Ryż',id:5}));
        a.push(realm.create('Product', {name: 'Cukier',id:6}));
        a.push(realm.create('Product', {name: 'Herbata',id:7}));
        a.push(realm.create('Product', {name: 'Kawa',id:8}));
        a.push(realm.create('Product', {name: 'Czosnek',id:9}));

        let meal = realm.create('Meal',{products:[...a],id:1});

        // a.forEach(element => {
        //     meal.products.push(element);   
        // });

    })
    realm.close();
}export {initLocalDB};

 
