
// Originally developed by prof. J. E. Kerwin at MIT
// Y = Aj(X - Xj)^3 + Aj+N-1(X - Xj)^2 + Aj+2(N-1)(X - Xj) + Aj+3(N-1)

function UGLYDK(NIN,NCL,NCR,XIN,YIN,ESL,ESR) {

	const H = new Array( NIN ).fill( 0.0 );
	const D= new Array( NIN ).fill( 0.0 );
	const AU = new Array( NIN ).fill( 0.0 );
	const AM = new Array( NIN ).fill( 0.0 );
	const AL = new Array( NIN ).fill( 0.0 );
	const S = new Array( NIN ).fill( 0.0 );
	const X = new Array( NIN ).fill( 0.0 );
	const AE = new Array( 4 * NIN ).fill( 0.0 );
	
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
		AL( NEQ - 1 ) = -H( NM1 );
		AM( NEQ - 1 ) = -2.0 * H( NM1 );
		AU( NEQ - 2 ) = H( NM1 );
		const SLP = ESR * RAD;
		S( J ) = ( D( NM1 ) + Math.tan( SLP ) ) * 6.0;
		//S( J ) = ( D( NM1 - 1 ) + Math.tan( SLP ) ) * 6.0; by jdy
	}

	for ( let K = 1, K < NEQ, K ++ ) {
		AL( K ) = AL( K ) / AM( K - 1 );
		AM( K ) = AM( K ) - AL( K ) * AU( K - 1 );
		S( K ) = S( K ) - AL( K ) * S( K - 1 );
	}
	
	X( NEQ ) = S( NEQ ) / AM( NEQ );
	//X( NEQ - 1 ) = S( NEQ - 1 ) / AM( NEQ - 1 ); by jdy
	
	for( let L = 2, L < NEQ ) {
		const K = NEQ - L + 1;
		//const K = NEQ - L - 1; by jdy
		X( K ) = ( S( K ) - AU( K ) * X( K + 1 ) ) / AM( K );
	}

	for( let N = 0, N < NEQ ) {
		S( N ) = X( N );
	}
	
	const HOLD = S( NEQ );
	//const HOLD = S( NEQ - 1 ); jdy
	
	if( NCL !== 2) {
		for( let N = 0, N < NM2, N ++ ) {
			
			const M = NM2 - N + 2;
			//const M = NM3 - N + 1; jdy
			S( M ) = S( M - 1 );
			
		}
		
		if( NCL === 0 ) S(0) = 0.0;
		const BUG=H(0)/H(1)
		if( NCL === 1 ) S(0)=(1.0+BUG)*S(1)-BUG*S(2);
	}

	if( NCR === 0) S( NM1 ) = 0.0;
	const BUG=H(NM2)/H(NM3);
	if(NCR === 1) S(NM1)=(1.0+BUG)*S(NM2)-BUG*S(NM3);
	if(NCR === 2) S(NM1)=HOLD;

	for( let N = 0, N < NM1, N ++ ) {
		AE( N ) = ( S( N + 1 ) - S( N ) ) / ( 6.0 * H( N ) );
		let M = N + NM1;
		AE( M ) = 0.5 * S( N );
		M += NM1;
		AE(M)=D(N)-H(N)*(2.0*S(N)+S(N+1))/6.0;
		M += NM1
		AE(H)=YIN(N);
	}
	
	return AE;

}

function EVALDK(NIN,NOUT,XIN,XOUT,A) {
	
	const XOUT = new Array( NOUT ).fill( 0.0 );
	const YOUT = new Array( NOUT ).fill( 0.0 );
	
	const NM1=NIN-1
	const MOUT=Math.abs(NOUT)
	
	if(NOUT <= O) {
		const DEL=(XIN(NM1)-XIN(0))/(MOUT-1)
		for( let N = 0 ,N < MOUT, N ++ ) {
			XOUT(N)=XIN(0)+N*DEL;
		}
	}
	let J=0;
	for( let N = 0, N < MOUT, N ++ ) { // 3

		if( XOUT(N).GE.XIN(1) ) {
			GO TO 4
			J = 1
			GO TO 5
		} //4 
		if( XOUT(N).LT.XIN(NM1) ) {
			GO TO 6
			J = NM1
			GO TO 5
		} //6
		if( XOUT(N) >= XIN(J+1) ) J=J+1 GO TO 6
		//9
		if( XOUT(N).LT.XIN(J) ) J=J-1 GO TO 9
		//5
		Hl=XOUT(N)-XIN(J)
		H2=H1**2
		H3=H1*H2
		J2=J+NM1
		J3=J2+NM1
		J4=J3+NM1
		Y0UT(N)=A(J)*H3+A(J2)*H2+A(J3)*H1+A(J4)
		GO TO 3
		
		
		
	}
	
	return YOUT;

}
