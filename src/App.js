import React from 'react'
import { StoreProvider } from "./stores";
import { MockOpsList } from './components/MockOpsList'
import { CollectionViewer } from './components/MockNotebook'

import "rbx/index.css";
import './App.scss';

import { RbxPanel } from './components/RbxPlayground'

function App() {

  return (
    <StoreProvider>
      <div className="App">
        <CollectionViewer />
        
        {/*
        <RbxPanel />
        <MockOpsList />
        */}

      </div>
    </StoreProvider>
  );
}

export default App;
