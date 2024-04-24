class UITable { // only number is acceptable

    constructor( n, m ) {

        const scope = this;
        this.dom = document.createElement( 'table' );
        const table = this.dom;
        this.precision = 2;

        for( let i = 0; i < n; i ++ ) {

            const row = table.insertRow();

            for( let j = 0; j < m; j ++ ) {
                
                if ( i && j ) {

                    const cell = new UICellElement();
                    row.appendChild( cell.dom );

                } else {

                    const header = document.createElement( 'th' );
                    row.appendChild( header );

                }
                

            }

        }

    }

    paste( arr, imin = 0, jmin = 0 ) {

        const tb = this.dom;
        const n = tb.rows.length;
        const m = tb.rows[ 0 ].cells.length;

        if( Array.isArray( arr ) ) {

            arr.map( ( row, i ) => {

                const ii = imin + i;

                if( Array.isArray( row ) ) {

                    row.map( ( e, j ) => {

                        const jj = jmin + j;

                        if( ii < n && jj < m ) {

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

class UICellElement {

    constructor() {

        this.dom = document.createElement( 'td' );
        this.init();

    }

    init() {

        const scope = this;
        const dom = this.dom;
        dom.setAttribute( "contenteditable", true );
        dom.addEventListener( 'keydown', onKeyDown, false );
        dom.addEventListener( 'focus', onFocus, false );
        dom.addEventListener( 'blur', onBlur, false );
        dom.addEventListener( 'paste', onPaste, false );

        function onPaste( event ) {

            event.preventDefault();
            const arr = ( event.clipboardData || window.clipboardData ).getData( "text" ).split( '\r\n' ).map( e => e.split('\t') );
            console.log( arr )
            const row = this.parentNode;
            const rowIndex = row.rowIndex;
            const cellIndex = this.cellIndex;
            scope.paste( arr, rowIndex, cellIndex );

        }

		function onFocus() {

		}

		function onBlur ( event ) {

            const dom = event.currentTarget;
            const number = parseFloat( dom.innerHTML );
			dom.innerHTML = number;

		}

		function onKeyDown( event ) {

			event.stopPropagation();
            const row = this.parentNode;
            const tb = row.parentNode;
            const cellIndex = this.cellIndex;
            const rowIndex = row.rowIndex;

			switch ( event.code ) {

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

    }

    paste( arr, imin = 0, jmin = 0 ) {

        const row = this.dom.parentNode;
        const tb = row.parentNode;
        const n = tb.rows.length;
        const m = tb.rows[ 0 ].cells.length;

        if( Array.isArray( arr ) ) {

            arr.map( ( row, i ) => {

                const ii = imin + i;

                if( Array.isArray( row ) ) {

                    row.map( ( e, j ) => {

                        const jj = jmin + j;

                        if( ii < n && jj < m ) {

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
