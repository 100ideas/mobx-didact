import { computed, runInAction } from 'mobx';
// import { concat, filter, last } from 'lodash';

import Op from 'models/Op';

export default class OpStore {
  constructor(_rootStore) {
    this.rootStore = _rootStore
    this.model = Op;
    this.modelName = 'Op';
  }
  
}
