import { array } from './index.esm.js';
import { besseli, besselk } from './bessel.js';
import { f } from './Interpolation.js';

const M = Math;
const pi = M.PI;
const g = 9.80665; //9.807 staimo ?

class Ship {

	constructor() {

		this.table = document.getElementById( "table1" );
		this.initialize();

	}

	initialize() {

		const table = this.table;

		// loads 3322 임시 데이터
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

		this.mt = {
			'vs'  : [ 14.0, 14.5, 15.0, 15.5, 16.0, 16.5, 17.0, 17.5, 18.0, 18.5, 19.0, 19.5, 20.0, 20.5, 21.0, 21.5, 22.0, 22.5, 23.0, 23.5, 24.0, 24.5, 25.0, 25.5, 26.0 ],
			't'   : [ 0.209, 0.205, 0.202, 0.200, 0.198, 0.196, 0.196, 0.194, 0.193, 0.191, 0.190, 0.189, 0.188, 0.188, 0.190, 0.191, 0.192, 0.192, 0.191, 0.189, 0.188, 0.186, 0.183, 0.181, 0.178 ],
			'wtm' : [ 0.379, 0.378, 0.378, 0.378, 0.376, 0.375, 0.373, 0.372, 0.372, 0.373, 0.375, 0.377, 0.378, 0.379, 0.379, 0.379, 0.378, 0.378, 0.378, 0.377, 0.377, 0.375, 0.374, 0.371, 0.369 ],
			'etar': [ 1.007, 1.006, 1.006, 1.006, 1.007, 1.008, 1.010, 1.011, 1.013, 1.014, 1.014, 1.014, 1.015, 1.015, 1.016, 1.017, 1.017, 1.018, 1.018, 1.018, 1.019, 1.019, 1.020, 1.020, 1.021 ],
			'etad': [ 0.813, 0.816, 0.818, 0.820, 0.820, 0.821, 0.822, 0.822, 0.823, 0.826, 0.828, 0.830, 0.831, 0.831, 0.830, 0.829, 0.828, 0.828, 0.829, 0.830, 0.831, 0.832, 0.832, 0.833, 0.834 ],
			'cts' : [ 2.0923, 2.0977, 2.1036, 2.11, 2.1161, 2.1226, 2.13, 2.1391, 2.1493, 2.1602, 2.1716, 2.1834, 2.1958, 2.2088, 2.2216, 2.234, 2.2464, 2.2593, 2.2725, 2.2858, 2.2988, 2.3115, 2.3244, 2.3383, 2.3525 ]
		}

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

		const vg = this.sog;
		const wave = this.wave;
		const swell = this.swell;

		let row1, row2, row3, row4, row5, row6, row7, row8, row9;

		row1 = table.insertRow();
		row2 = table.insertRow();
		row3 = table.insertRow();
		// row4 = table.insertRow();
		row5 = table.insertRow();
		row6 = table.insertRow();
		row7 = table.insertRow();
		// row8 = table.insertRow();
		// row9 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = 'Wave(Seas) height (m)';
		row2.insertCell( - 1 ).innerHTML = 'Wave(Seas) angle (°)';
		row3.insertCell( - 1 ).innerHTML = 'Wave(Seas) period (sec)';
		// row4.insertCell( - 1 ).innerHTML = 'RAW - Seas (kN) ';
		row5.insertCell( - 1 ).innerHTML = 'Swell height (m)';
		row6.insertCell( - 1 ).innerHTML = 'Swell angle (°)';
		row7.insertCell( - 1 ).innerHTML = 'Swell period (sec)';
		// row8.insertCell( - 1 ).innerHTML = 'RAW - Swell (kN) ';
		// row9.insertCell( - 1 ).innerHTML = 'RAW - Total (kN) ';

		for ( let i = 0; i <= nm1; i ++ ) {

			row1.insertCell( - 1 ).innerHTML = wave[ i ].height.toFixed( 2 );
			row2.insertCell( - 1 ).innerHTML = wave[ i ].angle.toFixed( 2 );
			row3.insertCell( - 1 ).innerHTML = wave[ i ].period.toFixed( 2 );
			row5.insertCell( - 1 ).innerHTML = swell[ i ].height.toFixed( 2 );
			row6.insertCell( - 1 ).innerHTML = swell[ i ].angle.toFixed( 2 );
			row7.insertCell( - 1 ).innerHTML = swell[ i ].period.toFixed( 2 );

		}

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

		//STA1 result
		const row10 = table.insertRow();
		row10.insertCell( - 1 ).innerHTML = 'STA1 RAW - Seas (kN) ';
		for ( let i = 0; i <= nm1; i ++ ) {

			let raw, ras, a;

			raw = 1 / 16 * rho * 9.807 * wave[ i ].height ** 2 * b * Math.sqrt( b / lbwl );
			a = wave[ i ].angle;
			raw = a <= 45 || a >= 315 ? raw : 0;
			row10.insertCell( - 1 ).innerHTML = ( 0.001 * raw ).toFixed( 2 );

		}

		const coefSn = ( h, t01, type ) => {

			const t4 = t01 ** 4;
			let Af, Bf, fp, f001, f999;
	
			if ( type == 0 ) { //for wind waves, the modified Pierson-Moskowitz type frequency spectrum of ITTC 1978
	
				Af = 173 * h ** 2 / t4;
				Bf = 691 / t4;
				fp = M.pow( 0.8 * Bf, 0.25);
				f001 = 0.652 * fp;
				f999 = 5.946 * fp;
	
			} else if ( type == 1 ) { //for the narrow band wave spectrum, the JONSWAP(Joint North Sea Wave Observation Project) frequency spectrum
	
				const pi4 = ( 2 * pi ) ** 4 / t4;
				Af = pi4 * 0.072 * h ** 2;
				Bf = pi4 * 0.44;
				fp = M.pow( 0.8 * Bf, 0.25);
				const gamma = 3.3;
				f001 = 0.5 * fp; //( 0.6477 + 0.005357 * gamma - 0.0002625 * gamma ** 2 ) * fp;
				f999 = 6.0 * fp; //( 6.3204 - 0.4377 * gamma + 0.05261 * gamma ** 2 - 0.002839 * gamma ** 3 ) * fp;
	
			}
	
			return { // 99.8 % of the energy is within the range f001 < f < f999

				Af: Af,
				Bf: Bf,
				fp: fp, // spectral peak frequency
				fmin: f001, // thresholds 0.1 %
				fmax: f999 // thresholds 99.9 %

			}
		
		}

		const calcSn = ( t01, w, Af, Bf, type ) => {

			// const w = 2 * pi / t;
			const w4 = w ** 4;
			const w5 = w ** 5;
		
			if ( type == 0 ) { //for wind waves, the modified Pierson-Moskowitz type frequency spectrum of ITTC 1978
	
				return Af / w5 * M.exp( - Bf / w4 );
	
			} else if ( type == 1 ) { //for the narrow band wave spectrum, the JONSWAP frequency spectrum
	
				const sigma = w <= 2 * pi / ( 1.3 * t01 ) ? 0.07 : 0.09;
				const exp = M.exp( - 0.5 * ( ( 1.3 * t01 * w / 2 / pi - 1 ) / sigma ) ** 2 );
				return Af / w5 * M.exp( - Bf / w4 ) * M.pow( 3.3, exp );
	
			}
	
		}

		// const { Af, Bf, fp, fmin, fmax } = coefSn( 0.5, 8, 1 );
		
		// const res = [];
		// const n = 200;
		// let sum = 0;

		// for ( let i = 0; i <= n; i ++ ) {

		// 	const df = ( fmax - fmin ) / n
		// 	const omega = fmin + df * i;
		// 	const sn = calcSn( 4, omega, Af, Bf, 0 )
		// 	res.push( sn );
		// 	sum += sn * df;

		// }

		// console.log( Af, Bf, fp, fmin, fmax );
		// console.log( res );
		// console.log( 'm0=', sum );
		// console.log( 'm1', 0.306*Af/Bf**0.75)


		const arr =[];

		//STA2 result
		const row11 = table.insertRow();
		const row12 = table.insertRow();
		const row13 = table.insertRow();
		const row14 = table.insertRow();
		const row15 = table.insertRow();
		row11.insertCell( - 1 ).innerHTML = 'STA2 RAW motion - Seas (kN) ';
		row12.insertCell( - 1 ).innerHTML = 'STA2 RAW reflection - Seas (kN) ';
		row13.insertCell( - 1 ).innerHTML = 'STA2 RAW motion - Swell (kN) ';
		row14.insertCell( - 1 ).innerHTML = 'STA2 RAW reflection - Swell (kN) ';
		row15.insertCell( - 1 ).innerHTML = 'STA2 RAW - Total (kN) ';
		for ( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			let rawm; //motion induced resistance
			let rawr; //wave reflection
			let total = 0;

			for ( let j = 0; j <= 1; j ++ ) {

				const arr = j == 0 ? wave : swell;
				const h = arr[ i ].height;
				const a = arr[ i ].angle;
				const t = arr[ i ].period;

				const { Af, Bf, fmin, fmax } = coefSn( h, t, j );

				rawm = 0;
				rawr = 0;
				const n = 200;

				for( let i = 0; i < n; i ++ ) {

					const df = ( fmax - fmin ) / n;
					const f = fmin + df * i; // its not circular frequency
					const omega = f; // 2 * pi * f;
					const k = omega ** 2 / g;
					const lamda = 2.0 * pi / k;
					const res = sta2( l, b, 0.5 * ( tf + ta ), cb, kyy, vs, a, lamda );
					const rawml = 4.0 * rho * g * b * b / l * res.kawml;
					const rawrl = 0.5 * rho * g * b * res.alpha1;
					const sn = calcSn( t, omega, Af, Bf, j );
					rawm += 2 * rawml * sn * df;
					rawr += 2 * rawrl * sn * df;

				}

				if ( j == 0 ) {
				
					row11.insertCell( - 1 ).innerHTML = ( 0.001 * rawm ).toFixed( 2 );
					row12.insertCell( - 1 ).innerHTML = ( 0.001 * rawr ).toFixed( 2 );

				} else if ( j == 1 ) {

					row13.insertCell( - 1 ).innerHTML = ( 0.001 * rawm ).toFixed( 2 );
					row14.insertCell( - 1 ).innerHTML = ( 0.001 * rawr ).toFixed( 2 );

				}

				total += rawm + rawr;

			}

			arr.push( total );
			row15.insertCell( - 1 ).innerHTML = ( 0.001 * total ).toFixed( 2 );

		}

		//SNNM result
		const row16 = table.insertRow();
		const row17 = table.insertRow();
		const row18 = table.insertRow();
		const row19 = table.insertRow();
		const row20 = table.insertRow();
		row16.insertCell( - 1 ).innerHTML = 'SNNM RAW motion - Seas (kN) ';
		row17.insertCell( - 1 ).innerHTML = 'SNNM RAW reflection - Seas (kN) ';
		row18.insertCell( - 1 ).innerHTML = 'SNNM RAW motion - Swell (kN) ';
		row19.insertCell( - 1 ).innerHTML = 'SNNM RAW reflection - Swell (kN) ';
		row20.insertCell( - 1 ).innerHTML = 'SNNM RAW - Total (kN) ';

		for ( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			let rawm; //motion induced resistance
			let rawr; //wave reflection
			let total = 0;

			for ( let j = 0; j <= 1; j ++ ) {

				const arr = j == 0 ? wave : swell;
				const h = arr[ i ].height;
				const a = arr[ i ].angle;
				const t = arr[ i ].period;
				const { Af, Bf, fmin, fmax } = coefSn( h, t, j );

				rawm = 0;
				rawr = 0;
				const n = 200;

				for( let i = 0; i < n; i ++ ) {

					const df = ( fmax - fmin ) / n;
					const f = fmin + df * i; // its not circular frequency
					const omega = f; // 2 * pi * f;
					const k = omega ** 2 / g;
					const lamda = 2.0 * pi / k;
					const { kawm, kawr1, kawr2, kawr3, kawr4 } = snnm( l, b, tf, ta, cb, kyy, le, lr, vs, a, lamda );
					const d = 4.0 * rho * g * b * b / l;
					const sn = calcSn( t, omega, Af, Bf, j );
					rawm += 2 * kawm * d * sn * df;
					rawr += 2 * ( kawr1 + kawr2 + kawr3 + kawr4 ) * d * sn * df;

				}

				if ( j == 0 ) {
				
					row16.insertCell( - 1 ).innerHTML = ( 0.001 * rawm ).toFixed( 2 );
					row17.insertCell( - 1 ).innerHTML = ( 0.001 * rawr ).toFixed( 2 );

				} else if ( j == 1 ) {

					row18.insertCell( - 1 ).innerHTML = ( 0.001 * rawm ).toFixed( 2 );
					row19.insertCell( - 1 ).innerHTML = ( 0.001 * rawr ).toFixed( 2 );

				}

				total += rawm + rawr;

			}

			row20.insertCell( - 1 ).innerHTML = ( 0.001 * total ).toFixed( 2 );

		}
		

		//2002 wave
		// const res3 = wave2002( l, 0.5 * ( tf + ta ), vs );


		//SNNM validation
		const vs = 14.5;
		const angle = 0;
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

		//STA2 validation
		tb = document.createElement( 'table' );
		document.body.appendChild( tb );
		row1 = tb.insertRow();
		row1.insertCell( - 1 ).innerHTML = "lamda / L";
		row1.insertCell( - 1 ).innerHTML = "w'";
		row1.insertCell( - 1 ).innerHTML = "w1";
		row1.insertCell( - 1 ).innerHTML = "a1";
		row1.insertCell( - 1 ).innerHTML = "b1";
		row1.insertCell( - 1 ).innerHTML = "d1";
		row1.insertCell( - 1 ).innerHTML = "rawml(w)";
		row1.insertCell( - 1 ).innerHTML = "f1";
		row1.insertCell( - 1 ).innerHTML = "I1";
		row1.insertCell( - 1 ).innerHTML = "K1";
		row1.insertCell( - 1 ).innerHTML = "alpha(w)";
		row1.insertCell( - 1 ).innerHTML = "Kwave";

		for ( let i = 0; i <= 46; i ++ ) {

			const lamdaOverL = 0.2 + 0.05 * i;
			const lamda = lamdaOverL * l;
			const res = sta2( l, b, 0.5 * ( tf + ta ), cb, kyy, vs, angle, lamda );
			row1 = tb.insertRow();
			row1.insertCell( - 1 ).innerHTML = ( lamda / l ).toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.omega.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.omegaBar.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.a1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.b1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.d1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kawml.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.f1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.I1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.K1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.alpha1.toFixed( 4 );
			row1.insertCell( - 1 ).innerHTML = res.kwave.toFixed( 4 );

		}

		return arr;

	}

