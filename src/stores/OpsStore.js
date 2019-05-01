import { action, computed, decorate, observable, runInAction, set, toJS } from 'mobx';
// import { concat, filter, last } from 'lodash';

import { Op } from '../models';

export default class OpsStore {
  data = new Map();

  constructor(_rootStore) {
    this.rootStore = _rootStore
    this.model = Op
    this.modelName = 'Op'
  }

  add = (item) => {
    const Model = this.model;

    if (!(item instanceof Model)) {
      const existing = this.data.get(item.id);
      if (existing) {
        set(existing, item);
        return existing;
      } else {
        item = new Model(item, this);
      }
    }

    this.data.set(item.id, item);
    return item;
  }

  // tojs = () => toJS(this.data)
  // tojs = () => Array.from(this.data.values()).map( item => toJS(item))
  tojs = () => Array.from(this.data.values()).map( item => item._tojs() )
  
}

decorate(OpsStore, {
  data: observable,
  add: action,
  // tojs: computed
})