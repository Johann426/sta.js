import { UIDiv, UITabbedPanel, UIText } from './ui.js';
import { UITable } from './UITable.js';
import { particularTab } from './gui/particularTab.js';
import { modeltestTab } from './gui/modeltestTab.js';
import { measuredTab } from './gui/measuredTab.js';
import { correctionTab } from './gui/correctionTab.js';
import { resultTab } from './gui/resultTab.js';

class ViewportSTA extends UIDiv{

	constructor( ship ) {

		super();
		this.ship = ship;
		this.setId( 'viewportSTA' );

		const tabbedPanel = new UITabbedPanel();
		this.add( tabbedPanel );
		
		const particular = new particularTab( this, ship );
		const modeltest = new modeltestTab( ship );
		const correction = new correctionTab( this, ship );
		const measured = new measuredTab( ship );
		const result = new resultTab( ship );
		
		tabbedPanel.setId( 'tabbedPanel' )
		tabbedPanel.addTab( 'particular', 'Particular', particular );
		tabbedPanel.addTab( 'model', 'Model test', modeltest );
		tabbedPanel.addTab( 'correction', 'Correction', correction );
		tabbedPanel.addTab( 'measured', 'Measured data', measured );
		tabbedPanel.addTab( 'result', 'Result', result );
		tabbedPanel.select( 'result' );

		Object.assign( this, { particular, modeltest, measured, correction, result } )

	}

	clear() {

		const { particular, modeltest, correction, measured, result } = this;

		particular.tables.map( table => table.clear() );
		modeltest.tables.map( table => table.clear() );
		correction.wind.table.clear();
		correction.wave.table.clear();
		measured.table.clear();
		result.tables.map( table => table.clear() );
		
	}

	readModelTest() {

		const { modeltest, ship } = this;

		modeltest.tables.slice( 0, 3 ).map( ( table, k ) => {

			const data = table.getColumnWiseData();
			const key = k == 0 ? 'trial' : k == 2 ? 'eedi' : 'contract';
		
			ship.mt[ key ].vs = data.speed;
			ship.mt[ key ].pb = data.power;
			ship.mt[ key ].rpm = data.rpm;

		} );

		const res = modeltest.tables[ 3 ].getColumnWiseData();
		ship.mt.res.vs = res.vs;
		ship.mt.res.cts = res.ct0;

		const sp = modeltest.tables[ 4 ].getColumnWiseData();
		ship.mt.sp.vs = sp.vs;
		ship.mt.sp.wtm = sp.wtm;
		ship.mt.sp.t = sp.t;
		ship.mt.sp.etar = sp.etar;
		ship.mt.sp.etad = sp.etad;
		ship.mt.sp.xip = sp.xip;
		ship.mt.sp.xin = sp.xin;
		ship.mt.sp.xiv = sp.xiv;

		const pow = modeltest.tables[ 5 ].getColumnWiseData();
		ship.mt.pow.j = pow.j;
		ship.mt.pow.kt = pow.kt;
		ship.mt.pow.kq = pow.kq;

	}

	readMeasured() {

		const { measured, ship } = this;

		const data = measured.table.getData();

		ship.load = data[ 'engineload' ];
		ship.time = data[ 'datetime' ];
		ship.hdg = data[ 'heading' ];
		ship.sog = data[ 'shipspeed' ];
		ship.rpmPORT = data[ 'rpmport' ];
		ship.rpmSTBD = data[ 'rpmstbd' ];
		ship.rpm = data[ 'rpm' ];
		ship.powerPORT = data[ 'powerport' ];
		ship.powerSTBD = data[ 'powerstbd' ];
		ship.power = data[ 'power' ];
		ship.wind_v = data[ 'windvelocity' ];
		ship.wind_d = data[ 'winddirection' ];
		ship.wave.height = data[ 'waveheight' ];
		ship.wave.angle = data[ 'wavedirection' ];
		ship.wave.period = data[ 'waveperiod' ];
		ship.swell.height = data[ 'swellheight' ];
		ship.swell.angle = data[ 'swelldirection' ];
		ship.swell.period = data[ 'swellperiod' ];
		ship.drift = data[ 'drift' ];
		ship.rudderPORT = data[ 'rudderport' ];
		ship.rudderSTBD = data[ 'rudderstbd' ];
		ship.rudder = data[ 'rudder' ];

	}