	RAA() {

		const table = this.table;
		const nm1 = this.hdg.length - 1;

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
		const cx = this.wind.coef.map( e => -e ); //negate
		const d = this.dwrRef;
		const res = f( a, cx, d );

		const vw = this.vwrRef;
		const vs = this.sog.map( e => e * 0.51444 );

		const rho = Number( document.getElementById( "rhoa" ).innerHTML );
		const Ax = Number( document.getElementById( "Ax" ).innerHTML );
		const arr = [];

		for ( let i = 0; i <= nm1; i ++ ) {

			row1.insertCell( - 1 ).innerHTML = res[ i ].toFixed( 2 );
			const raa = 0.5 * rho * res[ i ] * Ax * vw[ i ] ** 2 - 0.5 * rho * cx[ 0 ] * Ax * vs[ i ] ** 2;
			row2.insertCell( - 1 ).innerHTML = ( 0.001 * raa ).toFixed( 2 );
			arr.push( raa );

		}

		return arr;

	}

	RAS() {

		const S = Number( document.getElementById( "S" ).innerHTML );
		const l = Number( document.getElementById( "lpp" ).innerHTML );
		const rhos = Number( document.getElementById( "rhos" ).innerHTML );
		const rho0 = 1026;
		const nu = 0.0000011883;
		const nu0 = 0.0000011883;
		const vg = this.sog;

		const Cf = ( u, l, nu ) => {

			const Re = ( u * l) / nu; // Reynolds number
			const delCf = 0.0;
			
			return 0.075 / M.pow( M.log10( Re ) - 2, 2 ) + delCf;

		}

		const table = this.table;
		const nm1 = this.hdg.length - 1;
		const arr= [];

		for ( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			const u = vs * 1852 / 3600;
			const sv2 = S * u ** 2;
			const cf = Cf( u, l, nu );
			const rf = 0.5 * rhos * sv2 * cf;
			const ct0 = this.mt.cts[ 1 ] * 0.001; //spline interpolation needed
			const rt0 = 0.5 * rho0 * sv2 * ct0;
			const ras = 0.5 * rt0 * ( rhos / rho0 - 1 ) - rf * ( Cf( u, l, nu0 ) / cf - 1 )
			arr.push( ras );

		}

		return arr;

	}

