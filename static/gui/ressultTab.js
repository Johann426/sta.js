import { UIDiv, UIText, UIInput, UISelect, UICheckbox } from "../ui.js";
import { UITable } from "../UITable.js";
import { runClassLib } from "../ViewportSTA.js";

class ressultTab extends UIDiv {

    constructor( ship ) {

        super();

        const result = this;

        let div, table, row;

        const calButton = new UIText( 'Calculate result' ).setClass( 'item' );
        result.add( calButton );

        //Chart
        div = new UIDiv();
        result.add( div );

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

        calButton.dom.addEventListener( 'click', () => {
            
            runClassLib( ship );

        } );
    
    }
}

export { ressultTab };
