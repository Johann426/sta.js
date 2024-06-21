import { UIButton, UICheckbox, UIDiv, UIInput, UIInteger, UISelect, UISpan, UITabbedPanel, UIText, UITextArea } from './ui.js';
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
		tabbedPanel.addTab( 'particular', 'Particular', particular );
		tabbedPanel.addTab( 'model', 'Model test', modeltest );
		tabbedPanel.addTab( 'correction', 'Correction', correction );
		tabbedPanel.addTab( 'measured', 'Measured data', measured );
		tabbedPanel.addTab( 'result', 'Result', result );
		tabbedPanel.select( 'correction' );

		Object.assign( this, { particular, modeltest, measured, correction, result } )
		
		this.particularTab();
		this.modeltestTab();
		this.measuredTab();
		this.correctionTab();
		this.ressultTab();

	}

	particularTab() {

		const { particular, ship } = this;
		particular.textInput = [];
		particular.tables = [];

		let div, table, row;

		div = new UIDiv();
		particular.add( div );

		[ 'Ship name : ', 'Owner name : ', 'Ship number : ' ].map( txt => {

			div.add( new UIText( txt ).setWidth('16%').setTextAlign( 'center' ).setPadding( '10px 0px' ) );
			const input = new UIInput('').setWidth('16%').setTextAlign( 'center' ).setPadding( '0px' );
			div.add( input )
			particular.textInput.push( input )

		} )

		// Ship particulars
		div = new UIDiv().setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Ship particulars' ).setWidth('100%').setTextAlign( 'center' ).setPadding( '10px 0px 5px 0px' ) );
		particular.add( div );

		table = new UITable().setWidth('300px');
		div.add( table );
		particular.tables.push( table );

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
		row.insertHeader().innerHTML = 'A<sub>X</sub> (m\u00B2)'
		row.insertCell().textContent = ship.Ax;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'Z<sub>a</sub> (m)';
		row.insertCell().textContent = ship.Za;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'Z<sub>ref</sub> (m)';
		row.insertCell().textContent = ship.Zref;
		
		row = table.insertRow();
		row.insertHeader().innerHTML = 'C<sub>B</sub>';
		row.insertCell().textContent = ship.cb;
		
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
		row.insertHeader().innerHTML = '∇ (m\u00B3)';
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
		
		const txt = `
		<p>• Symbols & abbreviation <p>
		&nbsp LPP : length between perpendiculars <br>
		&nbsp B : breadth <br>
		&nbsp S : wetted surface area <br>
		&nbsp A<sub>X</sub> : transverse projected area above waterline <br>
		&nbsp Z<sub>a</sub> : vertical height of anemometer <br>
		&nbsp Z<sub>ref</sub> : reference height for the wind resistance coefficients <br>
		&nbsp C<sub>B</sub> : block coefficient <br>
		&nbsp ∇ : displacement volume in sea trial <br>
		`
		div = new UIDiv();
		div.setInnerHTML( txt );
		particular.add( div );

	}

	modeltestTab() {

		const { ship, modeltest } = this;
		modeltest.setPosition( 'relative' )
		modeltest.tables = [];

		let div, table, row;

		// Trial load condition

		function addTable( title, n ) {

			table = new UITable();
			table.title = title;
			row = table.insertRow();
			row.insertHeader().setWidth( '35px' ).textContent = 'Speed (knots)'
			row.insertHeader().setWidth( '35px' ).textContent = 'Power (kW)'
			row.insertHeader().setWidth( '35px' ).textContent = 'RPM (r/min)'

			for( let i = 0; i < n; i ++ ) {

				const row = table.insertRow();
				Array( 3 ).fill().map( () => row.insertCell() );

			}

			div = new UIDiv().setPadding( '10px 0px' );
			div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
			div.add( new UIText( title ).setWidth('100%').setTextAlign( 'center' ) );
			div.add( table );
			div.add( ...addButton( table ) );
			modeltest.add( div );
			modeltest.tables.push( table );

		}

		addTable( 'Trial load condition', 16 );
		addTable( 'Contract load condition', 16 );
		addTable( 'EEDI load condition', 16 );

		div = new UIDiv()
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		modeltest.add( div );
		
		const chartLayout = {
			title: 'Speed-power curve',
			width: 480,
			height: 720,
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			colorway: [
				'rgb(11,132,165)', //blue
				'rgb(202,71,47)', //red
				'rgb(246,200,95)', //yellow
				'rgb(157,216,102)', //green
				'rgb(111, 78, 124)', //purple
				'rgb(255,160,86)', // orange
				'rgb(141,221,208)' //cyan
			],
			font: { //global font
				color: 'lightgray',
			},
			xaxis: {
			  title: 'Speed [knots]',
			  color: 'lightgray',
			  gridcolor: 'gray',
			  tickformat: ".1f",
			  minallowed: 0,
			  showline: true,
			  showgrid: true,
			  zeroline: false
			},
			yaxis: {
			  title: {
				text : 'Power [kW]',
				standoff: 5,
			  },
			  color: 'lightgray',
			  gridcolor: 'gray',
			  tickformat: ",.0f",
			  minallowed: 0,
			  showline: true,
			  showgrid: true,
			},
			legend: {
				x: 0.5,
				xanchor: 'center',
				y: 1,
				orientation: 'h'
			}
		};
	
		const chartData = [
			{
				type: 'scatter',
				name: 'Trial',
				showlegend: true,
				line:{
					dash: 'dash',
					width: 2
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Loaded',
				showlegend: true,
				line:{
					dash: 'dashdot',
					width: 2
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'EEDI',
				showlegend: true,
				// mode: 'markers',
				line:{
					dash: 'dot',
					width: 2
				},
				x: [],
				y: []
			},
	
		];

		Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } );

		modeltest.chart = {
			dom: div.dom,
			data: chartData,
			layout: chartLayout
		};

		modeltest.tables.map( ( table, k ) => {

			const key = table.title;
			
			ship.mt[ key ] = {

				vs: [],
				pb: [],
				rpm: []

			};

			table.dom.addEventListener( 'focusout', () => { 
				
				const data = table.getColumnWiseData();
				const index = key == 'Trial load condition' ? 0 : key == 'Contract load condition' ? 1 : 2;

				chartData[ index ].x = data[ 'Speed' ];
				chartData[ index ].y = data[ 'Power' ];

				ship.mt[ key ].vs = data[ 'Speed' ];
				ship.mt[ key ].pb = data[ 'Power' ];
				ship.mt[ key ].rpm = data[ 'RPM' ];

				Plotly.update( div.dom, chartData, chartLayout )

			} );

		} )


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
		
		let div, table, row, options, img;

		div = new UIDiv().add( new UIText( '✔ Reference Guideline: ' ).setPadding( '10px 10px 5px 10px' ) );
		correction.add( div );
		
		options = new UISelect().setDisplay( 'inline' ).setOptions( {

			iso2002: 'ISO 15016:2002',
			iso2015: 'ISO 15016:2015',
			ittc2017: 'ITTC 7.5-04-01-01.1 (2017)',
			ittc2021: 'ITTC 7.5-04-01-01.1 (2021)'

	 	} );
		
		options.setValue( 'iso2015' )

		div.add( options );
		correction.method = options;

		const wind = new UICollapsible( '• Wind resistance' );
		const wave = new UICollapsible( '• Wave resistance' );
		const current = new UICollapsible( '• Current effect' );
		const temperature = new UICollapsible( '• Temperature & density' );
		const displacement = new UICollapsible( '• Displacement' );
		
		correction.add( wind, wave, current, temperature, displacement );
		
		Object.assign( correction, { wind, wave, current, temperature, displacement } )

		// Wind coefficients
		div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );

		div.add( new UIText( 'Wind profile' ).setWidth('100%').setTextAlign( 'center' ) );
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

		const chartLayout = {
			title: 'Wind resistance coefficient',
			width: 480,
			height: 680,
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			font: { //global font
				color: 'lightgray',
			},
			xaxis: {
			  title: 'Angle [°]',
			  color: 'lightgray',
			  gridcolor: 'gray',
			  minallowed: 0,
			  maxallowed: 360,
			  showline: true,
			  showgrid: true,
			},
			yaxis: {
			  title: {
				text : 'Cx',
				standoff: 5,
			  },
			  color: 'lightgray',
			  gridcolor: 'gray',
			//   tickformat: ",.0f",
			  showline: true,
			  showgrid: true,
			},
		};
	
		const chartData = [
			{
				type: 'scatter',
				name: 'cx',
				showlegend: false,
				line:{
					dash: 'solid',
					width: 2
				},
				x: [0, 360],
				y: [-1, 1]
			},
		];
	
		Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } )

		wind.chart = {
			dom: div.dom,
			data: chartData,
			layout: chartLayout
		};

		const dom = div.dom;

		wind.tables[ 0 ].dom.addEventListener( 'focusout', () => { 
				
			const data = wind.tables[ 0 ].getColumnWiseData();

			chartData[ 0 ].x = data[ 'Angle' ];
			chartData[ 0 ].y = data[ 'CX' ];
			console.log( data )
			ship.wind.angle = data[ 'Angle' ];
			ship.wind.coef = data[ 'CX' ];

			Plotly.update( dom, chartData, chartLayout )

		} );

		div = new UIDiv().setPadding( '10px 20px' ); // top and bottom, right and left
		wind.content.add( div );
		div.setDisplay( 'inline-block' ).setVerticalAlign( 'top' );
		div.add( new UIText( 'Use average (Annex C.1.1)' ).setWidth('90%').setTextAlign( 'center' ) );
		wind.useAverage = new UICheckbox().setValue( true )
		div.add( wind.useAverage );

		// Wave
		wave.content.add( new UIText( 'Methods to estimate the resistance increase due to waves' ).setPadding( '10px 10px 5px 10px' ) );
		div = new UIDiv().add( new UIText( '-ISO 15016:2002' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
		wave.content.add( div );
		
		options = new UISelect().setDisplay( 'inline' ).setOptions( {

			fal: 'Faltinsen',
			fuji: 'Fujii-Takahashi',
			kwon: 'Kwon',

	 	} );
		
		options.setValue( 'fal' )
		div.add( options );

		div = new UIDiv().add( new UIText( '-ISO 15016:2015, or later ver.' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
		wave.content.add( div );

		options = new UISelect().setDisplay( 'inline' ).setOptions( {

			sta1: 'STAWAVE-1',
			sta2: 'STAWAVE-2',
			nmri: 'Theoretical method with simplified tank tests in short wave',
			test: 'Seakeeping model tests',
			snnm: 'SNNM'

	 	} );
		
		div.add( options );
		options.setValue( 'nmri' )
		options.onChange( event => { 

			const key = event.target.value;
			[ 'sta1', 'sta2', 'snnm', 'nmri' ].map( key => wave[ key ].map( e => e.setHidden( true ) ) );
			if( wave[ key ] ) wave[ key ].map( e => e.setHidden( false ) );

		} );
		
		let h;

		wave.sta1 = [];
		img = new Image(317, 113);
		img.src = "./static/images/lbwl.jpg";
		img.style.display = 'block';
		img.style.margin = "0 auto";
		div = new UIDiv();
		div.dom.appendChild( img )
		h = '<Figure> Length of the bow on the water line to 95% of maximum beams'
		div.add( new UIText( h ).setWidth('100%').setTextAlign( 'center' ).setPadding( '5px 0px 20px 0px' ) );
		wave.sta1.push( waveInput( [ 'L<sub>BWL</sub> : ' ], 0, div ) );
		wave.content.add( ...wave.sta1 );

		wave.sta2 = [];
		h = 'Non-dimensional radius of gyration in the lateral direction (% LPP)'
		h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
		wave.sta2.push( waveInput( [ 'k<sub>yy</sub> : ' ], h, 0 ) );
		wave.content.add( ...wave.sta2 );

		wave.snnm = [];
		img = new Image(490, 140);
		img.src = "./static/images/le.jpg";
		img.style.display = 'block';
		img.style.margin = "0 auto";
		div = new UIDiv();
		div.dom.appendChild( img )
		h = '<Figure> Sketch of the half waterline of a ship and related definitions'
		div.add( new UIText( h ).setWidth('100%').setTextAlign( 'center' ).setPadding( '5px 0px 20px 0px' ) );
		wave.snnm.push( waveInput( [ 'L<sub>R</sub> : ', 'L<sub>E</sub> : ' ], 0, div ) )
		wave.content.add( ...wave.snnm );
		
		wave.nmri = [];
		h = 'Centre of gravity'
		h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
		wave.nmri.push( waveInput( [ 'LCG : ', 'TCG : ', 'VCG : ' ], h, 0 ) );

		h = 'Non-dimensional radius of gyration'
		h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
		wave.nmri.push( waveInput( [ 'K<sub>roll</sub> : ', 'K<sub>pitch</sub> : ', 'K<sub>yaw</sub> : ' ], h, 0 ) );

		h = 'Bluntness coefficient (Bf), coefficient of advance speed (Cu)'
		h = new UIText( h ).setWidth('100%').setPadding( '10px 0px 5px 10px' );
		wave.nmri.push( waveInput( [ 'B<sub>f</sub> : ', 'C<sub>u</sub> : '], h, 0 ) );
		wave.content.add( ...wave.nmri );

		function waveInput( arr, head, tail ) { // array of text keys

			const div = new UIDiv().setBorder( '1px solid rgb(72,72,72)' );

			if( head ) div.add( head );

			arr.map( txt => {

				const uiText = new UIText().setWidth('16%').setTextAlign( 'center' ).setPadding( '10px 0px' )
				const input = new UIInput('').setWidth('16%').setTextAlign( 'center' ).setPadding( '0px' );
				div.add( uiText ).add( input );
				uiText.setInnerHTML( txt )
				wave[ uiText.getValue().replace( ' : ', '' ).toLowerCase() ] = input;
	
			} )

			if( tail ) div.add( tail );

			return div;

		}

		wave.tables = [];
		table = new UITable();
		wave.tables.push( table );
		div = new UIDiv().setWidth( '50%' ).setMargin( 'auto' );
		div.add( new UIText( 'Geometry data' ).setWidth('90%').setTextAlign( 'center' ) );
		div.add( table );
		div.add( ...addButton( table ) );

		row = table.insertRow();
		row.insertHeader().setWidth( '120px' ).textContent = 'Longitudinal position from A.P. (m)'
		row.insertHeader().setWidth( '120px' ).textContent = 'Half breadth (m)'
		row.insertHeader().setWidth( '120px' ).textContent = 'Sectional draft (m)'
		row.insertHeader().setWidth( '120px' ).textContent = 'Sectional Area (m\u00B2)'
		row = table.insertRow();
		Array( 4 ).fill().map( () => row.insertCell() );

		wave.content.add( div );
		wave.nmri.push( div );

		[ 'sta1', 'sta2', 'snnm' ].map( key => wave[ key ].map( e => e.setHidden( true ) ) );

		// Current
		current.content.add( new UIText( 'Methods to account for the effect of current' ).setPadding( '10px 10px 5px 10px' ) );

		div = new UIDiv().add( new UIText( '-ISO 15016:2002' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
		current.content.add( div );
		
		options = new UISelect().setDisplay( 'inline' ).setOptions( {

			none: 'no current',
			curv: 'current curve'

	 	} );
		
		options.setValue( 'none' )
		div.add( options );

		div = new UIDiv().add( new UIText( '-ISO 15016:2015, or later ver.' ).setWidth( '200px' ).setPadding( '10px 10px 5px 20px' ) );
		current.content.add( div );
		
		options = new UISelect().setDisplay( 'inline' ).setOptions( {

			none: 'no current',
			iterative: 'iterative',
			mom: 'mean of means'

	 	} );
		
		options.setValue( 'iterative' )
		div.add( options );

		// Temperature
		let header;

		header = 'At sea trial'
		header = new UIText( header ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' );
		temperature.st = [];
		temperature.st.push( rasInput( [ 'Temperature : ', 'Density : ' ], header, 0 ) );
		temperature.content.add( ...temperature.st );

		header = 'Reference'
		header = new UIText( header ).setDisplay( 'block' ).setPadding( '10px 0px 5px 5px' );
		temperature.ref = [];
		temperature.ref.push( rasInput( [ 'Temperature : ', 'Density : ' ], header, 0 ) );
		temperature.content.add( ...temperature.ref );
console.log( temperature )
		temperature.ref[ 'temperature' ].setValue( '15.0' );

		function rasInput( arr, head, tail ) { // array of text keys

			const div = new UIDiv();//.setBorder( '1px solid rgb(72,72,72)' );

			if( head ) div.add( head );

			arr.map( txt => {

				const uiText = new UIText().setWidth( '120px' ).setPadding( '10px 10px 5px 20px' )
				const input = new UIText('').setWidth( '120px' ).setPadding( '2px 0px' );
				div.add( uiText ).add( input );
				uiText.setInnerHTML( txt )
				temperature[ uiText.getValue().replace( ' : ', '' ).toLowerCase() ] = input;
	
			} )

			if( tail ) div.add( tail );

			return div;

		}

		// Displacement
		div = new UIDiv();
		const disp = new UIText('').setWidth( '120px' ).setPadding( '10px 10px 5px 20px' );
		disp.setInnerHTML( '∇<sub>trial</sub> (m\u00B3)')
		displacement.st = new UIText( '' ).setWidth( '120px' ).setPadding( '0px' );
		div.add( disp, displacement.st );
		displacement.content.add( div );

		const cell = this.particular.tables[ 3 ].rows[ 2 ].cells[ 1 ]; // disp
		cell.dom.addEventListener( 'blur', e => displacement.st.setValue( e.target.textContent ) )

		div = new UIDiv();
		const dispm = new UIText('').setWidth( '120px' ).setPadding( '10px 10px 5px 20px' );
		dispm.setInnerHTML( '∇<sub>model</sub> (m\u00B3)')
		displacement.mt = new UIInput('').setWidth( '120px' ).setPadding( '2px 0px' );
		div.add( dispm, displacement.mt );
		displacement.content.add( div );

	}
	
	ressultTab() {

		const { ship, result } = this;

		let div, table, row;

		const calButton = new UIText( 'Calculate result' ).setClass( 'item' );
		result.add( calButton );

		//Chart
		div = new UIDiv();
		result.add( div );

		const chartLayout = {
			title: {
				text: 'Speed-power curve',
				font:{
					size: 16,
					weight: 'bold'
				}
			},
			width: 700,
			height: 1024,
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			colorway: [
				'rgb(11,132,165)', //blue
				'rgb(202,71,47)', //red
				'rgb(246,200,95)', //yellow
				'rgb(157,216,102)', //green
				'rgb(111, 78, 124)', //purple
				'rgb(255,160,86)', // orange
				'rgb(141,221,208)', //cyan
				'rgb(228,120,194)', //pink
				'rgb(128,128,128)' //gray
			], //Default: [#1f77b4, #ff7f0e, #2ca02c, #d62728, #9467bd, #8c564b, #e377c2, #7f7f7f, #bcbd22, #17becf]
			font: { //global font
				color: 'lightgray',
			},
			xaxis: {
			  title: {
				text: 'Speed [knots]',
				font:{
					size: 14,
					weight: 'bold'
				}
			  },
			  color: 'lightgray',
			  gridcolor: 'gray',
			  tickformat: ".1f",
			  minallowed: 0,
			  showline: true,
			  showgrid: true,
			  zeroline: false
			},
			yaxis: {
			  title: {
				text : 'Power [kW]',
				standoff: 10,
				font:{
					size: 14,
					weight: 'bold'
				}
			  },
			  color: 'lightgray',
			  gridcolor: 'gray',
			  tickformat: ",.0f",
			  minallowed: 0,
			  showline: true,
			  showgrid: true,
			},
			legend: {
				x: 0.5,
				y: 1,
				xanchor: 'center',
				orientation: 'h',
				groupclick: 'toggleitem'
			}
		};
	
		const chartData = [
			{
				type: 'scatter',
				name: 'Ballast(model)',
				showlegend: true,
				legendgroup: 'group',
				line:{
					dash: 'dash',
					width: 2
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Loaded(model)',
				showlegend: true,
				legendgroup: 'group2',
				line:{
					dash: 'dashdot',
					width: 2
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Ballast(sea trial)',
				showlegend: true,
				legendgroup: 'group',
				line:{
					dash: 'solid',
					width: 3
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Loaded(sea trial)',
				showlegend: true,
				legendgroup: 'group2',
				line:{
					dash: 'solid',
					width: 2
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Measured',
				showlegend: true,
				legendgroup: 'group',
				mode: 'markers',
				marker: {
					symbol: 'diamond',
					size: 8
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'Corrected',
				showlegend: true,
				legendgroup: 'group',
				mode: 'markers',
				marker: {
					symbol: 'triangle',
					size: 8,
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'PowerRef',
				showlegend: false,
				mode: 'lines',
				line:{
					color: 'white',
					dash: 'solid',
					width: 1
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'SpeedTrial',
				showlegend: false,
				mode: 'lines',
				line:{
					color: 'white',
					dash: 'solid',
					width: 1
				},
				x: [],
				y: []
			},
			{
				type: 'scatter',
				name: 'SpeedLoaded',
				showlegend: false,
				mode: 'lines',
				line:{
					color: 'white',
					dash: 'solid',
					width: 1
				},
				x: [],
				y: []
			},
	
		];

		result.chart = {
			dom: div.dom,
			data: chartData,
			layout: chartLayout
		}

		Plotly.newPlot( div.dom, chartData, chartLayout, { displayModeBar: false } )

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
	const { wave, swell, raw, ras, delr, pid, stw, pb, powerOffset, speedAtNCR, speedAtNCRLoaded } = res;

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
	row.insertHeader().textContent = speedAtNCRLoaded.toFixed( 3 ) + ' (knots)';

	// Speed-power chart
	const mt = ship.mt;
    const chartData = result.chart.data;
	const chartLayout = result.chart.layout;
	chartData[ 0 ].x = mt.vs;
	chartData[ 0 ].y = mt.pb;
	chartData[ 1 ].x = mt.vsLoaded;
	chartData[ 1 ].y = mt.pbLoaded;
	chartData[ 2 ].x = mt.vs;
	chartData[ 2 ].y = mt.pb.map( e => e + powerOffset );
	chartData[ 3 ].x = mt.vsLoaded;
	chartData[ 3 ].y = mt.pbLoaded.map( e => e + powerOffset );
	chartData[ 4 ].x = ship.sog;
	chartData[ 4 ].y = ship.power;
	chartData[ 5 ].x = stw;
	chartData[ 5 ].y = pb;
	
	let minX = 100;
	chartData.map( data => minX = Math.min( minX, ...data.x ) );
	let maxX = 0;
	chartData.map( data => maxX = Math.max( maxX, ...data.x ) );
	let minY = 10000;
	chartData.map( data => minY = Math.min( minY, ...data.y ) );
	let maxY = 0;
	chartData.map( data => maxY = Math.max( maxY, ...data.y ) );

	chartData[ 6 ].x = [ minX, Math.max( speedAtNCR, speedAtNCRLoaded ) ];
	chartData[ 6 ].y = [ ship.contractPower, ship.contractPower ];
	chartData[ 7 ].x = [ speedAtNCR, speedAtNCR ];
	chartData[ 7 ].y = [ minY, ship.contractPower ];
	chartData[ 8 ].x = [ speedAtNCRLoaded, speedAtNCRLoaded ];
	chartData[ 8 ].y = [ minY, ship.contractPower ];

	chartLayout.xaxis.autorange = false;
	chartLayout.xaxis.range = [ minX, maxX ];
	chartLayout.yaxis.autorange = false;
	chartLayout.yaxis.range = [ minY, maxY ];
	chartLayout.annotations = [
        {
            text: `Contract power: ${ Intl.NumberFormat().format( ship.contractPower ) }`,
			// text: `NCR Power / ${1 + 0.01 * ship.sm} = ${ ( ship.ncr[ 0 ] / ( 1 + 0.01 * ship.sm ) ).toFixed( 0 ) }`,
            xanchor: 'left',
			yanchor: 'bottom',
			showarrow: false,
			font: {
				size: 14
			},
			x: minX,
            y: ship.contractPower,
        },
		{
            x: speedAtNCR,
            y: minY,
            text: speedAtNCR.toFixed(2),
            xanchor: 'right',
			arrowcolor: 'white',
			arrowwidth: 1 //px
        },
		{
            x: speedAtNCRLoaded,
            y: minY,
            text: speedAtNCRLoaded.toFixed(2),
            xanchor: 'right',
			arrowcolor: 'white',
			arrowwidth: 1 //px
        }
    ]

    Plotly.update( result.chart.dom, chartData, result.chart.layout )

}

function checkValidity() {

	console.warn( 'not implemented' );

}

function addButton( table ) {

	table.history = [];

	const addButton = new UIText( '+' ).setClass( 'item' ).onClick( () => {

		const n = table.rows[ 0 ].cells.length;
		const row = table.insertRow();
		const pop = table.history.pop();
		Array( n ).fill().map( ( e, i ) => row.insertCell().textContent = pop? pop[ i ] : '' );

	});

	const minusButton = new UIText( '-' ).setClass( 'item' ).onClick( () => {

		table.history.push( table.removeRow().cells.map( e => e.textContent ) );

	});

	return [ addButton, minusButton ]

}

export { ViewportSTA, runSTA };
