
// Originally developed by prof. J. E. Kerwin at MIT
// Y = Aj(X - Xj)^3 + Aj+N-1(X - Xj)^2 + Aj+2(N-1)(X - Xj) + Aj+3(N-1)

function UGLYDK(NIN,NCL,NCR,XIN,YIN,ESL,ESR,AE) {

	const H = new Array( NIN ).fill( 0.0 );
	const D= new Array( NIN ).fill( 0.0 );
	const AU = new Array( NIN ).fill( 0.0 );
	const AM = new Array( NIN ).fill( 0.0 );
	const S = new Array( NIN ).fill( 0.0 );
	const AL = new Array( NIN ).fill( 0.0 );
	const X = new Array( NIN ).fill( 0.0 );
	const RAD = Math.PI / 180.0;
	const NM1=NIN-1
	const NM2=NM1-1
	const NM3=NM2-1
	const NM4=NM3-1
	const NEQ=NM2
	
	for ( let N = 0, N < NM1, N ++ ) {
		
		H(N) = XIN(N+1)-XIN(N)
		D(N) = (YIN(N+1)-YIN(N))/H(N)
		
	}
	
	if(NCL === 2) NEQ = NEQ + 1;
	if(NCR === 2) NEQ = NEQ + 1;
	
	let J = 0

	if( NCL >= 2 ) {
		
		AM( 0 ) = 2.0 * H( 0 );
		AU( 0 ) = H( 0 );
		const SLP = ESL * RAD;
		S( 0 ) = ( D( 0 ) - Math.tan( SLP ) ) * 6.0;
		J ++;
		AL( 1 ) = H( 0 );
		
	}

	for( let N = 0, N < NM2, N ++ ) {
		if(N > 0) AU( J - 1 ) = H( N );
		AM( J ) = 2.0 * ( H( N ) + H( N + 1 ) );
		if(N < NM3) AL( J + 1 ) = H( N + 1 );
		if(N === 1 && NCL === 1) AU( J - 1 ) -= H( N - 1 ) ** 2 / H( N );
		if(N === 0 && NCL === 1) AM( J ) += ( 1.0 + H( N ) / H( N + 1 ) ) * H( N );
		if(N === NM3 && NCR === 1) AM( J ) += ( 1.0 + H( N + 1 ) / H( N ) ) * H( N + 1 );
		if(N === NM4 && NCR === 1) AL( J + 1 ) -= H( N + 2 ) ** 2 / H( N + 1 );
		S( J ) = ( D( N + 1 ) - D( N ) ) * 6.0;
		J ++;
	}

	if( NCR >= 2) {
		AL( NEQ ) = -H( NM1 );
		AM( NEQ ) = -2.0 * H( NM1 );
		AU( NEQ - 1 ) = H( NM1 );
		const SLP = ESR * RAD;
		S( J ) = ( D( NM1 ) + Math.tan( SLP ) ) * 6.0;
		//7 CONTINUE
	}

	for ( let K = 1, k < NEQ ) {
		AL( K ) = AL( K ) / AM( K - 1 );
		AM( K ) = AM( K ) - AL( K ) * AU( K - 1 );
		S( K ) = S( K ) - AL( K ) * S( K - 1 );
		//4 CONTINUE
	}
	
	X( NEQ ) = S( NEQ ) / AM( NEQ );
	
	for( let L = 2, L < NEQ ) {
		K = NEQ - L + 1;
		X( K ) = ( S( K ) - AU( K ) * X( K + 1 ) ) / AM( K );
	}

	for( let N = 0, N < NEQ ) {
		S( N ) = X( N );
	}
	
	const HOLD = S( NEQ );
	
	if( NCL !== 2) {
		//DO 9 N=1,NM2
		for( let N = 0, N < NM2, N ++ ) {
			
			const M = NM2 - N + 2;
			S( M ) = S( M - 1 );
			
		}
		
		if( NCL === 0) S(1) = 0.0;
		const BUG=H(1)/H(2)
		if( NCL === 1) S(1)=(1.0+BUG)*S(2)-BUG*S(3);
	}

	if( NCR === 0) S( NIN ) = 0.0;
	const BUG=H(NM1)/H(NM2)
	if(NCR === 1) S(NIN)=(1.0+BUG)*S(NM1)-BUG*S(NM2)
	if(NCR === 2) S(NIN)=HOLD

	for( let N = 0, N < NM1, N ++ ) {
		AE( N ) = ( S( N + 1 ) - S( N ) ) / ( 6.0 * H( N ) );
		const M=N+NM1
		AE( M ) = 0.5 * S( N );
		M=M+NM1;
		AE(M)=D(N)-H(N)*(2.0*S(N)+S(N+1))/6.0;
		M=M+NM1
		AE(H)=YIN(N);
	}

	return

}
