import React from 'react'

import nanoid from 'nanoid'
import { action, computed, decorate, observable, set as _set } from 'mobx';
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

  const data = props.data ? props.data : mobxMockCollection1
  
  return <Section>
    
    <Button onClick={() => data.rows.push({region: "Baztarctica", sector: "Fooing", customer: "Bazman Bazzer", product: "Foobar Baz", amount: 12333})}>
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
  
  const colNames = data.columns.map( c => c.name ? c.name : c )
  const TableHeadings = colNames.map( (c, idx) => 
    <Table.Heading key={idx + '-' + c}>
      {c}
    </Table.Heading>
  )

  const TableRows = data.recordIds.map( rid => 
  <Table.Row key={rid}>
    {data.cols.map( cid => 
      <Table.Cell key={rid + '-' + cid}>
        {data.records[rid][cid]}
        <Button onClick={() => data.update({[rid]: {[cid]: 'updafrooo'}}) }>?</Button>
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
  const firstCol = data.columns[ 0 ].name || data.columns[ 0 ]
  return <div>
    <h2>ListView</h2>
    <List>
      {data.recordIds.map( (rid, idx) =>
        <List.Item 
          key={firstCol + '-' + rid}
          onClick={() => data.update( { [rid]: { [firstCol]: 'superfoo update' } } )}
        >
          { JSON.stringify(data.records[rid][firstCol]) }
        </List.Item>
      )}
    </List>
    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
  </div>
}

const Viewers = {
  table: TableView,
  card: CardView,
  list: ListView
}


class MobxCollection {
  cols = []
  // recordIds = []
  // records = new Map();
  records = {}
  log = []

  constructor(_data) {
    // _data.rows.map( r => this.records.set( r.id ? r.id : nanoid(4), r ))
    _data.rows.map( r => {
      const _id = r.id ? r.id : nanoid(4)
      // this.records.set( _id, r )
      _set(this.records, _id, r)
      // this.recordIds.push( _id )
    })
    this.cols = _data.columns.map( c => c.name )
  }

  //computed?
  getValuesFromColumn( colId ){
    return this.recordIds.map( rid => this.records[rid][colId] )
  }
  
  getRecord( rid ){
    return this.recordIds[rid]
  }

  //action
  update( obj ){
    let maybe_rids = Object.keys(obj)
    let updates = maybe_rids.map(rid => {
      if(rid in this.records) {
        let _old = this.records[rid]
        let _new = obj[rid]
        let _merged = {..._old, ..._new}
        // obj = {[rid]: {..._old, ..._new}}
        _set(this.records, rid, _merged)
        // return _merged
        return obj
      }
      _set(this.records, obj)
      return obj  
    })
    this.log.push(updates)
  }

  get columns(){
    return this.cols
  }
  get rows(){
    return this.recordIds.map( rid => this.records[rid] )
  }
  get recordIds(){
    return Object.keys(this.records)
  }
}

decorate(MobxCollection, {
  cols: observable,
  // recordIds: observable,
  recordIds: computed,
  records: observable,
  log: observable,
  update: action,
  columns: computed,
  rows: computed
})


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

const mobxMockCollection1 = new MobxCollection(mockCollection1)