import { action, computed, decorate, observable, runInAction, set, toJS } from 'mobx';
// import { concat, filter, last } from 'lodash';

import { Op } from '../models';

export default class OpsStore {
  constructor(_rootStore) {
    this.rootStore = _rootStore
    this.model = Op
    this.modelName = 'Op'
    this._data = new Map()
  }

  add = (item) => {
    const Model = this.model;

    if (!(item instanceof Model)) {
      const existing = this._data.get(item.id);
      if (existing) {
        set(existing, item);  // merge new properties into exisiting Model instance
        return existing;
      } else {
        item = new Model(item, this);
      }
    }

    this._data.set(item.id, item);
    return item;
  }

  // find( ident: < id | name | searchstring >) :: [opModel]
  find( ident ) {
    // if ( id === null && name === null && arguments[ 0 ] ) {
    //   console.log(arguments[0])
    //   id = arguments[ 0 ] // accept non-object param as id
    // }
    if (this._data.has(ident)) return [ this._data.get(ident) ]

    let matches = this.values.filter( v => v.name === ident )
    if ( matches.length > 0 ) return matches 
      
    matches = this.values.filter( v => v.name.indexOf( ident ) > -1 )
    return matches
    
  }
  
  // computed
  get values() { // getter
    return Array.from(this._data.values())
  }
  // computed
  get serializedMap() {
    const opsJson = {}
    this.values.map(v => opsJson[v.name] = v.serialize());
    return opsJson
  }
  // computed
  get serializedArray() {
    return this.values.map(v => v.serialize());
  }
}

decorate(OpsStore, {
  _data: observable,
  add: action,
  values: computed,
  serializedMap: computed,
  serializedArray: computed
})