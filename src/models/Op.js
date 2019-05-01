import { action, computed, decorate, observable, set, toJS } from 'mobx';
import nanoid from 'nanoid'

export class Op {
  // @observable id
  // @observable isSaving
  id
  isSaving
  name
  store

  constructor(fields, _store) {
    set(this, fields);
    this.store = _store;
    this.id = nanoid(4)
  }

  // save = async params => {
  //   this.isSaving = true;

  //   try {
  //     // ensure that the id is passed if the document has one
  //     if (params) params = { ...params, id: this.id };
  //     const model = await this.store.save(params || this.toJS());

  //     // if saving is successful set the new values on the model itself
  //     set(this, { ...params, ...model });
  //     return model;
  //   } finally {
  //     this.isSaving = false;
  //   }
  // };

  // fetch = (options: *) => {
  //   return this.store.fetch(this.id, options);
  // };

  // refresh = () => {
  //   return this.fetch({ force: true });
  // };

  // delete = async () => {
  //   this.isSaving = true;
  //   try {
  //     return await this.store.delete(this);
  //   } finally {
  //     this.isSaving = false;
  //   }
  // };

  toJS = () => {
    return { ...this };
  };
  _tojs = () => ({
    id: toJS(this.id),
    name: toJS(this.name)
  })
  // _tojs = () => ({ id, name } = toJS(this))
}

decorate(Op, {
  id: observable,
  isSaving: observable,
  store: observable,
  // toJS: computed,
});