	readCorrection() {

		const { correction, ship } = this;
		const { wind, wave, current, temperature, displacement, shallowWater } = correction;

		// Guideline
		ship.st.guideline = correction.guideline.getValue();
		
		// Current
		ship.st.currentMethod = current.method.getValue();
		ship.st.currentMethod2002 = current.method2002.getValue();

		// Wind
		ship.st.windMethod = wind.method.getValue();
		ship.st.windAverage = wind.useAverage.getValue();
		const cx = wind.table.getColumnWiseData();
		ship.wind.angle = cx.angle;
		ship.wind.coef = cx.cx;

		// Wave
		ship.st.waveMethod = wave.method.getValue();
		ship.st.waveMethod2002 = wave.method2002.getValue();

		[ 'lbwl', 'le', 'lr', 'kyy', 'lcg', 'tcg', 'vcg', 'kroll', 'kpitch', 'kyaw', 'bf', 'cu' ].map( key => {
			
			const txt = wave[ key ].getValue();
			ship[ key ] = txt ? parseFloat( txt ) : '';

		} );

		const data = wave.table.getColumnWiseData();

		ship.nmriGeom = {
			x: data[ 'longitudinalxposition' ],
			bhalf: data[ 'halfbreadth' ],
			draft: data[ 'sectionaldraft' ],
			area: data[ 'sectionalarea' ]
		};

		// Temperature
		[ 'rhos', 'rho0', 'temps', 'temp0' ].map( key => {

			const txt = temperature[ key ].getValue();
			ship[ key ] = txt ? parseFloat( txt ) : '';

		} );

		// Displacement
		[ 'disp', 'dispm' ].map( key => {
			
			const txt = displacement[ key ].getValue();
			ship[ key ] = txt ? parseFloat( txt ) : '';

		} );

		// Shallow water
		[ 'Am', 'h' ].map( key => {
			
			const txt = shallowWater[ key ].getValue();
			ship[ key ] = txt ? parseFloat( txt ) : '';

		} );

	}

}

function runClassLib( ship, result ) {

	console.log( 'it depends on class library in server method' )

	sendData( ship );

	async function sendData( value ) { 
		
		$.ajax({ 
			url: '/process',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify( value ),
			success: function(response) {
				console.log('success');
				console.log( response );
				resTable( response, result.tables[ 1 ] );
			}, 
			error: function(error) { 
				console.log(error);
			}
		});

	}

}

function resTable( res, table ) {

	const { vwr, dwr, vwt, dwt, vwtAve, dwtAve, vwtRef, vwrRef, dwrRef, caa, raa } = res;
	const { wave, swell, raw, ras, delr, pid, stw, pb } = res;

	let row;

	row = table.rows[ 14 ];
	vwr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 15 ];
	dwr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 16 ];
	vwt.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 17 ];
	dwt.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 18 ];
	vwtAve.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 19 ];
	dwtAve.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 20 ];
	vwtRef.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 21 ];
	vwrRef.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 22 ];
	dwrRef.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 23 ];
	caa.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 24 ];
	raa.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 3 ) : row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.rows[ 25 ];
	wave.rawm.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 26 ];
	wave.rawr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 27 ];
	wave.total.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 28 ];
	swell.rawm.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 29 ];
	swell.rawr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 30 ];
	swell.total.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.rows[ 31 ];
	raw.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 32 ];
	ras.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 33 ];
	delr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 2 ) : row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.rows[ 34 ];
	pid.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 0 ) : row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

	row = table.rows[ 35 ];
	stw.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 3 ) : row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.rows[ 36 ];
	pb.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e.toFixed( 0 ) : row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

}

