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

            viewport.readModelTest();
            viewport.readMeasured();
			viewport.readCorrection();
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

            const key = row.shift().replace( 'DISPLACEMENT', 'dispm' ); // duplicate name of 'DISPLACEMENT' in <SEA_TRIAL_CONDITION>
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

        data['<NMRI_WAVE>'].slice( 0, 8 ).map( row => {

            const key = row.shift();
            const val = row.pop();
            data[ key ] = val;
            
        })

        keys = data['<NMRI_WAVE>'][ 8 ];
        keys.map( key => data[ key ] = new Array() );

        data['<NMRI_WAVE>'].slice( 9 ).map( row => {

            row.map( ( val, i ) => val ? data[ keys[ i ] ].push( val ) : null );

        } );

        data['<SPEED_TRIAL_ANALY_METHODS>'].map( row => {

            const key = row.shift();
            const val = row.pop();
            // data[loaded key ] = val;
            data[ key ] = val;
            
        })

        part = data['<SPEED_TRIAL_MEASURED_DATA>']
        keys = part.shift();
        keys.map( key => data[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data[ keys[ i ] ].push( val ) : null );

        } );

        // part = data['<OWN_WIND_FORCE_COEFFI>'][ 1 ][ 0 ] == 'null' ? data['<STANDARD_WIND_FORCE_COEFFI>'] : data['<OWN_WIND_FORCE_COEFFI>']
        part = data['METHOD_2015_WIND_RESIST'] == 0 ? data['<OWN_WIND_FORCE_COEFFI>'] : data['<STANDARD_WIND_FORCE_COEFFI>'];
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
        data.mtOther = new Object();
        
        part.shift(); // drop no
        data.mtOther.size = part.shift().filter( ( e ) => e !== '' ).slice( 1 );
        data.mtOther.condition = part.shift().filter( ( e ) => e !== '' ).slice( 1 ).map( e => e.toLowerCase() );
        
        data.mtOther.size.map( ( n, j ) => {

            const cond = data.mtOther.condition[ j ];

            keys = part.shift();
            data.mtOther[ cond ] = new Object();
            keys.map( key => data.mtOther[ cond ][ key ] = new Array() );
            
            for( let k = 0; k < n; k ++ ) {

                const row = part.shift();
                row.map( ( val, i ) => val ? data.mtOther[ cond ][ keys[ i ] ].push( val ) : null );

            }

        } )

        part = data['<WATERLINE_HB>']
        data.halfBreadth = new Object();
        keys = part.shift();
        keys.map( key => data.halfBreadth[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.halfBreadth[ keys[ i ] ].push( val ) : null );

        } );

        part = data['<ARM>']
        data.arm = new Object();
        keys = part.shift();
        keys.map( key => data.arm[ key ] = new Array() );

        part.map( row => {

            row.map( ( val, i ) => val ? data.arm[ keys[ i ] ].push( val ) : null );

        } );
        
        ship.shipName = data[ 'SHIP_NAME' ];
        ship.ownerName = data[ 'OWNER_NAME' ];
        ship.l = parseFloat( data[ 'LBP' ] );
        ship.b = parseFloat( data[ 'BREADTH' ] );
        ship.tf = parseFloat( data[ 'DRAFT_FORE' ] );
        ship.ta = parseFloat( data[ 'DRAFT_AFT' ] );
        ship.disp = parseFloat( data[ 'DISPLACEMENT' ] );
        ship.dispm = parseFloat( data[ 'dispm' ] );
        ship.wetted = parseFloat( data[ 'WETTED_SURFACE' ] );
        ship.Za = parseFloat( data[ 'ANEMO_HEIGHT' ] );
        ship.Zref = 10; //data[ '' ]
        ship.Ax = parseFloat( data[ 'TRANS_PROJECT_AREA' ] );
        ship.Am = ( parseFloat( data[ 'CM' ] ) * parseFloat( data[ 'BREADTH' ] ) * 0.5 * ( parseFloat( data[ 'DRAFT_M_P'] ) + parseFloat( data[ 'DRAFT_M_S'] ) ) ).toFixed( 1 );
        ship.lbwl = data[ 'L_BWL' ] == 'null' ? '' : parseFloat( data[ 'L_BWL' ] );
        ship.le = data[ 'LE' ] == 'null' ? '' : parseFloat( data[ 'LE' ] );
        ship.lr = data[ 'LR' ] == 'null' ? '' : parseFloat( data[ 'LR' ] );
        ship.lcg = data[ 'XG' ] == 'null' ? '' : parseFloat( data[ 'XG' ] );
        ship.tcg = data[ 'YG' ] == 'null' ? '' : parseFloat( data[ 'YG' ] );
        ship.vcg = data[ 'ZG' ] == 'null' ? '' : parseFloat( data[ 'ZG' ] );
        ship.kroll = data[ 'Kxx' ] == 'null' ? '' : parseFloat( data[ 'Kxx' ] );
        ship.kpitch = data[ 'Kyy' ] == 'null' ? '' : parseFloat( data[ 'Kyy' ] );
        ship.kyaw = data[ 'Kzz' ] == 'null' ? '' : parseFloat( data[ 'Kzz' ] );
        ship.bf = data[ 'Bf' ] == 'null' ? '' : parseFloat( data[ 'Bf' ] );
        ship.cu = data[ 'Cu' ] == 'null' ? '' : parseFloat( data[ 'Cu' ] );
        ship.h = data[ 'WATER_DEPTH' ] == 'null' ? '' : parseFloat( data[ 'WATER_DEPTH' ] );

        ship.cb = parseFloat( data[ 'CB' ] );
        ship.cm = parseFloat( data[ 'CM' ] );
        ship.kyy = parseFloat( data[ 'RADIUS_GYRATION_Y' ] );

        ship.nmriGeom = {
            x: data[ 'SX' ],
            bhalf: data[ 'SB' ],
            draft: data[ 'SD' ],
            area: data[ 'AREA' ],
        }

        ship.contractCondition = data[ 'CONTRACT_CONDITION' ];
        ship.contractPower = parseFloat( data[ 'CONTRACT_POWER_SM' ] );
        ship.contractSpeed =  parseFloat( data[ 'CONTRACT_SPEED' ] );

        ship.noProp = parseFloat( data[ 'NO_PROP' ] );
        ship.mcr = [ data[ 'MCR_POWER_KW' ], data[ 'MCR_RPM' ] ].map( e => parseFloat( e ) );
        ship.ncr = [ data[ 'NCR_POWER_KW' ], data[ 'NCR_RPM' ] ].map( e => parseFloat( e ) );
        // ship.eedi = [ data[ 'MCR_POWER_KW' ] * 0.75, data[ 'MCR_RPM' ] * 0.75 ** ( 1 / 3 ) ].map( e => parseFloat( e ) );

        ship.load = data[ 'ENG_LOAD' ];
        ship.time = data[ 'INNING_TIME' ].map( e => e.replace( '_', ' ' ) );
        ship.hdg = data[ 'DIR_OF_RUN' ];
        ship.sog = data[ 'SPEED_MEASURED' ];

        ship.rpmSTBD = data[ 'SHAFT_RPM_MEASURED_S' ].map( e => parseFloat( e ) );
        ship.rpmPORT = data[ 'SHAFT_RPM_MEASURED_P' ].map( e => parseFloat( e ) );
        ship.powerSTBD = data[ 'SHAFT_POWER_MEASURED_S' ].map( e => parseFloat( e ) );
        ship.powerPORT = data[ 'SHAFT_POWER_MEASURED_P' ].map( e => parseFloat( e ) );
        ship.rudderSTBD = data[ 'RUDDER_MOVE_S' ].map( e => parseFloat( e ) );
        ship.rudderPORT = data[ 'RUDDER_MOVE_P' ].map( e => parseFloat( e ) );

        if( ship.noProp == 1 ) {

            ship.rpm = data[ 'SHAFT_RPM_MEASURED_S' ].map( e => parseFloat( e ) );
            ship.power = data[ 'SHAFT_POWER_MEASURED_S' ].map( e => parseFloat( e ) );
            ship.rudder = data[ 'RUDDER_MOVE_S' ].map( e => parseFloat( e ) );

        } else {

            ship.rpm = ship.rpmSTBD.map( ( e, i ) => Math.round( 0.5 * ( ship.rpmPORT[ i ] + e ) * 100 ) / 100 );
            ship.power = ship.powerSTBD.map( ( e, i ) => ship.powerPORT[ i ] + e );
            ship.rudder = ship.rudderSTBD.map( ( e, i ) => Math.round( 0.5 * ( ship.rudderPORT[ i ] + e ) * 100 ) / 100 );

        }

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
       
        ship.drift = data[ 'DRIFT' ];

        Object.assign( ship.mt, {
            
            trial: {

                vs: data.mtTrial[ 'SPEED' ],
                pb: data.mtTrial[ 'POWER' ],
                rpm: data.mtTrial[ 'RPM' ]

            },
            res: {
                vs: data.mtCoef[ 'SPEED' ],
                cts: data.mtCoef[ 'CTS' ]
            },

            sp: {
                vs: data.mtCoef[ 'SPEED' ],
                wtm: data.mtCoef[ 'WTM' ],
                t: data.mtCoef[ 'THDF' ],
                etar: data.mtCoef[ 'ETAR' ],
                etad: data.mtCoef[ 'ETAD' ],
                xip: data.mtCoef[ 'SPEED' ].map( () => data[ 'XI_P' ] ),
                xin: data.mtCoef[ 'SPEED' ].map( () => data[ 'XI_N' ] ),
                xiv: data.mtCoef[ 'SPEED' ].map( () => data[ 'XI_V' ] ),

            },

            pow: {
                j: data.pow[ 'J' ],
                kt: data.pow[ 'KT' ],
                kq: data.pow[ 'KQ' ],
            }
            
        } )

        ship.otherCondition = data.mtOther.condition;

        ship.otherCondition.map( cond =>{

            ship.mt[ cond ] = {
    
                vs: data.mtOther[ cond ][ 'SPEED' ],
                pb: data.mtOther[ cond ][ 'POWER' ],
                rpm: data.mtOther[ cond ][ 'RPM' ]

            }
            
        } );

        ship.halfBreadth = {

            xs: data.halfBreadth[ 'X_STATION' ],
            hb: data.halfBreadth[ 'H_BREADTH' ]

        }

        ship.arm = {

            hdg: data.arm[ 'HEADING' ],
            fr: data.arm[ 'FROUDE' ],
            lamda: data.arm[ 'WAVE_LENGTH' ],
            raw: data.arm[ 'WAVE_RESISTANCE' ],

        }

        ship.temp0 = parseFloat( data[ 'WATER_TEMP_SD' ] );
        ship.temps = parseFloat( data[ 'WATER_TEMP' ] );
        ship.tempa  = parseFloat( data[ 'AIR_TEMP' ][ 0 ] );
        ship.rho0 = parseFloat( data[ 'WATER_DEN_SD' ] );
        ship.rhos =  Math.round( parseFloat( data[ 'WATER_DEN' ] ) * 100 ) / 100;
        ship.rhoa = parseFloat( data[ 'AIR_DEN' ][ 0 ] );
        ship.propellerDiameter = parseFloat( data['PROP_DIA'] );
        ship.propellerPitch = parseFloat( data['PITCH_07R'] );
        ship.rudderArea = parseFloat( data['RUDDER_AREA'] );
        ship.rudderSpan = parseFloat( data['RUDDER_SPAN'] );
        ship.rudderAspect = parseFloat( data['ASPECT_RATIO'] );

        // correction guideline
        ship.st.guideline = 'iso2015';

        switch( data[ 'METHOD_2015_WIND_RESIST' ] ) {

            case '0': //own wind tennel test
                // 
                ship.st.windMethod = 'windTunnelTest'
                break;
            case '1': //standard wind tunnel result
                ship.st.windMethod = 'windTunnelTest'
                break
            case '2': //ITTC
                ship.st.windMethod = 'ittc'
                break;
            case '3': //Fujiwara
                ship.st.windMethod = 'formula'
                break;

        };
        
        switch( data[ 'METHOD_2015_WAVE_RESIST' ] ) {

            case '1':
                ship.st.waveMethod = 'sta2'
                break;
            case '2':
                ship.st.waveMethod = 'sta1'
                break
            case '3': // Theoretical method with simplified tank tests in short waves
                ship.st.waveMethod = 'nmri'
                break;
            case '4': // Theoretical method with fitting formula for the reflection waves
                ship.st.waveMethod = 'nmri'
                break;
            case '5':
                ship.st.waveMethod = 'test'
                break;
            case '6':
                ship.st.waveMethod = 'snnm'
                break;                

        };

        switch( data[ 'METHOD_2015_CURRENT' ] ) {

            case '1':
                ship.st.currentMethod = 'iterative';
                break;
            case '2':
                ship.st.currentMethod = 'mom';
                break

        };

        // data[ 'METHOD_2002_WAVE' ] <= 2:wave+swell
        // data[ 'METHOD_2002_MOTION' ] <= 1:Maruo
        switch( data[ 'METHOD_2002_DIFFRACTION' ] ) {

            case '0':
                ship.st.waveMethod2002 = 'none'
                break;
            case '1':
                ship.st.waveMethod2002 = 'falt'
                break
            case '2':
                ship.st.waveMethod2002 = 'kwon'
                break;
            case '2':
                ship.st.waveMethod2002 = 'fuji'
                break;

        };

        switch( data[ 'METHOD_2002_CURRENT' ] ) {

            case '0':
                ship.st.currentMethod2002 = 'none';
                break;
            case '1':
                ship.st.currentMethod2002 = 'data';
                break
            case '2':
                ship.st.currentMethod2002 = 'curv';
                break;

        };

        switch( data[ 'METHOD_2002_STEERING' ] ) {

            case '0':
                ship.st.steering2002 = false;
                break;
            case '1':
                ship.st.steering2002 = true;
                break

        };

        switch( data[ 'METHOD_2002_DRIFTING' ] ) {

            case '0':
                ship.st.drift2002 = false;
                break;
            case '1':
                ship.st.drift2002 = true;
                break

        };

        switch( data[ 'METHOD_2002_SHALLOW' ] ) {

            case '0':
                ship.st.shallow2002 = false;
                break;
            case '1':
                ship.st.shallow2002 = true;
                break

        };

        switch( data[ 'METHOD_2002_DISPLACEMENT' ] ) {

            case '0':
                ship.st.displacement2002 = false;
                break;
            case '1':
                ship.st.displacement2002 = true;
                break

        };

        switch( data[ 'METHOD_2002_TEMP_DENSITY' ] ) {

            case '0':
                ship.st.temperature2002 = false;
                break;
            case '1':
                ship.st.temperature2002 = true;
                break
            // case '2':
            //     ship.st.temperature2002 = 'ittc2017';
            //     break

        };

        switch( data[ 'METHOD_2002_NKQF' ] ) {

            case '0':
                ship.st.nkq = 'ls';
                break;
            case '1':
                ship.st.nkq = 'mean';
                break
            case '2':
                ship.st.nkq = 'same';
                break

        };

        const { load, hdg, sog, rpm, power, wind_v, wind_d, wave, swell } = ship;
        toArryDataFloat( load, hdg, sog, rpm, power, wind_v, wind_d )
        toArryDataFloat( wave.angle, wave.height, wave.period )
        toArryDataFloat( swell.angle, swell.height, swell.period )

        const { rudder, drift } = ship;
        toArryDataFloat( rudder, drift );

        const { wind, mt } = ship;
        toArryDataFloat( wind.angle, wind.coef );
        
        toArryDataFloat( mt.trial.vs, mt.trial.pb, mt.trial.rpm );
        ship.otherCondition.map( cond => toArryDataFloat( mt[ cond ].vs, mt[ cond ].pb, mt[ cond ].rpm ) );

        toArryDataFloat( mt.res.vs, mt.res.cts );
        toArryDataFloat( mt.sp.vs, mt.sp.wtm, mt.sp.t, mt.sp.etar, mt.sp.etad, mt.sp.xip, mt.sp.xin, mt.sp.xiv );
        toArryDataFloat( mt.pow.j, mt.pow.kt, mt.pow.kq );

        const { arm } = ship;
        toArryDataFloat( arm.hdg, arm.fr, arm.lamda, arm.raw );

        const { nmriGeom } = ship;
        toArryDataFloat( nmriGeom.x , nmriGeom.bhalf, nmriGeom.draft, nmriGeom.area );

        const { halfBreadth } = ship;
        toArryDataFloat( halfBreadth.xs, halfBreadth.hb );

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

    viewport.clear();

    let table, chartData;

    // Particulars tab
    table = viewport.particular.tables[ 0 ];

    const { shipName, ownerName, shipNo } = ship;

    [ shipName, ownerName, shipNo ].map( ( e, i ) => viewport.particular.textInput[ i ].setValue( e ) );

    const { l, b, wetted, Ax, Za, Zref, cb, Am } = ship;
    
    [ l, b, wetted, Ax, Za, Zref, cb, Am ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        row.cells[ 1 ].textContent = e;

    } );

    table = viewport.particular.tables[ 1 ];

    const { mcr, ncr } = ship;

    [ mcr, ncr ].map( ( arr, i ) => {

        const row = table.rows[ i + 1 ];
        arr ? arr.map( ( e, j ) => row.cells[ j + 1 ].textContent = e ) : null;

    } );

    table = viewport.particular.tables[ 2 ];

    const { contractSpeed, contractPower } = ship;

    [ contractSpeed, contractPower ].map( ( e, i ) => {

        const row = table.rows[ i ];
        row.cells[ 1 ].textContent = e;

    } );

    table = viewport.particular.tables[ 3 ];

    const { tf, ta, disp, temps, rhos, tempa, rhoa  } = ship;
    
    [ tf, ta, disp, temps, rhos, tempa, rhoa ].map( ( e, i ) => {
        
        const row = table.rows[ i ];
        const cell = row.cells[ 1 ];
        cell.textContent = e;
        cell.dom.dispatchEvent( new Event( 'blur' ) );

    } );

    // Model test tab
    const mt = ship.mt;
    table = viewport.modeltest.tables[ 0 ];

    [ mt.trial.vs, mt.trial.pb, mt.trial.rpm ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
            row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

        } )

    } );

    ship.otherCondition.map( ( cond, i ) => {

        if ( i > 1 ) return;

        table = viewport.modeltest.tables[ 1 + i ];

        [ mt[ cond ].vs, mt[ cond ].pb, mt[ cond ].rpm ].map( ( arr, i ) => {
        
            arr.map( ( e, j ) => { 
    
                const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
                row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;
    
            } )
    
        } );

        viewport.modeltest.conditions[ 1 + i ].setValue( cond + ' load condition' );

    } );

    table = viewport.modeltest.tables[ 3 ];

    [ mt.res.vs, mt.res.cts ].map( ( arr, i ) => {
        
        if ( arr ) {

            arr.map( ( e, j ) => { 

                const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
                row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

            } )

        }

    } );

    table = viewport.modeltest.tables[ 4 ];

    [ mt.sp.vs, mt.sp.wtm, mt.sp.t, mt.sp.etar, mt.sp.etad, mt.sp.xip, mt.sp.xin, mt.sp.xiv ].map( ( arr, i ) => {
        
        if ( arr ) {

            arr.map( ( e, j ) => { 

                const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
                row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

            } )

        }

    } );

    table = viewport.modeltest.tables[ 5 ];

    [ mt.pow.j, mt.pow.kt, mt.pow.kq ].map( ( arr, i ) => {
        
        if ( arr ) {

            arr.map( ( e, j ) => { 

                const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
                row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

            } )

        }

    } );

    //Speed-power curve
    chartData = viewport.modeltest.chart.data;
    chartData[ 0 ].x = mt.trial.vs;
    chartData[ 0 ].y = mt.trial.pb;
    
    ship.otherCondition.map( ( cond, i ) => {

        if ( i > 1 ) return;
        chartData[ 1 + i ].name = cond;
        chartData[ 1 + i ].x = mt[ cond ].vs;
        chartData[ 1 + i ].y = mt[ cond ].pb;
        
    } );

    Plotly.update( viewport.modeltest.chart.dom, chartData, viewport.modeltest.chart.layout )

    // Correction tab
    const correction = viewport.correction;
    correction.guideline.setValue( ship.st.guideline );
    correction.iso2002.steering.setValue( ship.st.steering2002 );
    correction.iso2002.drift.setValue( ship.st.drift2002 );
    correction.iso2002.shallow.setValue( ship.st.shallow2002 );
    correction.iso2002.displacement.setValue( ship.st.displacement2002 );
    correction.iso2002.temperature.setValue( ship.st.temperature2002 );
    correction.iso2002.nkqFair.setValue( ship.st.nkq );
    correction.iso2002.diameter.setValue( ship.propellerDiameter );
    correction.iso2002.pitch.setValue( ship.propellerPitch );
    correction.iso2002.area.setValue( ship.rudderArea );
    correction.iso2002.span.setValue( ship.rudderSpan );
    correction.iso2002.aspect.setValue( ship.rudderAspect );
    correction.wind.method.setValue( ship.st.windMethod );
    correction.wave.method.setValue( ship.st.waveMethod );
    correction.wave.method2002.setValue( ship.st.waveMethod2002 );
    correction.current.method.setValue( ship.st.currentMethod );
    correction.current.method2002.setValue( ship.st.currentMethod2002 );

    

    triggerChange( correction.wave.method.dom );

    function triggerChange( element ) {

        const changeEvent = new Event( 'change' );
        element.dispatchEvent( changeEvent );

    }

    table = viewport.correction.wind.table;

    ship.wind.angle.map( ( e, i ) => table.rows[ i + 1 ].cells[ 0 ].textContent = e );
    ship.wind.coef.map( ( e, i ) => table.rows[ i + 1 ].cells[ 1 ].textContent = e );

    chartData = viewport.correction.wind.chart.data;
    chartData[0].x = ship.wind.angle;
    chartData[0].y = ship.wind.coef;

    Plotly.update( viewport.correction.wind.chart.dom, chartData, viewport.correction.wind.chart.layout );
    
    [ 'lbwl', 'kyy', 'lr', 'le' ].map( key => {
        
        viewport.correction.wave[ key ].setValue( ship[ key ] );

    } );

    // viewport.correction.wave.kpitch.setValue( ship.kyy );

    [ 'lcg', 'tcg', 'vcg', 'kroll', 'kpitch', 'kyaw', 'bf', 'cu' ].map( key => {
        
        viewport.correction.wave[ key ].setValue( ship[ key ] );

    } );

    table = viewport.correction.wave.table;

    const nmriGeom = ship.nmriGeom;

    [ nmriGeom.x, nmriGeom.bhalf, nmriGeom.draft, nmriGeom.area ].map( ( arr, i ) => {
        
        arr.map( ( e, j ) => { 

            const row = table.rows[ j + 1 ] ? table.rows[ j + 1 ] : table.insertRow();
            row.cells[ i ] ? row.cells[ i ].textContent = e : row.insertCell().textContent = e;

        } )

    } );

    viewport.correction.temperature.temp0.setValue( ship.temp0 );
    viewport.correction.temperature.rho0.setValue( ship.rho0 );
    viewport.correction.temperature.temps.setValue( ship.temps );
    viewport.correction.temperature.rhos.setValue( ship.rhos );
    viewport.correction.displacement.dispm.setValue( ship.dispm );
    viewport.correction.shallowWater.Am.setValue( ship.Am );
    viewport.correction.shallowWater.h.setValue( ship.h );

    // Measured data tab
    table = viewport.measured.table;

    const { load, time, hdg, sog, rpmPORT, rpmSTBD, rpm, powerPORT, powerSTBD, power, wind_v, wind_d, wave, swell } = ship;

    const row0 = table.rows[ 0 ];
    hdg.map( ( e, i ) => row0.cells[ i + 1 ] ? row0.cells[ i + 1 ].textContent = i + 1 : row0.insertHeader().textContent = i + 1 );

    [ load, time, hdg, sog, rpmPORT, rpmSTBD, rpm, powerPORT, powerSTBD, power, wind_v, wind_d ].map( ( arr, i ) => {

        const row = table.rows[ i + 1 ];
        
        arr.map( ( e, j ) => {

            row.cells[ j + 1 ] ? row.cells[ j + 1 ].textContent = e : row.insertCell().textContent = e;

        } );

    } );

    [ wave, swell ].map( ( wave, k ) => {

        [ wave.height, wave.angle, wave.period ].map( ( arr, i ) => {

            const row = table.rows[ 13 + 3 * k + i ];

            arr.map( ( e, j ) => {

                row.cells[ j + 1 ] ? row.cells[ j + 1 ].textContent = e : row.insertCell().textContent = e;

            } );

        } );

    } );

    const { drift, rudderPORT, rudderSTBD, rudder } = ship;

    [ drift, rudderPORT, rudderSTBD, rudder ].map( ( arr, i ) => {

        const row = table.rows[ i + 19 ];
        
        arr.map( ( e, j ) => {

            row.cells[ j + 1 ] ? row.cells[ j + 1 ].textContent = e : row.insertCell().textContent = e;

        } );

    } );

}


export { MenubarSTA };
