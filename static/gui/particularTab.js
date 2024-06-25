import { UIDiv, UIText, UIInput } from "../ui.js";
import { UITable } from "../UITable.js";

class particularTab extends UIDiv {

    constructor( viewport ) { // this class access to sea temperature, rhos, and disp in correction tab

        super();
        
        const particular = this;
        
        particular.textInput = [];
        particular.tables = [];

        let div, table, row, cell;

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
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().textContent = 'B (m)'
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().textContent = 'S (m\u00B2)'
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().innerHTML = 'A<sub>X</sub> (m\u00B2)'
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().innerHTML = 'Z<sub>a</sub> (m)';
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().innerHTML = 'Z<sub>ref</sub> (m)';
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().innerHTML = 'C<sub>B</sub>';
        row.insertCell();
        
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
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().textContent = 'Draft A.P. (m)'
        row.insertCell();
        
        row = table.insertRow();
        row.insertHeader().innerHTML = '∇ (m\u00B3)';
        cell = row.insertCell();
        cell.dom.addEventListener( 'blur', e => viewport.correction.displacement.st.setValue( e.target.textContent ) );

        row = table.insertRow();
        row.insertHeader().innerHTML = 'T<sub>s</sub> (°C)';
        cell = row.insertCell();
        cell.dom.addEventListener( 'blur', e => viewport.correction.temperature[ 'temperaturetrial' ].setValue( e.target.textContent ) );

        row = table.insertRow();
        row.insertHeader().innerHTML = '&#961<sub>s</sub> (kg/m<sup>3</sup>)';
        cell = row.insertCell();
        cell.dom.addEventListener( 'blur', e => viewport.correction.temperature[ 'densitytrial' ].setValue( e.target.textContent ) );
        
        row = table.insertRow();
        row.insertHeader().innerHTML = 'T<sub>air</sub> (°C)';
        row.insertCell();

        row = table.insertRow();
        row.insertHeader().innerHTML = '&#961<sub>air</sub> (kg/m<sup>3</sup>)';
        row.insertCell();
        
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

}

export { particularTab };
