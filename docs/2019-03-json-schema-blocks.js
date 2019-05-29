// json-schema, block schema, collection schema...
// WIP
export const state = {
  currentPage   : 'home',
  showStateJson : false,

  blocks: {

    ///////////////////////// v5 /////////////////////////////////
    // more normalized
    
    block3_v5 : {
      id        : 'block3',
      op        : 'ops/apigetter/openLibrary/fetchMeta',
      text      : 'isbn -> book metadata from openlibrary.org API ',
      opReady   : true,
      opRunning : false,
      opDone    : true,
      opAutorun : false,
      consumes  : [ "isbn_10", "api_config" ],      // [ @id ] of definitions 
      produces  : [ "book_meta", "api_response" ],   // convention: look in local definitions{}, then doc
      collections: {  
        inputs:  {}, // consumes + defs imply 2 collections: "isbn_10", "api_config"
        outputs: {}, // initCollections(...produces); // serialize whatever overrides defaults
      },
      '@db'     : { _cuid11 : { isbn_10: '0262011530' } },
      '@definitions': {}
    },

    /** collections could be idempotent?
     * i.e. inputs & outputs are each a <collection> containing two <collection>s in this case,
     * 
     * `collections.inputs <collection>: { isbn_10: <collection> {}, api_config: <collection> {} }`
     *  or 
     * `consumes[in1, in2]` and `produces[out1, out2]` `imply inputs.*.rows [<rowid>] => outputs.*.rowid [<rowid>]`
     *  or 
     *  [`inputs.isbn_10[ rowid[n] ]`, inputs.api_config[rowid2[0]] 
     *
     * ```js
     * let inputArr = consumes.map( c => collections.inputs[c].rows )
     *     .reduce( (acc, v) => [Object.keys(v).map( o => v[o] ), ...acc], [])
     * ```
     * inputArrLooksLike --> [
     *  [ {api_key: "NO KEY NEEDED"} ]
     *  [ { isbns: '_cuid11' }, { isbns: '_cuid12' }, { isbns: '_cuid13' }, { isbns: '_cuid14' } ] 
     * ]  
     * 
     * so `inputs._rows` can be computed as something like 
    *
     * ```js
     *   let distribute = _rows =>  _rows.reduce( (acc, v) =>  v.map( o => [o, ...acc] ))
     *   inputs._rows = distribute(inputs._rows)
     *   outputs._rows ~= runOp('op', (  )
     * ```
     * inputs._rows --> [
     *    [ { isbns: '_cuid11' }, {api_key: "NO KEY NEEDED"} ],
     *    [ { isbns: '_cuid12' }, {api_key: "NO KEY NEEDED"} ],
     * ]
     * 
     * outputs._rows --> [
     *    [ { isbns: '_cuid11' }, {api_key: "NO KEY NEEDED"}, {book_meta: {...} }, {api_response: {...} } ],
     * ]
     * 
     * or even
     * outputs._rows --> [
     *    [ '_cuid11', "NO KEY NEEDED", _cuid31, _cuid41 ],
     *    [ '_cuid12', "NO KEY NEEDED", _cuid32, _cuid42 ],
     * ]
     * 
     *  
     */ 

    
    ///////////////////////// v4 /////////////////////////////////
    // normalized
    block3_v4 : {
      id        : 'block3',
      op        : 'ops/apigetter/openLibrary/fetchMeta',
      text      : 'isbn -> book metadata from openlibrary.org API ',
      opReady   : true,
      opRunning : false,
      opDone    : true,
      opAutorun : false,
      consumes  : {
        isbns      : {
          data       : [ '_cuid11', '_cuid12', '_cuid13', '_cuid14' ],
          collection : {/*...*/},
          definition : {/*...*/}
        },
        api_config : {
          data       : [ '_cuid21' ],
          collection : {/*...*/},
          definition : {/*...*/}
        }
      },
      produces  : {
        book_meta    : {
          data       : [ '_cuid31', '_cuid32', '_cuid33', '_cuid34' ],
          collection : {/*...*/},
          definition : {/*...*/}
        },
        api_response : {
          data       : [ '_cuid41', '_cuid42', '_cuid43', '_cuid44' ],
          collection : {/*...*/},
          definition : {/*...*/}
        }
      },
      '@db'     : {
        _cuid11 : { isbn_10: '0262011530' }
        //...
      }
    },

    ///////////////////////// v3 /////////////////////////////////
    // top level keys, more denormalized
    block3_v3 : {
      id          : 'block3',
      op          : 'ops/apigetter/openLibrary/fetchMeta',
      text        : 'isbn -> book metadata from openlibrary.org API ',
      opReady     : true,
      opRunning   : false,
      opDone      : true,
      opAutorun   : false,
      consumes    : { isbns: '#/definitions/isbn_10', api_config: '@/ops/apigetter/api_config' },
      produces    : { book_meta: '#/definitions/book_meta', api_response: '#/definitions/api_response' },
      data        : {
        isbns        : [ '_cuid11', '_cuid12', '_cuid13', '_cuid14' ],
        api_config   : [ '_cuid21' ],
        book_meta    : [ '_cuid31', '_cuid32', '_cuid33', '_cuid34' ],
        api_response : [ '_cuid41', '_cuid42', '_cuid43', '_cuid44' ]
      },
      collections : {
        isbns     : {},
        book_meta : {}
      },
      definitions : {
        isbn_10      : {},
        api_config   : {},
        book_meta    : {},
        api_response : {}
      },
      '@db'       : {
        _cuid11 : { isbn_10: '0262011530' }
        //...
      }
    },

    ///////////////////////// v2 /////////////////////////////////
    block3_v2 : {
      id           : 'block3',
      op           : 'API/openLibrary/fetchMeta',
      text         : 'isbn -> book metadata from openlibrary.org API ',
      opReady      : true,
      opRunning    : false,
      opDone       : true,
      opAutorun    : false,

      // io schema metadata - references or direct value
      // consumes: [{ "isbns": '#/definitions/isbn_10' }],
      consumes     : [ 'isbn_10', 'api_key' ],
      produces     : [ 'book_meta', 'api_response' ],

      // inputs & outputs
      // ----------------
      // consumes[key] is ref to definition
      // inputs[key] is ref to data sources

      collections1 : {
        inline : {
          // same datastructure as db; for user input in block
          isbns : {
            _cuid1  : 'ALTERED!', // overrides value of inputs/isbns/_cuid1
            _cuid22 : '0894261150' // new
          }
        }
      },

      collections  : {
        isbns     : {
          name         : 'isbns',
          presentation : [ 'list' ],
          group        : 'inputs',
          definitions  : { isbns_10: {} },
          columnOrder  : [ 'isbns' ],
          rowOrder     : [],
          rows         : {
            _rid1 : {
              isbn_10 : '0011011107',
              author  : 'Isaac Asimov',
              title   : 'I, Robot',
              _meta   : {
                definition  : 'isbns_10',
                cuid        : '123asdk123',
                derivedFrom : '@/blocks/block1/outputs/isbns/_rid2'
              }
            }
          }
        },
        book_meta : {
          name         : 'book metadata',
          presentation : [ 'table' ],
          group        : 'outputs',
          definitions  : [ 'isbns_10', 'book_meta', 'api_response' ],
          columnOrder  : [],
          rowOrder     : [],
          rows         : {
            _rid1     : {
              isbn_10 : '0011011107',
              _meta   : {
                definition  : 'isbns_10',
                cuid        : '123asdk123',
                derivedFrom : '@/blocks/block1/outputs/isbns/_rid2'
              }
            },
            book_meta : { author: 'Isaac Asimov', title: 'I, Robot', _meta: {} }
          },
          _rid2        : {}
        }
      }
    },

    // inputs:[<collection>]
    //  - rows of refs to seleted data meeting "consumes" constraint
    //  - inputs/data: materialized array w/o type info? for saving particular input state (as frame or matrix)
    // -> assigns _cuid to each input "row"
    // outputs:[<collection>]
    //  - extends each row in inputs with refs to corresponding output values

    // collection api?
    // must be equiv to frame:frame map of input rows -> output rows i.e. input._ridx -> output._ridx
    inputs      : {
      isbns : [
        '@blocks/1/outputs/isbns', // key identifies source? or should this be stored in db field ?
        '@collections/isbns_scans', // collection created / filled up by user promoting output of previously executed blocks >
        '#/userinput/isbns' // direct-entry user data context for block ?  only gets a "_cuid" when output from block -> notebook db ?
      ]
    },
    inputs2     : {
      isbns       : {
        '@id'      : 'isbns',
        definition : '#/definitions/isbn_10',
        sources    : [ ('sources': ['@/blocks/1', '@collections/isbns']) ],
        values     : [
          { title: '_cuid6', _meta: { cuid: '_cuid2', source: '@/block1/isbns/_cuid1' } },
          { title: '_cuid7', _meta: { cuid: '_cuid3', source: '@/block1/isbns/_cuid2' } },
          { title: '_cuid5', _meta: { cuid: '_cuid1', source: '@/block1/isbns/_cuid3' } },
          { title: '_cuid8', _meta: { cuid: '_cuid4', source: '@/block1/isbns/_cuid4' } }
        ],
        isbns2     : [ '@blocks/1/outputs/isbns/3' ]
      },

      // outputs row of form {...consumes, ...produces } ?
      outputs     : {
        // db-collection datastructure
        isbns        : {
          _cuid20 : '0011011107'
          //_cuid28...
        },
        book_meta    : {
          _cuid21 : { isbn_10: '0011011107', author: 'Isaac Asimov', title: 'I, Robot' }
          //_cuid29...
        },
        api_response : {
          _cuid22 : { req: { headers: 'x-form-transfer...' }, res: { code: 400, body: 'eresas json blasaa' } }
          //...
        },
        dataframe    : {
          _meta : {
            definitions        : [ 'isbn_10', 'book_meta', 'api_response' ],
            visibleColumnOrder : [ '{keys in isbn_10}', '...book_meta', '...api_response' ]
          },
          _rid1 : { isbn_10: '<_cuid>', book_meta: '<_cuid>', api_response: '<_cuid>' },
          _rid2 : { isbn_10: '_cuid20', book_meta: '_cuid21', api_response: '_cuid21' }
          //...
        }
      },
      outputs2    : {
        // db-collection datastructure
        isbns : {
          _cuid20 : '0011011107'
          //_cuid28...
        },
        rows  : {
          _meta : {
            definitions        : [ 'isbn_10', 'book_meta', 'api_response' ],
            visibleColumnOrder : [ '{keys in isbn_10}', '...book_meta', '...api_response' ]
          },
          _rid1 : { isbn_10: '<_cuid>', book_meta: '<_cuid>', api_response: '<_cuid>' },
          _rid2 : { isbn_10: '_cuid20', book_meta: '_cuid21', api_response: '_cuid21' }
          //...
        }
      },

      data        : {
        isbns        : {
          _cuid1                                : 'ALTERED!', // overrides value of inputs/isbns/_cuid1
          '@/blocks/block1/outputs/isbns/_rid2' : 'ALTERED',
          _rid20                                : '0894261150' // new
        },
        book_meta    : {
          _rid1                         : { isbn_10: '0011011107', author: 'Isaac Asimov', title: 'I, Robot' },
          '@/blocks/block1/isbns/_rid2' : { isbn_10: '0011011107', author: 'ALTERED!!!', title: 'I, Robot' }

          //_cuid29...
        },
        api_response : {
          _rid1 : { req: { headers: 'x-form-transfer...' }, res: { code: 400, body: 'eresas json blasaa' } }
          //...
        }
      },
      data2       : {
        isbns        : {
          cuids  : [ '_cuid11', '_cuid12', '_cuid13', '_cuid14' ],
          values : {
            _cuid11 : { isbn_10: '0262011530' },
            _cuid12 : { isbn_10: '047157175X' },
            _cuid13 : { isbn_10: '3110148307' },
            _cuid14 : { isbn_10: '0894261150' }
          }
        },
        api_config   : {
          cuids  : [ '_cuid21' ],
          values : {
            _cuid14 : { api_config: { api_key: 'NO_KEY_NEEDED' } }
          }
        },
        book_meta    : {
          cuids  : [ '_cuid31', '_cuid32', '_cuid33', '_cuid34' ],
          values : {
            _cuid31 : {
              author  : 'Harold Abelson',
              isbn_10 : '0262011530',
              openlib : 'http://openlibrary.org/isbn/0262011530.json',
              title   : 'Structure & Interpretation of Computer Programs.'
            },
            _cuid32 : {
              title   : 'Techniques of Prolog programming',
              author  : 'T. Van Le',
              isbn_10 : '047157175X'
            },
            _cuid33 : {
              title   : 'The lac Operon',
              author  : 'Benno Müller-Hill',
              isbn_10 : '3110148307'
            },
            _cuid34 : {
              author  : 'Eisenberg, Michael.',
              isbn_10 : '0894261150',
              title   : 'Programming in Scheme'
            }
          }
        },
        api_response : {
          cuids  : [ '_cuid41', '_cuid42', '_cuid43', '_cuid44' ],
          values : {
            _cuid41 : {
              api_response : `"req": { "headers": 'x-form-transfer...' }, "res": { "code": 400, "body": 'eresas json blasaa' }`
            }
          }
        }
      },

      // json-schema-ish //////////////////
      definitions : {
        isbn_10      : {
          $id         : '#/isbn_10',
          title       : 'isbn_10',
          description : "book's isbn_10 formatted string",
          tags        : [ 'isbn', 'isbn_10', 'isbn10', 'isbn-10' ],
          type        : 'string',
          example     : '0-449-23949-7',
          validation  : ''
        },
        book_meta    : {
          // collection data
          tags       : [ 'book' ],
          attributes : [
            'isbn_10',
            'title',
            'author',
            'description',
            'publisher',
            'number_of_pages',
            'publish_date',
            'worksUrl',
            'thumbnail_url',
            'isbn_13'
          ],
          validation : {},
          example    : {
            isbn_13         : 9780449239490,
            isbn_10         : '0449239497',
            title           : 'I, Robot',
            author          : 'Isaac Asimov',
            description     : 'The three laws of Robotics:\r\n\r\n 1. A robot may not injure a human being or...',
            publisher       : 'Fawcett Crest',
            number_of_pages : 192,
            publish_date    : '1977',
            worksUrl        : 'https://openlibrary.org/works/OL46404W.json',
            thumbnail_url   : 'https://covers.openlibrary.org/b/id/6517773.jpg'
          },
          // schema data
          schema     : {
            $id         : '#book_meta',
            title       : 'book metadata',
            description : 'schema of book metadata from openlibrary API',
            type        : 'object',
            properties  : {
              isbn_10         : {
                description : 'ISBN-10',
                type        : 'string'
              },
              title           : {
                description : 'title of work',
                type        : 'string'
              },
              worksUrl        : {
                description : 'openlibrary.org URI',
                type        : 'string'
              },
              publisher       : {
                description : 'publisher',
                type        : 'string'
              },
              author          : {
                description : 'author',
                type        : 'string'
              },
              number_of_pages : {
                description : 'number of pages',
                type        : 'int'
              },
              publish_date    : {
                description : 'publication date',
                type        : 'string'
              },
              isbn_13         : {
                description : 'ISBN-13',
                type        : 'string'
              },
              thumbnail_url   : {
                description : 'thumbnail url',
                type        : 'string'
              }
            }
          }
        },
        api_response : {
          title  : 'openlibrary.org API response',
          type   : 'json',
          schema : '@/_core/api_response'
        }
      } // end schema
    }
  },

  ///////////////////////// v1 /////////////////////////////////

  block3_v1   : {
    id          : 'block3',

    // input type schemas
    consumes    : {
      isbn_10 : {
        title       : 'ISBN10',
        description : 'ISBN-10 formatted string',
        tags        : [ 'ISBN' ],
        attributes  : [ 'isbn_10' ], // defines ordering
        definitions : '#/isbn_10' // refers to local 'definitions/book_meta' path
      }
    },
    // output type schemas
    produces    : {
      book_meta    : {
        title       : 'book metadata',
        description : 'book metadata from openlibrary API',
        tags        : [ 'book' ],
        attributes  : [
          'isbn_10',
          'title',
          'author',
          'description',
          'publisher',
          'number_of_pages',
          'publish_date',
          'worksUrl',
          'thumbnail_url',
          'isbn_13'
        ], // defines ordering
        definitions : '#/book_meta', // refers to local 'definitions/book_meta' path

        // full-on json-schema? maybe not...
        type        : 'object',
        schema      : { $ref: '#/definitions/isbn_10' }
      },
      api_response : { type: 'json', schema: '@/_core/api_response' }
    },

    inputs      : {
      isbns : {
        name       : 'isbns',
        definition : '#isbn_10'
      }
    },
    opIn        : 'self',
    op          : 'opName',
    opOut       : [ '055338256X.jpg', '0-449-23949-7.jpg', '978-0807014295.jpg' ],
    opOutName   : 'isbns',
    opReady     : true,
    opRunning   : false,
    opDone      : true,
    text        : 'download cover images; save to dropbox',

    // json-schema-ish
    definitions : {
      isbn_10      : {
        $id         : '#/isbn_10',
        description : 'ISBN-10 formatted string',
        tags        : [ 'isbn', 'isbn_10', 'isbn10', 'isbn-10' ],
        type        : 'string',
        example     : '0-449-23949-7',
        validation  : ''
      },
      book_meta    : {
        $id         : '#book_meta',
        title       : 'book metadata',
        description : 'book metadata from openlibrary API',
        tags        : [ 'book' ],
        attributes  : [
          'isbn_10',
          'title',
          'author',
          'description',
          'publisher',
          'number_of_pages',
          'publish_date',
          'worksUrl',
          'thumbnail_url',
          'isbn_13'
        ],
        validation  : {},
        example     : {
          isbn_13         : 9780449239490,
          isbn_10         : '0449239497',
          title           : 'I, Robot',
          author          : 'Isaac Asimov',
          description     : 'The three laws of Robotics:\r\n\r\n 1. A robot may not injure a human being or...',
          publisher       : 'Fawcett Crest',
          number_of_pages : 192,
          publish_date    : '1977',
          worksUrl        : 'https://openlibrary.org/works/OL46404W.json',
          thumbnail_url   : 'https://covers.openlibrary.org/b/id/6517773.jpg'
        },
        type        : 'object',
        properties  : {
          isbn_10         : {
            description : 'ISBN-10',
            type        : 'string'
          },
          title           : {
            description : 'title of work',
            type        : 'string'
          },
          worksUrl        : {
            description : 'openlibrary.org URI',
            type        : 'string'
          },
          publisher       : {
            description : 'publisher',
            type        : 'string'
          },
          author          : {
            description : 'author',
            type        : 'string'
          },
          number_of_pages : {
            description : 'number of pages',
            type        : 'int'
          },
          publish_date    : {
            description : 'publication date',
            type        : 'string'
          },
          isbn_13         : {
            description : 'ISBN-13',
            type        : 'string'
          },
          thumbnail_url   : {
            description : 'thumbnail url',
            type        : 'string'
          }
        }
      },
      api_response : {
        title  : 'openlibrary.org API response',
        type   : 'json',
        schema : '@/_core/api_response'
      }
    }
  }
}