function runSTA( ship, result ) { //result: UIDiv

	checkValidity( ship );
	
	result.tables.map( table => table.clear() );

	// Measured data
	const { load, time, hdg, sog, rpm, power, wind_v, wind_d } = ship;

    [ load, time, hdg, sog, rpm, power, wind_v, wind_d ].map( ( arr, i ) => {

		result.tables.map( table => {

			const row = table.rows[ i ];
			arr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e : row.insertCell().textContent = e );

		} );

	} );

	[ ship.wave, ship.swell ].map( ( wave, j ) => {

		const { height, angle, period } = wave;

		[ height, angle, period ].map( ( arr, i ) => {

			result.tables.map( table => {

				const row = table.rows[ i + 8 + j * 3 ];
				arr.map( ( e, i ) => row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e : row.insertCell().textContent = e );

			} );
	
		} );

	} );

	const res = ship.analysis( ship.mt.trial, ship.mt.contract );
	
	const { stw, pb, powerOffset, speedAtNCR, speedAtNCRLoaded } = res;

	resTable( res, result.tables[ 0 ] );

	// Temperature to density
	// wind resistance
	// wave resistance
	// water temperature salinity
	// current correction
	// speed-power
	runClassLib( ship, result ); // run class library(.dll)
	
	let row;
	const table2 = new UITable();
	result.add( table2 );
	row = table2.insertRow();
	row.insertHeader().textContent = "NCR";
	row.insertHeader().textContent = ship.ncr[ 1 ] + ' (kW)';
	row = table2.insertRow();
	row.insertHeader().textContent = "Sea Margin";
	row.insertHeader().textContent = ship.sm + ' (%)';
	row = table2.insertRow();
	row.insertHeader().textContent = "Speed at NCR with s.m.";
	row.insertHeader().textContent = speedAtNCRLoaded.toFixed( 3 ) + ' (knots)';

	

	// Speed-power chart
	const mt = ship.mt;
    const chartData = result.chart.data;
	const chartLayout = result.chart.layout;
	chartData[ 0 ].x = mt.trial.vs;
	chartData[ 0 ].y = mt.trial.pb;
	chartData[ 1 ].x = mt.contract.vs;
	chartData[ 1 ].y = mt.contract.pb;
	chartData[ 2 ].x = mt.trial.vs;
	chartData[ 2 ].y = mt.trial.pb.map( e => e + powerOffset );
	chartData[ 3 ].x = mt.contract.vs;
	chartData[ 3 ].y = mt.contract.pb.map( e => e + powerOffset );
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

function checkValidity( ship ) { // Check every data read from table

	[ 'trial', 'contract', 'eedi' ].map( condition => {

		const obj = ship.mt[ condition ];

		[ 'vs', 'pb', 'rpm' ].map( key => {

			const arr = obj[ key ];
			// obj[ key ] = arr.filter( v => Boolean( v ) || v === 0 );
			obj[ key ] = arr.filter( v => !Number.isNaN( v ) );

		} )

	} );

	[ 'vs', 'cts' ].map( key => {

		const arr = ship.mt.res[ key ];
		ship.mt.res[ key ] = arr.filter( v => !Number.isNaN( v ) );

	} );

	[ 'vs', 'wtm', 't', 'etar', 'etad', 'xip', 'xin', 'xiv' ].map( key => {

		const arr = ship.mt.sp[ key ];
		ship.mt.sp[ key ] = arr.filter( v => !Number.isNaN( v ) );

	} );

	[ 'j', 'kt', 'kq' ].map( key => {

		const arr = ship.mt.pow[ key ];
		ship.mt.pow[ key ] = arr.filter( v => !Number.isNaN( v ) );

	} );

	[ 'x', 'bhalf', 'draft', 'area' ].map( key => {

		const arr = ship.nmriGeom[ key ];
		ship.nmriGeom[ key ] = arr.filter( v => !Number.isNaN( v ) );

	} );

	[ 'load', 'time', 'hdg', 'sog', 'rpm', 'power', 'wind_v', 'wind_d', 'drift', 'rudder' ].map( key => {

		const arr = ship[ key ];
		ship[ key ] = arr.filter( v => !Number.isNaN( v ) );

	} );
	
	[ ship.wave, ship.swell ].map( wave => {

		[ 'period', 'angle', 'height' ].map( key => {

			const arr = wave[ key ];
			wave[ key ] = arr.filter( v => !Number.isNaN( v ) );

		})

	} );

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
