import { besselj, bessely, besseli, besselk } from './bessel.js';
import { f } from './Interpolation.js';

class Ship {

	constructor() {

		this.table = document.getElementById( "table1" );
		this.initialize();

	}

	initialize() {

		const table = this.table;

		// loads
		this.load = [ 65, 75, 75, 85, 100 ];
		// heading
		this.hdg = [ 20, 200, 20, 200, 20, 200, 20, 200, 20, 200 ];
		// speed over ground
		this.sog = [ 21.39, 21.29, 22.34, 22.24, 22.34, 22.24, 23.22, 23.12, 24.18, 24.08 ];
		// shaft speed [rpm]
		this.rpm = [ 69.7, 69.7, 73.1, 73.1, 73.1, 73.1, 76.3, 76.3, 79.6, 79.6 ];
		// shaft power [kW]
		this.power = [ 28722, 28722, 33140, 33140, 33140, 33140, 37559, 37559, 42721, 42721 ];
		// wind
		this.wind_v = [ 12.0, 10.0, 12.5, 10.5, 12.5, 10.5, 12.9, 10.9, 13.4, 11.4 ];
		this.wind_d = [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ];
		this.Za = Number( document.getElementById( "Za" ).innerHTML );
		this.Zref = Number( document.getElementById( "Zref" ).innerHTML );
		this.wind = {
			angle: [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360 ],
			coef: [ -1.306,-1.517,-1.691,-1.761,-1.734,-1.595,-1.327,-1.008,-0.665,-0.362,-0.025,0.316,0.763,1.193,1.524,1.776,1.773,1.636,1.445,1.625,1.807,1.813,1.667,1.346,0.937,0.508,0.166,-0.23,-0.571,-0.902,-1.223,-1.453,-1.627,-1.636,-1.589,-1.395,-1.306 ]
		};

		this.wave = [];
		[ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ].map( ( e, i ) => this.wave[ i ] = { height: e } );
		[ 0, 180, 0, 180, 0, 180, 0, 180, 0, 180 ].map( ( e, i ) => this.wave[ i ].angle = e );
		[ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 ].map( ( e, i ) => this.wave[ i ].period = e );

		this.swell = [];
		[ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ].map( ( e, i ) => this.swell[ i ] = { height: e } );
		[ 0, 180, 0, 180, 0, 180, 0, 180, 0, 180 ].map( ( e, i ) => this.swell[ i ].angle = e );
		[ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 ].map( ( e, i ) => this.swell[ i ].period = e );

		this.hdg.map( ( e, i ) => document.getElementById( "hdg" ).cells[ i + 1 ].innerHTML = e.toFixed( 0 ) );
		this.sog.map( ( e, i ) => document.getElementById( "sog" ).cells[ i + 1 ].innerHTML = e.toFixed( 2 ) );
		this.rpm.map( ( e, i ) => document.getElementById( "rpm" ).cells[ i + 1 ].innerHTML = e.toFixed( 1 ) );
		this.power.map( ( e, i ) => document.getElementById( "power" ).cells[ i + 1 ].innerHTML = e.toFixed( 0 ) );
		this.wind_v.map( ( e, i ) => document.getElementById( "vWind" ).cells[ i + 1 ].innerHTML = e.toFixed( 1 ) );
		this.wind_d.map( ( e, i ) => document.getElementById( "dWind" ).cells[ i + 1 ].innerHTML = e.toFixed( 1 ) );

		this.wave.map( ( e, i ) => {

			document.getElementById( "hWave" ).cells[ i + 1 ].innerHTML = e.height.toFixed( 1 );
			document.getElementById( "aWave" ).cells[ i + 1 ].innerHTML = e.angle.toFixed( 1 );
			document.getElementById( "pWave" ).cells[ i + 1 ].innerHTML = e.period.toFixed( 1 );

		} );

		this.swell.map( ( e, i ) => {

			document.getElementById( "hSwell" ).cells[ i + 1 ].innerHTML = e.height.toFixed( 1 );
			document.getElementById( "aSwell" ).cells[ i + 1 ].innerHTML = e.angle.toFixed( 1 );
			document.getElementById( "pSwell" ).cells[ i + 1 ].innerHTML = e.period.toFixed( 1 );

		} );

	}

