import Realm from 'realm';

export type Product = {
    id:number
    name:string
    used?:number
    bad?:number
    state?:boolean
    visible?:boolean
 }
export type Meal = {
  id:number,
  date:Date,
  products:number[],
  isDone:boolean
}

export const SCHEMA_VERSION = 11;

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
        products:{type:'list',objectType:'int',default:[]},
        date: {type:'date',default: new Date()},
        id: 'int',
        isDone: {type:'bool',default:false}
    }

} 
export {MealSchema};

export function initLocalDB(){
const realm = Realm.open({schema: [ProductSchema,MealSchema],schemaVersion: SCHEMA_VERSION});
}

 
