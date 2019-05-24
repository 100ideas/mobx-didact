import { action, computed, decorate, observable, runInAction, set, toJS } from 'mobx';
// import { concat, filter, last } from 'lodash';

import { Op } from '../models';

export default class OpsStore {
  get ops() { // getter
    return this._data.entries();
  }
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
        set(existing, item);
        return existing;
      } else {
        item = new Model(item, this);
      }
    }

    this._data.set(item.id, item);
    return item;
  }

  // tojs = () => toJS(this.data)
  // tojs = () => Array.from(this.data.values()).map( item => toJS(item))
  // tojs = () => Array.from(this.data.values()).map( item => item._tojs() )
  
  // computed
  serialize = () => {
    const opsJson = {}
    this._data.forEach( ( val, key ) => opsJson[ val.name ] = val.serialize() )
    return opsJson
  }
}

decorate(OpsStore, {
  _data: observable,
  add: action,
  // serialize: computed
})