	DPM( etad, etat = 0.99, ksip = -0.099 ) {

		const raa = this.RAA();
		const raw = this.RAW();
		const ras = this.RAS();
		const vg = this.sog;
		const ps = this.power; // shaft power
		const pd = ps.map( e => e * etat );
		const pid = [];

		const table = this.table;
		const nm1 = this.hdg.length - 1;
		const row = table.insertRow();
		row.insertCell( - 1 ).innerHTML = "&#916R (kN)";
		
		for( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			const u = vs * 1852 / 3600; // m/s
			const delr = 0.001 * ( raa[ i ] + raw [ i ] + ras[ i ] ); // kN
			const temp = delr * u / etad;
			const b = pd[ i ] - temp;
			// console.log( 'b=', b, b > 0 );
			const c = pd[ i ] * temp * ksip;
			pid[ i ] = b > 0 ? 0.5 * ( b + M.sqrt( b ** 2 + 4.0 * c ) ) : 0;

			row.insertCell( - 1 ).innerHTML = ( delr ).toFixed( 2 );

		}

		return pid;

	}

	currentCorrection( vg, pid ) {

		const nm1 = vg.length - 1;
		let stw, pvs;
		let n = 0;
		let sum = 0;
		let previous = 0;

		while( n < 20 ) {

			/**
			 * Approximation of stw
			 * 
			 * Power = a + b Vs^q
			 * 
			 * a, b, and q are unknown
			 * 
			 * Solve Ax = b,
			 * 
			 * b = Power
			 * x = [ a, b ] ^ T
			 * A = [ 1, Vs^q ], (q = 3.0)
			 * 
			 */
			const vsq = [];

			if( n == 0 ) { // 1st iteration
			
				pvs = [];

				for( let i = 0; i <= nm1; i ++ ) {

					if ( i % 2 == 0 ) {
		
						const vm = 0.5 * ( vg[ i ] + vg[ i + 1 ] );
						vsq.push( M.pow( vm, 3.0 ) );
						pvs.push( 0.5 * ( pid[ i ] + pid[ i + 1 ] ) );

					}
		
				}

			} else {

				pvs = pid;
				stw.map( e => vsq.push( M.pow( e, 3.0 ) ) )

			}

			/**
			 * Consider the linear equation
			 * 
			 * Ax = b,
			 * 
			 * where A is matrix with dimension of m x n, b is vector with length of m, and x is vector to be computed with length of n.
			 * When m > n, it is generally the case having no solution. Thus, for m > n, the goal of solving is to find the value of x
			 * that minimizes some error.
			 * 
			 * minimize | Ax - b | ^ 2
			 * 
			 * The solution to the least squares problem is computed by solving the normal equation,
			 * 
			 * A^T Ax = A^T b
			 * 
			 * where A^T denotes the transpose of A
			 * 
			 */
			
			let A = vsq.map( e => [ 1, e ] )
			let m00 = 0;
			let m01 = 0;
			let m10 = 0
			let m11 = 0;
			let b0 = 0;
			let b1 = 0;

			for( let i = 0; i < A.length; i ++ ) {

				m00 += A[ i ][ 0 ] * A[ i ][ 0 ];
				m01 += A[ i ][ 0 ] * A[ i ][ 1 ];
				m10 += A[ i ][ 1 ] * A[ i ][ 0 ];
				m11 += A[ i ][ 1 ] * A[ i ][ 1 ];
				b0 += A[ i ][ 0 ] * pvs[ i ];
				b1 += A[ i ][ 1 ] * pvs[ i ];

			}
			
			let ata = array( [ [ m00, m01 ], [ m10, m11 ] ] );
			let atb = array( [ [ b0 ], [ b1 ] ] );
			const x = ata.solve( atb );
			const [ a, b ] = x.data;
			// console.log( 'a,b=', a, b );

			// stw by regression curve
			const vs = pvs.map( e => M.pow( ( e - a ) / b, 1 / 3 ) );
			// console.log( 'pvs', pvs)
			// console.log( 'vs=', vs );

			// current speed( Vc' = Vg - Vs )
			const vcprime = vg.map( ( e, i ) => e - vs[ n == 0 ? M.floor( i / 2 ) : i ] ).map( ( e, i ) => i % 2 == 0 ? e : - e );
			// console.log( 'vc`=', vcprime );

			/**
			 * Vc = Vcc cos( 2pi/Tc * t ) + Vcs sin( 2pi/Tc * t ) + Vct * t + Vc0
			 * 
			 * Vcc, Vcs, Vct, Vc0 are unknown.
			 * 
			 * Solve Ax = b,
			 * 
			 * A = [ cos( 2pi/Tc * t ), sin( 2pi/Tc * t ), t, 1 ]
			 * x = [ Vcc, Vcs, Vct, Vc0 ] ^ T
			 * b = Vc
			 * 
			 */
			const tc = 0.51753 //44712 // 0.51753 day (12 hours, 25 mins, 12 sec)
			const twopiTc = 2.0 * pi / tc;
			const time = [];

			for( let i = 0; i <= nm1; i ++ ) {
			
				// time.push( i * 3600 );
				time.push( i * 1 / 24 );

			}
			
			// A = time.map( e => [ M.cos( twopiTc * e ), M.sin( twopiTc * e ), e / tc, 1 ] );
			A = time.map( e => [ M.cos( twopiTc * e ), M.sin( twopiTc * e ), e, 1 ] );

			ata = new Array( 4 );
			atb = new Array( 4 );

			for( let i = 0; i < 4; i ++ ) {

				ata[ i ] = new Array( 4 ).fill( 0 );
				atb[ i ] = new Array( 1 ).fill( 0 );

				for( let j = 0; j <= nm1; j ++ ) {

					atb[ i ][ 0 ] += A[ j ][ i ] * vcprime[ j ];

					for( let k = 0; k < 4; k ++ ) {

						ata[ i ][ k ] += A[ j ][ i ] * A[ j ][ k ];

					}

				}

			}

			const ata1 = array( ata );
			const atb1 = array( atb );
			const x1 = ata1.solve( atb1 );
			const [ vcc, vcs, vct, vc0 ] = x1.data
			// console.log( 'vcc, vcs, vct, vc0=', vcc, vcs, vct, vc0 );

			// updated by current curve
			// const vc = time.map( e => vcc * M.cos( twopiTc * e ) + vcs * M.sin( twopiTc * e ) + vct / tc * e + vc0 );
			const vc = time.map( e => vcc * M.cos( twopiTc * e ) + vcs * M.sin( twopiTc * e ) + vct * e + vc0 );
			// console.log( 'vc=', vc )

			// stw by current curve
			stw = vg.map( ( e, i ) => i % 2 == 0 ? e - vc[ i ] : e + vc[ i ] );
			// console.log( 'vs`=', stw )

			sum = 0;

			// calc. error
			stw.map( ( e, i ) => {

				const pv = a + b * M.pow( e, 3 );
				const err = pv - pid[ i ]
				sum += M.pow( err, 2 );

			} )

			console.log( 'error square=', sum );
			const percent = M.abs( 1 - sum / previous );
			console.log( 'n=', n, 'error %', 100 * percent );
			if ( percent < 0.01 ) break;
			previous = sum;
			n ++

		}

		const table = this.table;
		const row1 = table.insertRow();
		const row2 = table.insertRow();
		const row3 = table.insertRow();
		row1.insertCell( - 1 ).innerHTML = "Vs (kts)";
		row2.insertCell( - 1 ).innerHTML = "PD (kW)";
		row3.insertCell( - 1 ).innerHTML = "PB (kW)";
		
		for( let i = 0; i <= nm1; i ++ ) {

			const v = stw[ i ] * 3600 / 1852;
			const pd = pid[ i ];
			const pb = pd / 0.99;
			row1.insertCell( - 1 ).innerHTML = ( v ).toFixed( 3 );
			row2.insertCell( - 1 ).innerHTML = ( pd ).toFixed( 0 );
			row3.insertCell( - 1 ).innerHTML = ( pb ).toFixed( 0 );

		}

		return stw;

	}

