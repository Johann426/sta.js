class UITable { // only number is acceptable in table body

    constructor( n = 0, m = 0 ) {

        this.dom = document.createElement( 'table' );
        this.initialize( n, m );
        const dom = this.dom;
        const index = [];
        let ij;
        
        const onPointerDown = function ( event ) {

            const rowIndex = event.target.parentNode.rowIndex;
            const cellIndex = event.target.cellIndex;
            index[ 0 ] = rowIndex;
            index[ 1 ] = cellIndex;
            removeClass();
            dom.addEventListener( 'pointermove', onPointerMove );

        }

        const onPointerUp = function ( event ) {

            dom.removeEventListener( 'pointermove', onPointerMove );

        }

        const onPointerMove = function ( event ) {

            event.preventDefault();
            const rowIndex = event.target.parentNode.rowIndex;
            const cellIndex = event.target.cellIndex;
            const is = rowIndex > index[ 0 ] ? index[ 0 ] : rowIndex;
            const ie = rowIndex > index[ 0 ] ? rowIndex : index[ 0 ];
            const js = cellIndex > index[ 1 ] ? index[ 1 ] : cellIndex;
            const je = cellIndex > index[ 1 ] ? cellIndex : index[ 1 ];
            removeClass();

            for ( let i = is; i <= ie; i ++ ) {

                const row = dom.rows[ i ];

                for ( let j = js; j <= je; j ++ ) {

                    const cell = row.cells[ j ];
                    cell.className = "selected";

                }

            }

            ij = [ is, ie, js, je ];

        }

        const removeClass = function () {

            for ( let i = 0; i < dom.rows.length; i ++ ) {

                const row = dom.rows[ i ];

                for ( let j = 0; j < row.cells.length; j ++ ) {

                    const cell = row.cells[ j ];
                    cell.classList.remove("selected");

                }

            }

        }

        const onPaste = ( event ) => {

            event.preventDefault();
            const txt = ( event.clipboardData || window.clipboardData ).getData( "text" );
            const arr = txt.split( '\r\n' ).map( row => row.split('\t') );
            const last = arr[ arr.length - 1 ];
            last.length == 1 && last[ 0 ] == '' ? arr.pop() : null;
            console.log( arr )
            const rowIndex = event.target.parentNode.rowIndex;
            const cellIndex = event.target.cellIndex;
            this.paste( arr, rowIndex, cellIndex );

        }

        const onCopy = ( event ) => {

            let str = new String();

            for ( let i = ij[ 0 ]; i <= ij[ 1 ]; i ++ ) {

                const row = dom.rows[ i ];

                for ( let j = ij[ 2 ]; j <= ij[ 3 ]; j ++ ) {

                    const cell = row.cells[ j ];
                    const value = cell.textContent;
                    str = j == ij[ 2 ] ? str.concat( value ) : str.concat( '\t', value );

                }

                str = str.concat( '\r\n' );

            }
            
            console.log( str )
            event.clipboardData.setData("text/plain", str );
            event.preventDefault();

        }

        dom.addEventListener( 'pointerdown', onPointerDown );
        dom.addEventListener( 'pointerup', onPointerUp );
        dom.addEventListener( 'paste', onPaste );
        dom.addEventListener( 'copy', onCopy );

    }

    initialize( n, m ) {

        const dom = this.dom;

        while( dom.rows.length > 0 ) {

            dom.deleteRow( 0 );

        }

        for( let i = 0; i < n; i ++ ) {

            const row = new UIRowElement();
            dom.appendChild( row.dom );

            for( let j = 0; j < m; j ++ ) {
                
                if ( i ) {

                    const cell = new UICellElement();
                    row.insertCell();

                } else {

                    const cell = new UICellElement( 'th' );
                    row.insertCell();

                }

            }

        }

    }

    insertRow( row, i = - 1 ) {

        const dom = this.dom;
        row = new UIRowElement();
        dom.appendChild( row.dom );
        return row;

    }

    paste( arr, imin = 0, jmin = 0 ) {

        const tb = this.dom;
        const rows = tb.rows;
        const n = rows.length;

        if( Array.isArray( arr ) ) {

            arr.map( ( row, i ) => {

                const ii = imin + i;

                if( Array.isArray( row ) && ii < n ) {

                    const m = rows[ ii ].cells.length;

                    row.map( ( e, j ) => {

                        const jj = jmin + j;

                        if( jj < m ) {

                            // const number = parseFloat( e )
                            tb.rows[ imin + i ].cells[ jmin + j ].innerHTML = e;

                        }

                    } );

                } else {

                    if( ii < n ) {
                
                        tb.rows[ imin + i ].cells[ jmin ].innerHTML = row;

                    }

                }

            } )

        }

    }

}

