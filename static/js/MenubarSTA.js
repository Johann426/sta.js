import { UIDiv, UIHorizontalRule, UIPanel, UIRow } from "./ui.js";
import { runSTA } from "./ViewportSTA.js";

class MenubarSTA extends UIDiv {

    constructor( ship, viewport ) {

        super();
        this.setId( 'menubarSTA' );
        this.add( this.file( ship, viewport ) );
        this.add( this.run( ship, viewport ) );

    }

    file( ship, viewport ) {

        const menu = new UIPanel();
        menu.setClass( 'menu' );

        const head = new UIPanel();
		head.setTextContent( 'File' );
		head.setClass( 'head' );
		menu.add( head );

		const items = new UIPanel();
		items.setClass( 'items' );
		menu.add( items );

        let item;
		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'New' );
		item.onClick( () => {

			if ( confirm( 'Are you sure?' ) ) {

				location.reload();

			}

		} );

        items.add( item );

        item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Import File(.inp)' );

		item.onClick( () => {

            inpOpen( ship, viewport );

        } );

        items.add( item );
		items.add( new UIHorizontalRule().setClass( 'divider' ) );

		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Save File(.json)' );
		item.onClick( () => {

            let output = ship;

            try {

                output = JSON.stringify( output, null, '\t' );
                output = output.replace( /[\n\t]+([\d\-\]]+)/g, '$1' );

            } catch ( e ) {

                output = JSON.stringify( output );

            }

            save( output )

        } );

        items.add( item );

		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Open File(.json)' );

		item.onClick( () => {

            open( ship, viewport );

        } );

        items.add( item );
        items.add( new UIHorizontalRule().setClass( 'divider' ) );

		

        return menu;

    }

    run( ship, viewport ) {

        const menu = new UIPanel();
        menu.setClass( 'menu' );

        const head = new UIPanel();
		head.setTextContent( 'Run' );
		head.setClass( 'head' );
		menu.add( head );

		const items = new UIPanel();
		items.setClass( 'items' );
		menu.add( items );

        let item;
		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Calculate' );
		item.onClick( () => {

            runSTA( ship, viewport.result );

		} );

        items.add( item );
		items.add( new UIHorizontalRule().setClass( 'divider' ) );

		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Environment' );
		item.onClick( () => {

			console.warn( 'not implemented' )

		} );

        items.add( item );

        return menu;

    }

}

async function save( contents ) {

    const opts = {

        types: [ {

            description: 'JSON file',
            accept: { 'json/plain': [ '.json' ] }

        } ]

    };

    const handle = await window.showSaveFilePicker( opts );
    const writable = await handle.createWritable();
    await writable.write( contents );
    await writable.close();

}

async function open( ship, viewport ) {

    const opts = {

        types: [ {

            description: 'JSON file',
            accept: { 'json/plain': [ '.json' ] }

        } ],

        multiple: false,

    };

    const [ fileHandle ] = await window.showOpenFilePicker( opts );
    const fileData = await fileHandle.getFile();
    const ext = fileData.name.split( '.' ).pop().toLowerCase();
    const txt = await fileData.text();

    if ( ext == 'json' ) {

        Object.assign( ship, JSON.parse( txt ) );
        
        updateViewport( ship, viewport );

        
       
    } else {

        console.warn( 'not supported file type' );

    }

}

