import { UIDiv, UISpan, UIText, UISelect  } from "../ui.js";
import { UITable } from "../UITable.js";

class measuredTab extends UIDiv {

    constructor() {

        super();

        const measured = this;
        measured.history = [];

        let div, table, row;

        div = new UIDiv();
        measured.add( div );

        const addButton = new UIText( 'Add double runs (+)' ).setClass( 'item' );
        const minusButton = new UIText( 'Remove double runs (-)' ).setClass( 'item' );

        const options = new UISelect().setOptions( {

            single: 'Single propeller',
            twin: 'Twin propeller',

            } );
        
        options.setValue( 'single' );
        measured.singleTwin = options;

        const span = new UISpan().setPadding( '2px' ).setPosition('absolute').setRight( '10px' );
        span.add( new UIText( 'Single or Twin' ).setPaddingRight( '10px' ), options )
        div.add( addButton, minusButton, span );

        options.onChange( () => {
            
            // for ( let i = 0; i < table.rows.length; i ++ ) {

            //     const row = table.rows[ i ];
            //     if( row.isHidden() ) console.log( 'row no.', i, 'is hidden' );
                
            // }

            [ 7, 10, 22 ].map( index => {

                const row = table.rows[ index ];
                
                for ( let i = 1; i < row.cells.length; i ++ ) {

                    const cell = row.cells[ i ];
                    cell.dom.setAttribute( 'contenteditable', options.getValue() == 'single' ? true : false );

                }

            } );

            [ 5, 6, 8, 9, 20, 21 ].map( index => { 

                const row = table.rows[ index ];
                row.setHidden( options.getValue() == 'single' ? true : false );
                
            } );

        } )

        addButton.dom.addEventListener( 'click', () => {
            
            const rows = table.rows;
            const n = rows.length;
            
            for( let i = 0; i < n; i ++ ) {

                const row = rows[ i ];
                const cells = row.cells;
                Array( 2 ).fill().map( () => i == 1 ? row.insertHeader().textContent = cells.length - 1 : row.insertCell().textContent = measured.history.pop() );

            }

            [ 5, 6, 8, 9, 20, 21 ].map( index => { 

                const row = table.rows[ index ];

                for ( let i = 1; i < row.cells.length; i ++ ) {

                    const cell = row.cells[ i ];
                    cell.dom.addEventListener( 'blur', onBlur );

                }

            } );

        } );

        minusButton.dom.addEventListener( 'click', () => {
            
            const rows = table.rows;
            const n = rows.length;

            for( let i = n - 1; i >= 0; i -- ) {

                const row = rows[ i ];
                const cells = row.cells;

                if ( cells.length >= 5 ) {

                    Array( 2 ).fill().map( () => i == 1 ? row.removeCell( - 1 ) : measured.history.push( row.removeCell( - 1 ).textContent ) );

                }

            }

        } );

        const onBlur = function ( event ) {

            const row = event.target.parentNode;
            const tb = row.parentNode;
            const rowIndex = row.rowIndex;``
            const cellIndex = event.target.cellIndex;

            let a, b;

            switch ( rowIndex ) {

                case 5:
                    a = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 2 ].cells[ cellIndex ].textContent = ( 0.5 * ( a + b ) ).toFixed( 2 );
                    break;

                case 6:
                    a = parseFloat( tb.rows[ rowIndex - 1 ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent = ( 0.5 * ( a + b ) ).toFixed( 2 );
                    break;

                case 8:
                    a = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 2 ].cells[ cellIndex ].textContent = a + b;
                    break;
                case 9:
                    a = parseFloat( tb.rows[ rowIndex - 1 ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent = a + b;
                    break;

                case 20:
                    a = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 2 ].cells[ cellIndex ].textContent = ( 0.5 * ( a + b ) ).toFixed( 2 );
                    break;

                case 21:
                    a = parseFloat( tb.rows[ rowIndex - 1 ].cells[ cellIndex ].textContent );
                    b = parseFloat( tb.rows[ rowIndex ].cells[ cellIndex ].textContent );
                    tb.rows[ rowIndex + 1 ].cells[ cellIndex ].textContent = ( 0.5 * ( a + b ) ).toFixed( 2 );
                    break;

                default:
                    console.warn( 'not implemented for row index', rowIndex );
                    break;

            }

        }

        table = new UITable();
        measured.table = table;
        div.add( table );

        row = table.insertRow();
        row.insertHeader().setWidth( '100px' ).textContent = 'Engine load (%)'

        row = table.insertRow();
        row.insertHeader().textContent = 'Run number'

        row = table.insertRow().setFontSize( '11px' );
        row.insertHeader().setFontSize( '14px' ).textContent = 'Date time' //YYYY-MM-DDThh:mm:ss

        row = table.insertRow();
        row.insertHeader().textContent = 'Ship heading (°)';
        
        const border = '2px solid rgb(96,96,96)'

        row = table.insertRow().setBorderTop( border );
        row.insertHeader().textContent = 'Ship speed (knots)';

        row = table.insertRow();
        row.insertHeader().textContent = 'rpm port';
        row.setColor( 'rgb(196,48,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'rpm stbd';
        row.setColor( 'rgb(0,196,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'RPM (r/min)';

        row = table.insertRow();
        row.insertHeader().textContent = 'power port';
        row.setColor( 'rgb(196,48,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'power stbd';
        row.setColor( 'rgb(0,196,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'Power (kW)';

        row = table.insertRow().setBorderTop( border );
        row.insertHeader().textContent = 'Wind velocity (m/s)';

        row = table.insertRow();
        row.insertHeader().textContent = 'Wind direction (°)';

        row = table.insertRow().setBorderTop( border );
        row.insertHeader().textContent = 'Wave height (m)';

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave direction (°)';

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave period (sec)';

        row = table.insertRow().setBorderTop( border );
        row.insertHeader().textContent = 'Swell height (m)';

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell direction (°)';

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell period (sec)';

        row = table.insertRow().setBorderTop( border );
        row.insertHeader().textContent = 'Drift (°)';

        row = table.insertRow();
        row.insertHeader().textContent = 'rudder port';
        row.setColor( 'rgb(196,48,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'rudder stbd';
        row.setColor( 'rgb(0,196,0)' ).setHidden( true );

        row = table.insertRow();
        row.insertHeader().textContent = 'Rudder (°)';

        table.setWidth( '100%' )

        Array( 5 ).fill().map( () => addButton.dom.click() );

    }
}

export { measuredTab };
