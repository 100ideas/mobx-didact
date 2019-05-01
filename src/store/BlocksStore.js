import { computed, runInAction } from 'mobx';
// import { concat, filter, last } from 'lodash';

import Block from 'models/Block';

export default class BlocksStore {
  constructor(_rootStore) {
    this.rootStore = _rootStore
    this.model = Block;
    this.modelName = 'Block';
  }

}