	calcCorrection() {

		const pid = this.DPM( 0.83, 0.99, -0.124 );
		const stw = this.currentCorrection( this.sog.map( e => e * 1852 / 3600 ), pid );

	}

}

const ship = new Ship();
ship.calcCorrection();

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

	let a1, a2;
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
			return k90 + ( kpi - k90 ) * ratio;

		} else {

			a1 = cala1( alpha );
			a2 = cala2( alpha );
			return 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );

		}

	};

	const kawm = calKawm( alpha );
	const E1 = M.atan( 0.99 * 0.5 * b / le );
	const E2 = M.atan( 0.99 * 0.5 * b / lr );
	const fa = alpha <= E1 ? cosa : 0;
	const t12 = td;
	const t34 = cb <= 0.75 ? td * ( 4 + M.sqrt( M.abs( cosa ) ) ) / 5 : td * ( 2 + M.sqrt( M.abs( cosa ) ) ) / 3;
	const at12 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t12 / lamda - t12 / ( 2.5 * l ) ) ) : 0;
	const at34 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t34 / lamda - t34 / ( 2.5 * l ) ) ) : 0;
	const kawr1 = alpha <= pi - E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr2 = alpha <= E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr3 = E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr4 = pi - E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;

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

	const isLessThan45 = angle <= 45 || angle >= 315;

	if ( !isLessThan45 ) {

		return {

			omega: 0,
			omegaBar: 0,
			a1: 0,
			b1: 0,
			d1: 0,
			kawml: 0,
			f1: 0,
			I1: 0,
			K1: 0,
			alpha1: 0,
			kwave: 0

		}

	}

	const Fr = vs * 1852 / 3600 / M.sqrt( g * l );
	const omega = M.sqrt( 2 * pi * g / lamda );

	//motion induced resistance
	const omegaBar = M.sqrt( l / g ) * M.cbrt( kyy ) / ( 1.17 * M.pow( Fr, - 0.143 ) ) * omega;
	const a1 = 60.3 * M.pow( cb, 1.34 );
	const b1 = omegaBar < 1 ? 11.0 : - 8.50;
	const d1 = omegaBar < 1 ? 14.0 : - 566 * M.pow( l / b, - 2.66 );
	const raw = M.pow( omegaBar, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omegaBar, d1 ) ) ) * a1 * M.pow( Fr, 1.50 ) * M.exp( - 3.5 * Fr );

	//wave reflection
	const k = omega ** 2 / g;
	const x = 1.5 * k * tm;
	const I1 = besseli( x, 1 );
	const K1 = besselk( x, 1 );
	const f1 = 0.692 * M.pow( vs * 1852 / 3600 / M.sqrt( tm * g ), 0.769 ) + 1.81 * M.pow( cb, 6.95 );
	const alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 ) * f1;

	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return {

		omega: omega,
		omegaBar: omegaBar,
		a1: a1,
		b1: b1,
		d1: d1,
		kawml: raw,
		f1: f1,
		I1: I1,
		K1: K1,
		alpha1: alpha1,
		kwave: raw + alpha1 * 0.125 * l / b

	};

}

