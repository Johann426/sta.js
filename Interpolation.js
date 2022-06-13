/**
 *     THIS SUBROUTINE CALCULATES THE COEFFICIENTS OF CUBIC SPLINE
 *     PASSING THROUGH A GIVEN SET OF DATA POINTS. SINCE THE TRI-
 *     DIAGONAL MATRIX SOLVER HAS BEEN BUILT-IN, THERE IS NO NEED
 *     TO CALL SUBROUTINE SIMQ.  ORIGINAL VERSION OF UGLYDK CALLS
 *     THE SUBROUTINE SIMQ BECAUSE IT DOES NOT HAVE A MATRIX SOLVER.
 *     THIS SUBROUTINE WAS DEVELOPED BY PROF. J.E. KERWIN AT MIT.
 *
 *     DESCRIPTION OF VARIABLES:
 *
 *     NIN - NUMBER OF INPUT POINTS
 *     NCL - SPECIFICATION OF CURVATURE AT LEFT END
 *           0 : NO CURVATURE AT LEFT END, I.E. STRAIGHT LINE
 *           1 : CURVATURE AT LEFT END IS EXTRAPOLATED FROM FIRST
 *               TWO INTERIOR POINTS
 *           2 : SLOPE OF CURVE IS GIVEN AT LEFT END, THUS
 *               DETERMINING THE CURVATURE
 *               NOTE: UNLESS CURVATURE OR SLOPE IS KNOWN AT LEFT
 *                     END, NCL=1 IS RECOMMENDED.
 *     NCR - SPECIFICATION OF CURVATURE AT RIGHT END
 *           OPTIONS ARE SAME AS FOR NCL
 *     XIN - INPUT X-VALUES IN ASCENDING ORDER
 *     YIN - INPUT Y-VALUES AT CORRESPONDING X-VALUES
 *     ESL - LEFT END SLOPE IN DEGREES.  IF NCL IS NOT EQUAL TO 2,
 *           THIS INPUT IS DISREGARDED.  (ESL.LT.90.)
 *     ESR - RIGHT END SLOPE IN DEGREES.  IF NCR IS NOT EQUAL TO 2,
 *           THIS INPUT IS DISREGARDED.  (ESR.LT.90.)
 *           SEE SKETCH BELOW FOR POSITIVE SIGN CONVENTION.
 *     AE  - CUBIC COEFFICIENTS, A'S IN THE FOLLOWING EQUATION.  MUST
 *           BE A ONE DIMENSIONAL ARRAY WITH DIMENSION.GE.4*(NIN-1)
 *
 *     THE CUBIC FUNCTION IN THE J'TH INTERVAL IS GIVEN BY:
 *
 *     Y = A(X-Xj)3 + B(X-Xj)2 + C(X-Xj) + D
 *
 *     WHERE, A = AE[j]
 *            B = AE[j+nm1]
 *            C = AE[j+2nm1]
 *            D = AE[j+3nm1]
 *
 */
// function uglydk (NIN,NCL,NCR,XIN,YIN,ESL,ESR) {

// 	const H = new Array( NIN );
// 	const D= new Array( NIN );
// 	const AU = new Array( NIN );
// 	const AM = new Array( NIN );
// 	const AL = new Array( NIN );
// 	const S = new Array( NIN );
// 	const X = new Array( NIN );
// 	const AE = new Array( 4 * NIN );

// 	const RAD = Math.PI / 180.0;
// 	const NM1=NIN-1
// 	const NM2=NM1-1
// 	const NM3=NM2-1
// 	const nm4=NM3-1
// 	const NEQ=NM2

// 	for ( let i = 0; i < NM1; i ++ ) {

// 		H[i] = XIN[i+1]-XIN[i];
// 		D[i] = (YIN[i+1]-YIN[i])/H[i];

// 	}

// 	if(NCL === 2) NEQ = NEQ + 1;
// 	if(NCR === 2) NEQ = NEQ + 1;

//     let J = 0

// 	if( NCL === 2 ) {

// 		AM( 0 ) = 2.0 * H( 0 );
// 		AU( 0 ) = H( 0 );
// 		const SLP = ESL * RAD;
// 		S( 0 ) = ( D( 0 ) - Math.tan( SLP ) ) * 6.0;
// 		J ++;
// 		AL( 1 ) = H( 0 );