	RAW() {

		const table = document.createElement( 'table' );
		document.body.appendChild( table );
		const nm1 = this.hdg.length - 1;
		const header = table.createTHead();
		header.insertRow( 0 ).insertCell( 0 );
		header.rows[ 0 ].cells[ 0 ].colSpan = nm1 + 2;
		header.rows[ 0 ].cells[ 0 ].innerHTML = 'Resistance increase due to waves';
		header.rows[ 0 ].cells[ 0 ].style.fontWeight = 'bold';

		const wave = this.wave;
		const swell = this.swell;

		let row1, row2, row3, row4, row5, row6, row7, row8, row9;

		row1 = table.insertRow();
		row2 = table.insertRow();
		row3 = table.insertRow();
		row4 = table.insertRow();
		row5 = table.insertRow();
		row6 = table.insertRow();
		row7 = table.insertRow();
		row8 = table.insertRow();
		row9 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = 'Wave(Seas) height (m)';
		row2.insertCell( - 1 ).innerHTML = 'Wave(Seas) angle (°)';
		row3.insertCell( - 1 ).innerHTML = 'Wave(Seas) period (sec)';
		row4.insertCell( - 1 ).innerHTML = 'RAW - Seas (kN) ';
		row5.insertCell( - 1 ).innerHTML = 'Swell height (m)';
		row6.insertCell( - 1 ).innerHTML = 'Swell angle (°)';
		row7.insertCell( - 1 ).innerHTML = 'Swell period (sec)';
		row8.insertCell( - 1 ).innerHTML = 'RAW - Swell (kN) ';
		row9.insertCell( - 1 ).innerHTML = 'RAW - Total (kN) ';

		for ( let i = 0; i <= nm1; i ++ ) {

			row1.insertCell( - 1 ).innerHTML = wave[ i ].height.toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = wave[ i ].angle.toFixed( 2 );
			row3.insertCell( - 1 ).innerHTML = wave[ i ].period.toFixed( 2 );
			row5.insertCell( - 1 ).innerHTML = swell[ i ].height.toFixed( 2 );
			row6.insertCell( - 1 ).innerHTML = swell[ i ].angle.toFixed( 2 );
			row7.insertCell( - 1 ).innerHTML = swell[ i ].period.toFixed( 2 );

		}

		const rawm = []; //motion induced
		const rawr = []; //reflection induced

		const l = Number( document.getElementById( "lpp" ).innerHTML );
		const b = Number( document.getElementById( "beam" ).innerHTML );
		const tf = Number( document.getElementById( "tf" ).innerHTML );
		const ta = Number( document.getElementById( "ta" ).innerHTML );
		const rho = Number( document.getElementById( "rhos" ).innerHTML );
		const cb = Number( document.getElementById( "cb" ).innerHTML );
		const kyy = Number( document.getElementById( "kyy" ).innerHTML );
		const le = Number( document.getElementById( "le" ).innerHTML );
		const lr = Number( document.getElementById( "lr" ).innerHTML );
		const lbwl = Number( document.getElementById( "lbwl" ).innerHTML );
		const vs = 14.8;

		//STA1
		for ( let i = 0; i <= nm1; i ++ ) {

			let raw, ras, a;

			raw = 1 / 16 * rho * 9.807 * wave[ i ].height ** 2 * b * Math.sqrt( b / lbwl );
			a = wave[ i ].angle;
			raw = a <= 45 || a >= 315 ? raw : 0;
			row4.insertCell( - 1 ).innerHTML = raw.toFixed( 2 );

			ras = 1 / 16 * rho * 9.807 * swell[ i ].height ** 2 * b * Math.sqrt( b / lbwl );
			a = swell[ i ].angle;
			ras = a <= 45 || a >= 315 ? ras : 0;
			row8.insertCell( - 1 ).innerHTML = ras.toFixed( 2 );

			row9.insertCell( - 1 ).innerHTML = ( raw + ras ).toFixed( 2 );

		}

		//SNNM
		const angle = 135;
		let tb = document.createElement( 'table' );
		document.body.appendChild( tb );
		row1 = tb.insertRow();
		row1.insertCell( - 1 ).innerHTML = "lamda / L";
		row1.insertCell( - 1 ).innerHTML = "w'";
		row1.insertCell( - 1 ).innerHTML = "b1";
		row1.insertCell( - 1 ).innerHTML = "d1";
		row1.insertCell( - 1 ).innerHTML = "Kawm";
		row1.insertCell( - 1 ).innerHTML = "T12";
		row1.insertCell( - 1 ).innerHTML = "T34";
		row1.insertCell( - 1 ).innerHTML = "alphaT12";
		row1.insertCell( - 1 ).innerHTML = "alphaT34";
		row1.insertCell( - 1 ).innerHTML = "f(alpha)";
		row1.insertCell( - 1 ).innerHTML = "Kawr1";
		row1.insertCell( - 1 ).innerHTML = "Kawr2";
		row1.insertCell( - 1 ).innerHTML = "Kawr3";
		row1.insertCell( - 1 ).innerHTML = "Kawr4";
		row1.insertCell( - 1 ).innerHTML = "Kaw";

		for ( let i = 0; i <= 46; i ++ ) {

			const lamdaOverL = 0.2 + 0.05 * i;
			const lamda = lamdaOverL * l;
			const res = snnm( l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda );
			row1 = tb.insertRow();
			row1.insertCell( - 1 ).innerHTML = lamdaOverL.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.omega.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.b1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.d1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawm.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.t12.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.t34.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.at12.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.at34.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.fa.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawr1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawr2.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawr3.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawr4.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kwave.toFixed( 4 );

		}

		//STA2
		const res2 = sta2( l, b, 0.5 * ( tf + ta ), cb, kyy, vs, angle, 2.5 * l );
		console.log( res2 );

	}

