import { UIElement } from "./ui.js";

class UITable extends UIElement { // only number is acceptable in table body

    constructor( n = 0, m = 0 ) {

        super( document.createElement( 'table' ) );
        this.rows = [];
        const dom = this.dom;
        const index = [];
        const ij = [ 0, 0, 0, 0 ];
        
        const onPointerDown = function ( event ) {

            const rowIndex = event.target.parentNode.rowIndex;
            const cellIndex = event.target.cellIndex;
            ij.fill( 0 );
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

            [ is, ie, js, je ].map( ( e, i ) => ij[ i ] = e );

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

        const onKeyDown = ( event ) => {

			switch ( event.key ) {

				case 'Delete':

                    for ( let i = ij[ 0 ]; i <= ij[ 1 ]; i ++ ) {

                        const row = this.rows[ i ];

                        for ( let j = ij[ 2 ]; j <= ij[ 3 ]; j ++ ) {

                            const cell = row.cells[ j ];
                            if ( cell.editable ) cell.textContent = ''; // if( cell.dom.nodeName == TD )

                        }

                    }

					break;

			}

		}
        
        dom.addEventListener( 'pointerdown', onPointerDown );
        dom.addEventListener( 'pointerup', onPointerUp );
        dom.addEventListener( 'paste', onPaste );
        dom.addEventListener( 'copy', onCopy );
        dom.addEventListener( 'keydown', onKeyDown, false );

    }

    clear() {

        const rows = this.rows;

        for ( let i = 0; i < rows.length; i ++ ) {

            const row = rows[ i ];

            for ( let j = 0; j < row.cells.length; j ++ ) {

                const cell = row.cells[ j ];
                
                if ( cell.editable ) cell.textContent = ''; // if( cell.dom.nodeName == TD )

            }

        }

    }

    insertRow( i = - 1 ) {

        const { dom, rows } = this;
        const row = new UIRowElement();
        rows.push( row );
        dom.appendChild( row.dom );
        return row;

    }

    removeRow( i = - 1 ) {

        const { dom, rows } = this;
        dom.deleteRow( i );

        return rows.splice( i, 1 )[ 0 ];

    }

    paste( arr, imin = 0, jmin = 0 ) {

        const tb = this;
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

                            const cell = tb.rows[ imin + i ].cells[ jmin + j ]
                            if ( cell.editable ) cell.textContent = e;

                        }

                    } );

                } else {

                    if( ii < n ) {
                
                        const cell = tb.rows[ imin + i ].cells[ jmin ];
                        if ( cell.editable ) cell.textContent = row;

                    }

                }

            } )

        }

    }

    getData() { //row-wise

        const arr = new Array();
        const rows = this.rows;

        for( let i = 0; i < rows.length; i ++ ) {

            const row = rows[ i ];
            let header;
            
            for( let j = 0; j < row.dom.cells.length; j ++ ) {

                const txt = row.dom.cells[ j ].textContent;

                if( j == 0 ) {

                    header = txt.replace( /\s+/g, '' ).replace( /\(.*\)/g, '' ).toLowerCase() // exclude any character(s) in parentheses as well as white space
                    arr[ header ] = new Array();

                } else {

                    const number = parseFloat( txt.replace( ',', '' ) );
                    // regex of DateTime validator
                    const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                    const dateTime = txt.match(regex);
                    arr[ header ][ j - 1 ] = !dateTime ? number : txt;

                }

            }

        }

        return arr;

    }

    getColumnWiseData() { //column-wise

        const arr = new Array();
        const rows = this.rows;
        const keys = [];
        
        const cells = rows[ 0 ].cells;

        for( let j = 0; j < cells.length; j ++ ) {

            const cell = cells[ j ];
            const txt = cell.textContent;
            const header = txt.replace( /\s+/g, '' ).replace( /\(.*\)/g, '' ).toLowerCase() // exclude any character(s) in parentheses as well as white space
            arr[ header ] = new Array();
            keys.push( header );

        }

        for( let i = 1; i < rows.length; i ++ ) {

            const cells = rows[ i ].cells;

            for( let j = 0; j < cells.length; j ++ ) {

                const key = keys[ j ]
                const cell = cells[ j ];
                const txt = cell.textContent;
                const number = parseFloat( txt.replace( ',', '' ) );
                // regex of DateTime validator
                const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
                const dateTime = txt.match(regex);
                arr[ key ][ i ] = !dateTime ? number : txt;

            }

        }

        return arr;

    }

}

class UIRowElement extends UIElement {

    constructor() {

        super( document.createElement( 'tr' ) );
        this.cells = [];

    }

