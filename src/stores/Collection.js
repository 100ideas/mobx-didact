import { action, computed, decorate, observable, set, runInAction } from 'mobx';
// import { concat, filter, last } from 'lodash';

import { Block } from '../models';

export default class Collection {
  data = new Map();

  constructor(_rootStore) {
    this.rootStore = _rootStore
    this.model = Block;
    this.modelName = 'Collection';
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

}

decorate(Collection, {
  data: observable,
  add: action
})