	RAA() {

		const table = this.table; //document.createElement( 'table' );
		//document.body.appendChild( table );
		const nm1 = this.hdg.length - 1;
// 		const header = table.createTHead();
// 		header.insertRow( 0 ).insertCell( 0 );
// 		header.rows[ 0 ].cells[ 0 ].colSpan = nm1 + 2;
// 		header.rows[ 0 ].cells[ 0 ].innerHTML = 'Resistance increase due to wind';
// 		header.rows[ 0 ].cells[ 0 ].style.fontWeight = 'bold';

		const ave = true;
		const vwt = [];
		const dwt = [];
		let row1, row2, row3;

		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "Relative wind velocity at anemometer height (m/s)";
		row2.insertCell( - 1 ).innerHTML = "Relative wind direction at anemometer height (°)";

		for ( let i = 0; i <= nm1; i ++ ) {

			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ];

			row1.insertCell( - 1 ).innerHTML = vwr.toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = dwr.toFixed( 1 );

		}

		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "True wind velocity at anemometer height (m/s)";
		row2.insertCell( - 1 ).innerHTML = "True wind direction at anemometer height (°)";

		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = this.hdg[ i ] * pi / 180.0;
			const sog = this.sog[ i ] * 0.514444444;
			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ] * pi / 180.0;
			vwt[ i ] = M.sqrt( vwr * vwr + sog * sog - 2.0 * vwr * sog * M.cos( dwr ) );
			const y = vwr * M.sin( dwr + hdg ) - sog * M.sin( hdg );
			const x = vwr * M.cos( dwr + hdg ) - sog * M.cos( hdg );
			dwt[ i ] = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;

			row1.insertCell( - 1 ).innerHTML = vwt[ i ].toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = ( dwt[ i ] * 180.0 / pi ).toFixed( 1 );

		}

		// Averaging process for the true wind velocity and direction
		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "True wind velocity at anemometer height, double run averaged (m/s)";
		row2.insertCell( - 1 ).innerHTML = "True wind direction at anemometer height, double run averaged (°)";

		for ( let i = 0; i <= nm1; i ++ ) {

			if ( i % 2 === 0 ) {

				const y = 0.5 * ( vwt[ i ] * M.sin( dwt[ i ] ) + vwt[ i + 1 ] * M.sin( dwt[ i + 1 ] ) );
				const x = 0.5 * ( vwt[ i ] * M.cos( dwt[ i ] ) + vwt[ i + 1 ] * M.cos( dwt[ i + 1 ] ) );
				vwt[ i ] = M.sqrt( x * x + y * y );
				dwt[ i ] = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;

			} else {

				vwt[ i ] = vwt[ i - 1 ];
				dwt[ i ] = dwt[ i - 1 ];

			}

			row1.insertCell( - 1 ).innerHTML = vwt[ i ].toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = ( dwt[ i ] * 180.0 / pi ).toFixed( 1 );

		}

		row1 = table.insertRow();
		row2 = table.insertRow();
		row3 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "True wind velocity at reference height (m/s)";
		row2.insertCell( - 1 ).innerHTML = "Relative wind velocity at reference height (m/s)";
		row3.insertCell( - 1 ).innerHTML = "Relative wind direction at reference height (°)";
		this.vwrRef = [];
		this.dwrRef = [];

		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = this.hdg[ i ] * pi / 180.0;
			const sin = M.sin( dwt[ i ] - hdg );
			const cos = M.cos( dwt[ i ] - hdg );
			const sog = this.sog[ i ] * 0.514444444;

			const Za = this.Za;
			const Zref = this.Zref;
			const corr = M.pow( Zref / Za, 1 / 7 );
			const vwtRef = vwt[ i ] * corr;
			const vwrRef = M.sqrt( vwtRef * vwtRef + sog * sog + 2.0 * vwtRef * sog * cos );
			this.vwrRef[ i ] = vwrRef;
			const y = vwtRef * sin;
			const x = sog + vwtRef * cos;
			const dwrRef = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;
			this.dwrRef[ i ] = dwrRef * 180.0 / pi;

			row1.insertCell( - 1 ).innerHTML = vwtRef.toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = vwrRef.toFixed( 2 );
			row3.insertCell( - 1 ).innerHTML = ( dwrRef * 180.0 / pi ).toFixed( 1 );

		}

		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "Wind coefficient";
		row2.insertCell( - 1 ).innerHTML = "RAA (kN)";


		const a = this.wind.angle;
		const cx = this.wind.coef;
		const d = this.dwrRef;
		const res = f( a, cx, d );

		const vw = this.vwrRef;
		const vs = this.sog.map( e => e * 0.51444 );

		const rho = Number( document.getElementById( "rhoa" ).innerHTML );
		const Ax = Number( document.getElementById( "Ax" ).innerHTML );

		for ( let i = 0; i <= nm1; i ++ ) {

			row1.insertCell( - 1 ).innerHTML = res[ i ].toFixed( 2 );
			const raa = 0.5 * rho * res[ i ] * Ax * vw[ i ] ** 2 - 0.5 * rho * cx[ 0 ] * Ax * vs[ i ] ** 2;
			row2.insertCell( - 1 ).innerHTML = ( 0.001 * raa ).toFixed( 2 );

		}

	}

}

