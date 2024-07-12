import { UIDiv, UIInput } from "../ui.js";
import { UICollapsible } from "../UICollapsible.js";
import { UITable } from "../UITable.js";
import { addButton } from "../ViewportSTA.js";

class modeltestTab extends UIDiv {

    constructor( ship ) {

        super();

        const modeltest = this;
        modeltest.tables = [];

        const sp = new UICollapsible( '• Speed-power chart' );
        const coef = new UICollapsible( '• Other coefficients' );
        
        modeltest.add( sp, coef );

        Object.assign( modeltest, { sp, coef } );

        // speed-power table(and chart)
        const titles = [ 'Trial load condition', 'Contract load condition', 'EEDI load condition' ];
        titles.map( title => addTable( title, 16 ) );

        let div = new UIDiv().setPosition( 'relative' );
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        sp.content.add( div );
        
        const chartLayout = {
            title: 'Speed-power curve',
            width: 420,
            height: 620,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            colorway: [
                'rgb(11,132,165)', //blue
                'rgb(202,71,47)', //red
                'rgb(246,200,95)', //yellow
                'rgb(157,216,102)', //green
                'rgb(111, 78, 124)', //purple
                'rgb(255,160,86)', // orange
                'rgb(141,221,208)' //cyan
            ],
            font: { //global font
                color: 'lightgray',
            },
            xaxis: {
                title: 'Speed [knots]',
                color: 'lightgray',
                gridcolor: 'gray',
                tickformat: ".1f",
                minallowed: 0,
                showline: true,
                showgrid: true,
                zeroline: false
            },
            yaxis: {
                title: {
                text : 'Power [kW]',
                standoff: 5,
                },
                color: 'lightgray',
                gridcolor: 'gray',
                tickformat: ",.0f",
                minallowed: 0,
                showline: true,
                showgrid: true,
            },
            legend: {
                x: 0.5,
                xanchor: 'center',
                y: 1,
                orientation: 'h'
            }
        };
    
        const chartData = [
            {
                type: 'scatter',
                name: 'Trial',
                showlegend: true,
                line:{
                    dash: 'dash',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Loaded',
                showlegend: true,
                line:{
                    dash: 'dashdot',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'EEDI',
                showlegend: true,
                // mode: 'markers',
                line:{
                    dash: 'dot',
                    width: 2
                },
                x: [],
                y: []
            },
    
        ];

        Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } );

        modeltest.chart = {
            dom: div.dom,
            data: chartData,
            layout: chartLayout
        };

        function addTable( title, n ) {

            const key = title.match( /^\w+/ )[ 0 ].toLowerCase();

            ship.mt[ key ] = {

                vs: new Array(),
                pb: new Array(),
                rpm: new Array()

            };

            const table = new UITable();
            table.title = title;
            const row = table.insertRow();
            row.insertHeader().setWidth( '35px' ).textContent = 'Speed (knots)'
            row.insertHeader().setWidth( '35px' ).textContent = 'Power (kW)'
            row.insertHeader().setWidth( '35px' ).textContent = 'RPM (r/min)'

            for( let i = 0; i < n; i ++ ) {

                const row = table.insertRow();
                
                row.insertCell().dom.addEventListener( 'blur', e => { // event handler sending value in column cell to reference object and chart

                    const index = e.target.parentNode.rowIndex - 1; // -1: considering header cell
                    const txt = e.target.textContent;
                    const num = parseFloat( txt.replace( ',', '' ) );

                    // ship.mt[ key ].vs[ index ] = num;
                    chartData[ key == 'trial' ? 0 : key == 'eedi' ? 2 : 1 ].x[ index ] = num; // speed
                    Plotly.update( div.dom, chartData, chartLayout )
            
                } );

                row.insertCell().dom.addEventListener( 'blur', e => {
                        
                    const index = e.target.parentNode.rowIndex - 1;
                    const txt = e.target.textContent;
                    const num = parseFloat( txt.replace( ',', '' ) );

                    // ship.mt[ key ].pb[ index ] = num;
                    chartData[ key == 'trial' ? 0 : key == 'eedi' ? 2 : 1 ].y[ index ] = num; // power
                    Plotly.update( div.dom, chartData, chartLayout )
            
                } );

                row.insertCell().dom.addEventListener( 'blur', e => {
                        
                    const index = e.target.parentNode.rowIndex - 1;
                    const txt = e.target.textContent;
                    const num = parseFloat( txt.replace( ',', '' ) );

                    // ship.mt[ key ].rpm[ index ] = num; // rpm
            
                } );

            }

            const div0 = new UIDiv().setPadding( '10px 0px' );
            div0.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
            div0.add( new UIInput( title ).setDisplay( 'block' ).setMargin( 'auto' ).setTextAlign( 'center' ) );
            div0.add( table );
            div0.add( ...addButton( table ) );
            modeltest.tables.push( table );
            sp.content.add( div0 );

        }

        // other coefficients from resistance, pow, and self-propulsion test
        let table, row;
        table = new UITable();
        row = table.insertRow();
        const arr1 = [ 'Vs', 'CT0', 'wtm', 't', 'etar', 'etad' ];
        
        arr1.map( header => {

            row.insertHeader().setWidth( '35px' ).textContent = header;
            

        } );

        for( let i = 0; i < 16; i ++ ) {

            const row = table.insertRow();
            arr1.map( () => row.insertCell() );

        }

        div = new UIDiv().setPosition( 'relative' );
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        div.add( new UIInput( 'Res & s-p test' ).setDisplay( 'block' ).setMargin( 'auto' ).setTextAlign( 'center' ) );
        div.add( table );
        div.add( ...addButton( table ) );
        modeltest.tables.push( table );
        coef.content.add( div );

        table = new UITable();
        row = table.insertRow();
        const arr2 = [ 'J', 'KT', 'KQ' ];
        
        arr2.map( header => {

            row.insertHeader().setWidth( '35px' ).textContent = header;
            

        } );

        for( let i = 0; i < 20; i ++ ) {

            const row = table.insertRow();
            arr2.map( () => row.insertCell() );

        }

        div = new UIDiv().setPosition( 'relative' );
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        div.add( new UIInput( 'Propeller open water' ).setDisplay( 'block' ).setMargin( 'auto' ).setTextAlign( 'center' ) );
        div.add( table );
        div.add( ...addButton( table ) );
        modeltest.tables.push( table );
        coef.content.add( div );

    }

}

export { modeltestTab };