// 	}

//    	for( let i = 0; i < NM2; i ++ ) {

// 		if(i > 0) AU( J - 1 ) = H( i );
// 		AM( J ) = 2.0 * ( H( i ) + H( i + 1 ) );
// 		if(i < NM3) AL( J + 1 ) = H( i + 1 );
// 		if(i === 1 && NCL === 1) AU( J - 1 ) -= H( i - 1 ) ** 2 / H( i );
// 		if(i === 0 && NCL === 1) AM( J ) += ( 1.0 + H( i ) / H( i + 1 ) ) * H( i );
// 		if(i === NM3 && NCR === 1) AM( J ) += ( 1.0 + H( i + 1 ) / H( i ) ) * H( i + 1 );
// 		if(i === NM4 && NCR === 1) AL( J + 1 ) -= H( i + 2 ) ** 2 / H( i + 1 );
// 		S( J ) = ( D( i + 1 ) - D( i ) ) * 6.0;
// 		J ++;

// 	}

// 	if( NCR === 2) {
// 		AL( NEQ - 1 ) = -H( NM1 );
// 		AM( NEQ - 1 ) = -2.0 * H( NM1 );
// 		AU( NEQ - 2 ) = H( NM1 );
// 		const SLP = ESR * RAD;
// 		S( J ) = ( D( NM1 ) + Math.tan( SLP ) ) * 6.0;
// 		//S( J ) = ( D( NM1 - 1 ) + Math.tan( SLP ) ) * 6.0; by jdy
// 	}

// 	for ( let i = 1; K < NEQ; K ++ ) {
// 		AL( i ) = AL( i ) / AM( i - 1 );
// 		AM( i ) = AM( i ) - AL( i ) * AU( i - 1 );
// 		S( i ) = S( i ) - AL( i ) * S( i - 1 );
// 	}

// 	X( NEQ ) = S( NEQ ) / AM( NEQ );
// 	//X( NEQ - 1 ) = S( NEQ - 1 ) / AM( NEQ - 1 ); by jdy

// 	for( let L = 2; L < NEQ; L ++ ) {
// 		const K = NEQ - L + 1;
// 		//const K = NEQ - L - 1; by jdy
// 		X( K ) = ( S( K ) - AU( K ) * X( K + 1 ) ) / AM( K );
// 	}

// 	for( let N = 0; N < NEQ; N ++ ) {
// 		S( N ) = X( N );
// 	}

// 	const HOLD = S( NEQ );
// 	//const HOLD = S( NEQ - 1 ); jdy

// 	if( NCL !== 2) {
// 		for( let N = 0; N < NM2; N ++ ) {

// 			const M = NM2 - N + 2;
// 			//const M = NM3 - N + 1; jdy
// 			S( M ) = S( M - 1 );

// 		}

// 		if( NCL === 0 ) S(0) = 0.0;
// 		const BUG=H(0)/H(1)
// 		if( NCL === 1 ) S(0)=(1.0+BUG)*S(1)-BUG*S(2);
// 	}

// 	if( NCR === 0) S( NM1 ) = 0.0;
// 	const BUG=H(NM2)/H(NM3);
// 	if(NCR === 1) S(NM1)=(1.0+BUG)*S(NM2)-BUG*S(NM3);
// 	if(NCR === 2) S(NM1)=HOLD;

// 	for( let N = 0; N < NM1; N ++ ) {
// 		AE( N ) = ( S( N + 1 ) - S( N ) ) / ( 6.0 * H( N ) );
// 		let M = N + NM1;
// 		AE( M ) = 0.5 * S( N );
// 		M += NM1;
// 		AE(M)=D(N)-H(N)*(2.0*S(N)+S(N+1))/6.0;
// 		M += NM1
// 		AE(H)=YIN(N);
// 	}

// 	return AE;

// }

console.log( 'hello' );
const x = [ 1, 2, 3, 4 ];
const y = [ 2, 4, 9, 16 ];
const res = pcsi( x, y, [ 0.2, 1.5, 2.5, 3.5, 4.8 ] );
console.log( res );

