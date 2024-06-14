import { UIButton, UICheckbox, UIDiv, UIInteger, UISelect, UISpan, UITabbedPanel, UIText, UITextArea } from './ui.js';
import { UICollapsible } from './UICollapsible.js';
import { UITable } from './UITable.js';

const colors = [
	'rgb(11,132,165)', //blue
	'rgb(202,71,47)', //red
	'rgb(246,200,95)', //yellow
	'rgb(157,216,102)', //green
	'rgb(111, 78, 124)', //purple
	'rgb(255,160,86)', // orange
	'rgb(141,221,208)' //cyan
]
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
		tabbedPanel.select( 'result' );

		Object.assign( this, { particular, modeltest, measured, correction, result } )

		
		
		this.particularTab();
		this.modeltestTab();
		this.measuredTab();
		this.correctionTab();
		this.res();

	}

	particularTab() {

		const { particular, ship } = this;
		particular.tables = [];

		let div, table, row;

		// Ship particulars
		div = new UIDiv().setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Ship particulars' ).setWidth('100%').setTextAlign( 'center' ).setPadding( '10px 0px 5px 0px' ) );
		particular.add( div );

		table = new UITable().setWidth('300px');
		div.add( table );
		particular.tables.push( table );

		row = table.insertRow();
		row.insertHeader().textContent = 'Ship No.'
		row.insertCell().textContent = '' // text format needed

		row = table.insertRow();
		row.insertHeader().textContent = 'LPP (m)'
		row.insertCell().textContent = ship.l;
		
		row = table.insertRow();
		row.insertHeader().textContent = 'B (m)'
		row.insertCell().textContent = ship.b;
		
		row = table.insertRow();
		row.insertHeader().textContent = 'S (m\u00B2)'
		row.insertCell().textContent = ship.wetted;
		
		row = table.insertRow();
		row.insertHeader().textContent = 'Ax (m\u00B2)'
		row.insertCell().textContent = ship.Ax;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'Z<sub>a</sub> (m)';
		row.insertCell().textContent = ship.Za;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'Z<sub>ref</sub> (m)';
		row.insertCell().textContent = 10;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'C<sub>B</sub>';
		row.insertCell().textContent = ship.cb;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'k<sub>yy</sub>';
		row.insertCell().textContent = ship.kyy;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'L<sub>E</sub>';
		row.insertCell().textContent = ship.le;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'L<sub>R</sub>';
		row.insertCell().textContent = ship.lr;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'L<sub>BWL</sub>';
		row.insertCell().textContent = ship.lbwl;

		// Engine & speed
		div = new UIDiv().setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		particular.add( div );
		
		// Main engine
		div.add( new UIText( 'Main engine' ).setWidth('100%').setTextAlign( 'center' ).setPadding( '10px 0px 5px 0px' ) );

		table = new UITable().setWidth('360px');
		div.add( table );
		particular.tables.push( table );

		row = table.insertRow()
		row.insertHeader().textContent = ''
		row.insertHeader().textContent = 'Power (kW)'
		row.insertHeader().textContent = 'RPM'

		// row = table.insertRow();
		// row.insertHeader().textContent = 'MCR'
		// Array( 2 ).fill().map( () => row.insertCell() );

		row = table.insertRow();
		row.insertHeader().textContent = 'NCR Load'
		Array( 2 ).fill().map( () => row.insertCell() );

		row = table.insertRow();
		row.insertHeader().textContent = 'EEDI Load'
		Array( 2 ).fill().map( () => row.insertCell() );

		// Speed
		div.add( new UIText( 'Contract speed' ).setWidth('100%').setTextAlign( 'center' ).setPadding( '10px 0px 5px 0px' ) );

		table = new UITable().setWidth('360px');
		div.add( table );
		particular.tables.push( table );

		row = table.insertRow();
		row.insertHeader().textContent = 'Sea margin (%)'
		row.insertCell();

		row = table.insertRow();
		row.insertHeader().textContent = 'Contract speed at NCR power with sea margin (knots)'
		row.insertCell();

		// Draft reading
		div = new UIDiv();
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );;
		div.add( new UIText( 'Draft reading' ).setWidth('100%').setTextAlign( 'center' ).setPadding( '10px 0px 5px 0px' ) );
		particular.add( div );

		table = new UITable().setWidth('300px');
		div.add( table );
		particular.tables.push( table );

		row = table.insertRow();
		row.insertHeader().textContent = 'Draft F.P. (m)'
		row.insertCell().textContent = ship.tf;
		
		row = table.insertRow();
		row.insertHeader().textContent = 'Draft A.P. (m)'
		row.insertCell().textContent = ship.ta;
		
		row = table.insertRow();
		row.insertHeader().textContent = 'Disp. (t)'//'Δ (m\u00B3)'
		row.insertCell().textContent = ship.disp;

		row = table.insertRow();
		row.insertHeader().innerHTML = 'T<sub>s</sub> (°C)';
		row.insertCell().textContent = ship.tempSea;

		row = table.insertRow();
		row.insertHeader().innerHTML = '&#961<sub>s</sub> (kg/m<sup>3</sup>)';
		row.insertCell().textContent = ship.rho;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'T<sub>air</sub> (°C)';
		row.insertCell().textContent = ship.tempAir;

		row = table.insertRow();
		row.insertHeader().innerHTML = '&#961<sub>air</sub> (kg/m<sup>3</sup>)';
		row.insertCell().textContent = ship.rhoa;

	}

	modeltestTab() {

		const { ship, modeltest } = this;
		modeltest.setPosition( 'relative' )
		modeltest.tables = [];

		let div, table, row;

		// Trial load condition
		div = new UIDiv().setPadding( '10px 0px' ); // top and bottom, right and left
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Trial load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );

		table = new UITable();
		modeltest.tables.push( table );
		div.add( table );
		div.add( ...addButton( table ) );

		row = table.insertRow();
		row.insertHeader().setWidth( '50px' ).textContent = 'Speed (knots)'
		row.insertHeader().setWidth( '50px' ).textContent = 'Power (kW)'
		row.insertHeader().setWidth( '50px' ).textContent = 'RPM (r/min)'

		const n = 16;

		for( let i = 0; i < n; i ++ ) {

			const row = table.insertRow();
			Array( 3 ).fill().map( () => row.insertCell() );

		}

		// Contract load condition
		div = new UIDiv().setPadding( '10px 0px' );
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Contract load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );
		
		table = new UITable();
		modeltest.tables.push( table );
		div.add( table );
		div.add( ...addButton( table ) );

		row = table.insertRow();
		row.insertHeader().setWidth( '50px' ).textContent = 'Speed (knots)'
		row.insertHeader().setWidth( '50px' ).textContent = 'Power (kW)'
		row.insertHeader().setWidth( '50px' ).textContent = 'RPM (r/min)'

		for( let i = 0; i < n; i ++ ) {

			const row = table.insertRow();
			Array( 3 ).fill().map( () => row.insertCell() );

		}

		// EEDI load condition
		div = new UIDiv().setPadding( '10px 25px 10px 0px' ); // top right bottom left
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'EEDI load condition' ).setWidth('100%').setTextAlign( 'center' ) );
		modeltest.add( div );
		
		table = new UITable();
		modeltest.tables.push( table );
		div.add( table );
		div.add( ...addButton( table ) );

		row = table.insertRow();
		row.insertHeader().setWidth( '50px' ).textContent = 'Speed (knots)'
		row.insertHeader().setWidth( '50px' ).textContent = 'Power (kW)'
		row.insertHeader().setWidth( '50px' ).textContent = 'RPM (r/min)'

		for( let i = 0; i < n; i ++ ) {

			const row = table.insertRow();
			Array( 3 ).fill().map( () => row.insertCell() );

		}
		
		// Speed-power chart
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			
			Chart.defaults.backgroundColor = 'Black';
			Chart.defaults.borderColor = 'DimGray';
			Chart.defaults.color = 'lightgray';

		}

		div = new UIDiv()//.setPosition( 'absolute' ).setTop( '50%' ).setHeight( '360px' ).setMarginTop( '-360px' ); // vertical center
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		modeltest.add( div );

		const canvas = document.createElement('canvas');
		div.dom.appendChild( canvas );
		canvas.width = 480;
		canvas.height = 720;
		canvas.style.display = 'inline'
		// canvas.style.border = 'solid'

		const data = {

			datasets: [
				{

					label: 'Ballast',
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[0],
					showLine: true,
					borderWidth: 2,
					borderDash: [5, 5],
					//pointStyle: 'circle'
					pointRadius: 0,
					// data: ship.mt.vs.map( ( e, i ) => { 
						
					// 	return {
							
					// 		x: e,
					// 		y: ship.mt.pb[ i ]

					// 	}

					// } ),

				},

				{

					label: 'Design',
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[1],
					showLine: true,
					borderWidth: 2,
					borderDash: [12, 5],
					//pointStyle: 'rectRot'
					pointRadius: 0,
					
				},

				{

					label: 'EEDI condition',
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[2],
					showLine: true,
					borderWidth: 2,
					borderDash: [2, 2],
					//pointStyle: 'triangle'
					pointRadius: 0,

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

		modeltest.chart = new Chart( canvas, config );

	}

	measuredTab() {

		const { measured, ship } = this;
		measured.history = [];

		let div, table, row;

		div = new UIDiv();
		measured.add( div );

		const addButton = new UIText( 'Add double runs (+)' ).setClass( 'item' );
		const minusButton = new UIText( 'Remove double runs (-)' ).setClass( 'item' );
		div.add( addButton, minusButton );

		addButton.dom.addEventListener( 'click', () => {
			
			const rows = table.rows;
			const n = rows.length;
			
			for( let i = 0; i < n; i ++ ) {

				const row = rows[ i ];
				const cells = row.cells;
				Array( 2 ).fill().map( () => i == 1 ? row.insertHeader().textContent = cells.length - 1 : row.insertCell().textContent = measured.history.pop() );

			}

		} );

		minusButton.dom.addEventListener( 'click', () => {
			
			const rows = table.rows;
			const n = rows.length;

			for( let i = n - 1; i >= 0; i -- ) {

				const row = rows[ i ];
				const cells = row.cells;

				if ( cells.length >= 5 ) {

					Array( 2 ).fill().map( () => i == 1 ? row.removeCell( - 1 ) : measured.history.push( row.removeCell( - 1 ).textContent ) );

				}

			}

		} );


		table = new UITable();
		measured.table = table;
		div.add( table );

		row = table.insertRow();
		row.insertHeader().setWidth( '100px' ).textContent = 'Engine load (%)'
		// ship.load.map( e => row.insertCell().textContent = e );

		row = table.insertRow();
		row.insertHeader().textContent = 'Run number'
		// ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i + 1 );

		row = table.insertRow();
		row.insertHeader().textContent = 'Date time' //YYYY-MM-DDThh:mm:ss
		// ship.time.map( e => row.insertCell().setFontSize( '11px' ).textContent = e );

		row = table.insertRow();
		row.insertHeader().textContent = 'Ship heading (°)'
		// ship.hdg.map( e => row.insertCell().textContent = e );
		
		const border = '2px solid rgb(96,96,96)'

		row = table.insertRow().setBorderTop( border )
		row.insertHeader().textContent = 'Ship speed (knots)'
		// ship.sog.map( e => row.insertCell().textContent = e.toFixed( 2 ) );

		row = table.insertRow();//.setBorderLeft( border ).setBorderRight( border );
		row.insertHeader().textContent = 'RPM (r/min)'
		// ship.rpm.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();//.setBorderLeft( border ).setBorderRight( border ).setBorderBottom( border );
		row.insertHeader().textContent = 'Power (kW)'
		// ship.power.map( e => row.insertCell().textContent = e.toFixed( 0 ) );

		row = table.insertRow().setBorderTop( border );;
		row.insertHeader().textContent = 'Wind velocity (m/s)'
		// ship.wind_v.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wind direction (°)'
		// ship.wind_d.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow().setBorderTop( border );;
		row.insertHeader().textContent = 'Wave height (m)'
		// ship.wave.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wave direction (°)'
		// ship.wave.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Wave period (sec)'
		// ship.wave.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow().setBorderTop( border );
		row.insertHeader().textContent = 'Swell height (m)'
		// ship.swell.height.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Swell direction (°)'
		// ship.swell.angle.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		row = table.insertRow();
		row.insertHeader().textContent = 'Swell period (sec)'
		// ship.swell.period.map( e => row.insertCell().textContent = e.toFixed( 1 ) );

		table.dom.style.width = '100%';

		Array( 5 ).fill().map( () => addButton.dom.click() );
		
	}

	correctionTab() {

		const { correction, ship } = this;
		
		let div, table, row, options;

		div = new UIDiv().add( new UIText( 'Correction method' ).setPadding( '10px 0px 5px 0px' ) );
		correction.add( div );
		
		options = new UISelect().setDisplay( 'block' ).setOptions( {

			iso2002: 'ISO 15016:2002',
			iso2015: 'ISO 15016:2015',
			ittc2017: 'ITTC 2017',
			ittc2021: 'ITTC 2021'

	 	} );
		
		options.setValue( 'iso2015' )

		div.add( options );
		correction.method = options;

		const wind = new UICollapsible( 'wind' );
		const wave = new UICollapsible( 'wave' );
		const current = new UICollapsible( 'current' );
		
		correction.add( wind, wave, current );
		
		Object.assign( correction, { wind, wave, current } )

		// Wind coefficients
		div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );

		div.add( new UIText( 'Wind resistance coefficient' ).setWidth('100%').setTextAlign( 'center' ) );
		wind.content.add( div );

		wind.tables = [];

		table = new UITable();
		wind.tables.push( table );
		div.add( table );

		row = table.insertRow();
		row.insertHeader().setPadding( '2px 10px' ).textContent = 'Angle (°)'
		row.insertHeader().setPadding( '2px 10px' ).innerHTML = 'C<sub>X</sub>'

		for ( let i = 0; i <= 36; i ++ ) {

			row = table.insertRow();
			row.insertCell().setPadding( '0px' ).textContent = ( i * 10 ).toString();
			row.insertCell().setPadding( '0px' ).textContent = ''

		}

		// Wind coefficients chart
		div = new UIDiv().setPadding( '10px 20px' );
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		wind.content.add( div );
		const canvas = document.createElement('canvas');
		div.dom.appendChild( canvas );
		canvas.width = 480;
		canvas.height = 680;
		canvas.style.display = 'inline'

		const data = {

			datasets: [
				{

					label: 'Ballast',
					showLine: true,
					borderWidth: 2,
					pointStyle: 'circle',
					// data: 

				},

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
							text: 'Angle [°]',

							font: {

								size: 14,
								weight: 'bold',

							}

						},
					
					},

					y: {
					
						type: 'linear',
						position: 'left',
						
						title: {

							display: true,
							text: 'Cx',
							
							font: {

								size: 14,
								weight: 'bold',

							}

						},

					}

				},

				plugins: {

					legend: false

				}

			}

		};

		wind.chart = new Chart( canvas, config );
		
		div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
		wind.content.add( div );
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Use average (Annex C.1.1)' ).setWidth('90%').setTextAlign( 'center' ) );
		wind.useAverage = new UICheckbox().setValue( true )
		div.add( wind.useAverage );

		// wave
		div = new UIDiv().add( new UIText( 'ISO 15016:2002' ).setPadding( '10px 0px 5px 0px' ) );
		wave.content.add( div );
		
		options = new UISelect().setDisplay( 'block' ).setOptions( {

			fal: 'Faltinsen',
			fuji: 'Fujii-Takahashi',
			kwon: 'Kwon',

	 	} );
		
		options.setValue( 'fal' )
		div.add( options );

		div = new UIDiv().add( new UIText( 'ISO 15016:2015' ).setPadding( '10px 0px 5px 0px' ) );
		wave.content.add( div );
		
		options = new UISelect().setDisplay( 'block' ).setOptions( {

			sta1: 'STAWAVE-1',
			sta2: 'STAWAVE-2',
			nmri: 'Theoretical method with simplified tank tests in short wave',
			test: 'Seakeeping model tests',
			snnm: 'SNNM'

	 	} );
		
		options.setValue( 'sta2' )
		div.add( options );
		

		// current
		div = new UIDiv().add( new UIText( 'ISO 15016:2002' ).setPadding( '10px 0px 5px 0px' ) );
		current.content.add( div );
		
		options = new UISelect().setDisplay( 'block' ).setOptions( {

			none: 'no current',
			curv: 'current curve'

	 	} );
		
		options.setValue( 'none' )
		div.add( options );

		div = new UIDiv().add( new UIText( 'ISO 15016:2015' ).setPadding( '10px 0px 5px 0px' ) );
		current.content.add( div );
		
		options = new UISelect().setDisplay( 'block' ).setOptions( {

			none: 'no current',
			iterative: 'iterative',
			mom: 'mean of means'

	 	} );
		
		options.setValue( 'iterative' )
		div.add( options );

	}
	
	res() {

		const { ship, result } = this;

		let div, table, row;

		const calButton = new UIText( 'Calculate result' ).setClass( 'item' );
		result.add( calButton );

		//Chart
		div = new UIDiv();
		result.add( div );
		const canvas = document.createElement('canvas');
		div.dom.appendChild( canvas );
		canvas.width = 700;
		canvas.height = 1024;

		const data = {

			datasets: [
				{

					label: 'Ballast(Model)',
					showLine: true,
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[0],
					borderWidth: 1,
					borderDash: [5, 5],
					pointRadius: 0,
					// data:

				},

				{

					label: 'Loaded(Model)',
					showLine: true,
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[1],
					borderWidth: 1,
					borderDash: [12, 5],
					pointRadius: 0,
					
				},

				{

					label: 'Ballast(Sea trial)',
					showLine: true,
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[2],
					borderWidth: 3,
					pointRadius: 0,

				},

				{

					label: 'Loaded(Predicted)',
					showLine: true,
					backgroundColor: 'rgba(0, 0, 0, 0.0)',
					borderColor: colors[3],
					borderWidth: 3,
					// backgroundColor: 'lightgreen',
					// borderColor: 'green',
					// borderDash: [4, 2],
					pointRadius: 0,

				},

				{

					label: 'Measured',
					backgroundColor: colors[4],
					borderColor: colors[4],
					borderWidth: 2,
					borderDash: [2, 2],
					pointStyle: 'circle',
					pointRadius: 4,

				},

				{

					label: 'Corrected',
					backgroundColor: colors[5],
					borderColor: colors[5],
					borderWidth: 2,
					borderDash: [2, 2],
					pointStyle: 'triangle',
					pointRadius: 6,

				},

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

					}

				},

				plugins: {

					datalabels: {

						anchor: 'start',
						align: '-45',
						clamp: true,
						color: "orange",

					}

				},
			
			}

		};

		result.chart = new Chart( canvas, config );

		calButton.dom.addEventListener( 'click', () => {
			
			// runSTA( ship, result );
			runClassLib( ship );

		} );

	}

}