const M = Math;
const pi = M.PI;
const g = 9.807; //9.80665;

init();

function init() {

	const ship = new Ship();
	ship.RAA();
	ship.RAW();

}

function snnm( l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda ) {

	const alpha = angle <= 180 ? angle * pi / 180 : ( 360 - angle ) * pi / 180;
	const cosa = M.cos( alpha );
	const cos2a = M.cos( 2 * alpha );
	const td = M.max( tf, ta );
	const w = M.sqrt( 2 * pi * g / lamda );
	const u = vs * 1852 / 3600;
	const Fr = u / M.sqrt( g * l );
	const omega = 2.142 * M.cbrt( kyy ) * M.sqrt( l / lamda ) * M.pow( cb / 0.65, 0.17 )
				* ( 1 - 0.111 / cb * ( M.log( b / td ) - M.log( 2.75 ) ) )
				* ( ( - 1.377 * Fr ** 2 + 1.157 * Fr ) * M.abs( cosa ) + 0.618 * ( 13 + cos2a ) / 14 );
	const vg = 0.5 * g / w;
	const Fr_rel = ( u - vg ) / M.sqrt( g * l );
	const cala1 = ( a ) => {

		const a90 = M.pow( 0.87 / cb, ( 1 + Fr ) * M.cos( a ) ) / M.log( b / td ) * ( 1 + 2 * M.cos( a ) ) / 3; // use M.cos( a ) instead of cosa
		const api = u > vg && Fr_rel >= 0.12 ? M.pow( 0.87 / cb, 1 + Fr_rel ) / M.log( b / td ) : ( 0.87 / cb ) / M.log( b / td );

		if ( a >= 0 && a <= pi / 2 ) {

			return a90;

		} else if ( a == pi ) {

			return api;

		} else {

			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			return a90 + ( api - a90 ) * ratio;

		}

	};

	let a1 = cala1( alpha );
	const cala2 = ( a ) => {

		const a90 = Fr < 0.12 ? 0.0072 + 0.1676 * Fr : M.pow( Fr, 1.5 ) * M.exp( - 3.5 * Fr );

		const api = u <= vg ? 0.0072 * ( 2 * u / vg - 1 ) : Fr_rel < 0.12 ? 0.0072 + 0.1676 * Fr_rel : M.pow( Fr_rel, 1.5 ) * M.exp( - 3.5 * Fr_rel );

		if ( a >= 0 && a <= pi / 2 ) {

			return a90;

		} else if ( a == pi ) {


			return api;

		} else {

			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			return a90 + ( api - a90 ) * ratio;

		}

	};

	let a2 = cala2( alpha );
	const atan = M.atan( M.abs( ta - tf ) / l );
	const a3 = 1.0 + 28.7 * atan;
	const b1 = omega < 1 ? 11.0 : - 8.5;
	const d1 = omega < 1 ? 566 * M.pow( l * cb / b, - 2.66 ) : - 566 * M.pow( l / b, - 2.66 ) * ( 4 - 125 * atan );

	const calKawm = ( a ) => {

		if ( a > pi / 2 && a < pi ) {

			a1 = cala1( pi / 2 );
			a2 = cala2( pi / 2 );
			const k90 = 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );
			a1 = cala1( pi );
			a2 = cala2( pi );
			const kpi = 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );
			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			//console.log( k90, kpi );
			return k90 + ( kpi - k90 ) * ratio;

		} else {

			return 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );

		}

	};

	var kawm = calKawm( alpha );

	const E1 = M.atan( 0.99 * 0.5 * b / le );
	const E2 = M.atan( 0.99 * 0.5 * b / lr );
	const fa = alpha <= E1 ? cosa : 0;
	const t12 = td;
	const t34 = cb <= 0.75 ? td * ( 4 + M.sqrt( M.abs( cosa ) ) ) / 5 : td * ( 2 + M.sqrt( M.abs( cosa ) ) ) / 3;
	const at12 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t12 / lamda - t12 / ( 2.5 * l ) ) ) : 0;
	const at34 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t34 / lamda - t34 / ( 2.5 * l ) ) ) : 0;
	var kawr1 = alpha <= pi - E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	var kawr2 = alpha <= E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	var kawr3 = E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	var kawr4 = pi - E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;





	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return {
  	omega: omega,
		b1: b1,
		d1: d1,
		kawm: kawm,
  	t12: t12,
		t34: t34,
		at12: at12,
		at34: at34,
		fa: fa,
		kawr1: kawr1,
		kawr2: kawr2,
		kawr3: kawr3,
		kawr4: kawr4,
  	kwave: kawm + kawr1 + kawr2 + kawr3 + kawr4
	};

}

