import React from 'react'
import { observer } from "mobx-react-lite";
import { useStore } from "../stores";


export const MockOpsList = observer(() => {
  const store = useStore();

  return (
    <main>
      
      <header className="App-header">
        <p>
          list of ops in OpsStore 
        </p>
      </header>

      <h3>store:ops</h3>
      
      <p className="notelist">ops: searched for 'o'</p>
      
      <pre className="notelist">
        { JSON.stringify(store.ops.find( 'o' ).map(o => o.toJS), null, 2) }
        {/* {JSON.stringify( store.ops.data.filter( v => v.name.indexOf('api') > -1 ) )} */}
        { JSON.stringify(store.ops.find( '@csv/1' ).map(o => o.toJS), null, 2) }
      </pre>

      <p className="notelist">all ops: -=-=-=-=-=-=-=-</p>
      
      <pre className="notelist">
        { JSON.stringify( store.ops.serializedMap, null, 2 ) }
        {/* { JSON.stringify( store.ops, null, 2 ) } */}
      </pre>

      <button onClick={ () => store.ops.add( { name: "woot" } ) }>insert new op</button>
    
    </main>
  )
})