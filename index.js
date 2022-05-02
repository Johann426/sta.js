class Ship {

	constructor() {

		this.initialize();
		this.table = document.getElementById( "table1" );

	}

	initialize() {

		this.Za = 52.4;
		this.Zref = 10;

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
		this.wave_ = [];

	}

	RAA() {

		const table = this.table;
		const ave = true;
		const nm1 = this.hdg.length - 1;
		const vwt = [];
		const dwt = [];
		let row1, row2, row3;

		row1 = table.insertRow();
		row2 = table.insertRow();

		for ( let i = 0; i <= nm1; i ++ ) {

			const hdg = this.hdg[ i ] * Math.PI / 180.0;
			const sog = this.sog[ i ] * 0.514444444;
			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ] * Math.PI / 180.0;
			vwt[ i ] = Math.sqrt( vwr * vwr + sog * sog - 2.0 * vwr * sog * Math.cos( dwr ) );
			const y = vwr * Math.sin( dwr + hdg ) - sog * Math.sin( hdg );
			const x = vwr * Math.cos( dwr + hdg ) - sog * Math.cos( hdg );
			dwt[ i ] = x >= 0 ? y >= 0 ? Math.atan( y / x ) : Math.atan( y / x ) + 2.0 * Math.PI : Math.atan( y / x ) + Math.PI;

			row1.insertCell( i ).innerHTML = vwt[ i ];
			row2.insertCell( i ).innerHTML = dwt[ i ] * 180.0 / Math.PI;

		}

		row1.insertCell( 0 ).innerHTML = "True wind velocity at anemometer height";
		row2.insertCell( 0 ).innerHTML = "True wind direction at anemometer height";

		// Averaging process for the true wind velocity and direction
		row1 = table.insertRow();
		row2 = table.insertRow();

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

			row1.insertCell( i ).innerHTML = vwt[ i ];
			row2.insertCell( i ).innerHTML = dwt[ i ] * 180.0 / Math.PI;

		}

		row1.insertCell( 0 ).innerHTML = "True wind velocity at anemometer height (double run average)";
		row2.insertCell( 0 ).innerHTML = "True wind direction at anemometer height (double run average)";

		row1 = table.insertRow();
		row2 = table.insertRow();
		row3 = table.insertRow();

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

			row1.insertCell( i ).innerHTML = vwtRef;
			row2.insertCell( i ).innerHTML = vwrRef;
			row3.insertCell( i ).innerHTML = dwrRef * 180.0 / Math.PI;

		}

		row1.insertCell( 0 ).innerHTML = "True wind velocity at reference height";
		row2.insertCell( 0 ).innerHTML = "Relative wind velocity at reference height";
		row3.insertCell( 0 ).innerHTML = "Relative wind direction at reference height";

	}

}


init();

function init() {

	const ship = new Ship();
	ship.RAA();



}
