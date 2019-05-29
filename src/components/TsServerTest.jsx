import React from 'react'

// import nanoid from 'nanoid'
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
import { Button, Icon, Control, Tag, Field, Heading, Table, Level, Delete } from "rbx";
// import { Button, Control, Delete, Heading, Icon, Field, Level, List, Section, Table, Tag, Title } from "rbx";
import {
  faList,
  faTable,
  faIdCard,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const Button1 = (children) => {
//   let x = 1
//   return <div>{ children }</div>
// }

const Butns = ({ clickHandler }) =>
  <Button.Group hasAddons>
    <Button onClick={ () => clickHandler('table')} >
    <Icon size="small">
      
    </Icon>
    <span>Table</span>
  </Button>
  <Button onClick={ () => clickHandler('card')} >
    <Icon size="small">
      
    </Icon>
    <span>Card</span>
  </Button>
  <Button onClick={ () => clickHandler('list')} >
    <Icon size="small">
      
    </Icon>
    <span>List</span>
  </Button>
</Button.Group>

export function _CollectionViewer( props ){
  const [viewMode, setViewMode] = React.useState('table')

  // const data = props.data ? props.data : mobxMockCollection1
  const data = props.data ? props.data : {}
  console.log(data.colInfo,)
  
  return <Section>
    
    <Button onClick={() => data.update( {1: 1} )}>
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

  const ColumnTags = () => {

    const MakeTagGroup = ( {name, freq, hidden} ) => 
      <Control>
        <Tag.Group gapless onClick={() => data.toggleCol(name)}>
          <Tag color={hidden ? "light" : "dark"}>{name}</Tag>
          <Tag color="info">{freq}</Tag>
        </Tag.Group>
      </Control>

    return (
      <>
        <Heading>available columns</Heading>
        <Field kind="group" multiline>
          {data.colInfo.stats.map( info => MakeTagGroup(info) )}
        </Field>
      </>
    )
  }
  
  const TableHeadings = data.cols.map( (c, idx) => 
    <Table.Heading key={idx + '-' + c}>
      <Level>
        <Level.Item>{c}</Level.Item>
        <Level.Item> 
          <Delete 
            size='small' 
            color='danger' 
            rounded 
            inverted 
            onClick={ () => data.toggleCol( c ) }>
            x
          </Delete>
        </Level.Item>
      </Level>
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
    <Heading>TableView</Heading>
    
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

    <ColumnTags />

    {/* <pre>{ JSON.stringify( data, null, 2 ) }</pre> */}

  </div>
}