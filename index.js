import { array } from './index.esm.js';
import { besseli, besselk } from './bessel.js';
import { f } from './Interpolation.js';
import { UITable } from './UITable.js';

const M = Math;
const pi = M.PI;
const g = 9.80665; //9.807 staimo ?

class Ship {

	constructor() {

		this.initialize();

	}

	initialize() {

		// loads 3322 임시 데이터
		this.ncr = 44187;
		this.sm = 0.15;
		this.load = [ 65, 75, 75, 85, 100 ];
		// time
		this.time = [ "2023-12-20T00:00:00", "2023-12-20T01:00:00", "2023-12-20T02:00:00", "2023-12-20T03:00:00", "2023-12-20T04:00:00", "2023-12-20T05:00:00", "2023-12-20T06:00:00", "2023-12-20T07:00:00", "2023-12-20T08:00:00", "2023-12-20T09:00:00" ];
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
		this.Za = Number( document.getElementById( "Za" ).textContent );
		this.Zref = Number( document.getElementById( "Zref" ).textContent );
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
			'cts' : [ 2.0923, 2.0977, 2.1036, 2.11, 2.1161, 2.1226, 2.13, 2.1391, 2.1493, 2.1602, 2.1716, 2.1834, 2.1958, 2.2088, 2.2216, 2.234, 2.2464, 2.2593, 2.2725, 2.2858, 2.2988, 2.3115, 2.3244, 2.3383, 2.3525 ],
			'pb': [ 7700,8554,9473,10452,11529,12670,13895,15214,16611,18065,19620,21282,23054,24982,27037,29197,31525,33904,36402,39002,41723,44585,47593,50749,54110 ],
			'rpm': [ 44.27,45.86,47.47,49.07,50.76,52.43,54.11,55.83,57.52,59.13,60.74,62.36,63.98,65.67,67.36,69.04,70.80,72.48,74.20,75.90,77.63,79.38,81.17,82.97,84.85 ],
			'vsLoaded': [ 12.0,12.5,13.0,13.5,14.0,14.5,15.0,15.5,16.0,16.5,17.0,17.5,18.0,18.5,19.0,19.5,20.0,20.5,21.0,21.5,22.0,22.5,23.0 ],
			'pbLoaded': [ 6802,7659,8596,9602,10672,11822,13037,14353,15744,17232,18844,20546,22403,24402,26542,28889,31379,34049,36994,40333,44060,48201,52738 ],
			'rpmLoaded': [ 41.54,43.20,44.91,46.61,48.29,49.99,51.66,53.39,55.08,56.77,58.50,60.18,61.94,63.72,65.49,67.36,69.19,71.02,72.90,74.92,77.02,79.23,81.50 ]

		}

	}

	RAW( speed, wave, swell, option = 'sta2' ) {

		const res = {
			wave: {
				rawm: [],
				rawr: [],
				total: []
			},
			swell: {
				rawm: [],
				rawr: [],
				total: []
			}
		};

		const nm1 = this.hdg.length - 1;
		const vg = speed;
		const l = Number( document.getElementById( "lpp" ).textContent );
		const b = Number( document.getElementById( "beam" ).textContent );
		const tf = Number( document.getElementById( "tf" ).textContent );
		const ta = Number( document.getElementById( "ta" ).textContent );
		const rho = Number( document.getElementById( "rhos" ).textContent );
		const cb = Number( document.getElementById( "cb" ).textContent );
		const kyy = Number( document.getElementById( "kyy" ).textContent );
		const le = Number( document.getElementById( "le" ).textContent );
		const lr = Number( document.getElementById( "lr" ).textContent );
		const lbwl = Number( document.getElementById( "lbwl" ).textContent );

		//STA1 result
		for ( let i = 0; i <= nm1; i ++ ) {

			let raw, a;

			raw = 1 / 16 * rho * 9.807 * wave[ i ].height ** 2 * b * Math.sqrt( b / lbwl );
			a = wave[ i ].angle;
			raw = a <= 45 || a >= 315 ? raw : 0;

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


		//STA2 result
		if ( option == 'sta2' ) {

			for ( let i = 0; i <= nm1; i ++ ) {

				const vs = vg[ i ];
				let rawm; //motion induced resistance
				let rawr; //wave reflection
	
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
						// console.log( 'j',j, 'sn', sn )
						rawm += 2 * rawml * sn * df;
						rawr += 2 * rawrl * sn * df;
	
					}
	
					if ( j == 0 ) { // wave
					
						res.wave.rawm[ i ] = rawm;
						res.wave.rawr[ i ] = rawr;
						res.wave.total[ i ] = rawm + rawr;
	
					} else if ( j == 1 ) { // swell
	
						res.swell.rawm[ i ] = rawm;
						res.swell.rawr[ i ] = rawr;
						res.swell.total[ i ] = rawm + rawr;
	
					}

				}
	
			}

		}
		

		//SNNM result
		if ( option == 'snnm' ) {
		
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
					
						res.wave.rawm[ i ] = rawm;
						res.wave.rawr[ i ] = rawr;
						res.wave.total[ i ] = rawm + rawr;

					} else if ( j == 1 ) {

						res.swell.rawm[ i ] = rawm;
						res.swell.rawr[ i ] = rawr;
						res.swell.total[ i ] = rawm + rawr;

					}

				}

			}

		}

		return res;

	}


	RAA( heading, speed, vwind, dwind, Za, Zref, rho, Ax, cxList ) {

		const nm1 = heading.length - 1;
		const vwt =[];
		const dwt =[];

		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = heading[ i ] * pi / 180.0;
			const sog = speed[ i ] * 1852 / 3600;
			const vwr = vwind[ i ];
			const dwr = dwind[ i ] * pi / 180.0;
			vwt[ i ] = M.sqrt( vwr * vwr + sog * sog - 2.0 * vwr * sog * M.cos( dwr ) );
			const y = vwr * M.sin( dwr + hdg ) - sog * M.sin( hdg );
			const x = vwr * M.cos( dwr + hdg ) - sog * M.cos( hdg );
			dwt[ i ] = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;

		}

		// Averaging process for the true wind velocity and direction
		const vwtAve = [];
		const dwtAve = [];

		for ( let i = 0; i <= nm1; i ++ ) {

			if ( i % 2 === 0 ) {

				const y = 0.5 * ( vwt[ i ] * M.sin( dwt[ i ] ) + vwt[ i + 1 ] * M.sin( dwt[ i + 1 ] ) );
				const x = 0.5 * ( vwt[ i ] * M.cos( dwt[ i ] ) + vwt[ i + 1 ] * M.cos( dwt[ i + 1 ] ) );
				vwtAve[ i ] = M.sqrt( x * x + y * y );
				dwtAve[ i ] = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;

			} else {

				vwtAve[ i ] = vwtAve[ i - 1 ];
				dwtAve[ i ] = dwtAve[ i - 1 ];

			}

		}

		const vwtRef = [];
		const vwrRef = [];
		const dwrRef = [];

		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = heading[ i ] * pi / 180.0;
			const sin = M.sin( dwtAve[ i ] - hdg );
			const cos = M.cos( dwtAve[ i ] - hdg );
			const sog = speed[ i ] * 1852 / 3600;

			const corr = M.pow( Zref / Za, 1 / 7 );
			vwtRef[ i ] = vwtAve[ i ] * corr;
			vwrRef[ i ] = M.sqrt( vwtRef[ i ] * vwtRef[ i ] + sog * sog + 2.0 * vwtRef[ i ] * sog * cos );
			const y = vwtRef[ i ] * sin;
			const x = sog + vwtRef[ i ] * cos;
			dwrRef[ i ] = x >= 0 ? y >= 0 ? M.atan( y / x ) : M.atan( y / x ) + 2.0 * pi : M.atan( y / x ) + pi;

		}

		const a = cxList.angle;
		const cx = cxList.coef.map( e => -e ); //negate
		const d = dwrRef.map( e => e * 180.0 / pi );
		const caa = f( a, cx, d );

		const vw = vwrRef;
		const vs = speed.map( e => e * 1852 / 3600 );

		const raa = [];

		for ( let i = 0; i <= nm1; i ++ ) {

			const r = 0.5 * rho * caa[ i ] * Ax * vw[ i ] ** 2 - 0.5 * rho * cx[ 0 ] * Ax * vs[ i ] ** 2;
			raa.push( r );

		}

		return {

			vwr: vwind, 							// Relative wind velocity at anemometer height (m/s)
			dwr: dwind.map( e => e * 180 / pi ), 	// Relative wind direction at anemometer height (°)
			vwt: vwt, 								// True wind velocity at anemometer height (m/s)
			dwt: dwt.map( e => e * 180 / pi ), 		// True wind direction at anemometer height (°)
			vwtAve: vwtAve, 						// True wind velocity at anemometer height, double run averaged (m/s)
			dwtAve: dwtAve.map( e => e * 180 / pi ),// True wind direction at anemometer height, double run averaged (°)
			vwtRef: vwtRef, 						// True wind velocity at reference height (m/s)
			vwrRef: vwrRef, 						// Relative wind velocity at reference height (m/s)
			dwrRef: dwrRef.map( e => e * 180 / pi ),// Relative wind direction at reference height (°)
			caa: caa, 								// Wind coefficient
			raa: raa.map( e => e * 0.001 )			// Wind resistance (kN)

		}

	}

	RAS( celcius, rhos ) {

		// ITTC Fresh Water and Seawater Properties
		// const seawater ={
		// 	temp: [ 10, 11, 12 ,13],
			
		// }
		const S = Number( document.getElementById( "S" ).textContent );
		const l = Number( document.getElementById( "lpp" ).textContent );

		const nu = ( temp, rho ) => {

			return 0.000001 * ( ( 43.4233 - 31.38 * 0.001 * rho ) * M.pow( temp + 20, 1.72 * 0.001 * rho - 2.202 ) + 4.7478 - 5.779 * 0.001 * rho )

		}

		const rho0 = 1026;
		const nu0 = nu( 15.0, rho0 ); //0.0000011883;
		const vg = this.sog;

		const Cf = ( u, l, nu ) => {

			const Re = ( u * l) / nu; // Reynolds number
			const delCf = 0.0;
			
			return 0.075 / M.pow( M.log10( Re ) - 2, 2 ) + delCf;

		}

		const nm1 = this.hdg.length - 1;
		const arr= [];

		for ( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			const u = vs * 1852 / 3600;
			const sv2 = S * u ** 2;
			const cf = Cf( u, l, nu( celcius, rhos ) );
			const rf = 0.5 * rhos * sv2 * cf;
			const ct0 = this.mt.cts[ 1 ] * 0.001; //spline interpolation needed
			const rt0 = 0.5 * rho0 * sv2 * ct0;
			const ras = 0.5 * rt0 * ( rhos / rho0 - 1 ) - rf * ( Cf( u, l, nu0 ) / cf - 1 )
			arr.push( ras );

		}

		return arr;

	}

	DPM( speed, power, delr, etadList, etat = 0.99, ksip = -0.099 ) {

		const vg = speed;
		const ps = power; // shaft power
		const pd = ps.map( e => e * etat );
		const pid = [];

		const etad = f( etadList.x, etadList.y, vg );

		const nm1 = speed.length - 1;
		
		for( let i = 0; i <= nm1; i ++ ) {

			const vs = vg[ i ];
			const u = vs * 1852 / 3600; // m/s

			const temp = delr[ i ] * u / etad[ i ];
			const b = pd[ i ] - temp;
			if ( b < 0 ) console.warn( 'too much correction(minus power)' )
			const c = pd[ i ] * temp * ksip;
			pid[ i ] = b > 0 ? 0.5 * ( b + M.sqrt( b ** 2 + 4.0 * c ) ) : 0;

		}

		return pid;

	}

	currentCorrection( time, vg, pid ) {

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
			console.log( 'a,b=', a, b );

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
			const tc = 44712 // 0.51753 day (12 hours, 25 mins, 12 sec)
			const twopiTc = 2.0 * pi / tc;
			
			A = time.map( e => [ M.cos( twopiTc * e ), M.sin( twopiTc * e ), e / tc, 1 ] );
			// A = time.map( e => [ M.cos( twopiTc * e ), M.sin( twopiTc * e ), e, 1 ] );

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
			console.log( 'vcc, vcs, vct, vc0=', vcc, vcs, vct, vc0 );

			// updated by current curve
			const vc = time.map( e => vcc * M.cos( twopiTc * e ) + vcs * M.sin( twopiTc * e ) + vct / tc * e + vc0 );
			// const vc = time.map( e => vcc * M.cos( twopiTc * e ) + vcs * M.sin( twopiTc * e ) + vct * e + vc0 );
			console.log( 'vc=', vc )

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

		return stw.map( e => e * 3600 / 1852 ); //Speed through water ( knots )

	}

	analysis() {

	}

	

}

