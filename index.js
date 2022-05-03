class Ship {

	constructor() {

		this.table = document.getElementById( "table1" );
		this.initialize();

	}

	initialize() {

		const table = this.table;

		this.Za = Number( document.getElementById( "Za" ).innerHTML );
		this.Zref = Number( document.getElementById( "Zref" ).innerHTML );
    
		// loads
		this.load = [ 65, 75, 75, 100 ];
		// heading
		this.hdg = [ 20, 200, 20, 200, 20, 200, 20, 200 ];
		// speed over ground
		this.sog = [ 17.9, 17.08, 18.01, 17.0, 17.96, 17.07, 18.19, 16.81 ];
		// shaft speed [rpm]
		this.rpm = [ 66, 66, 66, 66, 66, 66, 66, 66 ];
		// shaft power [kW]
		this.power = [ 12850, 12850, 12850, 12850, 12850, 12850, 12850, 12850 ];
		this.wind_v = [ 12.43, 12.39, 11.79, 13.15, 11.68, 13.67, 11.77, 13.88 ];
		this.wind_d = [ 16.4, 346.8, 17.1, 351.3, 16.2, 353.6, 15.0, 355.8 ];
		
    this.wave = [];
    [ 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5].map( ( e, i ) => this.wave[ i ] = { height: e } );
    [ 0, 180, 0, 180, 0, 180, 0, 180].map( ( e, i ) => this.wave[ i ].angle = e );
    [ 4, 4, 4, 4, 4, 4, 4, 4 ].map( ( e, i ) => this.wave[ i ].period = e );
    
    this.swell = [];
    [ 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 ].map( ( e, i ) => this.swell[ i ] = { height: e } );
    [ 0, 180, 0, 180, 0, 180, 0, 180].map( ( e, i ) => this.swell[ i ].angle = e );
    [ 8, 8, 8, 8, 8, 8, 8, 8].map( ( e, i ) => this.swell[ i ].period = e );
   
   this.hWave = document.getElementById( "hWave" );
   console.log(hWave.rowIndex)
   
   this.wave.map( ( e, i ) => {
   
   	document.getElementById( "hWave" ).cells[ i + 1 ].innerHTML = e.height.toFixed(1);
    document.getElementById( "aWave" ).cells[ i + 1 ].innerHTML = e.angle.toFixed(1);
    document.getElementById( "pWave" ).cells[ i + 1 ].innerHTML = e.period.toFixed(1);
   
   } );
   
   this.swell.map( ( e, i ) => {
   
   	document.getElementById( "hSwell" ).cells[ i + 1 ].innerHTML = e.height.toFixed(1);
    document.getElementById( "aSwell" ).cells[ i + 1 ].innerHTML = e.angle.toFixed(1);
    document.getElementById( "pSwell" ).cells[ i + 1 ].innerHTML = e.period.toFixed(1);
   
   } );
   
	}

	RAW() {
  
  	const table = document.createElement('table');
    document.body.appendChild( table );
    const nm1 = this.hdg.length - 1;
    const header = table.createTHead();
    header.insertRow(0).insertCell(0);
    header.rows[0].cells[0].colSpan = nm1 + 2;
    header.rows[0].cells[0].innerHTML = 'Resistance increase due to waves';
    header.rows[0].cells[0].style.fontWeight = 'bold';
    
    const wave = this.wave;
    const swell = this.swell;
    
    let row1, row2, row3;

		row1 = table.insertRow();
		row2 = table.insertRow();
    row3 = table.insertRow();
		row1.insertCell( -1 ).innerHTML = 'Wave height (m)';
    row2.insertCell( -1 ).innerHTML = 'Wave angle (°)';
    row3.insertCell( -1 ).innerHTML = 'Wave period (sec)';
    
    for ( let i = 0; i <= nm1; i ++ ) {
    
    	row1.insertCell( -1 ).innerHTML = wave[ i ].height.toFixed(2);
      row2.insertCell( -1 ).innerHTML = wave[ i ].angle.toFixed(2);
      row3.insertCell( -1 ).innerHTML = wave[ i ].period.toFixed(2);
    
    }
    
		const g = 9.80665;
    		const rawm = []; //motion induced
		const rawr =[]; //reflection induced
		
		for ( let i = 0; i <= nm1; i ++ ) {
    
			//rawm[ i ] = 3859.2 * rhos * g * 
    	    
    		}
    
  }

	RAA() {

    const table = document.createElement('table');
    document.body.appendChild( table );
    const nm1 = this.hdg.length - 1;
    const header = table.createTHead();
    header.insertRow(0).insertCell(0);
    header.rows[0].cells[0].colSpan = nm1 + 2;
    header.rows[0].cells[0].innerHTML = 'Resistance increase due to wind';
    header.rows[0].cells[0].style.fontWeight = 'bold';
    
		const ave = true;
		const vwt = [];
		const dwt = [];
		let row1, row2, row3;

		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( -1 ).innerHTML = "Relative wind velocity at anemometer height (m/s)";
		row2.insertCell( -1 ).innerHTML = "Relative wind direction at anemometer height (°)";
    
    for ( let i = 0; i <= nm1; i ++ ) {

			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ];

			row1.insertCell( -1 ).innerHTML = vwr.toFixed(2);
			row2.insertCell( -1 ).innerHTML = dwr.toFixed(1);

		}
    
		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( -1 ).innerHTML = "True wind velocity at anemometer height (m/s)";
		row2.insertCell( -1 ).innerHTML = "True wind direction at anemometer height (°)";
    
		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = this.hdg[ i ] * Math.PI / 180.0;
			const sog = this.sog[ i ] * 0.514444444;
			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ] * Math.PI / 180.0;
			vwt[ i ] = Math.sqrt( vwr * vwr + sog * sog - 2.0 * vwr * sog * Math.cos( dwr ) );
			const y = vwr * Math.sin( dwr + hdg ) - sog * Math.sin( hdg );
			const x = vwr * Math.cos( dwr + hdg ) - sog * Math.cos( hdg );
			dwt[ i ] = x >= 0 ? y >= 0 ? Math.atan( y / x ) : Math.atan( y / x ) + 2.0 * Math.PI : Math.atan( y / x ) + Math.PI;

			row1.insertCell( -1 ).innerHTML = vwt[ i ].toFixed(2);
			row2.insertCell( -1 ).innerHTML = ( dwt[ i ] * 180.0 / Math.PI ).toFixed(1);

		}

		// Averaging process for the true wind velocity and direction
		row1 = table.insertRow();
		row2 = table.insertRow();
		row1.insertCell( -1 ).innerHTML = "True wind velocity at anemometer height, double run averaged (m/s)";
		row2.insertCell( -1 ).innerHTML = "True wind direction at anemometer height, double run averaged (°)";
    
		for ( let i = 0; i <= nm1; i ++ ) {

			if ( i % 2 === 0 ) {

				const y = 0.5 * ( vwt[ i ] * Math.sin( dwt[ i ] ) + vwt[ i + 1 ] * Math.sin( dwt[ i + 1 ] ) );
				const x = 0.5 * ( vwt[ i ] * Math.cos( dwt[ i ] ) + vwt[ i + 1 ] * Math.cos( dwt[ i + 1 ] ) );
				vwt[ i ] = Math.sqrt( x * x + y * y );
				dwt[ i ] = x >= 0 ? y >= 0 ? Math.atan( y / x ) : Math.atan( y / x ) + 2.0 * Math.PI : Math.atan( y / x ) + Math.PI;

			} else {

				vwt[ i ] = vwt[ i - 1 ];
				dwt[ i ] = dwt[ i - 1 ];

			}

			row1.insertCell( -1 ).innerHTML = vwt[ i ].toFixed(2);
			row2.insertCell( -1 ).innerHTML = ( dwt[ i ] * 180.0 / Math.PI ).toFixed(1);

		}

		row1 = table.insertRow();
		row2 = table.insertRow();
		row3 = table.insertRow();
		row1.insertCell( -1 ).innerHTML = "True wind velocity at reference height (m/s)";
		row2.insertCell( -1 ).innerHTML = "Relative wind velocity at reference height (m/s)";
		row3.insertCell( -1 ).innerHTML = "Relative wind direction at reference height (°)";
    
		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = this.hdg[ i ] * Math.PI / 180.0;
			const sin = Math.sin( dwt[ i ] - hdg );
			const cos = Math.cos( dwt[ i ] - hdg );
			const sog = this.sog[ i ] * 0.514444444;

			const Za = this.Za;
			const Zref = this.Zref;
			const corr = Math.pow( Zref / Za, 1 / 7 );
			const vwtRef = vwt[ i ] * corr;
			const vwrRef = Math.sqrt( vwtRef * vwtRef + sog * sog + 2.0 * vwtRef * sog * cos );
			const y = vwtRef * sin;
			const x = sog + vwtRef * cos;
			const dwrRef = x >= 0 ? y >= 0 ? Math.atan( y / x ) : Math.atan( y / x ) + 2.0 * Math.PI : Math.atan( y / x ) + Math.PI;

			row1.insertCell( -1 ).innerHTML = vwtRef.toFixed(2);
			row2.insertCell( -1 ).innerHTML = vwrRef.toFixed(2);
			row3.insertCell( -1 ).innerHTML = ( dwrRef * 180.0 / Math.PI ).toFixed(1);

		}

	}

}


