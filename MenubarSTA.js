import { UIDiv, UIHorizontalRule, UIPanel, UIRow } from "./ui.js";

class MenubarSTA extends UIDiv {

    constructor( ship, viewport ) {

        super();
        this.setId( 'menubarSTA' );
        this.add( this.file( ship, viewport ) );

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

		item = new UIRow();
		item.setClass( 'item' );
		item.setTextContent( 'Import File(.inp)' );

		item.onClick( () => {

            inpOpen( ship, viewport );

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

        ship.shipNo = data['<SHIP_NO>'][ 0 ][ 1 ];
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

        part = data['<SPEED_TRIAL_MEASURED_DATA>']
        keys = part.shift();
        keys.map( key => data[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<OWN_WIND_FORCE_COEFFI>']
        keys = part.shift();
        data.wind = new Object();
        keys.map( key => data.wind[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.wind[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<MODEL_TEST_COEFFI>']
        keys = part[ 5 ]; // SPEED ETAR THDF WTM CTS ETAD
        data.mtCoef = new Object();
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

        part = data['<SPEED_POWER_RPM_TRIAL>']
        keys = part.shift();
        data.mtTrial = new Object();
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

        
        ship.shipName = data[ 'SHIP_NAME' ];
        ship.l = data[ 'LBP' ];
        ship.b = data[ 'BREADTH' ];
        ship.tf = data[ 'DRAFT_FORE' ];
        ship.ta = data[ 'DRAFT_AFT' ];
        ship.disp = data[ 'DISPLACEMENT' ];
        ship.wetted = data[ 'WETTED_SURFACE' ];
        ship.rho = data[ 'WATER_DEN' ];
        ship.cb = data[ 'CB' ];
        ship.kyy = data[ 'RADIUS_GYRATION_Y' ];
        ship.le = data[ 'LE' ];
        ship.lr = data[ 'LR' ];
        ship.lbwl = data[ '' ];
        ship.Za = data[ 'ANEMO_HEIGHT' ];
        ship.Zref = 10; //data[ '' ]
        ship.Ax = data[ 'TRANS_PROJECT_AREA' ];
        ship.rhoa  = data[ '' ];

        ship.ncr = data[ 'NCR_POWER_KW' ];
        ship.sm = data[ 'NCR_POWER_KW' ] / data[ 'CONTRACT_POWER_SM' ] - 1;

        ship.load = data[ 'ENG_LOAD' ];
        ship.time = data[ 'INNING_TIME' ].map( e => e.replace( '_', ' ' ) );
        ship.hdg = data[ 'DIR_OF_RUN' ];
        ship.sog = data[ 'SPEED_MEASURED' ];
        ship.rpm = data[ 'SHAFT_RPM_MEASURED_S' ];
        ship.power = data[ 'SHAFT_POWER_MEASURED_S' ];
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
        }

        console.log( ship )
        updateViewport( ship, viewport );

    } else {

        console.warn( 'not supported file type' );

    }

}

function updateViewport( ship, viewport ) {

    let table;

    table = viewport.particular.tables[ 0 ];

    const { shipno, l, b, wetted, Ax, Za, Zref, cb, kyy, le, lr, lbwl } = ship;
    
    [ shipno, l, b, wetted, Ax, Za, Zref, cb, kyy, le, lr, lbwl ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        row.dom.cells[ 1 ].textContent = e;

    } );

    table = viewport.particular.tables[ 1 ];

    const { tf, ta, disp, tempSea, rho, tempAir, rhoa  } = ship;
    
    [ tf, ta, disp, tempSea, rho, tempAir, rhoa ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        row.dom.cells[ 1 ].textContent = e;

    } );

    const mt = ship.mt;

    table = viewport.modeltest.tables[ 0 ];

    [ mt.vs, mt.pb, mt.rpm ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ];
            row.dom.cells[ i ].textContent = e;

        } )

    } );

    table = viewport.modeltest.tables[ 1 ];

    [ mt.vsLoaded, mt.pbLoaded, mt.rpmLoaded ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ];
            row.dom.cells[ i ].textContent = e;

        } )

    } );

    table = viewport.modeltest.tables[ 2 ];

    [ mt.vsEEDI, mt.pbEEDI, mt.rpmEEDI ].map( ( arr, i ) => {
        
        if ( arr ) {

            arr.map( ( e, j ) => { 

                const row = table.rows[ j + 1 ];
                row.dom.cells[ i ].textContent = e;

            } )

        }

    } );

    
    const chartData = viewport.modeltest.chart.config._config.data.datasets;

    chartData[ 0 ].data = mt.vs.map( ( e, i ) => { 
                    
        return {
            
            x: e,
            y: mt.pb[ i ]

        }

    } );

    chartData[ 1 ].data = mt.vsLoaded.map( ( e, i ) => { 
                    
        return {
            
            x: e,
            y: mt.pbLoaded[ i ]

        }

    } );

    viewport.modeltest.chart.update();

    table = viewport.measured.table;

    ship.load.map( ( e, i ) => {

        const row = table.rows[ 0 ];
        row.dom.cells[ i + 1 ].textContent = e;

    } );

    const { time, hdg, sog, rpm, power, wind_v, wind_d, wave, swell } = ship;

    [ time, hdg, sog, rpm, power, wind_v, wind_d ].map( ( arr, i ) => {

        const row = table.rows[ i + 2 ];
        
        arr.map( ( e, j ) => {

            row.dom.cells[ j + 1 ].textContent = e;

        } );

    } );

    [ wave, swell ].map( ( wave, k ) => {

        [ wave.height, wave.angle, wave.period ].map( ( arr, i ) => {

            const row = table.rows[ 9 + 3 * k + i ];

            arr.map( ( e, j ) => {

                row.dom.cells[ j + 1 ].textContent = e;

            } );

        } );

    } );
    
}


export { MenubarSTA };