function sta2( l, b, tm, cb, kyy, vs, angle, lamda ) {

	const table = document.createElement( 'table' );
	document.body.appendChild( table );
	let row1;
	row1 = table.insertRow();
	row1.insertCell( - 1 ).innerHTML = "lamda / L";
	row1.insertCell( - 1 ).innerHTML = "w'";
	row1.insertCell( - 1 ).innerHTML = "w1";
	row1.insertCell( - 1 ).innerHTML = "a1";
	row1.insertCell( - 1 ).innerHTML = "b1";
	row1.insertCell( - 1 ).innerHTML = "d1";
	row1.insertCell( - 1 ).innerHTML = "raw(w)";
	row1.insertCell( - 1 ).innerHTML = "f1";
	row1.insertCell( - 1 ).innerHTML = "I1";
	row1.insertCell( - 1 ).innerHTML = "K1";
	row1.insertCell( - 1 ).innerHTML = "alpha(w)";
	row1.insertCell( - 1 ).innerHTML = "Kaw";


	for ( let i = 0; i <= 46; i ++ ) {

		        const lamdaOverL = 0.2 + 0.05 * i;
		        lamda = lamdaOverL * l;

		const Fr = vs * 1852 / 3600 / M.sqrt( g * l );
		const omega = M.sqrt( 2 * pi * g / lamda );

		const omegaBar = M.sqrt( l / g ) * M.cbrt( kyy ) / ( 1.17 * M.pow( Fr, - 0.143 ) ) * omega;
		const a1 = 60.3 * M.pow( cb, 1.34 );
		const b1 = omegaBar < 1 ? 11.0 : - 8.50;
		const d1 = omegaBar < 1 ? 14.0 : - 566 * M.pow( l / b, - 2.66 );
		var raw = M.pow( omegaBar, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omegaBar, d1 ) ) ) * a1 * M.pow( Fr, 1.50 ) * M.exp( - 3.5 * Fr );

		const k = omega ** 2 / g;
		const x = 1.5 * k * tm;
		const I1 = besseli( x, 1 );
		const K1 = besselk( x, 1 );
		const f1 = 0.692 * M.pow( vs * 1852 / 3600 / M.sqrt( tm * g ), 0.769 ) + 1.81 * M.pow( cb, 6.95 );
		var alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 ) * f1;

		row1 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = ( lamda / l ).toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = omega.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = omegaBar.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = a1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = b1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = d1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = raw.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = f1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = I1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = K1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = alpha1.toFixed( 4 );
		row1.insertCell( - 1 ).innerHTML = ( raw + alpha1 / 8 * l / b ).toFixed( 4 );

	}

	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return { rawm: raw,
		 rawr: alpha1 / 8 * l / b };

}

