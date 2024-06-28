import { UIDiv, UISpan, UIText, UISelect  } from "../ui.js";
import { UITable } from "../UITable.js";

class measuredTab extends UIDiv {

    constructor( ship ) {

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
            
            for( let i = 1; i < n; i ++ ) {

                const row = rows[ i ];
                const cells = row.cells;
                Array( 2 ).fill().map( () => row.insertCell().textContent = measured.history.pop() );

            }

            Array( 2 ).fill().map( () => rows[ 0 ].insertHeader().textContent = rows[ 0 ].cells.length - 1 );
            
            // [ 'load', 'time', 'hdg', 'sog', 'rpmPORT', 'rpmSTBD', 'rpm', 'powerPORT', 'powerSTBD', 'power', 'wind_v', 'wind_d' ].map( ( key, i ) => {

            //     const row = rows[ i + 1 ];

            //     Array( 2 ).fill().map( () => {

            //         const cell = row.insertCell();
            //         cell.rowCellTo( ship, key );
            //         const value = measured.history.pop();
                    
            //         if ( value ) {

            //             ship[ key ].push( value )
            //             cell.textContent = value;

            //         }

            //     } );

            // } );

            // [ ship.wave, ship.swell ].map( ( obj, j ) => {

            //     [ 'height', 'angle', 'period' ].map( ( key, i ) => {

            //         const row = rows[ i + 13 + j * 3 ];

            //         Array( 2 ).fill().map( () => {

            //             const cell = row.insertCell();
            //             cell.rowCellTo( obj, key );
            //             const value = measured.history.pop();

            //             if ( value ) {

            //                 obj[ key ].push( value )
            //                 cell.textContent = value;

            //             }

            //         } );

            //     } );

            // } );
            
            // [ 'drift', 'rudderPORT', 'rudderSTBD', 'rudder' ].map( ( key, i ) => {

            //     const row = rows[ i + 19 ];

            //     Array( 2 ).fill().map( () => {

            //         const cell = row.insertCell();
            //         cell.rowCellTo( ship, key );
            //         const value = measured.history.pop();

            //         if ( value ) {

            //             ship[ key ].push( value )
            //             cell.textContent = value;

            //         }

            //     } );

            // } );

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

                    Array( 2 ).fill().map( () => i == 0 ? row.removeCell( - 1 ) : measured.history.push( row.removeCell( - 1 ).textContent ) );

                }

            }

            // [ 'rudder', 'rudderSTBD', 'rudderPORT', 'drift' ].map( ( key, i ) => {

            //     const row = rows[ n - 1 - i ];

            //     Array( 2 ).fill().map( () => {
                    
            //         const nm1 = row.cells.length - 1;
            //         measured.history.push( ship[ key ].splice( nm1 - 1, 1 ) ); //-1 considering header
            //         row.removeCell( - 1 );
                    
            //     } );

            // } );

            // [ ship.swell, ship.wave ].map( ( obj, j ) => {

            //     [ 'period', 'angle', 'height' ].map( ( key, i ) => {

            //         const row = rows[ n - 5 - i - j * 3 ];

            //         Array( 2 ).fill().map( () => {
                    
            //             const nm1 = row.cells.length - 1;
            //             measured.history.push( obj[ key ].splice( nm1 - 1, 1 ) );
            //             row.removeCell( - 1 );
                    
            //         } );

            //     } );

            // } );

            // [ 'wind_d' , 'wind_v', 'power', 'powerSTBD', 'powerPORT', 'rpm', 'rpmSTBD', 'rpmPORT', 'sog', 'hdg', 'time', 'load' ].map( ( key, i ) => {

            //     const row = rows[ n - 11 - i ];

            //     Array( 2 ).fill().map( () => {
                    
            //         const nm1 = row.cells.length - 1;
            //         measured.history.push( ship[ key ].splice( nm1 - 1, 1 ) );
            //         row.removeCell( - 1 );
                    
            //     } );

            // } );

            // Array( 2 ).fill().map( () => rows[ 0 ].removeCell( - 1 ) );

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
        row.insertHeader().setWidth( '135px' ).textContent = 'Run number'

        row = table.insertRow();
        row.insertHeader().textContent = 'Engine load (%)'

        row = table.insertRow().setFontSize( '11px' );
        row.insertHeader().setFontSize( '14px' ).textContent = 'Date time' //YYYY-MM-DDThh:mm:ss

        row = table.insertRow();
        row.insertHeader().textContent = 'Heading (°)';
        
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
