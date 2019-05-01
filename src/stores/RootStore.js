import BlocksStore   from './BlocksStore'
import OpsStore      from './OpsStore';

export default class RootStore {
  constructor() {
    this.blocks = new BlocksStore(this);
    this.ops = new OpsStore(this);
  }
}