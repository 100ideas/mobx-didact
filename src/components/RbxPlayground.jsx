import React from 'react'
import { Button, Checkbox, Content, Control, Icon, Input, Panel } from "rbx";
import {
  faBook,
  faCodeBranch,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export const RbxPanel = () => <Panel>
  <Panel.Heading>repositories</Panel.Heading>
  <Panel.Block>
    <Control iconLeft>
      <Input size="small" type="text" placeholder="search" />
      <Icon size="small" align="left">
        <FontAwesomeIcon icon={faSearch} />
      </Icon>
    </Control>
  </Panel.Block>
  <Panel.Tab.Group>
    <Panel.Tab active>all</Panel.Tab>
    <Panel.Tab>public</Panel.Tab>
    <Panel.Tab>private</Panel.Tab>
    <Panel.Tab>sources</Panel.Tab>
    <Panel.Tab>forks</Panel.Tab>
  </Panel.Tab.Group>
  <Panel.Block as="a" active>
    <Panel.Icon>
      <FontAwesomeIcon icon={faBook} />
    </Panel.Icon>
    bulma
  </Panel.Block>
  <Panel.Block>
    <Panel.Icon>
      <FontAwesomeIcon icon={faBook} />
    </Panel.Icon>
    marksheet
  </Panel.Block>
  <Panel.Block>
    <Panel.Icon>
      <FontAwesomeIcon icon={faBook} />
    </Panel.Icon>
    minireset.css
  </Panel.Block>
  <Panel.Block>
    <Panel.Icon>
      <FontAwesomeIcon icon={faBook} />
    </Panel.Icon>
    jgthms.github.io
  </Panel.Block>
  <Panel.Block>
    <Panel.Icon>
      <FontAwesomeIcon icon={faCodeBranch} />
    </Panel.Icon>
    daniellowtw/infboard
  </Panel.Block>
  <Panel.Block>
    <Panel.Icon>
      <FontAwesomeIcon icon={faCodeBranch} />
    </Panel.Icon>
    mojs
  </Panel.Block>
  <Panel.Block as="label">
    <Checkbox />
    remember me
  </Panel.Block>
  <Panel.Block>
    <Button fullwidth color="link" outlined>
      reset all filters
    </Button>
  </Panel.Block>
</Panel>