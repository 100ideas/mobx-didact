

## Apr 19

### autosuggest & graph tools
- use graph structure to represent Type -> Action -> Type graph for autosuggest
  - https://github.com/dagrejs/graphlib/wiki/API-Reference
- useTrie hook provides simple word search
  - https://github.com/cshooks/hooks/tree/master/packages/useTrie
  - also check out https://github.com/cshooks/hooks/tree/master/packages/useHeap
- best probably to use lunr.js
- also see
  - http://docs.thi.ng/umbrella/dgraph/ Type-agnostic directed acyclic graph (DAG), using @thi.ng/associative maps & sets as backend.
  - http://docs.thi.ng/umbrella/defmulti/ **defmulti returns a new multi-dispatch function using the provided dispatcher function. The dispatcher acts as a mapping function**
  - https://github.com/thi-ng/umbrella/tree/master/packages/rstream-graph - A dataflow graph spec is a plain object where keys are node names and their values are NodeSpecs, defining a node's inputs, outputs and the operation to be applied to produce one or more result streams.

### execution engine
- **exciting** graphql-clientside-react-hooks! 
  - https://github.com/DanielMSchmidt/reactive-graphql-react
  - https://github.com/mesosphere/reactive-graphql
- execution engine - check out animation libs, orchestrators
  - https://github.com/drcmda/react-three-fiber/blob/master/src/reconciler.js#L48
  - https://github.com/juliangarnier/anime/blob/master/src/index.js#L917
- https://github.com/datavis-tech/topologica - A library for reactive programming. Weighs 1KB minified. This library provides an abstraction for reactive data flows. This means you can declaratively specify a dependency graph, and the library will take care of executing only the required functions to propagate changes through the graph in the correct order.
  - notes: "Mobx Very similar library, with React bindings and more API surface", "inspired by observablehq"
  - see this article: https://codeburst.io/state-management-in-javascript-15d0d98837e1
- observablehq runtime: https://github.com/observablehq/runtime
  - https://github.com/observablehq/runtime/blob/master/src/runtime.js#L72
  - https://observablehq.com/@observablehq/how-observable-runs
- observablehq CLI https://github.com/szymonkaliski/editable-cli
- reverse engineered observablehq notebook https://github.com/Guitlle/observable-nbdapp
- observablehq clone https://github.com/darrylyeo/fluorine-notebook
- https://github.com/coreybutler/shortbus

- blocks dataflow js clientside engine, https://github.com/Gregwar/blocks.js#blocks
- mobius modeller angular dataflow 
  - https://mobius.design-automation.net/editor
  - https://github.com/design-automation/mobius/blob/master/examples/Workflow-1.json
  - https://github.com/design-automation/mobius-parametric-modeller/tree/master/src/app/views
  - https://mobius-book.design-automation.net/contents/chapter3/3.5.syntax.html
  - https://design-automation.github.io/mobius-geospatial/viewer/beijing-buslines.mob
- https://github.com/fibo/dflow/tree/master/src  


```ts static
// https://github.com/design-automation/mobius-parametric-modeller/blob/master/src/app/shared/services/data.service.ts#L270
getExecutableNodes() {
    const checkList = new Set([0]);
    this._modifiedNodeSet.forEach(nodeID => {
        this.recursiveDownstreamNodeCheck(nodeID, checkList);
    });
    return checkList;
}

private recursiveDownstreamNodeCheck(nodeID: string, checkList: Set<number>) {
    for (let i = 0; i < this.flowchart.nodes.length; i++) {
        const node = this.flowchart.nodes[i];
        if (!node.enabled) { continue; }
        if (node.id === nodeID) {
            checkList.add(i);
            if (node.output.edges) {
                node.output.edges.forEach((edge: IEdge) => {
                    this.recursiveDownstreamNodeCheck(edge.target.parentNode.id, checkList);
                });
            }
            return;
        }
    }
}

////////////////////////////////////////////////
// https://github.com/design-automation/mobius-parametric-modeller/blob/master/src/app/shared/models/node/node.utils.ts#L11
  static getNewNode(): INode {
      const node: INode = <INode>{
          name: 'Node',
          id: IdGenerator.getNodeID(),
          position: {x: 0, y: 0},
          enabled: false,
          type: '',
          procedure: [{type: 13, ID: '',
              parent: undefined,
              meta: {name: '', module: ''},
              variable: undefined,
              children: undefined,
              argCount: 0,
              args: [],
              print: false,
              enabled: true,
              selected: false,
              selectGeom: false,
              hasError: false}],
          state: {
              procedure: [],
              input_port: undefined,
              output_port: undefined
          },
          input: PortUtils.getNewInput(),
          output: PortUtils.getNewOutput()
      };
      node.input.parentNode = node;
      node.output.parentNode = node;

      return node;
  }    

```


### markdown & de/serializtion
- markdown
  - maid task runner https://github.com/egoist/maid/blob/master/lib/parseMarkdown.js#L104
  - 

### frontend components
- grommet.io diagram - demo of grommet diagram + rbx tiles
  - https://codesandbox.io/s/818nmzp7z0
  - img
- flowpoints
  - https://mariusbrataas.github.io/flowpoints/?p=demo
  - https://github.com/mariusbrataas/flowpoints
- editor
  - Wysiwyg editor components built using ReactJS and Prosemirror. https://github.com/jpuri/Nib
  - mdx + rbx https://github.com/100ideas/mdx-live-editor
- rbx + react-datasheet w/ custom cell validation
  - https://frontarm.com/demoboard/?id=3260abd2-45e5-4008-9251-a09e0a463735

https://github.com/juliangarnier/anime/blob/master/src/index.js#L917

---


- hmmmm
- sketch of structure and api for plugins
  - what is the process for finding compatible actions from plugins?


modules have json-schema that describes available methods AKA actions.

this schema defines the interface type definitions and validation rules for each action.

alternatively, there is a common `ActionManager` class that initializes the methods, compiles json-schema definitions the methods themselves may define in a single object, and registers each method with the document.
- trying to avoid separating function parameter & output definitions in json-schema from function declarations in different src files.

But maybe it makes sense to centralize the schema definitions in main module file. like `type.d.ts` definitions.

lets say for we have `files` module. so the module entry point is `index.js`. it:
- loads `files.schema.json`
- imports methods
  - as defined at runtime in `files.schema.json`?
- constructs `GetCompatibleActions` type checker function.
  - takes object with 'from' and 'samples' keys. 

```js static
// example
let propTypes = {
  from: enum( 'objects', 'values' ),
  data: []
}

propTypes.examples = {
  // implies using inspecting schema paths to determine compatability
  objectExample: {
    from: 'objects',
    samples: [
      {'isbn_10': '0262011530'},
      { isbn_10: '047157175X' }
    ]
  },
  // implies using ducktyping w/ schema validation rules 
  valueExample: {
    from: 'values',
    samples: [
      '0262011530',
      '047157175X'
    ]
  }  
}

// maybe from would be better expressed as enum('schema', 'ducktype')
function GetCompatibleActions({ from, samples }) {
  // ...
  
  // location in array maps to input samples
  let mockResult = [
    'path/or/ref to method name',
    ['/ops/apigetter/fetchBook', '/ops/logger/log']
  ]

  return mockResult
}
```

Not sure how to deal with globbing multiple inputs... maybe something like
- for each method
  - for each sample  
    - if method accepts sample
      - put sample in temprorary 'accepts' array
      - check if method accepts array
- result: array  

---
