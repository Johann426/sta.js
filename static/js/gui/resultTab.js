import { UIDiv, UIText, UIInput, UISelect, UICheckbox } from "../ui.js";
import { UICollapsible } from "../UICollapsible.js";
import { UITable } from "../UITable.js";
import { runClassLib } from "../ViewportSTA.js";

class resultTab extends UIDiv {

    constructor( ship ) {

        super();

        const result = this;
        // Collapsible elements
        const speedPower = new UICollapsible( '• Speed-power curve' );
        const analysis = new UICollapsible( '• Analysis of speed trial data' );

        result.add( speedPower, analysis );

        Object.assign( result, { speedPower, analysis } );

        let div;

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
                'rgb(11,132,165)', //blue
                'rgb(202,71,47)', //red
                'rgb(246,200,95)', //yellow
                'rgb(157,216,102)', //green
                'rgb(111, 78, 124)', //purple
                'rgb(255,160,86)', // orange
                'rgb(141,221,208)', //cyan
                'rgb(228,120,194)', //pink
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
                name: 'Ballast(model)',
                showlegend: true,
                legendgroup: 'group',
                line:{
                    dash: 'dash',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Loaded(model)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'dashdot',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Ballast(sea trial)',
                showlegend: true,
                legendgroup: 'group',
                line:{
                    dash: 'solid',
                    width: 3
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Loaded(sea trial)',
                showlegend: true,
                legendgroup: 'group2',
                line:{
                    dash: 'solid',
                    width: 2
                },
                x: [],
                y: []
            },
            {
                type: 'scatter',
                name: 'Measured',
                showlegend: true,
                legendgroup: 'group',
                mode: 'markers',
                marker: {
                    symbol: 'diamond',
                    size: 8
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
                    symbol: 'triangle',
                    size: 8,
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

        let row;

        const table = new UITable();
        analysis.content.add( table );
        result.table = table;

        row = table.insertRow();
        row.insertHeader().textContent = 'Engine load (%)'
        // ship.load.map( e => row.insertCell().textContent = e );

        row = table.insertRow();
        row.insertHeader().textContent = 'Run number'
        // ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i );

        row = table.insertRow();
        row.insertHeader().textContent = 'Heading (°)'
        // ship.hdg.map( e => row.insertCell().textContent = e );

        row = table.insertRow();
        row.insertHeader().textContent = 'Speed over ground (knots)'
        // ship.sog.map( e => row.insertCell().textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Shaft speed (rpm)'
        // ship.rpm.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Shaft power (kW)'
        // ship.power.map( e => row.insertCell().textContent = e.toFixed( 0 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wind velocity (m/s)'
        // ship.wind_v.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wind direction (°)'
        // ship.wind_d.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave height (m)'
        // ship.wave.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave direction (°)'
        // ship.wave.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave period (sec)'
        // ship.wave.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell height (m)'
        // ship.swell.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell direction (°)'
        // ship.swell.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell period (sec)'
        // ship.swell.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

        /////////////////////////////////////////////////////////////////////////////////////////////
        // Results
        /////////////////////////////////////////////////////////////////////////////////////////////

        row = table.insertRow();
        row.insertHeader().textContent = "Relative wind velocity at anemometer height (m/s)";
        // vwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "Relative wind direction at anemometer height (°)";
        // dwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "True wind velocity at anemometer height (m/s)";
        // vwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "True wind direction at anemometer height (°)";
        // dwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "True wind velocity at anemometer height, double run averaged (m/s)";
        // vwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "True wind direction at anemometer height, double run averaged (°)";
        // dwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "True wind velocity at reference height (m/s)";
        // vwtRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "Relative wind velocity at reference height (m/s)";
        // vwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "Relative wind direction at reference height (°)";
        // dwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "Wind coefficient";
        // caa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "RAA (kN)";
        // raa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave motion (kN) ';
        // wave.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave reflection (kN) ';
        // wave.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Wave total (kN) ';
        // wave.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell motion (kN) ';
        // swell.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell reflection (kN) ';
        // swell.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'Swell total (kN) ';
        // swell.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'RAW (kN) ';
        // raw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = 'RAS (kN) ';
        // ras.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "ΔR (kN)";
        // delr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "PD (kW)";
        // pid.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "Vs (knots)";
        // stw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

        row = table.insertRow();
        row.insertHeader().textContent = "PB (kW)";
        // pb.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );
    
    }
}

export { resultTab };