function runClassLib( ship ) {

	console.log( 'it depends on class library in server method' )

	sendData( ship )

	function sendData( value ) { 
		
		$.ajax({ 
			url: '/process',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify( value ),
			success: function(response) {
				console.log('success');
				console.log( response );
			}, 
			error: function(error) { 
				console.log(error); 
			} 
		});
	} 

}

function runSTA( ship, result ) { //result: UIDiv

	runClassLib( ship ); // run class library(.dll)

	const chart = result.chart // chart.js
	const data = chart.config.data

	checkValidity();

	// Temperature to density
	// wind resistance
	// wave resistance
	// water temperature salinity
	// current correction
	// speed-power
	
	let table, row;

	// Measured data
	table = new UITable();
	result.add( table );

	row = table.insertRow();
	row.insertHeader().textContent = 'Engine load (%)'
	ship.load.map( e => row.insertCell().textContent = e );

	row = table.insertRow();
	row.insertHeader().textContent = 'Run number'
	ship.hdg.map( ( e, i ) => row.insertHeader().textContent = i );

	row = table.insertRow();
	row.insertHeader().textContent = 'Heading (°)'
	ship.hdg.map( e => row.insertCell().textContent = e );

	row = table.insertRow();
	row.insertHeader().textContent = 'Speed over ground (knots)'
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

	/////////////////////////////////////////////////////////////////////////////////////////////
	// Results
	/////////////////////////////////////////////////////////////////////////////////////////////
	const res = ship.analysis();
	console.log( res );
	const { vwr, dwr, vwt, dwt, vwtAve, dwtAve, vwtRef, vwrRef, dwrRef, caa, raa } = res;
	const { wave, swell, raw, ras, delr, pid, stw, pb, powerOffset, speedAtNCR } = res;

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind velocity at anemometer height (m/s)";
	vwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind direction at anemometer height (°)";
	dwr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at anemometer height (m/s)";
	vwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind direction at anemometer height (°)";
	dwt.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at anemometer height, double run averaged (m/s)";
	vwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind direction at anemometer height, double run averaged (°)";
	dwtAve.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "True wind velocity at reference height (m/s)";
	vwtRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind velocity at reference height (m/s)";
	vwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Relative wind direction at reference height (°)";
	dwrRef.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Wind coefficient";
	caa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "RAA (kN)";
	raa.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave motion (kN) ';
	wave.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave reflection (kN) ';
	wave.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Wave total (kN) ';
	wave.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell motion (kN) ';
	swell.rawm.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell reflection (kN) ';
	swell.rawr.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'Swell total (kN) ';
	swell.total.map( e => row.insertCell( - 1 ).textContent = ( 0.001 * e ).toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'RAW (kN) ';
	raw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = 'RAS (kN) ';
	ras.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "ΔR (kN)";
	delr.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 2 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "PD (kW)";
	pid.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "Vs (kts)";
	stw.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 3 ) );

	row = table.insertRow();
	row.insertHeader().textContent = "PB (kW)";
	pb.map( e => row.insertCell( - 1 ).textContent = e.toFixed( 0 ) );

	table = new UITable();
	result.add( table );
	row = table.insertRow();
	row.insertHeader().textContent = "NCR";
	row.insertHeader().textContent = ship.ncr[ 1 ] + ' (kW)';
	row = table.insertRow();
	row.insertHeader().textContent = "Sea Margin";
	row.insertHeader().textContent = ship.sm + ' (%)';
	row = table.insertRow();
	row.insertHeader().textContent = "Speed at NCR with s.m.";
	row.insertHeader().textContent = speedAtNCR.toFixed( 3 ) + ' (knots)';

	// Speed-power chart
	data.datasets[ 0 ].data = drawCurve( ship.mt.vs, ship.mt.pb )

	data.datasets[ 1 ].data = drawCurve( ship.mt.vsLoaded, ship.mt.pbLoaded )

	data.datasets[ 2 ].data = drawCurve( ship.mt.vs, ship.mt.pb.map( e => e + powerOffset ))
	console.log( data.datasets[ 2 ].data )

	data.datasets[ 3 ].data = drawCurve( ship.mt.vsLoaded, ship.mt.pbLoaded.map( e => e + powerOffset ) )

	data.datasets[ 4 ].data = drawCurve( ship.sog, ship.power )

	data.datasets[ 5 ].data = drawCurve( stw, pb )

	function drawCurve( vs, pb ) {

		return vs.map( ( v, i ) => { 
			
			return {
				
				x: v,
				y: pb[ i ]
	
			}
	
		} );

	}

	chart.update();

}

function checkValidity() {

	console.warn( 'not implemented' );

}

function addButton( table ) {

	table.history = [];

	const addButton = new UIText( '+' ).setClass( 'item' ).onClick( () => {

		const row = table.insertRow();
		const pop = table.history.pop();
		Array( 3 ).fill().map( ( e, i ) => row.insertCell().textContent = pop? pop[ i ] : '' );

	});

	const minusButton = new UIText( '-' ).setClass( 'item' ).onClick( () => {

		table.history.push( table.removeRow().cells.map( e => e.textContent ) );

	});

	return [ addButton, minusButton ]

}

export { ViewportSTA, runSTA };
