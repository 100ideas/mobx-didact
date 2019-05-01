import React, { useContext } from 'react'
import { observer } from "mobx-react-lite";
import { mobxStore } from './stores'
import './App.scss';



function App() {
  const store = useContext(mobxStore)

  // TODO make observer
  return (
    <div className="App">
      <header className="App-header">
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <h3>store:ops</h3>
      <pre className="notelist">
        { JSON.stringify(store.ops.tojs(), null, 2) }
      </pre>
      <button onClick={() => store.ops.add({name: "woot"})}>insert new op</button>
    
    </div>
  );
}

export default observer(App);
