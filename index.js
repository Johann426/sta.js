
init();

function init() {
	
	const ship = Ship();
	ship.initialize();
	
}

class Ship() {

	constructor() {
	}
	/*
	 *
	*/

	initialize() {
		
		// loads
		this.load = [65, 75, 75, 100];
		// heading
		this.hdg = [20, 200 , 20, 200, 20, 200 , 20, 200];
		// speed over ground
		this.sog = [17.9, 17.08, 18.01, 17.0, 17.96, 17.07, 18.19, 16.81];
		// shaft speed [rpm]
		this.rpm=[66, 66, 66, 66, 66, 66, 66, 66];
		// shaft power [kW]
		this.power=[12850, 12850, 12850, 12850, 12850, 12850, 12850, 12850];
		this.wind_v=[12.43, 12.39, 11.79, 13.15, 11.68, 13.67, 11.77, 13.88];
		this.wind_d=[16.4, 346.8, 17.1, 351.3, 16.2, 353.6, 15.0, 355.8];
		this.wave_=[];
		
	}
	
	RAA() {
		const nm1 = this.hdg.length - 1;
		const vwt = [];
		const dwt = [];
		
		for ( let i = 0; i < nm1; i ++ ) {

			const hdg = this.hdg[ i ] * Math.PI / 180.0;
			const sog = this.sog[ i ];
			const vwr = this.wind_v[ i ];
			const dwr = this.wind_d[ i ] * Math.PI / 180.0;
			vwt[ i ] = Math.sqrt( vwr * vwr + sog * sog - 2.0 * vwr * sog * Math.cos( dwr ) );
			const num = vwr * Math.sin( dwr + hdg ) - sog * Math.sin( hdg);
			const den = vwr * Math.cos( dwr + hdg ) - sog * Math.cos( hdg);
			dwt[ i ] = den >= 0 ? Math.atan( num / den ) : Math.atan( num / den ) + 180.0 ;
			
		}
		
		console.log( dwt );
		
	}

}