function spectrum( h, t, type ) {

	/*
	h : significant wave height
	t : mean period
	type == 0, for wind waves, the modified Pierson-Moskowitz type frequency spectrum of ITTC 1978
	type == 1, for the narrow band wave spectrum, the JONSWAP frequency spectrum
	*/

	const t4 = t ** 4;
	const w = 2 * pi / t;
	const w4 = w ** 4;
	const w5 = w ** 5;

	function CalcSn( type ) {

		if ( type === 0 ) {

			const Af = 173 * h ** 2 / t4;
			const Bf = 691 / t4;
			return Af / w5 * M.exp( - Bf / w4 );

		} else {

			const pi4 = ( 2 * pi ) ** 4;
			const Af = pi4 * 0.072 * h ** 2 / t4;
			const Bf = pi4 * 0.44 / t4;
			const sigma = w <= 2 * pi / ( 1.3 * t ) ? 0.07 : 0.09;
			const exp = M.exp( - 0.5 * ( 1.3 * t * w / ( 2 * pi - 1 ) / sigma ) ** 2 );
			return Af / w5 * M.exp( - Bf / w4 ) * M.pow( 3.3, exp );

		}

	}

	const wp = 0.772 * w; // =(4/5·Bf)^0.25, spectral peak frequency
	const w001 = 0.652 * wp; // thresholds 0.1 %
	const w999 = 5.946 * wp; // thresholds 99.9 %
	// 99.8 % of the energy is within the range w001 < w < w999



}


