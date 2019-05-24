import React from 'react'
import { observer } from "mobx-react-lite";
import { StoreProvider, useStore } from "./stores";
import './App.scss';


const Landing = observer(() => {
  const store = useStore();

  return (
    <main>
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
        { JSON.stringify( store.ops.serialize(), null, 2 ) }
      </pre>
      <button onClick={ () => store.ops.add( { name: "woot" } ) }>insert new op</button>
    </main>
  )
})


function App() {

  return (
    <StoreProvider>
      <div className="App">

      <Landing />

      </div>
    </StoreProvider>
  );
}

export default App;
    