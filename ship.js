
class Ship {

	constructor() {

		this.initialize();
		this.name = 'STA'

	}

	toJSON() {

		const data = {
			metadata: {
				version: 1.0,
				type: this.constructor.name,
				generator: this.constructor.name + '.toJSON'
			}
		};

		Object.assign( data, this )

		return data;

	}

	initialize() {

		this.l = Number( document.getElementById( "lpp" ).textContent );
		this.b = Number( document.getElementById( "beam" ).textContent );
		this.tf = Number( document.getElementById( "tf" ).textContent );
		this.ta = Number( document.getElementById( "ta" ).textContent );
		this.disp = Number( document.getElementById( "disp" ).textContent );
		this.wetted = Number( document.getElementById( "S" ).textContent );
		this.rho = Number( document.getElementById( "rhos" ).textContent );
		this.cb = Number( document.getElementById( "cb" ).textContent );
		this.kyy = Number( document.getElementById( "kyy" ).textContent );
		this.le = Number( document.getElementById( "le" ).textContent );
		this.lr = Number( document.getElementById( "lr" ).textContent );
		this.lbwl = Number( document.getElementById( "lbwl" ).textContent );
		this.rhoa = Number( document.getElementById( "rhoa" ).textContent );
		this.Ax = Number( document.getElementById( "Ax" ).textContent );

		// loads 3322 임시 데이터
		this.ncr = 44187;
		this.sm = 0.15;
		this.load = [ 65, 75, 75, 85, 100 ];
		// time
		this.time = [ "2023-12-20 00:00:00", "2023-12-20 01:00:00", "2023-12-20 02:00:00", "2023-12-20 03:00:00", "2023-12-20 04:00:00", "2023-12-20 05:00:00", "2023-12-20 06:00:00", "2023-12-20 07:00:00", "2023-12-20 08:00:00", "2023-12-20 09:00:00" ];
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

		this.wave = {
			'angle': [ 0, 180, 0, 180, 0, 180, 0, 180, 0, 180 ],
			'height': [ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ],
			'period': [ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 ]
		};

		this.swell = {
			'angle': [ 0, 180, 0, 180, 0, 180, 0, 180, 0, 180 ],
			'height': [ 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5 ],
			'period': [ 8, 8, 8, 8, 8, 8, 8, 8, 8, 8 ]
		};

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
		const { l, b, tf, ta, rho, cb, kyy, le, lr, lbwl } = this;

		//STA1 result
		for ( let i = 0; i <= nm1; i ++ ) {

			let raw, a;

			raw = 1 / 16 * rho * 9.807 * wave.height[ i ] ** 2 * b * Math.sqrt( b / lbwl );
			a = wave.angle[ i ];
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
					const h = arr.height[ i ];
					const a = arr.angle[ i ];
					const t = arr.period[ i ];
	
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

export { Ship };
