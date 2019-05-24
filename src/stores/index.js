import React from 'react';
import RootStore from './RootStore';

const rootStore = new RootStore();

const mockOps = [{ name: 'mock/op1' }, {name: 'mock/api/fetch'}]
mockOps.map(item => rootStore.ops.add(item))

// console.log(rootStore.ops.tojs())


export const storeContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
  const [store] = React.useState(rootStore);
  return (
    <storeContext.Provider value={store}>{children}</storeContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(storeContext);
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error("You have forgot to use StoreProvider, shame on you.");
  }
  return store;
};