/////////////////////////////////////////////////////////////////////////////////////////////
// Analysis
/////////////////////////////////////////////////////////////////////////////////////////////
const ship = new Ship();
const rho = Number( document.getElementById( "rhoa" ).textContent );
const Ax = Number( document.getElementById( "Ax" ).textContent );
const nm1 = ship.hdg.length - 1;
const { vwr, dwr, vwt, dwt, vwtAve, dwtAve, vwtRef, vwrRef, dwrRef, caa, raa, } = ship.RAA( ship.hdg, ship.sog, ship.wind_v, ship.wind_d, ship.Za, ship.Zref, rho, Ax, ship.wind ) 
const { wave, swell } = ship.RAW( ship.sog, ship.wave, ship.swell );
const raw = [];

for ( let i = 0; i <= nm1; i ++ ) {
	
	raw[ i ] = 0.001 * ( wave.total[ i ] + swell.total[ i ] )

}

const temp = 15;
const rhos = Number( document.getElementById( "rhos" ).textContent );
const ras = ship.RAS( temp, rhos ).map( e => e * 0.001 );
const delr = [];

for ( let i = 0; i <= nm1; i ++ ) {

	delr[ i ] = raa[ i ] + raw [ i ] + ras[ i ] ; // kN

}

const pid = ship.DPM( ship.sog, ship.power, delr, { x: ship.mt.vs, y: ship.mt.etad }, 0.99, -0.099 )
const pb = pid.map( e => e / 0.99 );
const time0 = new Date( ship.time[ 0 ] ).getTime();
const time = ship.time.map( e => ( new Date( e ).getTime() - time0 ) / 1000 )
const stw = ship.currentCorrection( time, ship.sog.map( e => e * 1852 / 3600 ), pid );

