import { UIDiv, UITabbedPanel, UIText, UIInput, UISelect, UICheckbox } from './ui.js';
import { UICollapsible } from './UICollapsible.js';
import { UITable } from './UITable.js';
import { particularTab } from './gui/particularTab.js';
import { modeltestTab } from './gui/modeltestTab.js';
import { measuredTab } from './gui/measuredTab.js';
import { correctionTab } from './gui/correctionTab.js';
import { ressultTab } from './gui/ressultTab.js';

class ViewportSTA extends UIDiv{

	constructor( ship ) {

		super();
		this.ship = ship;
		this.setId( 'viewportSTA' );

		const tabbedPanel = new UITabbedPanel();
		this.add( tabbedPanel );
		
		const particular = new particularTab( this );
		const modeltest = new modeltestTab( ship );
		const correction = new correctionTab( this );
		const measured = new measuredTab();
		const result = new ressultTab( ship );
		
		tabbedPanel.setId( 'tabbedPanel' )
		tabbedPanel.addTab( 'particular', 'Particular', particular );
		tabbedPanel.addTab( 'model', 'Model test', modeltest );
		tabbedPanel.addTab( 'correction', 'Correction', correction );
		tabbedPanel.addTab( 'measured', 'Measured data', measured );
		tabbedPanel.addTab( 'result', 'Result', result );
		tabbedPanel.select( 'correction' );

		console.log( correction )
		Object.assign( this, { particular, modeltest, measured, correction, result } )

	}

}

function runClassLib( ship ) {

	console.log( 'it depends on class library in server method' )

	sendData( ship )

	function sendData( value ) { 
		
		$.ajax({ 
			url: '/process',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify( value ),
			success: function(response) {
				console.log('success');
				console.log( response );
			}, 
			error: function(error) { 
				console.log(error); 
			} 
		});
	} 

}