function wave2002( l, tm, vs ) {

	const table = document.createElement( 'table' );
	document.body.appendChild( table );
	let row1;
	row1 = table.insertRow();
	row1.insertCell( - 1 ).innerHTML = "lamda / L";

	for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const omega = M.sqrt( 2 * pi * g / lamda );
	const k = omega ** 2 / g;

	//long wave
	const k0 = g / ( vs * 1852 / 3600 ) ** 2;


	//short wave
	const x = 1.5 * k * tm;
	const I1 = besseli( x, 1 );
	const K1 = besselk( x, 1 );
	var alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 );


	row1 = table.insertRow();
	row1.insertCell( - 1 ).innerHTML = ( lamda / l ).toFixed( 4 );

	}

	return;

}

//mean resistance increase due to motion (in regular waves) based on the Maruo's theory
function AddResRegular( w, we, V, AmpH, PhaH, AmpP, PhaP, ca, RhoW )
{
    let I1, I2, I3;
	const tau = we * V / g;
    const K = w * w / g;
    const K0 = g / (V * V);

    const m3 = -0.5 * K0 * (1.0 + 2.0 * tau + M.sqrt(1.0 + 4.0 * tau));
    const m4 = -0.5 * K0 * (1.0 + 2.0 * tau - M.sqrt(1.0 + 4.0 * tau));
    if (tau < 0.25)
    {
        const m1 = 0.5 * K0 * (1.0 - 2.0 * tau + M.sqrt(1.0 - 4.0 * tau));
        const m2 = 0.5 * K0 * (1.0 - 2.0 * tau - M.sqrt(1.0 - 4.0 * tau));
    }
    else
    {
        const m1 = 0.5 * K0 * (1.0 - 2.0 * tau);
		const m2 = m1
    }
    const dm = 0.01 * K0;
    const nm = 10;
    const epsilon = dm / (2 * nm - 1);
    const a = nm * nm * epsilon;
	const tiny = 1.0e-10;
    //------------------------------------------------------------------
    // Region 3 - inf
    I3 = 0.0;
    for (let i = 0; i <= nm; i++)
    {
        const m = m3 - i * i * epsilon;
        const [ KR, KI ] = Kochin( m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca );
        let ff = (KR * KR + KI * KI) * M.Pow(m + K0 * tau, 2.0) * (m + K * ca);
        ff /= M.sqrt(M.abs((m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau)));
        if ((i == 0) || (i == nm)) I3 += ff;
        else I3 += 2.0 * ff;
    }
    I3 *= M.sqrt(epsilon);
    for (let i = 0; i < 10000; i++)
    {
        const m = m3 - a - i * dm;
        const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
        let ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
        ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau)));
        if (i == 0) I3 += 0.5 * ff * dm;
        else I3 += ff * dm;
        if (M.abs(ff / I3) < tiny) break;
    }
    I3 *= -4.0 * pi * RhoW;
    if (tau < 0.25)
    {
        aa = (m2 - m4) < 2.0 * a ? 0.5 * ( m2 - m4 ) : a;
        const epsilona = aa / (nm * nm);
        //------------------------------------------------------------------
        // Region 4-2
        let I2 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            const m = m4 + i * i * epsilona;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(M.Abs((m - m3) * (m - m2) * (m - m1)));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        for (let i = 0; i <= nm; i++)
        {
            m = m2 - i * i * epsilona;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(Math.Abs((m - m4) * (m - m3) * (m - m1)));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        I2 *= Math.Sqrt(epsilona);
        const dl = (m2 - m4) - 2.0 * a;
        if (dl > 0.0)
        {
            const nma = dl / dm + 1; // need to convert to integer?
            const dma = dl / nma;
            for (i = 0; i <= nma; i++)
            {
                m = m4 + aa + i * dma;
                const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
                ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
                ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m - m2) * (m - m1)));
                if ((i == 0) || (i == nma)) I2 += 0.5 * ff * dma;
                else I2 += ff * dma;
            }
        }
        I2 *= 4.0 * pi * RhoW;
        //------------------------------------------------------------------
        // Region 1-inf
        I1 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            m = m1 + i * i * epsilon;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m - m2)));
            if ((i == 0) || (i == nm)) I1 += ff;
            else I1 += 2.0 * ff;
        }
        I1 *= M.sqrt(epsilon);
        for (let i = 0; i < 10000; i++)
        {
            m = m1 + a + i * dm;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m - m4) * (m - m2) * (m - m1));
            if (i == 0) I1 += 0.5 * ff * dm;
            else I1 += ff * dm;
            if (M.abs(ff / I1) < tiny) break;
        }
        I1 *= 4.0 * pi * RhoW;
    }
    else
    {
        //------------------------------------------------------------------
        // Region 4-inf
        I2 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            m = m4 + i * i * epsilon;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        I2 *= M.sqrt(epsilon);
        for (let i = 0; i < 10000; i++)
        {
            m = m4 + a + i * dm;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau));
            if (i == 0) I2 += 0.5 * ff * dm;
            else I2 += ff * dm;
            if (M.abs(ff / I2) < tiny) break;
        }
        I2 *= 4.0 * pi * RhoW;
        I1 = 0.0;
    }

    return I1 + I2 + I3;

}