async function inpOpen( ship, viewport ) {

    const opts = {

        types: [ {

            description: 'JSON file',
            accept: { 'json/plain': [ '.inp' ] }

        } ],

        multiple: false,

    };

    const [ fileHandle ] = await window.showOpenFilePicker( opts );
    const fileData = await fileHandle.getFile();
    const ext = fileData.name.split( '.' ).pop().toLowerCase();
    const txt = await fileData.text();

    if ( ext == 'inp' ) {

        // const arr = txt.split( '\r\n' );
        const arr = txt.split( '\r\n' ).map( row => row.split('\t') )

        const data = {
			metadata: {
				version: 1.0,
				type: 'HiPerShip input file',
				generator: 'HiPerShip_Offline_Program_1.8.2'
			},
		};

        let header, keys, part;
        
        for ( let i = 0; i < arr.length; i ++ ) {

            const row = arr[ i ];
            const shift = row.shift();

            if ( row.length == 0 ) { // <tag> detected

                header = shift;
                const isEndTag = header.match(/[/]/) // trying to detect </tag>

                if ( !isEndTag ) data[ header ] = [];

            } else {

                row.shift(); // drop emptry
                data[ header ].push( row );

            }

        }

        console.log( data )

        ship.shipNo = data['<SHIP_NO>'][ 0 ][ 2 ];
        ship.trialCondition = data['<COND_NO>'][ 0 ][ 1 ];
        
        data['<SHIP_MAIN_PARTICULAR>'].map( row => {

            const key = row.shift();
            const val = row.pop();
            data[ key ] = val;
            
        })

        data['<SHIP_CONDITION_DATA>'].map( row => {

            const key = row.shift();
            const val = row.pop();
            data[ key ] = val;
            
        })

        data['<SEA_TRIAL_CONDITION>'].map( row => {

            const key = row.shift();
            // const val = row.length == 1 ? row[ 0 ] : row;
            const val = row.pop();
            data[ key ] = val;
            
        })

        data['<ETC>'].map( row => {

            const key = row.shift();
            const val = row.pop();
            data[ key ] = val;
            
        })

        part = data['<SPEED_TRIAL_MEASURED_DATA>']
        keys = part.shift();
        keys.map( key => data[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<OWN_WIND_FORCE_COEFFI>'][ 1 ][ 0 ] == 'null' ? data['<STANDARD_WIND_FORCE_COEFFI>'] : data['<OWN_WIND_FORCE_COEFFI>']
        data.wind = new Object();
        keys = part.shift();
        keys.map( key => data.wind[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.wind[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<MODEL_TEST_COEFFI>']
        data.mtCoef = new Object();
        keys = part[ 5 ]; // SPEED ETAR THDF WTM CTS ETAD
        keys.map( key => data.mtCoef[ key ] = new Array() );

        part.map( ( row, j ) => {

            if( j < 5 ) { // k, delCf, ksip, ksin, ksiv

                const key = row.shift();
                const val = row.pop();
                data[ key ] = val;

            } else if ( j > 5 ) {

                row.map( ( val, i ) => val ? data.mtCoef[ keys[ i ] ].push( val ) : null );

            }

        } );

        part = data['<POW>']
        data.pow = new Object();
        keys = part.shift(); // J, KT, KQ
        keys.map( key => data.pow[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.pow[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<SPEED_POWER_RPM_TRIAL>']
        data.mtTrial = new Object();
        keys = part.shift();
        keys.map( key => data.mtTrial[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.mtTrial[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<SPEED_POWER_RPM_OTHER>']
        data.mtLoaded = new Object();
        
        part.shift(); // drop no
        data.mtLoaded.size = part.shift().filter( ( e ) => e !== '' ).slice( 1 );
        data.mtLoaded.condition = part.shift().filter( ( e ) => e !== '' ).slice( 1 );
        data.mtLoaded.condition.map( key => data.mtLoaded[ key ] = new Object() )
        
        data.mtLoaded.size.map( ( n, j ) => {

            const cond = data.mtLoaded.condition[ j ];

            keys = part.shift();
            data.mtLoaded[ cond ] = new Object();
            keys.map( key => data.mtLoaded[ cond ][ key ] = new Array() );
            
            for( let k = 0; k < n; k ++ ) {

                const row = part.shift();
                row.map( ( val, i ) => val ? data.mtLoaded[ cond ][ keys[ i ] ].push( val ) : null );

            }

        } )

        part = data['<ARM>']
        data.arm = new Object();
        keys = part.shift();
        keys.map( key => data.arm[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.arm[ keys[ i ] ].push( val ) : null );

        } );

        
        ship.shipName = data[ 'SHIP_NAME' ];
        ship.ownerName = data[ 'OWNER_NAME' ];
        ship.l = data[ 'LBP' ];
        ship.b = data[ 'BREADTH' ];
        ship.tf = data[ 'DRAFT_FORE' ];
        ship.ta = data[ 'DRAFT_AFT' ];
        ship.disp = data[ 'DISPLACEMENT' ];
        ship.wetted = data[ 'WETTED_SURFACE' ];
        ship.rhos = data[ 'WATER_DEN' ];
        ship.cb = data[ 'CB' ];
        ship.kyy = data[ 'RADIUS_GYRATION_Y' ];
        ship.le = data[ 'LE' ];
        ship.lr = data[ 'LR' ];
        ship.lbwl = data[ 'L_BWL' ];
        ship.Za = data[ 'ANEMO_HEIGHT' ];
        ship.Zref = 10; //data[ '' ]
        ship.Ax = data[ 'TRANS_PROJECT_AREA' ];
        ship.rhoa  = data[ '' ];
        
        ship.contractCondition = data[ 'CONTRACT_CONDITION' ];
        ship.contractPower = data[ 'CONTRACT_POWER_SM' ];
        ship.contractSpeed = data[ 'CONTRACT_SPEED' ];

        ship.noProp = data[ 'NO_PROP' ];
        ship.mcr = [ data[ 'MCR_POWER_KW' ], data[ 'MCR_RPM' ] ];
        ship.ncr = [ data[ 'NCR_POWER_KW' ], data[ 'NCR_RPM' ] ];
        ship.eedi = [ data[ 'MCR_POWER_KW' ] * 0.75, 0 ];
        ship.sm = 100 * ( data[ 'NCR_POWER_KW' ] / data[ 'CONTRACT_POWER_SM' ] - 1 ).toFixed( 3 );

        ship.load = data[ 'ENG_LOAD' ];
        ship.time = data[ 'INNING_TIME' ].map( e => e.replace( '_', ' ' ) );
        ship.hdg = data[ 'DIR_OF_RUN' ];
        ship.sog = data[ 'SPEED_MEASURED' ];
        ship.rpm = data[ 'SHAFT_RPM_MEASURED_S' ].map( e => parseFloat( e ) );
        data[ 'SHAFT_RPM_MEASURED_P' ].map( ( e, i ) => ship.rpm[ i ] = 0.5 * ( ship.rpm[ i ] + parseFloat( e ) ) );
        ship.power = data[ 'SHAFT_POWER_MEASURED_S' ].map( e => parseFloat( e ) );
        data[ 'SHAFT_POWER_MEASURED_P' ].map( ( e, i ) => ship.power[ i ] += parseFloat( e ) );

        ship.wind_v = data[ 'WIND_VELOCITY' ];
        ship.wind_d = data[ 'WIND_DIR' ];
        ship.wind = {
            angle: data.wind[ 'Angle' ],
            coef: data.wind[ 'CX' ],
        }

        ship.wave = {

            height: data[ 'WAVE_HEIGHT' ],
            angle: data[ 'WAVE_DIR' ],
            period: data[ 'WAVE_PERIOD' ],

        };

        ship.swell = {

            height: data[ 'SWELL_HEIGHT' ],
            angle: data[ 'SWELL_DIR' ],
            period: data[ 'SWELL_PERIOD' ],

        }

        ship.rudderSTBD = data[ 'RUDDER_MOVE_S' ];
        ship.rudderPORT = data[ 'RUDDER_MOVE_P' ];
        ship.drift = data[ 'DRIFT' ];

        ship.mt = {
            vs: data.mtTrial[ 'SPEED' ],
            pb: data.mtTrial[ 'POWER' ],
            rpm: data.mtTrial[ 'RPM' ],
            vsLoaded: data.mtLoaded[ 'Design' ][ 'SPEED' ],
            pbLoaded: data.mtLoaded[ 'Design' ][ 'POWER' ],
            rpmLoaded: data.mtLoaded[ 'Design' ][ 'RPM' ],
            vsEEDI: data.mtLoaded[ 'EEDI' ] ? data.mtLoaded[ 'EEDI' ][ 'SPEED' ] : undefined,
            pbEEDI: data.mtLoaded[ 'EEDI' ] ? data.mtLoaded[ 'EEDI' ][ 'POWER' ] : undefined,
            rpmEEDI: data.mtLoaded[ 'EEDI' ] ? data.mtLoaded[ 'EEDI' ][ 'RPM' ] : undefined,
            
            res: {
                vs: data.mtCoef[ 'SPEED' ],
                cts: data.mtCoef[ 'CTS' ]
            },

            sp: {
                vs: data.mtCoef[ 'SPEED' ],
                wtm: data.mtCoef[ 'WTM' ],
                t: data.mtCoef[ 'THDF' ],
                etar: data.mtCoef[ 'ETAR' ],
                etad: data.mtCoef[ 'ETAD' ]
            },

            pow: {
                j: data.pow[ 'J' ],
                kt: data.pow[ 'KT' ],
                kq: data.pow[ 'KQ' ],
            }
            
        }

        ship.arm ={

            hdg: data.arm[ 'HEADING' ],
            fr: data.arm[ 'FROUDE' ],
            lamda: data.arm[ 'WAVE_LENGTH' ],
            raw: data.arm[ 'WAVE_RESISTANCE' ],

        }

        ship.rhoa = data[ 'AIR_DEN' ][ 0 ];
        ship.rhos0 = data[ 'WATER_DEN_SD' ];
        ship.temp0 = data[ 'WATER_TEMP_SD' ];

        const { hdg, sog, rpm, power, wind_v, wind_d, wave, swell } = ship;
        toArryDataFloat( hdg, sog, rpm, power, wind_v, wind_d )
        toArryDataFloat( wave.angle, wave.height, wave.period )
        toArryDataFloat( swell.angle, swell.height, swell.period )

        const { rudderSTBD, rudderPORT, drift } = ship;
        toArryDataFloat( rudderSTBD, rudderPORT, drift );

        const { mcr, ncr } = ship;
        toArryDataFloat( mcr, ncr );

        const { wind, mt } = ship;
        toArryDataFloat( wind.angle, wind.coef );
        toArryDataFloat( mt.vs, mt.pb, mt.rpm );
        toArryDataFloat( mt.vsLoaded, mt.pbLoaded, mt.rpmLoaded );
        mt.vsEEDI ? toArryDataFloat( mt.vsEEDI, mt.pbEEDI, mt.rpmEEDI ) : null;
        toArryDataFloat( mt.res.vs, mt.res.cts );
        toArryDataFloat( mt.sp.vs, mt.sp.wtm, mt.sp.t, mt.sp.etar, mt.sp.etad );
        toArryDataFloat( mt.pow.j, mt.pow.kt, mt.pow.kq );

        const { arm } = ship;
        toArryDataFloat( arm.hdg, arm.fr, arm.lamda, arm.raw );

        ship.noProp = parseFloat( ship.noProp );
        ship.contractSpeed = parseFloat( ship.contractSpeed );

        ship.l = parseFloat( ship.l );
        ship.b = parseFloat( ship.b );
        ship.tf = parseFloat( ship.tf );
        ship.ta = parseFloat( ship.ta );
        ship.disp = parseFloat( ship.disp );
        ship.wetted = parseFloat( ship.wetted );
        ship.rhos = parseFloat( ship.rhos );
        ship.cb = parseFloat( ship.cb );
        ship.kyy = parseFloat( ship.kyy );
        ship.Za = parseFloat( ship.Za );
        ship.Ax = parseFloat( ship.Ax );
        if( ship.le ) ship.le = parseFloat( ship.le );
        if( ship.lr ) ship.lr = parseFloat( ship.lr );
        if( ship.lbwl ) ship.lbwl = parseFloat( ship.lbwl );
        ship.rhos0 = parseFloat( ship.rhos0 );
        ship.temp0 = parseFloat( ship.temp0 );
        ship.rhoa = parseFloat( ship.rhoa );

        function toArryDataFloat( ...args ) {

            args.map( arr => {

                for( let i = 0; i < arr.length; i ++ ) {

                    arr[ i ] = parseFloat( arr[ i ] );
    
                }

            } );

        }

        [ wave, swell ].map( wave => {

            let saved;

            for( let i = 0; i < wave.angle.length; i ++ ) {

                if( i % 2 == 0 ) {

                    saved = wave.angle[ i ];
                    wave.angle[ i ] = wave.angle[ i + 1 ]

                } else {

                    wave.angle[ i ] = saved;

                }
                

            }

        } )

        console.log( ship )
        updateViewport( ship, viewport );

    } else {

        console.warn( 'not supported file type' );

    }

}

function updateViewport( ship, viewport ) {

    let table, div, chartData;

    // Particulars tab
    table = viewport.particular.tables[ 0 ];

    const { shipName, ownerName, shipNo } = ship;

    [ shipName, ownerName, shipNo ].map( ( e, i ) => viewport.particular.textInput[ i ].setValue( e ) );

    const { l, b, wetted, Ax, Za, Zref, cb } = ship;
    
    [ l, b, wetted, Ax, Za, Zref, cb ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        row.cells[ 1 ].textContent = e;

    } );

    table = viewport.particular.tables[ 1 ];

    const { ncr, eedi } = ship;

    [ ncr, eedi ].map( ( arr, i ) => {

        const row = table.rows[ i + 1 ];
        arr ? arr.map( ( e, j ) => row.cells[ j + 1 ].textContent = e ) : null;

    } );

    table = viewport.particular.tables[ 2 ];

    const { sm, contractSpeed } = ship;

    [ sm, contractSpeed ].map( ( e, i ) => {

        const row = table.rows[ i ];
        row.cells[ 1 ].textContent = e;

    } );

    table = viewport.particular.tables[ 3 ];

    const { tf, ta, disp, tempSea, rhos, tempAir, rhoa  } = ship;
    
    [ tf, ta, disp, tempSea, rhos, tempAir, rhoa ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        row.cells[ 1 ].textContent = e;

    } );

    // Model test tab
    const mt = ship.mt;
    table = viewport.modeltest.tables[ 0 ];

    [ mt.vs, mt.pb, mt.rpm ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
            row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

        } )

    } );

    table = viewport.modeltest.tables[ 1 ];

    [ mt.vsLoaded, mt.pbLoaded, mt.rpmLoaded ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
            row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

        } )

    } );

    table = viewport.modeltest.tables[ 2 ];

    [ mt.vsEEDI, mt.pbEEDI, mt.rpmEEDI ].map( ( arr, i ) => {
        
        if ( arr ) {

            arr.map( ( e, j ) => { 

                const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
                row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

            } )

        }

    } );

    //Speed-power curve
    chartData = viewport.modeltest.chart.data;
    chartData[ 0 ].x = mt.vs;
    chartData[ 0 ].y = mt.pb;
    chartData[ 1 ].x = mt.vsLoaded;
    chartData[ 1 ].y = mt.pbLoaded;
    chartData[ 2 ].x = mt.vsEEDI;
    chartData[ 2 ].y = mt.pbEEDI;
    Plotly.newPlot( viewport.modeltest.chart.dom, chartData, viewport.modeltest.chart.layout )

    // Correction tab
    table = viewport.correction.wind.tables[ 0 ];

    ship.wind.angle.map( ( e, i ) => table.rows[ i + 1 ].cells[ 0 ].textContent = e );
    ship.wind.coef.map( ( e, i ) => table.rows[ i + 1 ].cells[ 1 ].textContent = e );

    chartData = viewport.correction.wind.chart.data;
    chartData[0].x = ship.wind.angle;
    chartData[0].y = ship.wind.coef;

    Plotly.newPlot( viewport.correction.wind.chart.dom, chartData, viewport.correction.wind.chart.layout );
    
    [ 'lbwl', 'le', 'lr', 'kyy' ].map( key => {
        
        viewport.correction.wave[ key ].setValue( ship[ key ] ? ship[ key ] : 0 );

    } );

    viewport.correction.wave.kpitch = ship.kyy;

    // Measured data tab
    table = viewport.measured.table;

    ship.load.map( ( e, i ) => {

        const row = table.rows[ 0 ];
        row.cells[ i + 1 ] ? row.cells[ i + 1 ].textContent = e : row.insertCell().textContent = e;

    } );

    const runNo = table.rows[ 1 ];
    table.rows[ 0 ].cells.slice( 1 ).map( ( e, i ) => runNo.cells[ i + 1 ] ?  runNo.cells[ i + 1 ].textContent = i + 1 : runNo.insertHeader().textContent = i + 1 );

    const { time, hdg, sog, rpm, power, wind_v, wind_d, wave, swell } = ship;

    [ time, hdg, sog, rpm, power, wind_v, wind_d ].map( ( arr, i ) => {

        const row = table.rows[ i + 2 ];
        
        arr.map( ( e, j ) => {

            row.cells[ j + 1 ] ? row.cells[ j + 1 ].textContent = e : row.insertCell().textContent = e;

        } );

    } );

    [ wave, swell ].map( ( wave, k ) => {

        [ wave.height, wave.angle, wave.period ].map( ( arr, i ) => {

            const row = table.rows[ 9 + 3 * k + i ];

            arr.map( ( e, j ) => {

                row.cells[ j + 1 ] ? row.cells[ j + 1 ].textContent = e : row.insertCell().textContent = e;

            } );

        } );

    } );
    
}


export { MenubarSTA };
