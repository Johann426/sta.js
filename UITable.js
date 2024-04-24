class UITable { // only number is acceptable

    constructor( n, m ) {

        const scope = this;
        this.dom = document.createElement( 'table' );
        const table = this.dom;
        this.precision = 2;

        for( let i = 0; i < n; i ++ ) {

            const row = table.insertRow();

            for( let j = 0; j < m; j ++ ) {
                
                const cell = row.insertCell( - 1 );
                cell.setAttribute( "contenteditable", true );
                cell.addEventListener( 'keydown', onKeyDown, false );
                cell.addEventListener( 'change', onChange, false );
                cell.addEventListener( 'focus', onFocus, false );
                cell.addEventListener( 'blur', onBlur, false );

            }

        }

        function onChange() {

            const value = this.dom.value;
            const float = parseFloat( value );
			this.dom.value = float;
            console.log( float )

		}

		function onFocus() {

            // const rowIndex = this.parentNode.rowIndex;
            // const cellIndex = this.cellIndex;
            // console.log( rowIndex, cellIndex )


		}

		function onBlur() {

            const content = this.innerHTML
            console.log( content )
            const template = document.createElement('template');
            template.innerHTML = content;
            const dom = template.content.firstChild;
            console.log( dom )

            if ( dom instanceof HTMLTableElement ) {

                const row = this.parentNode;
                const cellIndex = this.cellIndex;
                const rowIndex = row.rowIndex;
                const arr = tableToArray( dom )
                console.log( arr )
                scope.paste( arr, rowIndex, cellIndex );

            } else {

                const number = parseFloat( this.innerHTML );
			    this.innerHTML = number;

            }

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

                case 'KeyV':

                    if( event.ctrlKey ) {

                        console.log( 'ctrl + v' )
                        // console.log( navigator.clipboard.writeText() )
                        // tableToArray( this.innerHTML )

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

                            //
                            const float = parseFloat( e )
                            tb.rows[ imin + i ].cells[ jmin + j ].innerHTML = float;

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

    get() {

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
