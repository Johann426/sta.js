import { UIDiv, UIText, UIInput, UISelect, UICheckbox } from "../ui.js";
import { UICollapsible } from "../UICollapsible.js";
import { UITable } from "../UITable.js";
import { runClassLib } from "../ViewportSTA.js";

class resultTab extends UIDiv {

    constructor( ship ) {

        super();

        const result = this;
        result.tables = [];

        // Collapsible elements
        const speedPower = new UICollapsible( '• Speed-power curve' );
        const analysis = new UICollapsible( '• Speed trial data analysis (developer use)' );
        const istap = new UICollapsible( '• Speed trial data analysis (i-stap)' );

        result.add( speedPower, analysis, istap );

        Object.assign( result, { speedPower, analysis, istap } );

        analysis.setHidden( true );

        result.onKeyDown( ( event ) => {

			switch ( event.key ) {

				case 'h':
                    analysis.setHidden( !analysis.isHidden() );
					break;

            }
        } );

        let div;

        div = new UIDiv().add( new UIText( '✔ Select loading condition: ' ).setPadding( '10px 10px 5px 10px' ) );
        speedPower.content.add( div );
        
        const condition = new UISelect().setDisplay( 'inline' ).setOptions( {

            trial: 'trial load condition',

        } );
        
        div.add( condition );
        condition.setValue( 'trial' );
        speedPower.content.add( div );
        result.condition = condition;

        //Chart
        div = new UIDiv();
        speedPower.content.add( div );

        const chartLayout = {
            title: {
                text: 'Speed-power curve',
                font:{
                    size: 16,
                    weight: 'bold'
                }
            },
            width: 700,
            height: 1024,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            colorway: [
                'rgb(141,221,208)', //cyan
                'rgb(111, 78, 124)', //purple
                'rgb(228,120,194)', //pink
                'rgb(255,160,86)', // orange
                'rgb(11,132,165)', //blue
                'rgb(246,200,95)', //yellow
                'rgb(202,71,47)', //red
                'rgb(157,216,102)', //green
                'rgb(128,128,128)' //gray
            ], //Default: [#1f77b4, #ff7f0e, #2ca02c, #d62728, #9467bd, #8c564b, #e377c2, #7f7f7f, #bcbd22, #17becf]
            font: { //global font
                color: 'lightgray',
            },
            xaxis: {
                title: {
                text: 'Speed [knots]',
                font:{
                    size: 14,
                    weight: 'bold'
                }
                },
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
                standoff: 10,
                font:{
                    size: 14,
                    weight: 'bold'
                }
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
                y: 1,
                xanchor: 'center',
                orientation: 'h',
                groupclick: 'toggleitem'
            }
        };
    
        const chartData = [
            {
                type: 'scatter',
                name: 'Measured',
                showlegend: true,
                legendgroup: 'group',
                mode: 'markers',
                marker: {
                    symbol: 'diamond-open',
                    size: 8,
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Measured(double run averaged)',
                showlegend: true,
                legendgroup: 'group',
                mode: 'markers',
                marker: {
                    symbol: 'diamond',
                    size: 10,
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Corrected',
                showlegend: true,
                legendgroup: 'group',
                mode: 'markers',
                marker: {
                    symbol: 'circle-open',
                    size: 8,
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Corrected(double run averaged)',
                showlegend: true,
                legendgroup: 'group',
                mode: 'markers',
                marker: {
                    symbol: 'circle',
                    size: 10,
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Trial(model test)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'dash',
                    shape: 'spline',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Trial(sea trial)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'solid',
                    shape: 'spline',
                    width: 3
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Loaded(model test)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'dashdot',
                    shape: 'spline',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Loaded(adjusted curve by trial result)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'solid',
                    shape: 'spline',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'PowerRef',
                showlegend: false,
                mode: 'lines',
                line:{
                    color: 'white',
                    dash: 'solid',
                    width: 1
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'SpeedTrial',
                showlegend: false,
                mode: 'lines',
                line:{
                    color: 'white',
                    dash: 'solid',
                    width: 1
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'SpeedLoaded',
                showlegend: false,
                mode: 'lines',
                line:{
                    color: 'white',
                    dash: 'solid',
                    width: 1
                },
                x: [],
                y: []
            },
    
        ];

        result.chart = {
            dom: div.dom,
            data: chartData,
            layout: chartLayout
        }

        Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } )

        result.tables.push( resultTable(), resultTable() );
        analysis.content.add( result.tables[ 0 ] );
        istap.content.add( result.tables[ 1 ] );

    }
    
}

function resultTable() {

    const table = new UITable();

    let row;

    row = table.insertRow();
    row.insertHeader().textContent = 'Engine load (%)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Run number'

    row = table.insertRow();
    row.insertHeader().textContent = 'Heading (°)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Speed over ground (knots)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Shaft speed (rpm)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Shaft power (kW)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Wind velocity (m/s)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Wind direction (°)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave height (m)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave direction (°)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave period (sec)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell height (m)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell direction (°)'

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell period (sec)'

    // Results
    row = table.insertRow();
    row.insertHeader().textContent = "Relative wind velocity at anemometer height (m/s)";

    row = table.insertRow();
    row.insertHeader().textContent = "Relative wind direction at anemometer height (°)";

    row = table.insertRow();
    row.insertHeader().textContent = "True wind velocity at anemometer height (m/s)";

    row = table.insertRow();
    row.insertHeader().textContent = "True wind direction at anemometer height (°)";

    row = table.insertRow();
    row.insertHeader().textContent = "True wind velocity at anemometer height, double run averaged (m/s)";

    row = table.insertRow();
    row.insertHeader().textContent = "True wind direction at anemometer height, double run averaged (°)";

    row = table.insertRow();
    row.insertHeader().textContent = "True wind velocity at reference height (m/s)";

    row = table.insertRow();
    row.insertHeader().textContent = "Relative wind velocity at reference height (m/s)";

    row = table.insertRow();
    row.insertHeader().textContent = "Relative wind direction at reference height (°)";

    row = table.insertRow();
    row.insertHeader().textContent = "Wind coefficient";

    row = table.insertRow();
    row.insertHeader().textContent = "RAA (kN)";

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave motion (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave reflection (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'Wave total (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell motion (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell reflection (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'Swell total (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'RAW (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = 'RAS (kN) ';

    row = table.insertRow();
    row.insertHeader().textContent = "ΔR (kN)";

    row = table.insertRow();
    row.insertHeader().textContent = "PD (kW)";

    row = table.insertRow();
    row.insertHeader().textContent = "Vs (knots)";

    row = table.insertRow();
    row.insertHeader().textContent = "PB (kW)";

    return table

}

export { resultTab };
