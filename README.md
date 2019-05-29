I'm working on a block-based document editor intended to facilitate capturing structured data (in the form of files, api responses, or csv-like text) in parallel with narrative content. The notebook will use both to anticipate or hint at the likely shape, storage, validation, and naming defaults for notebook data based on the contents and topology of nearby blocks.

One of the overarching design requirements is that the notebook should be ambivalent about the order in which data and narrative blocks are organized into workflows - a user can create narrative blocks and placeholders data "templates" blocks for data that may or may not be added and processed later, or they can begin in a traditional spreadsheet interface and optionally annotate their workflow with narrative content as desired.

--- 

Documents are composed from blocks that contain content.

Collection blocks define a table (or dataframe) structure. Columns are defined with json-schema, and rows as lists of references to data blocks. Rows express joins between data blocks. Columns independantly capture the shape of the table separate from instance of values. In the UI new collections can be defined row-first (i.e. direct entry or autosuggest; value first) or column-first (i.e. empty table but w/ validation & names; schema first)