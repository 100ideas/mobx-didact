import BlocksStore   from './BlockStore'
import OpsStore      from './OpStore';

export default class RootStore {
  constructor() {
    this.blocks = new BlocksStore(this);
    this.ops = new OpsStore(this);
  }
}