init();

function init() {

	const ship = new Ship();
	ship.RAA();
  ship.RAW();

}

function snnm(l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda) {
	
	const td = Math.max( tf, ta );
	const omega = 2.142 * Math.cbrt( kyy ) * Math.sqrt( l / lamda ) * Math.pow( cb / 0.65, 0.17 ) * ( 1 - 0.111 / cb * ( Math.log( b / td  ) - Math.log( 2.75 ) ) ) * 
	(
		(-1.377 * Fr ** 2 + 1.157 * Fr) * Math.abs( Math.cos( angle ) ) + 0.618 * ( 13 + Math.cos( 2 * angle ) ) /14
	)
	
}

function sta2(l, b, tm, cb, kyy, vs, angle, lamda) {
	
	const g = 9.80665;
	const pi = Math.PI;
	const Fr = vs * 1852/3600 / Math.sqrt( g * l );
	const omega = Math.sqrt( 2 * pi * g / lamda );
	
	const omegaBar = Math.sqrt( l / g ) * Math.cbrt( kyy ) / ( 1.17 * Fr ) * omega;
	const a1 = 60.3 * Math.pow( cb, 1.34 );
	const b1 = omegaBar < 1 ? 11.0 : -8.50;
	const d1 = omegaBar < 1 ? 14.0 : -566 * Math.pow( l / b, -2.66 );
	const raw = Math.pow( omegaBar, b1 ) * Math.exp( b1 / d1 * ( 1 - Math.pow( omegaBar, d1 ) ) ) * a1 * Math.pow( Fr, 1.50 ) * Math.exp( -3.5 * Fr );
	
	const k = omega ** 2 / g;
	const I1 = besselI();
	const K1 = besselK();
	const f1 = 0.692 * Math.pow( vs * 1852 / 3600 / Math.sqrt( tm * g ), 0.769 ) + 1.81 * Math.pow( cb, 6.95);
	const alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 ) * f1;
	
	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return raw + alpha1 / 8 * l / b;
	
}