// speed-power curve
const pmt = f( ship.mt.vs, ship.mt.pb, stw );
let dif = 0;

for ( let i = 0; i <= nm1; i ++ ) {

	dif += pb[ i ] - pmt[ i ];

}

dif /= ( nm1 + 1 )

const speedAtNCR = f( ship.mt.pbLoaded.map( e => e + dif ), ship.mt.vsLoaded, [ ship.ncr / ( 1 + ship.sm ) ] );

let table, row;

/////////////////////////////////////////////////////////////////////////////////////////////
// Measured data
/////////////////////////////////////////////////////////////////////////////////////////////
table = new UITable();
document.body.appendChild( table.dom );

row = table.insertRow();
row.insertHeader().textContent = 'Engine load (%)'
ship.load.map( e => {

	const cell = row.insertHeader();
	cell.textContent = e;
	cell.colSpan = 2;

} );

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
ship.wave.map( e => row.insertCell().textContent = e.height.toFixed( 1 ) );

row = table.insertRow();
row.insertHeader().textContent = 'Wave direction (°)'
ship.wave.map( e => row.insertCell().textContent = e.angle.toFixed( 1 ) );

row = table.insertRow();
row.insertHeader().textContent = 'Wave period (sec)'
ship.wave.map( e => row.insertCell().textContent = e.period.toFixed( 1 ) );