//AmpH, PhaH, AmpP, PhaP : HeaveA, HeaveP, PitchA, PitchP
function Kochin( m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca )
{
    let KR, KI;
	const zz = [];
    ci = new Complex(0.0, 1.0);

    const wano = w * w / g;
    // For Depth attenuation
    const tau = we * V / g;
    const K = w * w / g;
    const K0 = g / (V * V);
    const a1 = M.pow((m + K0 * tau), 2.0) / K0;
    // fac_depth = M.exp(-0.75 * m_CVP * m_Draught * a1);
    const fac_depth = M.exp(-m_CBgeom * m_Draught * a1);

    //----------------------
    //  cutting out the high frequancy of m
    const ist = m_DataG.nst / 2;
    const dx = m_DataG.x[ist] - m_DataG.x[ist - 1];
    if ( m > ( pi / dx ) )
    {
        KR = 0.0;
        KI = 0.0;
        // return [ KR, KI ];
    }

    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        zz[ist] = AmpH * ci.mul( PhaH ).exp() - m_DataG.x[ist] * AmpP * ci.mul ( PhaP ).exp() - ci.mul( wano ).mul ( m_DataG.x[ist] ).mul( ca ).exp() * Complex(-m_Draught * wano).exp();  // Wave Attenuation 2
        zz[ist] *= 2.0 * m_DataG.b[ist];
    }
    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        zz[ist] *= -ci / (4.0 * pi) * (we + 1.0 * m * V);
    }

    //---------------------------------
    // Integration along x
    let H = new Complex(0.0, 0.0);
    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        if (ist == 0)
        {
            dx = 1.0 * (m_DataG.x[ist + 1] - m_DataG.x[ist]);
        }
        else if (ist == m_DataG.nst - 1)
        {
            dx = 1.0 * (m_DataG.x[ist] - m_DataG.x[ist - 1]);
        }
        else
        {
            dx = 0.5 * (m_DataG.x[ist + 1] - m_DataG.x[ist - 1]);
        }
        H += zz[ist] * Complex.pow(ci * m * m_DataG.x[ist]) * dx;
    }
    //  Depth attenuation
    H *= fac_depth;

    KR = H.Real;
    KI = H.Imaginary;

	return [ KR, KI ];
}
