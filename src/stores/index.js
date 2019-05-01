import React, { createContext, useContext } from 'react';
import RootStore from './RootStore';

const rootStore = new RootStore();

const mockOps = [{ name: 'mock/op1' }, {name: 'mock/api/fetch'}]
mockOps.map(item => rootStore.ops.add(item))

// console.log(rootStore.ops.tojs())

export const mobxStore = createContext(rootStore);

// export const StoreProvider = ({ children }) => {
//   return (
//     <MobX.Provider value={rootStore}>
//       {children}
//     </MobX.Provider>
//   );
// };

// export const useStore = store => {
//   const { state, dispatch } = useContext(MobX);
//   return { state, dispatch };
// };

export default rootStore;