row = table.insertRow();
row.insertHeader().textContent = 'Swell height (m)'
ship.swell.map( e => row.insertCell().textContent = e.height.toFixed( 1 ) );

row = table.insertRow();
row.insertHeader().textContent = 'Swell direction (°)'
ship.swell.map( e => row.insertCell().textContent = e.angle.toFixed( 1 ) );

row = table.insertRow();
row.insertHeader().textContent = 'Swell period (sec)'
ship.swell.map( e => row.insertCell().textContent = e.period.toFixed( 1 ) );


/////////////////////////////////////////////////////////////////////////////////////////////
// Results
/////////////////////////////////////////////////////////////////////////////////////////////
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
row.insertHeader().textContent = "Vs (kts)";
stw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

row = table.insertRow();
row.insertHeader().textContent = "PD (kW)";
pid.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

row = table.insertRow();
row.insertHeader().textContent = "PB (kW)";
pb.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

table = new UITable();
document.body.appendChild( table.dom );
row = table.insertRow();
row.insertCell( - 1 ).textContent = "NCR";
row.insertCell( - 1 ).textContent = ship.ncr.toFixed( 1 ) + ' (kW)';
row = table.insertRow();
row.insertCell( - 1 ).textContent = "Sea Margin";
row.insertCell( - 1 ).textContent = ship.sm.toFixed( 2 ) + ' (%)';
row = table.insertRow();
row.insertCell( - 1 ).textContent = "Speed at NCR with s.m.";
row.insertCell( - 1 ).textContent = speedAtNCR[ 0 ].toFixed( 3 ) + ' (knots)';


