function dydx( xin, yin, xout ) {

	const nm1 = xin.length - 1;
	const nm2 = nm1 - 1;
	const A = coef( xin, yin );
	const yout = [];

	for ( let i = 0; i < xout.length; i ++ ) {

		const t = binarySearch( xin, xout[ i ] );
		const j1 = t < nm1 ? t : nm2;
		const j2 = j1 + nm1;
		const j3 = j2 + nm1;
		const h1 = xout[ i ] - xin[ j1 ];
		const h2 = h1 * h1;

		const dydx = 3.0 * A[ j1 ] * h2 + 2.0 * A[ j2 ] * h1 + A[ j3 ];
		//const d2ydx = 6.0 * A[ j1 ] * h1 + 2.0 * A[ j2 ];
		yout[ i ] = dydx;

	}

	return yout;

}

// Piecewise Cubic Spline Interpolation
/**
 *     Piecewise Cubic Spline Interpolation
 *
 *     Y = A(X-Xj)3 + B(X-Xj)2 + C(X-Xj) + D
 *
 *     WHERE, A = AE[j]
 *            B = AE[j+nm1]
 *            C = AE[j+2nm1]
 *            D = AE[j+3nm1]
 *
 */
function f( xin, yin, xout ) {

	const nm1 = xin.length - 1;
	const nm2 = nm1 - 1;
	const A = coef( xin, yin );
	const yout = [];

	for ( let i = 0; i < xout.length; i ++ ) {

		const t = binarySearch( xin, xout[ i ] );
		const j1 = t < nm1 ? t : nm2;
		const j2 = j1 + nm1;
		const j3 = j2 + nm1;
		const j4 = j3 + nm1;
		const h1 = xout[ i ] - xin[ j1 ];
		const h2 = h1 * h1;
		const h3 = h2 * h1;
		const fx = A[ j1 ] * h3 + A[ j2 ] * h2 + A[ j3 ] * h1 + A[ j4 ];
		yout[ i ] = fx;

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

	//if ( arr[ low ] !== target ) console.warn( `target between ${low} and ${low + 1}` );

	return low;

}

/**
 *      Piecewise cubic polynomial function at i'th interval(xi < x < xi+1) is given by,
 *
 *      Yi = A(X-Xi)3 + B(X-Xi)2 + C(X-Xi) + D
 *
 *      Let, h = X[i+1] - X[i]
 *           k = Y[i+1] - Y[i]
 *           d = k / h
 *
 *      Yi = mi/6h(Xi+1-X)^3 + mi+1/6h(X-Xi)^3 + a(X-Xi) + b
 *
 *      x = xi   => b = fi - mihi^2/6
 *      x = xi+1 => a = (fi+1-fi)/hi - hi/6(mi+1-mi)
 *      so, we have formula for all of the ai and bi in terms of m
 *
 *      Y'i = -mi/2h(Xi+1-X)^2 + mi+1/2h(X-Xi)^2 + a
 *      1st derivative continuity, Y'i(xi) = Y'i-1(xi)
 *
 *      a*m(i-1) + b*mi + c*m(i+1) = r
 *      a =   h[i-1]
 *      b = 2(h[i-1]+h[i])
 *      c =   h[i]
 *      r = 6(d[i]-d[i-1])
 *
 *      Y"i = -mi/h(Xi+1-X) + mi+1/h(X-Xi)
 *      2nd derivative continuity, Y"i(xi) = Y"i-1(xi) = mi
 *
 */

function coef( x, y ) {

	x.length !== y.length ? console.warn( 'input x and y must have the same size' ) : null;
	const n = x.length;
	const nm1 = n - 1;
	const nm2 = n - 2;
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
	 * | b1 c1               | = | .                  | | .  .                |
	 * | .  .  .             |   | .  .               | |    .  .             |
	 * |    ai bi ci         |   |    Ai Bi           | |       1  Ci         |
	 * |       .  .  .       |   |       .  .         | |          .  .       |
	 * |          .  .  .    |   |          .  .      | |             .  .    |
	 * |                     |   |                    | |                     |
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

	for ( let i = 0; i < nm1; i ++ ) {

		/**
		*    Y = A(X-Xj)3 + B(X-Xj)2 + C(X-Xj) + D
		*
		*    WHERE, A = AE[j]
		*           B = AE[j+nm1]
		*           C = AE[j+2nm1]
		*           D = AE[j+3nm1]
		*/
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

export { coef, f, dydx };
