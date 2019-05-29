import React from 'react'

import nanoid from 'nanoid'
import { 
  autorun, 
  action,
  computed,
  decorate,
  observe,
  observable,
  isObservable,
  toJS,
  set as _set } from 'mobx';
import { createViewModel, getAllMethodsAndProperties } from 'mobx-utils'
import { observer, Observer } from "mobx-react-lite";


// import { Button, Checkbox, Content, Control, Icon, Input, Panel } from "rbx";
import { Button, Icon, List, Section, Table } from "rbx";
import {
  faList,
  faTable,
  faIdCard,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Butns = ({ clickHandler }) =>
  <Button.Group hasAddons>
    <Button onClick={ () => clickHandler('table')} >
    <Icon size="small">
      <FontAwesomeIcon icon={faTable} />
    </Icon>
    <span>Table</span>
  </Button>
  <Button onClick={ () => clickHandler('card')} >
    <Icon size="small">
      <FontAwesomeIcon icon={faIdCard} />
    </Icon>
    <span>Card</span>
  </Button>
  <Button onClick={ () => clickHandler('list')} >
    <Icon size="small">
      <FontAwesomeIcon icon={faList} />
    </Icon>
    <span>List</span>
  </Button>
</Button.Group>


export function _CollectionViewer( props ){
  const [viewMode, setViewMode] = React.useState('table')

  // const data = props.data ? props.data : mobxMockCollection1
  const data = props.data ? props.data : {}
  console.log(data.allCols, data.hiddenCols)
  
  return <Section>
    
    <Button onClick={() => data.update( mockNewRow )}>
      addRow
    </Button>

    <Button onClick={() => data.resetAllChanges()}>
      reset ALL
    </Button>

    <Butns clickHandler={ setViewMode } />

    <Observer>
      {() => Viewers[ viewMode ]( {data} )}
    </Observer>

    <h3>log</h3>
    {data.log.map((entry, idx) => <pre key={"code-" + idx} >{JSON.stringify(entry, null, 2)}</pre>)}
    
  </Section>
}

export const CollectionViewer = observer(_CollectionViewer)

function TableView( {data} ){
  
  const TableHeadings = data.cols.map( (c, idx) => 
    <Table.Heading key={idx + '-' + c}>
      {c} 
      <Button 
        size='small' 
        color='danger' 
        rounded 
        inverted 
        onClick={ () => data.toggleCol(c) }>x</Button>
    </Table.Heading>
  )

  const TableRows = data.recordIds.map( rid => 
  <Table.Row key={rid}>
    {data.cols.map( cid => 
      <Table.Cell key={rid + '-' + cid} className={data.isDirty(rid, cid) ? 'dirty' : ''}>
        {data.records.get(rid)[cid]}
        {/* <Button onClick={() => data.update({[rid]: {[cid]: 'updafrooo'}}) }>?</Button> */}
        <Button onClick={() => data.setRecord([rid, cid, 'updafrooo']) }>?</Button>
        { data.isDirty( rid, cid )
          ? <Button small onClick={ () => data.resetLocalChange( [ rid, cid ] ) }>x</Button>
          : ''
        }
      </Table.Cell>
    )}
  </Table.Row>
)

  return <div>
    <h2>TableView</h2>
    
    <Table bordered>
      <Table.Head>
        <Table.Row>
          {TableHeadings}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {TableRows}
      </Table.Body>
    </Table>

    {/* <pre>{ JSON.stringify( data, null, 2 ) }</pre> */}

  </div>
}

function CardView( props ){

  return <div>
    <h2>CardView</h2>
    <pre>{JSON.stringify(props.data, null, 2)}</pre>
  </div>
}

function ListView( {data} ){
  const firstCol = data.cols[ 0 ]
  console.log('listview', data.recordIds, data.rows)
  return <div>
    <h2>ListView</h2>
    <List>
      {data.recordIds.map( (rid, idx) => {
        console.log(rid, data.getRecord(rid))
        return <List.Item 
          key={firstCol + '-' + rid}
          // TODO use reaction in collection to set log and use direct prop assignment here
          onClick={() => data.update( { [rid]: { [firstCol]: 'superfoo update' } } )}
        >
          { JSON.stringify(data.getRecord(rid)[firstCol]) }
        </List.Item>
      })}
    </List>
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  </div>
}

const Viewers = {
  table: TableView,
  card: CardView,
  list: ListView
}


function MobxCxnFactory(data) {
  const cxn = observable({
    _meta: {toggledCols: [] },
    cols: [],
    records: new Map(),
    log: [],
    update(obj) {
      let maybe_rids = Object.keys(obj)
      let updates = maybe_rids.map(rid => {
        if(cxn.records.has(rid)) {
          let _old = cxn.records.get(rid)
          let _new = obj[rid]
          let _merge = {..._old, ..._new}
          // need to directly set via property access for mobx proxy to notice
          Object.keys(_new).map( key => {
            _old[key] = _new[key]
          })
          console.log("cxn update", toJS(cxn.records.get(rid)))
          return {op: 'set', val: obj}
        }
        cxn.records.set(rid, obj[rid])
        return obj  
      })
      cxn.log.push(updates)
    },
    getCol(colId){ return Array.from(cxn.records.values()).map( row => colId in row ? row[colId] : null ) },

    getRecord( rid, cid = null ) {
      let rec = cxn.records.has(rid) ? cxn.records.get(rid) : false
      if (!rec) return {}
      if (cid === null) return toJS( rec )
      return toJS(rec[cid])
    },

    setRecord( [rid, cid, val] ) {
      let rec = cxn.records.has(rid) ? cxn.records.get(rid) : false
      if (!rec) return {}
      if (cid in rec) {
        rec[cid] = val
        cxn.log.push([rid, cid, val])
      }
    },
    toggleCol( col ) {
      let colIdx = cxn.cols.indexOf(col)
      let _colIdx = cxn.cols.findIndex( entry => entry.toString() === col.toString() )
      console.log("cxn.cols.indexOf(col):", colIdx, toJS(cxn.cols[colIdx]) )
      console.log("cxn.cols.findIndex():", _colIdx, toJS(cxn.cols[_colIdx]) )
      if ((colIdx || _colIdx) > -1) {
        console.log("found col ", col, "in cols array, removing...")
        if (!cxn.cols.remove(col)) console.error("something went wrong removing", col, "from cols")
        cxn._meta.toggledCols.push(col)
      } else {
        _colIdx = cxn._meta.toggledCols.findIndex( entry => entry.toString() === col.toString() )
        if ( _colIdx > -1 ) {
          console.log("swapping", col, "from cxn._meta.toggledCols into cxn.cols" )
          cxn._meta.toggledCols.remove(col)
          cxn.cols.push(col)
        }
      }
    },

    get allCols() {
      let tallys = new Map()
      let tally = (cols) => {
        if (!isArray(cols)) cols = [cols]
        cols
          .filter( c => !skipCols.has(c) )
          .map( col => tallys.has(col) 
            ? tallys.set(col, tallys.get(col) + 1)
            : tallys.set(col, 0)
          )
      }
      let skipCols = new Set(['isPropertyDirty', 'localComputedValues', 'localValues', 'model']) // maybe set by mobx viewModel
      cxn.records.forEach( (value, key) => {
        // easier to get keys from model ... but probably a bad idea will get out of sync
        // if (value.model) tally( Object.keys(value.model) ) 
        tally(Object.keys(value))
      })
                 // [...[key, val]] 
      let _sorted = [...tallys.entries()].sort( (a, b) => b[1] - a[1] )
      console.log("column frequencies", _sorted)
      return _sorted.map( el => el[0] )
    },
    get hiddenCols() {
      return cxn.allCols.filter(colName => cxn.cols.indexOf(colName) < 0)
    },
    
    get rows() {
      return [...this.records.values()].map( v => toJS(v))
    },
    get recordIds() {
      return [...this.records.keys()]
    },
    isDirty(rid, cid) {
      let rec = cxn.records.has(rid) ? cxn.records.get(rid) : false
      if (!rec || !rec.model) return false
      if (rec.isPropertyDirty) {
        let dirty = rec.isPropertyDirty(cid)
        return dirty
      }
      return false // just to be sure
    },
    resetLocalChange([rid, cid]) {
      let rec = cxn.records.has(rid) ? cxn.records.get(rid) : false
      // guard against non-viewModel-enhanced records
      if (!rec && !rec.model && !rec.cid) return {}
      return rec.resetProperty(cid)
    },
    resetAllChanges() {
      cxn.records.forEach( (value, key) => {
        if (value.model) value.reset()
      })
    }
  }, {
  records: observable,
  resetLocalChange: action,
  resetAllChanges: action,
  update: action,
  setRecord: action,
  toggleCol: action,
  rows: computed,
  recordIds: computed,
  allCols: computed,
//   // columns: computed,
  })

  // pseudo-constructor
  if ( isObservable(data) ) {
    console.dir("pseudo-constructor", toJS(data.records))
    data.records.forEach( (value, key) => {
      cxn.records.set(key, createViewModel(value))
    })
    // hande additions from upstream
    observe(data.records, (change) => {
      console.log('pseudoConstructor observe data.records.keys,', toJS(change))
      cxn.records.set(change.name, createViewModel(data.records.get(change.name)))
    })
    // TODO handle deletions from upstream - remove viewModel from local?
    // ...

    // TODO need to make cols a viewModel as well
    cxn.cols = toJS(data.cols)
  } else {  
    data.rows.map( r => {
      const _id = r.id ? r.id : nanoid(4)
      cxn.records.set(_id, r)
    })
    cxn.cols = data.columns.map( c => c.name ? c.name : c )
  }

  return cxn
}



export const mockCollection1 = {
  columns: [
    { name: 'region', title: 'Region' },
    { name: 'sector', title: 'Sector' },
    { name: 'customer', title: 'Customer' },
    { name: 'product', title: 'Product' },
    { name: 'amount', title: 'Sale Amount' },
  ],
  rows: [
    {region: "South America", sector: "Banking", customer: "Beacon Systems", product: "EnviroCare Max", amount: 10294},
    {region: "North America", sector: "Health", customer: "Global Services", product: "EnviroCare", amount: 2895},
    {region: "North America", sector: "Health", customer: "Supply Warehouse", product: "EnviroCare Max", amount: 3503},
    {region: "Australia", sector: "Banking", customer: "Apollo Inc", product: "SolarOne", amount: 1379},
    {region: "Europe", sector: "Health", customer: "Beacon Systems", product: "SolarOne", amount: 2867},
    {region: "South America", sector: "Banking", customer: "Discovery Systems", product: "EnviroCare", amount: 3365},
    {region: "North America", sector: "Health", customer: "Renewable Supplies", product: "EnviroCare", amount: 6932},
    {region: "Europe", sector: "Telecom", customer: "Building M Inc", product: "EnviroCare", amount: 1135 },
  ],
};

const mockNewRow = { 'rid11': {region: "Baztarctica", sector: "Fooing", customer: "Bazman Bazzer", product: "Foobar Baz", amount: 1337, "my_FAV_ROW": 'nullo'}}

// thanks, @Christoph https://stackoverflow.com/a/1058753
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

export const mobxMockCollection1 = MobxCxnFactory(mockCollection1)
export const viewModel = MobxCxnFactory(mobxMockCollection1);

console.log(getAllMethodsAndProperties(viewModel))
autorun(() => {
  console.log(viewModel.changedValues)
})

viewModel.cols.push( 'rid12' )
// viewModel.cols[5] = 'rid08'
// _set(viewModel.records, 'rid12', mockNewRow['rid11'] )