// Piecewise Cubic Spline Interpolation
function pcsi( xin, yin, xout ) {

	const nm1 = xin.length - 1;
	const nm2 = nm1 - 1;
	const A = temp( xin, yin );
	const yout = [];

	for ( let i = 0; i < xout.length; i ++ ) {

		const t = binarySearch( xin, xout[ i ] );
		const j = t < nm1 ? t : nm2;
		const h = xout[ i ] - xin[ j ];
		const j2 = j + nm1;
		const j3 = j2 + nm1;
		const j4 = j3 + nm1;
		yout[ i ] = A[ j ] * h ** 3 + A[ j2 ] * h ** 2 + A[ j3 ] * h + A[ j4 ];
		console.log( 'j=', j, 'i=', i, 'yout=', yout[ i ] );

	}

	return yout;

}

function binarySearch( arr, target ) {

	let low = 0;
	let high = arr.length - 1;

	while ( low != high ) {

		const m = Math.ceil( ( low + high ) / 2 );

		arr[ m ] > target ? high = m - 1 : low = m;

	}

	if ( arr[ low ] !== target ) console.warn( `target between ${low} and ${low + 1}` );

	return low;

}

function temp( x, y ) {

	x.length !== y.length ? console.warn( 'input x and y must have the same size' ) : null;
	const n = x.length;
	const nm1 = n - 1;
	const nm2 = n - 2;
	const nm3 = n - 3;
	const h = new Array( nm1 );
	const d = new Array( nm1 );

	for ( let i = 0; i < nm1; i ++ ) {

		h[ i ] = x[ i + 1 ] - x[ i ];
		d[ i ] = y[ i + 1 ] - y[ i ];
		d[ i ] /= h[ i ];

	}

	const AU = new Array( nm1 );
	const AM = new Array( nm1 );
	const AL = new Array( nm1 );
	const RH = new Array( nm1 );

   	for ( let i = 1; i < nm1; i ++ ) {

		AU[ i ] = h[ i - 1 ];
		AM[ i ] = 2.0 * ( h[ i ] + h[ i - 1 ] );
		AL[ i ] = h[ i ];
		RH[ i ] = ( d[ i ] - d[ i - 1 ] ) * 6.0;

	}

	
	
	

	/**
	 * Thomas algorithm (Tri-diagonal matrix solver)
	 *
	 * A = L U
	 *
	 * A = | b1 c1                  | = | .                     | | .  .                   |
	 *     | .  .  .                |   | .  .                  | |    .  .                |
	 *     |    .  .  .             |   |    .  .               | |       .  .             |
	 *     |       ai bi ci         |   |       Ai Bi           | |          1  Ci         |
	 *     |          .  .  .       |   |          .  .         | |             .  .       |
	 *     |             .  .  .    |   |             .  .      | |                .  .    |
	 *     |                        |   |                       | |                        |
	 *
	 * Ai = ai
	 * AiCi-1 + Bi = bi
	 * BiCi = ci
	 *
	 * Recursive formula
	 * Ai = ai
	 * Bi = bi - AiCi-1
	 * Ci = ci / Bi
	 *
	 */
	RH[ 0 ] = 0.0; // 2nd derivative will be zero at end point
	AU[ 0 ] = 0.0;
	
	for ( let i = 1; i < nm1; i ++ ) {

		AM[ i ] -= AL[ i ] * AU[ i - 1 ];
		AU[ i ] /= AM[ i ];
		RH[ i ] -= AL[ i ] * RH[ i - 1 ];
		RH[ i ] /= AM[ i ];

	}

	RH[ nm1 ] = 0.0; // 2nd derivative will be zero at end point

	for ( let i = nm2; i > 0; i -- ) {

		RH[ i ] -= AU[ i ] * RH[ i + 1 ];

	}

	const AE = new Array( 4 * nm1 );
	RH[ nm1 ] = 0.0;

	for ( let i = 0; i < nm1; i ++ ) {

		AE[ i ] = ( RH[ i + 1 ] - RH[ i ] ) / ( 6.0 * h[ i ] );
		let j = i + nm1;
		AE[ j ] = 0.5 * RH[ i ];
		j += nm1;
		AE[ j ] = d[ i ] - h[ i ] * ( 2.0 * RH[ i ] + RH[ i + 1 ] ) / 6.0;
		j += nm1;
		AE[ j ] = y[ i ];

	}

	return AE;

}

export { pcsi };
