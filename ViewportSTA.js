import { UIButton, UIDiv, UIInteger, UISelect, UISpan, UITabbedPanel, UIText, UITextArea } from './ui.js';
import { UICollapsible } from './UICollapsible.js';
import { UITable } from './UITable.js';

class ViewportSTA extends UIDiv{

	constructor( ship ) {

		super();
		this.ship = ship;
		this.setId( 'viewportSTA' );

		const tabbedPanel = new UITabbedPanel();
		this.add( tabbedPanel );
		
		const particular = new UIDiv();
		const correction = new UIDiv();
		const measured = new UIDiv();
		const result = new UIDiv();
		
		tabbedPanel.setId( 'tabbedPanel' )
		tabbedPanel.addTab( 'particular', 'particular', particular );
		tabbedPanel.addTab( 'correction', 'correction', correction );
		tabbedPanel.addTab( 'measured', 'measured data', measured );
		tabbedPanel.addTab( 'result', 'result', result );
		tabbedPanel.select( 'measured' );

		Object.assign( this, { particular, correction, result } )

		const wind = new UICollapsible( 'wind' );
		const wave = new UICollapsible( 'wave' );
		const current = new UICollapsible( 'current' );
		correction.add( wind, wave, current );

		let row;

		const table = new UITable();
		wind.content.dom.appendChild( table.dom );
		
		for ( let i = 0; i <= 36; i ++ ) {

			row = table.insertRow();
			row.insertCell().textContent = ( i * 10 ).toString();
			row.insertCell().textContent = ''

		}
		
		const options = new UISelect().setOptions( {

			iterative: 'iterative',
			mom: 'mean of means'

	 	} );
		
		options.setValue( 'iterative' )

		current.content.dom.appendChild( options.dom );

		this.measured( measured );

	}

	measured( div ) {

		const ship = this.ship;
		const addButton = new UIButton( 'Add engine load (+)' );
		const minusButton = new UIButton( 'Remove engine load (-)' );
		div.add( addButton, minusButton );

		addButton.dom.addEventListener( 'click', () => {
			
			const rows = table.rows;
			const n = rows.length;

			for( let i = 0; i < n; i ++ ) {

				const row = rows[ i ];
				const cells = row.dom.cells;

				if ( cells[ cells.length - 1 ].tagName == 'TH' ) {
				
					row.insertHeader().textContent = i == 1 ? cells.length - 1 : '';
					row.insertHeader().textContent = i == 1 ? cells.length - 1 : '';

				} else {

					row.insertCell();
					row.insertCell();

				}

			}

		} );

		minusButton.dom.addEventListener( 'click', () => {
			
			const rows = table.dom.rows;
			const n = rows.length;

			for( let i = 0; i < n; i ++ ) {

				const row = rows[ i ];
				const cells = row.cells;

				if ( cells.length >= 3 ) {

					row.deleteCell( - 1 );
					row.deleteCell( - 1);

				}

			}

		} );


		const table = new UITable();
		div.dom.appendChild( table.dom );

		let row = table.insertRow();
		row.insertHeader().textContent = 'Engine load (%)'
		ship.load.map( e => {

			row.insertHeader().textContent = e;
			row.insertHeader().textContent = e;

		} );

		row = table.insertRow();
		row.insertHeader().textContent = 'Run number'
		ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i );

		row = table.insertRow();
		row.insertCell().textContent = 'Heading (°)'
		ship.hdg.map( e => row.insertCell().textContent = e );

		row = table.insertRow();
		row.insertCell().textContent = 'Speed over ground (knots)'
		ship.sog.map( e => row.insertCell().textContent = e.toFixed( 2 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Shaft speed (rpm)'
		ship.rpm.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Shaft power (kW)'
		ship.power.map( e => row.insertCell().textContent = e.toFixed( 0 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Wind velocity (m/s)'
		ship.wind_v.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Wind direction (°)'
		ship.wind_d.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Wave height (m)'
		ship.wave.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Wave direction (°)'
		ship.wave.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Wave period (sec)'
		ship.wave.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Swell height (m)'
		ship.swell.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Swell direction (°)'
		ship.swell.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertCell().textContent = 'Swell period (sec)'
		ship.swell.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		table.dom.style.width = '95%';

		

	}

}

export { ViewportSTA };