function runSTA( ship, result ) { //result: UIDiv

	runClassLib( ship ); // run class library(.dll)

	checkValidity();

	// Temperature to density
	// wind resistance
	// wave resistance
	// water temperature salinity
	// current correction
	// speed-power
	
	let table, row;

	// Measured data
	table = new UITable();
	result.add( table );

	row = table.insertRow();
	row.insertHeader().textContent = 'Engine load (%)'
	ship.load.map( e => row.insertCell().textContent = e );

	row = table.insertRow();
	row.insertHeader().textContent = 'Run number'
	ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i );

	row = table.insertRow();
	row.insertHeader().textContent = 'Heading (°)'
	ship.hdg.map( e => row.insertCell().textContent = e );

	row = table.insertRow();
	row.insertHeader().textContent = 'Speed over ground (knots)'
	ship.sog.map( e => row.insertCell().textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Shaft speed (rpm)'
	ship.rpm.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Shaft power (kW)'
	ship.power.map( e => row.insertCell().textContent = e.toFixed( 0 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wind velocity (m/s)'
	ship.wind_v.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wind direction (°)'
	ship.wind_d.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave height (m)'
	ship.wave.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave direction (°)'
	ship.wave.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave period (sec)'
	ship.wave.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell height (m)'
	ship.swell.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell direction (°)'
	ship.swell.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell period (sec)'
	ship.swell.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

	/////////////////////////////////////////////////////////////////////////////////////////////
	// Results
	/////////////////////////////////////////////////////////////////////////////////////////////
	const res = ship.analysis();
	console.log( res );
	const { vwr, dwr, vwt, dwt, vwtAve, dwtAve, vwtRef, vwrRef, dwrRef, caa, raa } = res;
	const { wave, swell, raw, ras, delr, pid, stw, pb, powerOffset, speedAtNCR, speedAtNCRLoaded } = res;

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind velocity at anemometer height (m/s)";
	vwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind direction at anemometer height (°)";
	dwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at anemometer height (m/s)";
	vwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind direction at anemometer height (°)";
	dwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at anemometer height, double run averaged (m/s)";
	vwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind direction at anemometer height, double run averaged (°)";
	dwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at reference height (m/s)";
	vwtRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind velocity at reference height (m/s)";
	vwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind direction at reference height (°)";
	dwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Wind coefficient";
	caa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "RAA (kN)";
	raa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave motion (kN) ';
	wave.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave reflection (kN) ';
	wave.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave total (kN) ';
	wave.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell motion (kN) ';
	swell.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell reflection (kN) ';
	swell.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell total (kN) ';
	swell.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'RAW (kN) ';
	raw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'RAS (kN) ';
	ras.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "ΔR (kN)";
	delr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "PD (kW)";
	pid.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Vs (knots)";
	stw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "PB (kW)";
	pb.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

	table = new UITable();
	result.add( table );
	row = table.insertRow();
	row.insertHeader().textContent = "NCR";
	row.insertHeader().textContent = ship.ncr[ 1 ] + ' (kW)';
	row = table.insertRow();
	row.insertHeader().textContent = "Sea Margin";
	row.insertHeader().textContent = ship.sm + ' (%)';
	row = table.insertRow();
	row.insertHeader().textContent = "Speed at NCR with s.m.";
	row.insertHeader().textContent = speedAtNCRLoaded.toFixed( 3 ) + ' (knots)';

	// Speed-power chart
	const mt = ship.mt;
    const chartData = result.chart.data;
	const chartLayout = result.chart.layout;
	chartData[ 0 ].x = mt.vs;
	chartData[ 0 ].y = mt.pb;
	chartData[ 1 ].x = mt.vsLoaded;
	chartData[ 1 ].y = mt.pbLoaded;
	chartData[ 2 ].x = mt.vs;
	chartData[ 2 ].y = mt.pb.map( e => e + powerOffset );
	chartData[ 3 ].x = mt.vsLoaded;
	chartData[ 3 ].y = mt.pbLoaded.map( e => e + powerOffset );
	chartData[ 4 ].x = ship.sog;
	chartData[ 4 ].y = ship.power;
	chartData[ 5 ].x = stw;
	chartData[ 5 ].y = pb;
	
	let minX = 100;
	chartData.map( data => minX = Math.min( minX, ...data.x ) );
	let maxX = 0;
	chartData.map( data => maxX = Math.max( maxX, ...data.x ) );
	let minY = 10000;
	chartData.map( data => minY = Math.min( minY, ...data.y ) );
	let maxY = 0;
	chartData.map( data => maxY = Math.max( maxY, ...data.y ) );

	chartData[ 6 ].x = [ minX, Math.max( speedAtNCR, speedAtNCRLoaded ) ];
	chartData[ 6 ].y = [ ship.contractPower, ship.contractPower ];
	chartData[ 7 ].x = [ speedAtNCR, speedAtNCR ];
	chartData[ 7 ].y = [ minY, ship.contractPower ];
	chartData[ 8 ].x = [ speedAtNCRLoaded, speedAtNCRLoaded ];
	chartData[ 8 ].y = [ minY, ship.contractPower ];

	chartLayout.xaxis.autorange = false;
	chartLayout.xaxis.range = [ minX, maxX ];
	chartLayout.yaxis.autorange = false;
	chartLayout.yaxis.range = [ minY, maxY ];
	chartLayout.annotations = [
        {
            text: `Contract power: ${ Intl.NumberFormat().format( ship.contractPower ) }`,
			// text: `NCR Power / ${1 + 0.01 * ship.sm} = ${ ( ship.ncr[ 0 ] / ( 1 + 0.01 * ship.sm ) ).toFixed( 0 ) }`,
            xanchor: 'left',
			yanchor: 'bottom',
			showarrow: false,
			font: {
				size: 14
			},
			x: minX,
            y: ship.contractPower,
        },
		{
            x: speedAtNCR,
            y: minY,
            text: speedAtNCR.toFixed(2),
            xanchor: 'right',
			arrowcolor: 'white',
			arrowwidth: 1 //px
        },
		{
            x: speedAtNCRLoaded,
            y: minY,
            text: speedAtNCRLoaded.toFixed(2),
            xanchor: 'right',
			arrowcolor: 'white',
			arrowwidth: 1 //px
        }
    ]

    Plotly.update( result.chart.dom, chartData, result.chart.layout )

}

function checkValidity() {

	console.warn( 'not implemented' );

}

function addButton( table ) {

	table.history = [];

	const addButton = new UIText( '+' ).setClass( 'item' ).onClick( () => {

		const n = table.rows[ 0 ].cells.length;
		const row = table.insertRow();
		const pop = table.history.pop();
		Array( n ).fill().map( ( e, i ) => row.insertCell().textContent = pop? pop[ i ] : '' );

	});

	const minusButton = new UIText( '-' ).setClass( 'item' ).onClick( () => {

		table.history.push( table.removeRow().cells.map( e => e.textContent ) );

	});

	return [ addButton, minusButton ]

}

export { ViewportSTA, runSTA, runClassLib, addButton };
