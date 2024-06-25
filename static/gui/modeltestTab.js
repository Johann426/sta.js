import { UIDiv, UIText } from "../ui.js";
import { UITable } from "../UITable.js";
import { addButton } from "../ViewportSTA.js";

class modeltestTab extends UIDiv {

    constructor( ship ) {

        super();

        const modeltest = this;
        modeltest.setPosition( 'relative' )
        modeltest.tables = [];

        let div, table, row;

        // Trial load condition
        function addTable( title, n ) {

            table = new UITable();
            table.title = title;
            row = table.insertRow();
            row.insertHeader().setWidth( '35px' ).textContent = 'Speed (knots)'
            row.insertHeader().setWidth( '35px' ).textContent = 'Power (kW)'
            row.insertHeader().setWidth( '35px' ).textContent = 'RPM (r/min)'

            for( let i = 0; i < n; i ++ ) {

                const row = table.insertRow();
                Array( 3 ).fill().map( () => row.insertCell() );

            }

            div = new UIDiv().setPadding( '10px 0px' );
            div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
            div.add( new UIText( title ).setWidth('100%').setTextAlign( 'center' ) );
            div.add( table );
            div.add( ...addButton( table ) );
            modeltest.add( div );
            modeltest.tables.push( table );

        }

        addTable( 'Trial load condition', 16 );
        addTable( 'Contract load condition', 16 );
        addTable( 'EEDI load condition', 16 );

        div = new UIDiv()
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        modeltest.add( div );
        
        const chartLayout = {
            title: 'Speed-power curve',
            width: 480,
            height: 720,
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

        modeltest.tables.map( ( table, k ) => {

            const key = table.title;
            
            ship.mt[ key ] = {

                vs: [],
                pb: [],
                rpm: []

            };

            table.dom.addEventListener( 'focusout', () => { 
                
                const data = table.getColumnWiseData();
                const index = key == 'Trial load condition' ? 0 : key == 'Contract load condition' ? 1 : 2;

                chartData[ index ].x = data[ 'Speed' ];
                chartData[ index ].y = data[ 'Power' ];

                ship.mt[ key ].vs = data[ 'Speed' ];
                ship.mt[ key ].pb = data[ 'Power' ];
                ship.mt[ key ].rpm = data[ 'RPM' ];

                Plotly.update( div.dom, chartData, chartLayout )

            } );

        } );

    }

}

export { modeltestTab };
