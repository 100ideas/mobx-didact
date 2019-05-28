import { action, computed, decorate, observable, set, toJS } from 'mobx';
import nanoid from 'nanoid'

export class Block {
  // @observable id
  // @observable isSaving
  id
  name
  store

  constructor(fields, _store) {
    set(this, fields);
    this.store = _store;
    this.id = fields.id ? fields.id : nanoid(4)
  }

  get toJS() {
    return {
      id: toJS( this.id ),
      name: toJS( this.name )
    }
  }
  
  serialize = () => {
    let { id, name } = toJS(this)
    return ({ id, name })
  } 
}

decorate(Block, {
  id: observable,
  store: observable,
  toJS: computed,
});
