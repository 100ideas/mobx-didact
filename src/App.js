import React from 'react'
import { StoreProvider } from "./stores";
import { MockOpsList } from './components/MockOpsList'
import { CollectionViewer, mobxMockCollection1, viewModel } from './components/MockNotebook'
// import { CollectionViewer as tsCollectionViewer } from './components/TsServerTest'

import "rbx/index.css";
import './App.scss';

import { RbxPanel } from './components/RbxPlayground'

function App() {

  return (
    <StoreProvider>
      <div className="App">
        <CollectionViewer data={mobxMockCollection1}/>
        <hr />
        <CollectionViewer data={viewModel}/>
        
        
        <RbxPanel />
        <MockOpsList />

      </div>
    </StoreProvider>
  );
}

export default App;