    insertCell( i = - 1 ) {

        const { dom, cells } = this;
        const cell = new UICellElement();
        cells.push( cell );
        dom.appendChild( cell.dom );
        
        return cell;

    }

    insertHeader( i = - 1 ) {

        const { dom, cells } = this;
        const cell = new UICellElement( 'th' );
        cells.push( cell );
        dom.appendChild( cell.dom );
        
        return cell;

    }

    removeCell( i = - 1 ) {

        const { dom, cells } = this;
        dom.deleteCell( i );

        return cells.splice( i, 1 )[ 0 ];

    }

}

class UICellElement extends UIElement{ // text or number or date time

    constructor( type = 'td' ) {

        super( document.createElement( type ) );
        type == 'th' ? this.editable = false : this.init().editable = true;

    }

    // .textContent property has better performance than use .innerHTML to retrieve or write text inside an element since its not parsed as HTML.
    get textContent() {

        return this.dom.textContent;

    }

    set textContent( txt ) {

        this.dom.textContent = txt;

    }

    get innerHTML() {

        return this.dom.textContent;

    }

    set innerHTML( txt ) {

        this.dom.innerHTML = txt;

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

        const dom = this.dom;

        const onDrop = ( event ) => {

            // to prevent unintended item from being drop down to the cell
            event.preventDefault();

        }

        const onBlur = () => {

            const txt = dom.textContent;

            // regex of DateTime validator
            const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
            const dateTime = txt.match(regex);
            
            if( txt != '' && !dateTime ) {

                const number = parseFloat( txt.replace( ',', '' ) );
			    // dom.textContent = number.toLocaleString();
                dom.textContent = number.toFixed( this.decimal ); //.replace( /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',' ); // record dicimal point with thousand seperator //use .toLocaleString()

            }

		}

        const onKeyDown = ( event ) => {

			// event.stopPropagation();
            const row = event.target.parentNode;
            const tb = row.parentNode;
            const rowIndex = row.rowIndex;
            const cellIndex = event.target.cellIndex;
            
			switch ( event.key ) {

				case 'Enter':
                    event.preventDefault();
                    event.target.blur();
                    if( rowIndex < tb.rows.length - 1  ) tb.rows[ rowIndex + 1 ].cells[ cellIndex ].focus()
					break;

                // case 'ArrowLeft':
				// 	event.preventDefault();
                //     if( cellIndex > 0  ) tb.rows[ rowIndex ].cells[ cellIndex - 1 ].focus()
				// 	break;

				// case 'ArrowUp':
				// 	event.preventDefault();
				// 	if( rowIndex > 0  ) tb.rows[ rowIndex - 1 ].cells[ cellIndex ].focus()
				// 	break;

                // case 'ArrowRight':
				// 	event.preventDefault();
				// 	if( cellIndex < row.cells.length - 1 ) tb.rows[ rowIndex ].cells[ cellIndex + 1 ].focus()
				// 	break;

				// case 'ArrowDown':
				// 	event.preventDefault();
				// 	if( rowIndex < tb.rows.length - 1  ) tb.rows[ rowIndex + 1 ].cells[ cellIndex ].focus()
				// 	break;
                
			}

		}

        dom.setAttribute( 'contenteditable', true );
        dom.addEventListener( 'drop', onDrop );
        dom.addEventListener( 'blur', onBlur );
        dom.addEventListener( 'keydown', onKeyDown );

        return this;

    }

    //Call by reference function(obj, key) to send targeted dom text content
    numberTo( obj, key ) {

        this.dom.addEventListener( 'blur', e => {
            
            const txt = e.target.textContent;
            obj[ key ] = parseFloat( txt.replace( ',', '' ) );

        } );

    }

    textTo( obj, key ) {

        this.dom.addEventListener( 'blur', e => {
            
            obj[ key ] = e.target.textContent;
            
        } );
        
    }

    columnCellTo( obj, key ) { //to send data in column cell to reference object

        this.dom.addEventListener( 'blur', e => {
            
            const index = e.target.parentNode.rowIndex - 1; // -1: considering header cell
            const txt = e.target.textContent;
            const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/; // date and time

            obj[ key ][ index ] = txt.match( regex ) ? txt : parseFloat( txt.replace( ',', '' ) );

        } );

    }

    rowCellTo( obj, key ) { //to send data in column cell to reference object

        this.dom.addEventListener( 'blur', e => {
            
            const index = e.target.cellIndex - 1; // -1: considering header cell
            const txt = e.target.textContent;
            const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/; // date and time

            obj[ key ][ index ] = txt.match( regex ) ? txt : parseFloat( txt.replace( ',', '' ) );

        } );

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