//Chart
const ctx = document.getElementById('canvas');

const data = {

	datasets: [
		{
			label: 'Ballast M/T',
			data: [],
			backgroundColor: 'rgb(255, 99, 132)'
		},
		{
			label: 'Design M/T',
			data: [],
			backgroundColor: 'rgb(99, 132, 255)'
		}
	],

};

  ship.mt.vs.map( e => data.datasets[ 0 ].data.push( { x: e } ) );
  ship.mt.pb.map( ( e, i ) => data.datasets[ 0 ].data[ i ].y = e )
  
  ship.mt.vsLoaded.map( e => data.datasets[ 1 ].data.push( { x: e } ) );
  ship.mt.pbLoaded.map( ( e, i ) => data.datasets[ 1 ].data[ i ].y = e ); ;

const config = {
	type: 'scatter',
	data: data,
	options: {
	  scales: {
		x: {
		  type: 'linear',
		  position: 'bottom'
		}
	  }
	}
  };

  new Chart( ctx, config );


//SNNM validation
const l = Number( document.getElementById( "lpp" ).textContent );
const b = Number( document.getElementById( "lpp" ).textContent );
const tf = Number( document.getElementById( "tf" ).textContent );
const ta = Number( document.getElementById( "ta" ).textContent );
const cb = Number( document.getElementById( "cb" ).textContent );
const kyy = Number( document.getElementById( "kyy" ).textContent );
const le = Number( document.getElementById( "le" ).textContent );
const lr = Number( document.getElementById( "lr" ).textContent );
const vs = 14.5;
const angle = 0;
let tb = new UITable();
document.body.appendChild( tb.dom );
row = tb.insertRow();
row.insertHeader().textContent = "lamda / L";
row.insertHeader().textContent = "w'";
row.insertHeader().textContent = "b1";
row.insertHeader().textContent = "d1";
row.insertHeader().textContent = "Kawm";
row.insertHeader().textContent = "T12";
row.insertHeader().textContent = "T34";
row.insertHeader().textContent = "alphaT12";
row.insertHeader().textContent = "alphaT34";
row.insertHeader().textContent = "f(alpha)";
row.insertHeader().textContent = "Kawr1";
row.insertHeader().textContent = "Kawr2";
row.insertHeader().textContent = "Kawr3";
row.insertHeader().textContent = "Kawr4";
row.insertHeader().textContent = "Kaw";