class UIRowElement {

    constructor() {

        this.dom = document.createElement( 'tr' );

    }

    insertCell( i = - 1 ) {

        const dom = this.dom;
        const cell = new UICellElement();
        dom.appendChild( cell.dom );
        
        return cell;

    }

    insertHeader( i = - 1 ) {

        const dom = this.dom;
        const cell = new UICellElement( 'th' );
        dom.appendChild( cell.dom );
        
        return cell;

    }

}

class UICellElement {

    constructor( type = 'td' ) {

        this.dom = document.createElement( type );
        type == 'td' ? this.init() : null;

    }

    // .textContent property has better performance than use .innerHTML to retrieve or write text inside an element since its not parsed as HTML.
    get textContent() {

        return this.dom.textContent;

    }

    set textContent( txt ) {

        this.dom.textContent = txt;

    }

    /**
     * @param {int} span
     */
    set colSpan( span ) {

        this.dom.colSpan = parseInt( span );

    }

    get decimal() {

        const txt = this.dom.textContent;
        const value = parseFloat( txt )

        if( typeof value === 'number' ) {

            return txt.includes('.') ? txt.toString().split('.')[1].length : 0;

        } else {

            return 0;

        }

    }

    init() {

        const scope = this;
        const dom = this.dom;

        const onDrop = ( event ) => {

            // to prevent unintended item from being drop down to the cell
            event.preventDefault();

        }

        const onBlur = () => {

            const value = dom.textContent;
            const number = parseFloat( value );
			dom.textContent = number.toFixed( this.decimal );

		}

        const onKeyDown = ( event ) => {

			event.stopPropagation();
            const row = event.target.parentNode;
            const tb = row.parentNode;
            const rowIndex = row.rowIndex;
            const cellIndex = event.target.cellIndex;
            

			switch ( event.key ) {

				case 'Enter':
                    event.preventDefault();
                    if( rowIndex < tb.rows.length - 1  ) tb.rows[ rowIndex + 1 ].cells[ cellIndex ].focus()
					break;

                case 'ArrowLeft':
					event.preventDefault();
                    if( cellIndex > 0  ) tb.rows[ rowIndex ].cells[ cellIndex - 1 ].focus()
					break;

				case 'ArrowUp':
					event.preventDefault();
					if( rowIndex > 0  ) tb.rows[ rowIndex - 1 ].cells[ cellIndex ].focus()
					break;

                case 'ArrowRight':
					event.preventDefault();
					if( cellIndex < row.cells.length - 1 ) tb.rows[ rowIndex ].cells[ cellIndex + 1 ].focus()
					break;

				case 'ArrowDown':
					event.preventDefault();
					if( rowIndex < tb.rows.length - 1  ) tb.rows[ rowIndex + 1 ].cells[ cellIndex ].focus()
					break;
                
			}

		}

        dom.addEventListener( 'drop', onDrop );
        dom.addEventListener( 'blur', onBlur, false );
        dom.addEventListener( 'keydown', onKeyDown, false );
        dom.setAttribute( 'contenteditable', true ); // editable cell

    }

}

function tableToArray( table ) {

    const res =[];
    const rows = table.rows;

    for ( let i = 0; i < rows.length; i ++ ) {

        const cells = rows[ i ].cells;
        const arr = [];

        for ( let j = 0; j < cells.length; j ++ ) {

            arr.push( cells[ j ].textContent );
        
        }

        res.push( arr );

    }

    return res;

}

export { UITable };
