import React from 'react'

import nanoid from 'nanoid'
import { 
  autorun, 
  action,
  computed,
  decorate,
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
  // console.log(data)
  
  return <Section>
    
    <Button onClick={() => data.update( mockNewRow )}>
      addRow
    </Button>
    <Butns clickHandler={ setViewMode } />

    {/* { Viewers[ viewMode ]( { data } ) } */}
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
    </Table.Heading>
  )

  const TableRows = data.recordIds.map( rid => 
  <Table.Row key={rid}>
    {data.cols.map( cid => {
      console.log(rid + '-' + cid)
      return <Table.Cell key={rid + '-' + cid}>
        {data.getRecord(rid)[cid]}
        <Button onClick={() => data.update({[rid]: {[cid]: 'updafrooo'}}) }>?</Button>
      </Table.Cell>
    }
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
    _cols: {},
    // records: new Map(),
    records: {
      vals: {},
      _meta: { 
        rids: [],
        cols: []
      }
    },
    log: [],
    update(obj) {
      let maybe_rids = Object.keys(obj)
      let updates = maybe_rids.map(rid => {
        if(cxn.records._meta.rids.indexOf(rid) > -1) {
          let _old = cxn.records.vals[rid]
          let _new = obj[rid]
          let _merged = {..._old, ..._new}
          // obj = {[rid]: {..._old, ..._new}}
          _set(cxn.records.vals, rid, _merged)
          // // return _merged
          // cxn.records.merge(obj)
          return obj
        }
        _set(cxn.records.vals, rid, obj[rid])
        cxn.records._meta.rids.push(rid)
        return obj  
      })
      cxn.log.push(updates)
    },
    getCol(colId){ return Array.from(cxn.records.values()).map( row => row[colId] ) },

    getRecord(rid){ return rid in cxn.records.vals ? toJS(cxn.records.vals[rid]) : {} },
    
    get rows() {
      return cxn.recordIds.map( id => toJS(cxn.records[id]) )
    },
    get recordIds() {
      // console.dir(toJS(cxn.records))
      // return cxn.records.model 
      //   ? Object.keys(cxn.records).filter(key => key !== '_meta')
      //   : Object.keys(cxn.records).filter(key => key !== '_meta')
      return cxn.records._meta.rids
    },
    get cols() {
      return cxn.records._meta.cols
    },
    // set cols(col) {
    //   cxn.records._meta.cols.push(col)
    // }
  }, {
    records: observable,
    update: action,
    // _cols: computed
  })

  // pseudo-constructor
  if ( isObservable(data) ) {
    console.dir("pseudo-constructor", data.records._meta)
    // cxn._cols = createViewModel(data._cols)
    cxn.records = createViewModel(data.records)
  } else {  
    data.rows.map( r => {
      const _id = r.id ? r.id : nanoid(4)
      _set(cxn.records.vals, _id, r )
      cxn.records._meta.rids.push(_id)
    })
    // data.columns.map( c => c.name ? c.name : c ).map( (c, idx) => _set(cxn._cols, idx, c) )
    // cxn.records._meta = {cols: []}
    cxn.records._meta.cols = data.columns.map( c => c.name ? c.name : c )
    console.log("tried setting records._meta", cxn.records._meta)
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

const mockNewRow = { 'rid11': {region: "Baztarctica", sector: "Fooing", customer: "Bazman Bazzer", product: "Foobar Baz", amount: 12333}}

// export const mobxMockCollection1 = new MobxCollection(mockCollection1)
// export const mobxMockCollection2 = new MobxCollection(mobxMockCollection1)

export const mobxMockCollection1 = MobxCxnFactory(mockCollection1)

// const viewModel = createViewModel(mobxMockCollection1);
// viewModel.records = createViewModel(mobxMockCollection1.records)
// export const viewModel = mobxMockCollection1;
const viewModel = MobxCxnFactory(mobxMockCollection1)

console.log("mobxCxn cols:", mobxMockCollection1.cols)

console.log(getAllMethodsAndProperties(viewModel))
autorun(() => {
  // console.log(toJS(viewModel.model.records), ",", toJS(viewModel.records))
  console.log(viewModel.changedValues)
})

viewModel.records['ridfoo'] = {country: "bazerzstan"}
// _set(viewModel.records, 'rid12', mockNewRow['rid11'] )
// viewModel['new'] = {foo: 'foo'}

export {viewModel}







// class MobxCollection {
//   cols = []
//   records = new Map();
//   log = []

//   constructor(_data) {
//     // _data.rows.map( r => this.records.set( r.id ? r.id : nanoid(4), r ))
//     // if (isObservable(_data)) {
//     //   this.records = _data.records
//     //   this.cols = _data.cols
//     // } else {
//       _data.rows.map( r => {
//         const _id = r.id ? r.id : nanoid(4)
//         this.records.set( _id, r )
//         // _set(this.records, _id, r)
//         // this.recordIds.push( _id )
//       })
//       this.cols = _data.columns.map( c => c.name ? c.name : c )
//     // }
//   }

//   //action
//   update(obj) {
//     let maybe_rids = Object.keys(obj)
//     let updates = maybe_rids.map(rid => {
//       if(this.records.has(rid)) {
//         // let _old = this.records[rid]
//         // let _new = obj[rid]
//         // let _merged = {..._old, ..._new}
//         // // obj = {[rid]: {..._old, ..._new}}
//         // _set(this.records, rid, _merged)
//         // // return _merged
//         this.records.merge(obj)
//         return obj
//       }
//       this.records.set(rid, obj[rid])
//       return obj  
//     })
//     this.log.push(updates)
//   };

//   //computed?
//   getCol = colId => Array.from(this.records.values()).map( row => row[colId] )
  
//   getRecord = rid => toJS(this.records.get(rid))

//   // get columns(){
//   //   return this.cols
//   // }
//   get rows () {
//     return [...this.records.values()].map( v => toJS(v))
//   }
//   get recordIds() {
//     return [...this.records.keys()]
//   }
// }

// decorate(MobxCollection, {
//   cols: observable,
//   // recordIds: observable,
//   records: observable,
//   log: observable,
//   update: action,
//   // getCol: computed,
//   // getRecord: computed,
//   rows: computed,
//   recordIds: computed,
//   // columns: computed,
// })