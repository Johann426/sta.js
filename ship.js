import { f } from './Interpolation.js';
import { array } from './index.esm.js';
import { snnm, sta2 } from './index.js'

const M = Math;
const pi = M.PI;
const g = 9.80665;

class Ship {

	constructor() {

		this.initialize();

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
	
			return { // 99.8 % of the energy is within the range of f001 < f < f999

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
	
			} else if ( type == 1 ) { //for the narrow band wave spectrum, the JONSWAP(Joint North Sea Wave Observation Project) frequency spectrum
	
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

		const S = this.wetted;
		const l = this.l

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

        const ship = this;
        const nm1 = ship.hdg.length - 1;
        const { rhoa, Ax, rho } = ship;
        const { vwr, dwr, vwt, dwt, vwtAve, dwtAve, vwtRef, vwrRef, dwrRef, caa, raa, } = ship.RAA( ship.hdg, ship.sog, ship.wind_v, ship.wind_d, ship.Za, ship.Zref, rhoa, Ax, ship.wind ) 
        const { wave, swell } = ship.RAW( ship.sog, ship.wave, ship.swell );
        const raw = [];

        for ( let i = 0; i <= nm1; i ++ ) {
            
            raw[ i ] = 0.001 * ( wave.total[ i ] + swell.total[ i ] )

        }

        const temp = 15.0;
        const ras = ship.RAS( temp, rho ).map( e => e * 0.001 );
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

		// difference in power between trial and model
        for ( let i = 0; i <= nm1; i ++ ) {

            dif += pb[ i ] - pmt[ i ]; 

        }

        dif /= ( nm1 + 1 )

        const speedAtNCR = f( ship.mt.pbLoaded.map( e => e + dif ), ship.mt.vsLoaded, [ ship.ncr / ( 1 + ship.sm ) ] );

        return {

            vwr: vwr,
            dwr: dwr,
            vwt: vwt,
            dwt: dwt,
            vwtAve: vwtAve,
            dwtAve: dwtAve,
            vwtRef: vwtRef,
            vwrRef: vwrRef,
            dwrRef: dwrRef,
            caa: caa,
            raa: raa,
            wave: wave,
            swell: swell,
            raw: raw,
            ras: ras,
            delr: delr,
            pid: pid,
            stw: stw,
            pb: pb,
			powerOffset: dif,
			speedAtNCR: speedAtNCR,

        }
        
	}

}

export { Ship };
