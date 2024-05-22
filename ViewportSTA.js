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
		const modeltest = new UIDiv();
		const correction = new UIDiv();
		const measured = new UIDiv();
		const result = new UIDiv();
		
		tabbedPanel.setId( 'tabbedPanel' )
		tabbedPanel.addTab( 'particular', 'particular', particular );
		tabbedPanel.addTab( 'model', 'model test', modeltest );
		tabbedPanel.addTab( 'correction', 'correction', correction );
		tabbedPanel.addTab( 'measured', 'measured data', measured );
		tabbedPanel.addTab( 'result', 'result', result );
		tabbedPanel.select( 'measured' );

		Object.assign( this, { particular, modeltest, correction, result } )

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

		this.mt();
		this.measured( measured );


	}

	mt() {

		const { ship, modeltest } = this;
		let div, table, row;

		div = new UIDiv();
		div.setDisplay( 'inline-block' );
		div.add( new UIText( 'Trial load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );

		table = new UITable();
		div.dom.appendChild( table.dom );
		div.add( new UIText( '' ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Speed (knots)'
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'

		for( let i = 0; i < row.dom.cells.length; i ++ ) {

			row.dom.cells[ i ].style.width = '50px';

		}

		for( let i = 0; i < 20; i ++ ) {

			const row = table.insertRow();
			row.insertCell();
			row.insertCell();
			row.insertCell();

		}

		div = new UIDiv();
		div.setDisplay( 'inline-block' );
		div.add( new UIText( 'Contract load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );
		
		table = new UITable();
		div.dom.appendChild( table.dom );
		div.add( new UIText( '' ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Speed (knots)'
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'

		for( let i = 0; i < row.dom.cells.length; i ++ ) {

			row.dom.cells[ i ].style.width = '50px';

		}

		for( let i = 0; i < 20; i ++ ) {

			const row = table.insertRow();
			row.insertCell();
			row.insertCell();
			row.insertCell();

		}

		div = new UIDiv();
		div.setDisplay( 'inline-block' );
		div.add( new UIText( 'EEDI load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );
		
		table = new UITable();
		div.dom.appendChild( table.dom );
		div.add( new UIText( '' ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Speed (knots)'
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'

		for( let i = 0; i < row.dom.cells.length; i ++ ) {

			row.dom.cells[ i ].style.width = '50px';

		}

		for( let i = 0; i < 20; i ++ ) {

			const row = table.insertRow();
			row.insertCell();
			row.insertCell();
			row.insertCell();

		}
		
		//Chart
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			
			Chart.defaults.backgroundColor = 'Black';
			Chart.defaults.borderColor = 'DimGray';
			Chart.defaults.color = 'lightgray';

		}

		div = new UIDiv();
		div.setDisplay( 'inline-block' );
		div.add( new UIText( 'Chart view' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );

		const ctx = document.createElement('canvas');
		div.dom.appendChild( ctx );
		ctx.width = 500;
		ctx.height = 812;
		ctx.style.display = 'inline'

		const data = {

			datasets: [
				{
					label: 'Ballast M/T',
					// backgroundColor: 'rgb(255, 99, 132)',
					// borderColor: 'rgb(255, 149, 182)',
					showLine: true,
					data: ship.mt.vs.map( ( e, i ) => { 
						
						return {
							
							x: e,
							y: ship.mt.pb[ i ]

						}

					} ),

				},
				{
					label: 'Design M/T',
					// backgroundColor: 'rgb(99, 132, 255)',
					// borderColor: 'rgb(149, 182, 255)',
					showLine: true,
					data: ship.mt.vsLoaded.map( ( e, i ) => { 
						
						return {
							
							x: e,
							y: ship.mt.pbLoaded[ i ]
							
						}

					} ),
				}
			],

		};

		const config = {
			
			type: 'scatter',
			data: data,

			options: {
			
				responsive: false,

				scales: {
				
					x: {
					
						type: 'linear',
						position: 'bottom',
						
						title: {

							display: true,
							text: 'Speed [knots]',

							font: {

								size: 14,
								weight: 'bold',

							}

						},

						// ticks: {

						// 	callback: function(value, index, ticks) {

						// 		return value.toFixed( 1 ) + ' kts';

						// 	}

						// }
					
					},

					y: {
					
						type: 'linear',
						position: 'left',
						
						title: {

							display: true,
							text: 'Power [kW]',
							
							font: {

								size: 14,
								weight: 'bold',

							}

						},

						// ticks: {

						// 	callback: function(value, index, ticks) {

						// 		return value.toLocaleString() + ' kW';

						// 	}

						// }
					
					}

				},

				plugins: {

					title: {

						display: true,
						text: 'Speed-power curve',
						
						font: {

							size: 16,
							weight: 'bold',

						},

						padding: {

							top: 10,
							bottom: 10

						}

					},

					// datalabels: {

					// 	anchor: 'start',
					// 	align: '-45',
					// 	clamp: true,
					// 	color: "orange",

					// }

				},
			
			}

		};

		new Chart( ctx, config );

	}

	modekTest() {

		const { ship, modeltest } = this;

		let table, row;

		table = new UITable();
		
		row = table.insertRow();
		row.insertHeader().textContent = 'Speed (knots)'
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'
		row.insertHeader().textContent = 'CTS'
		row.insertHeader().textContent = 'ETAD'
		row.insertHeader().textContent = 'ETAR'
		row.insertHeader().textContent = 't'
		row.insertHeader().textContent = 'wtm'

		for( let i = 0; i < row.dom.cells.length; i ++ ) {

			row.dom.cells[ i ].style.width = '50px';

		}

		ship.mt.vs.map( e => table.insertRow().insertCell().textContent = e.toFixed( 1 ) );
		ship.mt.pb.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.rpm.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.cts.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.etad.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.etar.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.t.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.wtm.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );

		modeltest.add( new UIText( 'Trial load condition' ) );
		modeltest.dom.appendChild( table.dom );

		table = new UITable();
		row = table.insertRow();
		row.insertHeader().textContent = 'Speed (knots)'
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'

		for( let i = 0; i < row.dom.cells.length; i ++ ) {

			row.dom.cells[ i ].style.width = '50px';

		}

		ship.mt.vsLoaded.map( e => table.insertRow().insertCell().textContent = e.toFixed( 1 ) );
		ship.mt.pbLoaded.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );
		ship.mt.rpmLoaded.map( ( e, i ) => table.rows[ i + 1 ].insertCell().textContent = e );

		modeltest.add( new UIText( 'Design load condition' ) );
		modeltest.dom.appendChild( table.dom );

	}

	measured( div ) {

		const ship = this.ship;
		const addButton = new UIButton( 'Add double runs (+)' );
		const minusButton = new UIButton( 'Remove double runs (-)' );
		div.add( addButton, minusButton );

		addButton.dom.addEventListener( 'click', () => {
			
			const rows = table.rows;
			const n = rows.length;

			for( let i = 0; i < n; i ++ ) {

				const row = rows[ i ];
				const cells = row.dom.cells;
				// if ( cells[ cells.length - 1 ].tagName == 'TH' ) {
				i == 1 ? row.insertHeader().textContent = cells.length - 1 : row.insertCell();
				i == 1 ? row.insertHeader().textContent = cells.length - 1 : row.insertCell();

			}

		} );

		minusButton.dom.addEventListener( 'click', () => {
			
			const rows = table.dom.rows;
			const n = rows.length;

			for( let i = 0; i < n; i ++ ) {

				const row = rows[ i ];
				const cells = row.cells;

				if ( cells.length >= 5 ) {

					row.deleteCell( - 1 );
					row.deleteCell( - 1);

				}

			}

		} );


		const table = new UITable();
		div.dom.appendChild( table.dom );

		let row = table.insertRow();
		row.insertHeader().setWidth( '100px' ).textContent = 'Engine load (%)'
		ship.load.map( e => {

			row.insertCell().textContent = e;
			row.insertCell().textContent = e;

		} );

		row = table.insertRow();
		row.insertHeader().textContent = 'Run number'
		ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i + 1 );

		row = table.insertRow();
		row.insertHeader().textContent = 'Date time' //YYYY-MM-DDThh:mm:ss
		ship.time.map( e => row.insertCell().setFontSize( '11px' ).textContent = e );

		row = table.insertRow();
		row.insertHeader().textContent = 'Ship heading (°)'
		ship.hdg.map( e => row.insertCell().textContent = e );

		row = table.insertRow();
		row.insertHeader().textContent = 'Ship speed (knots)'
		ship.sog.map( e => row.insertCell().textContent = e.toFixed( 2 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Shaft speed (rpm)'
		ship.rpm.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Shaft power (kW)'
		ship.power.map( e => row.insertCell().textContent = e.toFixed( 0 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wind velocity (m/s)'
		ship.wind_v.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wind direction (°)'
		ship.wind_d.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wave height (m)'
		ship.wave.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wave direction (°)'
		ship.wave.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wave period (sec)'
		ship.wave.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Swell height (m)'
		ship.swell.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Swell direction (°)'
		ship.swell.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Swell period (sec)'
		ship.swell.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		table.dom.style.width = '95%';

		console.log( table.getData() );

	}

}

export { ViewportSTA };
