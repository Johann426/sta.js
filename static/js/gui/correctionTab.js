import { UIDiv, UIText, UIInput, UISelect, UICheckbox, UISpan, UIRow } from "../ui.js";
import { UICollapsible } from "../UICollapsible.js";
import { UITable } from "../UITable.js";
import { addButton } from "../ViewportSTA.js";

class correctionTab extends UIDiv {

    constructor( viewport, ship ) { // this class access to visibility of rudder & drift in measured tab

        super();

        const correction = this;
        
        let div, table, row, options, img;

        div = new UIDiv().add( new UIText( '✔ Reference Guideline: ' ).setPadding( '10px 10px 5px 10px' ) );
        correction.add( div );
        
        const guideline = new UISelect().setDisplay( 'inline' ).setOptions( {

            iso2002: 'ISO 15016:2002',
            iso2015: 'ISO 15016:2015',
            ittc2017: 'ITTC 7.5-04-01-01.1 (2017)',
            ittc2021: 'ITTC 7.5-04-01-01.1 (2021)'

        } );
        
        div.add( guideline );
        guideline.setValue( 'iso2015' );

        // show or hide 2002 option
        const options2002 = new UIDiv().setPaddingLeft( '10px' );
        correction.add( options2002 );
        correction.guideline = guideline;

        guideline.onChange( event => {

            options2002.setHidden( event.target.value == 'iso2002' ? false : true );
            ship.st.guideline = guideline.getValue();
            
        } );

        correction.optionISO2002 = new Object();
        [ 'steering', 'drift', 'shallow water', 'displacement', 'temperature and salinity' ].map( txt => {

            const uiText = new UIText( txt ).setPadding( '10px 0px 5px 20px' );
            const checkBox = new UICheckbox().setValue( true );
            correction.optionISO2002[ txt.replace( /\s(.*)/, '' ) ] = checkBox;
            options2002.add( uiText, checkBox );

        } )
        
        options2002.add( new UIText( 'n-KQ fairing' ).setPadding( '10px 5px 5px 20px' ) );
        
        const nkqFair = new UISelect().setDisplay( 'inline' ).setOptions( {

            ls: 'Least square',
            mean: 'Mean',
            same: 'Same',

            } );
        
        nkqFair.setValue( 'ls' )
        options2002.add( nkqFair );
        correction.optionISO2002.nkqFair = nkqFair;
        options2002.setHidden( true );

        // Collapsible elements
        const wind = new UICollapsible( '• Wind resistance' );
        const wave = new UICollapsible( '• Wave resistance' );
        const current = new UICollapsible( '• Current effect' );
        const temperature = new UICollapsible( '• Temperature & density' );
        const displacement = new UICollapsible( '• Displacement' );
        
        correction.add( wind, wave, current, temperature, displacement );

        Object.assign( correction, { wind, wave, current, temperature, displacement } );

        // Wind coefficients
        div= new UIDiv().add( new UIText( 'Coefficients by ' ).setPadding( '10px 10px 5px 10px' ) );
        wind.content.add( div );
        
        const windMethod = new UISelect().setDisplay( 'inline' ).setOptions( {

            windTunnelTest: 'Wind tunnel test',
            cfd: 'CFD',
            ittc: 'ITTC data set',
            formula: 'Regression formula'

        } );
    
        windMethod.setValue( 'windTunnelTest' )
        div.add( windMethod );
        correction.wind.method = windMethod;

        windMethod.onChange( () => ship.st.windMethod = windMethod.getValue() );

        div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        div.add( new UIText( 'Wind profile' ).setWidth('100%').setTextAlign( 'center' ) );
        wind.content.add( div );

        table = new UITable();
        wind.table = table;
        div.add( table );

        row = table.insertRow();
        row.insertHeader().setWidth( '80px' ).setPadding( '2px 10px' ).textContent = 'Angle (°)'
        row.insertHeader().setWidth( '80px' ).setPadding( '2px 10px' ).innerHTML = 'C<sub>X</sub>'

        for ( let i = 0; i <= 36; i ++ ) {

            row = table.insertRow();
            row.insertCell().setPadding( '0px' ).textContent = ( i * 10 ).toString();
            row.insertCell().setPadding( '0px' ).textContent = ''

        }

        // Wind coefficients chart
        div = new UIDiv().setPadding( '10px 20px' );
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        wind.content.add( div );

        const chartLayout = {
            title: 'Wind resistance coefficient',
            width: 480,
            height: 680,
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { //global font
                color: 'lightgray',
            },
            xaxis: {
                title: 'Angle [°]',
                color: 'lightgray',
                gridcolor: 'gray',
                minallowed: 0,
                maxallowed: 360,
                showline: true,
                showgrid: true,
            },
            yaxis: {
                title: {
                text : 'Cx',
                standoff: 5,
                },
                color: 'lightgray',
                gridcolor: 'gray',
            //   tickformat: ",.0f",
                showline: true,
                showgrid: true,
            },
        };
    
        const chartData = [
            {
                type: 'scatter',
                name: 'cx',
                showlegend: false,
                line:{
                    dash: 'solid',
                    width: 2
                },
                x: [0, 360],
                y: [-1, 1]
            },
        ];
    
        Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } )

        wind.chart = {
            dom: div.dom,
            data: chartData,
            layout: chartLayout
        };

        const dom = div.dom;

        wind.table.dom.addEventListener( 'focusout', () => { 
                
            const data = wind.tables[ 0 ].getColumnWiseData();

            chartData[ 0 ].x = data[ 'Angle' ];
            chartData[ 0 ].y = data[ 'CX' ];
            // ship.wind.angle = data[ 'Angle' ];
            // ship.wind.coef = data[ 'CX' ];

            Plotly.update( dom, chartData, chartLayout )

        } );

        div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
        wind.content.add( div );
        div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
        div.add( new UIText( 'Use average (Annex C.1.1)' ).setWidth('90%').setTextAlign( 'center' ) );
        wind.useAverage = new UICheckbox().setValue( true )
        div.add( wind.useAverage );

        // Wave
        wave.content.add( new UIText( 'Methods to estimate the resistance increase due to waves' ).setPadding( '10px 10px 5px 10px' ) );
        div = new UIDiv().add( new UIText( '-ISO 15016:2002' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
        wave.content.add( div );
        
        const waveMethod2002 = new UISelect().setDisplay( 'inline' ).setOptions( {

            falt: 'Faltinsen',
            fuji: 'Fujii-Takahashi',
            kwon: 'Kwon',

        } ).setValue( 'falt' );
        
        div.add( waveMethod2002 );
        correction.wave.method2002 = waveMethod2002;
        waveMethod2002.onChange( () => ship.st.waveMethod2002 = waveMethod2002.getValue() );

        div = new UIDiv().add( new UIText( '-ISO 15016:2015, or later ver.' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
        wave.content.add( div );

        const waveMethod = new UISelect().setDisplay( 'inline' ).setOptions( {

            sta1: 'STAWAVE-1',
            sta2: 'STAWAVE-2',
            nmri: 'Theoretical method with simplified tank tests in short wave',
            test: 'Seakeeping model tests',
            snnm: 'SNNM'

        } ).setValue( 'nmri' );
    
        div.add( waveMethod );
        correction.wave.method = waveMethod;
        waveMethod.onChange( () => ship.st.waveMethod = waveMethod.getValue() );

        waveMethod.onChange( () => { 

            const value = waveMethod.getValue();
            ship.st.waveMethod = value;
            [ 'sta1', 'sta2', 'snnm', 'nmri' ].map( key => wave[ key ].map( e => e.setHidden( true ) ) );
            if( wave[ value ] ) wave[ value ].map( e => e.setHidden( false ) );

        } );
        
        let h;

        wave.sta1 = [];
        img = new Image(317, 113);
        img.src = "./static/images/lbwl.jpg";
        img.style.display = 'block';
        img.style.margin = "0 auto";
        div = new UIDiv();
        div.dom.appendChild( img )
        h = '<Figure> Length of the bow on the water line to 95% of maximum beams'
        div.add( new UIText( h ).setWidth('100%').setTextAlign( 'center' ).setPadding( '5px 0px 20px 0px' ) );
        wave.sta1.push( waveInput( [ 'L<sub>BWL</sub> : ' ], 0, div ) );
        wave.content.add( ...wave.sta1 );

        wave.sta2 = [];
        h = 'Non-dimensional radius of gyration in lateral direction (% LPP)'
        h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
        wave.sta2.push( waveInput( [ 'k<sub>yy</sub> : ' ], h, 0 ) );
        wave.content.add( ...wave.sta2 );

        wave.snnm = [];
        img = new Image(490, 140);
        img.src = "./static/images/le.jpg";
        img.style.display = 'block';
        img.style.margin = "0 auto";
        div = new UIDiv();
        div.dom.appendChild( img )
        h = '<Figure> Sketch of the half waterline of a ship and related definitions'
        div.add( new UIText( h ).setWidth('100%').setTextAlign( 'center' ).setPadding( '5px 0px 20px 0px' ) );
        wave.snnm.push( waveInput( [ 'L<sub>R</sub> : ', 'L<sub>E</sub> : ' ], 0, div ) )
        wave.content.add( ...wave.snnm );
        
        wave.nmri = [];
        h = 'Centre of gravity'
        h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
        wave.nmri.push( waveInput( [ 'LCG : ', 'TCG : ', 'VCG : ' ], h, 0 ) );

        h = 'Non-dimensional radius of gyration'
        h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
        wave.nmri.push( waveInput( [ 'K<sub>roll</sub> : ', 'K<sub>pitch</sub> : ', 'K<sub>yaw</sub> : ' ], h, 0 ) );

        h = 'Bluntness coefficient (Bf), coefficient of advance speed (Cu)'
        h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
        wave.nmri.push( waveInput( [ 'B<sub>f</sub> : ', 'C<sub>u</sub> : '], h, 0 ) );
        wave.content.add( ...wave.nmri );

        function waveInput( arr, head, tail ) { // array of text keys

            const div = new UIDiv(); //.setBorder( '1px solid rgb(72,72,72)' );

            if( head ) div.add( head );

            arr.map( txt => {

                const uiText = new UIText().setWidth('16%').setTextAlign( 'center' ).setPadding( '10px 0px' )
                const input = new UIInput('').setWidth('16%').setTextAlign( 'center' ).setPadding( '0px' );
                div.add( uiText ).add( input );
                uiText.setInnerHTML( txt )
                const key = uiText.getValue().replace( ' : ', '' ).toLowerCase();
                wave[ key ] = input;
                input.dom.addEventListener( 'blur', () => ship[ key ] = parseFloat( input.getValue() ) ); // send input value to ship[ key ]

            } )

            if( tail ) div.add( tail );

            return div;

        }

        table = new UITable().setWidth( '50%' ).setMargin( 'auto' );
        wave.table = table;
        div = new UIDiv();
        div.add( new UIText( 'Geometry data' ).setWidth('100%').setTextAlign( 'center' ) );
        div.add( table );
        const span = new UIRow().add( ...addButton( table ) ).setWidth('50%').setMargin( 'auto' );
        div.add( span );

        row = table.insertRow();
        row.insertHeader().setWidth( '120px' ).textContent = 'Longitudinal x position (m)'
        row.insertHeader().setWidth( '120px' ).textContent = 'Half breadth (m)'
        row.insertHeader().setWidth( '120px' ).textContent = 'Sectional draft (m)'
        row.insertHeader().setWidth( '120px' ).textContent = 'Sectional Area (m\u00B2)'

        Array( 4 ).fill().map( () => {

            row = table.insertRow();
            Array( 4 ).fill().map( () => row.insertCell() );

        });

        wave.content.add( div );
        wave.nmri.push( div );

        [ 'sta1', 'sta2', 'snnm' ].map( key => wave[ key ].map( e => e.setHidden( true ) ) );

        // Current
        current.content.add( new UIText( 'Methods to account for the effect of current' ).setPadding( '10px 10px 5px 10px' ) );

        div = new UIDiv().add( new UIText( '-ISO 15016:2002' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
        current.content.add( div );
        
        const currentMethod2002 = new UISelect().setDisplay( 'inline' ).setOptions( {

            none: 'no current',
            data: 'input value',
            curv: 'current curve'

        } ).setValue( 'none' );
        
        div.add( currentMethod2002 );
        correction.current.method2002 = currentMethod2002;
        currentMethod2002.onChange( () => ship.st.currentMethod2002 = currentMethod2002.getValue() );

        div = new UIDiv().add( new UIText( '-ISO 15016:2015, or later ver.' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
        current.content.add( div );
        
        const currentMethod = new UISelect().setDisplay( 'inline' ).setOptions( {

            none: 'no current',
            iterative: 'iterative',
            mom: 'mean of means'

        } ).setValue( 'iterative' );
        
        div.add( currentMethod );
        correction.current.method = currentMethod;
        currentMethod.onChange( () => ship.st.currentMethod = currentMethod.getValue() );

        // Temperature
        let header;

        header = 'At sea trial'
        header = new UIText( header ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' );
        temperature.content.add( rasInput( [ 'Temperature<sub>trial</sub> : ', '&#961<sub>trial</sub> : ' ], header, 0, temperature ) );

        header = 'Reference'
        header = new UIText( header ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' );
        temperature.content.add( rasInput( [ 'Temperature<sub>ref</sub> : ', '&#961<sub>ref</sub> : ' ], header, 0, temperature ) );
        temperature[ 'temp0' ].setValue( '15.0' );
        temperature[ 'rho0' ].setValue( Number( 1026 ).toLocaleString() );

        function rasInput( arr, head, tail, parent ) { // array of text keys

            const div = new UIDiv();//.setBorder( '1px solid rgb(72,72,72)' );

            if( head ) div.add( head );

            arr.map( txt => {

                const uiText = new UIText().setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '10px 10px 5px 20px' );
                const input = new UIInput('').setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '2px 0px' );
                div.add( uiText ).add( input );
                uiText.setInnerHTML( txt );
                const key = uiText.getValue().replace( ' : ', '' ).replace( 'Temperature', 'temp' ).replace( 'ρ', 'rho' );
                parent[ key.replace( 'trial', 's' ).replace( 'ref', '0' ) ] = input;
    
            } )

            if( tail ) div.add( tail );

            return div;

        }

        // Displacement
        div = new UIDiv();
        div.add( new UIText( 'At sea trial' ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' ) );
        const disp = new UIText('').setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '10px 10px 5px 20px' );
        disp.setInnerHTML( '∇<sub>trial</sub> (m\u00B3)')
        displacement.disp = new UIInput( '' ).setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '2px 0px' );
        div.add( disp, displacement.disp );
        displacement.content.add( div );

        div = new UIDiv();
        div.add( new UIText( 'Reference model test' ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' ) );
        const dispm = new UIText('').setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '10px 10px 5px 20px' );
        dispm.setInnerHTML( '∇<sub>model</sub> (m\u00B3)')
        displacement.dispm = new UIInput('').setWidth( '16%' ).setTextAlign( 'center' ).setPadding( '2px 0px' );
        div.add( dispm, displacement.dispm );
        displacement.content.add( div );
    
    }

}

export { correctionTab };