for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const res = snnm( l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda );
	row = tb.insertRow();
	row.insertCell().textContent = lamdaOverL.toFixed( 4 );
	row.insertCell().textContent = res.omega.toFixed( 4 );
	row.insertCell().textContent = res.b1.toFixed( 4 );
	row.insertCell().textContent = res.d1.toFixed( 4 );
	row.insertCell().textContent = res.kawm.toFixed( 4 );
	row.insertCell().textContent = res.t12.toFixed( 4 );
	row.insertCell().textContent = res.t34.toFixed( 4 );
	row.insertCell().textContent = res.at12.toFixed( 4 );
	row.insertCell().textContent = res.at34.toFixed( 4 );
	row.insertCell().textContent = res.fa.toFixed( 4 );
	row.insertCell().textContent = res.kawr1.toFixed( 4 );
	row.insertCell().textContent = res.kawr2.toFixed( 4 );
	row.insertCell().textContent = res.kawr3.toFixed( 4 );
	row.insertCell().textContent = res.kawr4.toFixed( 4 );
	row.insertCell().textContent = res.kwave.toFixed( 4 );

}

//STA2 validation
tb = new UITable();
document.body.appendChild( tb.dom );
row = tb.insertRow();
row.insertHeader().textContent = "lamda / L";
row.insertHeader().textContent = "w'";
row.insertHeader().textContent = "w1";
row.insertHeader().textContent = "a1";
row.insertHeader().textContent = "b1";
row.insertHeader().textContent = "d1";
row.insertHeader().textContent = "rawml(w)";
row.insertHeader().textContent = "f1";
row.insertHeader().textContent = "I1";
row.insertHeader().textContent = "K1";
row.insertHeader().textContent = "alpha(w)";
row.insertHeader().textContent = "Kwave";

for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const res = sta2( l, b, 0.5 * ( tf + ta ), cb, kyy, vs, angle, lamda );
	row = tb.insertRow();
	row.insertCell().textContent = ( lamda / l ).toFixed( 4 );
	row.insertCell().textContent = res.omega.toFixed( 4 );
	row.insertCell().textContent = res.omegaBar.toFixed( 4 );
	row.insertCell().textContent = res.a1.toFixed( 4 );
	row.insertCell().textContent = res.b1.toFixed( 4 );
	row.insertCell().textContent = res.d1.toFixed( 4 );
	row.insertCell().textContent = res.kawml.toFixed( 4 );
	row.insertCell().textContent = res.f1.toFixed( 4 );
	row.insertCell().textContent = res.I1.toFixed( 4 );
	row.insertCell().textContent = res.K1.toFixed( 4 );
	row.insertCell().textContent = res.alpha1.toFixed( 4 );
	row.insertCell().textContent = res.kwave.toFixed( 4 );

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
	const b1 = omegaBar < 1.0 ? 11.0 : - 8.50;
	const d1 = omegaBar < 1.0 ? 14.0 : - 566 * M.pow( l / b, - 2.66 );
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
	row1.insertCell( - 1 ).textContent = "lamda / L";

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
	row1.insertCell( - 1 ).textContent = ( lamda / l ).toFixed( 4 );

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
