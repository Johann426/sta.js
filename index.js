import { array } from './index.esm.js';
import { besseli, besselk } from './bessel.js';

import { UITable } from './UITable.js';
import { MenubarSTA } from './MenubarSTA.js';
import { ViewportSTA } from './ViewportSTA.js';
import { Ship } from './Ship.js';

const M = Math;
const pi = M.PI;
const g = 9.80665; //9.807 staimo ?

const ship = new Ship();

let table, row;

/////////////////////////////////////////////////////////////////////////////////////////////
// Measured data
/////////////////////////////////////////////////////////////////////////////////////////////

const viewport = new ViewportSTA( ship );
document.body.appendChild( viewport.dom );

const menubar = new MenubarSTA( ship, viewport );
document.body.appendChild( menubar.dom );




//SNNM validation
const { l, b, tf, ta, cb, kyy, le, lr } = ship;
const vs = 14.5;
const angle = 0;
let tb = new UITable();
viewport.dom.appendChild( tb.dom );

row = tb.insertRow();
row.insertHeader().textContent = "lamda / L";
row.insertHeader().textContent = "w'";
row.insertHeader().textContent = "b1";
row.insertHeader().textContent = "d1";
row.insertHeader().textContent = "Kawm";
row.insertHeader().textContent = "T12";
row.insertHeader().textContent = "T34";
row.insertHeader().textContent = "alphaT12";
row.insertHeader().textContent = "alphaT34";
row.insertHeader().textContent = "f(alpha)";
row.insertHeader().textContent = "Kawr1";
row.insertHeader().textContent = "Kawr2";
row.insertHeader().textContent = "Kawr3";
row.insertHeader().textContent = "Kawr4";
row.insertHeader().textContent = "Kaw";

for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const res = snnm( l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda );
	row = tb.insertRow();
	row.insertCell().textContent = lamdaOverL.toFixed( 4 );
	row.insertCell().textContent = res.omega.toFixed( 4 );
	row.insertCell().textContent = res.b1.toFixed( 4 );
	row.insertCell().textContent = res.d1.toFixed( 4 );
	row.insertCell().textContent = res.kawm.toFixed( 4 );
	row.insertCell().textContent = res.t12.toFixed( 4 );
	row.insertCell().textContent = res.t34.toFixed( 4 );
	row.insertCell().textContent = res.at12.toFixed( 4 );
	row.insertCell().textContent = res.at34.toFixed( 4 );
	row.insertCell().textContent = res.fa.toFixed( 4 );
	row.insertCell().textContent = res.kawr1.toFixed( 4 );
	row.insertCell().textContent = res.kawr2.toFixed( 4 );
	row.insertCell().textContent = res.kawr3.toFixed( 4 );
	row.insertCell().textContent = res.kawr4.toFixed( 4 );
	row.insertCell().textContent = res.kwave.toFixed( 4 );

}

//STA2 validation
tb = new UITable();
viewport.dom.appendChild( tb.dom );
row = tb.insertRow();
row.insertHeader().textContent = "lamda / L";
row.insertHeader().textContent = "w'";
row.insertHeader().textContent = "w1";
row.insertHeader().textContent = "a1";
row.insertHeader().textContent = "b1";
row.insertHeader().textContent = "d1";
row.insertHeader().textContent = "rawml(w)";
row.insertHeader().textContent = "f1";
row.insertHeader().textContent = "I1";
row.insertHeader().textContent = "K1";
row.insertHeader().textContent = "alpha(w)";
row.insertHeader().textContent = "Kwave";

for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const res = sta2( l, b, 0.5 * ( tf + ta ), cb, kyy, vs, angle, lamda );
	row = tb.insertRow();
	row.insertCell().textContent = ( lamda / l ).toFixed( 4 );
	row.insertCell().textContent = res.omega.toFixed( 4 );
	row.insertCell().textContent = res.omegaBar.toFixed( 4 );
	row.insertCell().textContent = res.a1.toFixed( 4 );
	row.insertCell().textContent = res.b1.toFixed( 4 );
	row.insertCell().textContent = res.d1.toFixed( 4 );
	row.insertCell().textContent = res.kawml.toFixed( 4 );
	row.insertCell().textContent = res.f1.toFixed( 4 );
	row.insertCell().textContent = res.I1.toFixed( 4 );
	row.insertCell().textContent = res.K1.toFixed( 4 );
	row.insertCell().textContent = res.alpha1.toFixed( 4 );
	row.insertCell().textContent = res.kwave.toFixed( 4 );

}


function snnm( l, b, tf, ta, cb, kyy, le, lr, vs, angle, lamda ) {

	const alpha = angle <= 180 ? angle * pi / 180 : ( 360 - angle ) * pi / 180;
	const cosa = M.cos( alpha );
	const cos2a = M.cos( 2 * alpha );
	const td = M.max( tf, ta );
	const w = M.sqrt( 2 * pi * g / lamda );
	const u = vs * 1852 / 3600;
	const Fr = u / M.sqrt( g * l );
	const omega = 2.142 * M.cbrt( kyy ) * M.sqrt( l / lamda ) * M.pow( cb / 0.65, 0.17 )
				* ( 1 - 0.111 / cb * ( M.log( b / td ) - M.log( 2.75 ) ) )
				* ( ( - 1.377 * Fr ** 2 + 1.157 * Fr ) * M.abs( cosa ) + 0.618 * ( 13 + cos2a ) / 14 );
	const vg = 0.5 * g / w;
	const Fr_rel = ( u - vg ) / M.sqrt( g * l );

	const cala1 = ( a ) => {

		const a90 = M.pow( 0.87 / cb, ( 1 + Fr ) * M.cos( a ) ) / M.log( b / td ) * ( 1 + 2 * M.cos( a ) ) / 3; // use M.cos( a ) instead of cosa
		const api = u > vg && Fr_rel >= 0.12 ? M.pow( 0.87 / cb, 1 + Fr_rel ) / M.log( b / td ) : ( 0.87 / cb ) / M.log( b / td );

		if ( a >= 0 && a <= pi / 2 ) {

			return a90;

		} else if ( a == pi ) {

			return api;

		} else {

			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			return a90 + ( api - a90 ) * ratio;

		}

	};

	const cala2 = ( a ) => {

		const a90 = Fr < 0.12 ? 0.0072 + 0.1676 * Fr : M.pow( Fr, 1.5 ) * M.exp( - 3.5 * Fr );

		const api = u <= vg ? 0.0072 * ( 2 * u / vg - 1 ) : Fr_rel < 0.12 ? 0.0072 + 0.1676 * Fr_rel : M.pow( Fr_rel, 1.5 ) * M.exp( - 3.5 * Fr_rel );

		if ( a >= 0 && a <= pi / 2 ) {

			return a90;

		} else if ( a == pi ) {


			return api;

		} else {

			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			return a90 + ( api - a90 ) * ratio;

		}

	};

	let a1, a2;
	const atan = M.atan( M.abs( ta - tf ) / l );
	const a3 = 1.0 + 28.7 * atan;
	const b1 = omega < 1 ? 11.0 : - 8.5;
	const d1 = omega < 1 ? 566 * M.pow( l * cb / b, - 2.66 ) : - 566 * M.pow( l / b, - 2.66 ) * ( 4 - 125 * atan );

	const calKawm = ( a ) => {

		if ( a > pi / 2 && a < pi ) {

			a1 = cala1( pi / 2 );
			a2 = cala2( pi / 2 );
			const k90 = 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );
			a1 = cala1( pi );
			a2 = cala2( pi );
			const kpi = 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );
			const ratio = a / ( pi / 2 ) - 1; // linear interpolation
			return k90 + ( kpi - k90 ) * ratio;

		} else {

			a1 = cala1( alpha );
			a2 = cala2( alpha );
			return 964.8 * M.pow( cb, 1.34 ) * M.pow( kyy, 2 ) * a1 * a2 * a3 * M.pow( omega, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omega, d1 ) ) );

		}

	};

	const kawm = calKawm( alpha );
	const E1 = M.atan( 0.99 * 0.5 * b / le );
	const E2 = M.atan( 0.99 * 0.5 * b / lr );
	const fa = alpha <= E1 ? cosa : 0;
	const t12 = td;
	const t34 = cb <= 0.75 ? td * ( 4 + M.sqrt( M.abs( cosa ) ) ) / 5 : td * ( 2 + M.sqrt( M.abs( cosa ) ) ) / 3;
	const at12 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t12 / lamda - t12 / ( 2.5 * l ) ) ) : 0;
	const at34 = lamda / l <= 2.5 ? 1.0 - M.exp( - 4 * pi * ( t34 / lamda - t34 / ( 2.5 * l ) ) ) : 0;
	const kawr1 = alpha <= pi - E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr2 = alpha <= E1 ? 2.25 / 16 * l / b * at12 * ( M.sin( E1 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E1 ) * M.cos( E1 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr3 = E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 - alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 - alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;
	const kawr4 = pi - E2 <= alpha && alpha <= pi ? - 2.25 / 16 * l / b * at34 * ( M.sin( E2 + alpha ) ** 2 + 2 * w * u / g * ( M.cos( alpha ) - M.cos( E2 ) * M.cos( E2 + alpha ) ) ) * M.pow( 0.87 / cb, ( 1 + 4 * M.sqrt( Fr ) ) * fa ) : 0;

	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return {
		omega: omega,
		b1: b1,
		d1: d1,
		kawm: kawm,
		t12: t12,
		t34: t34,
		at12: at12,
		at34: at34,
		fa: fa,
		kawr1: kawr1,
		kawr2: kawr2,
		kawr3: kawr3,
		kawr4: kawr4,
		kwave: kawm + kawr1 + kawr2 + kawr3 + kawr4
	};

}

function sta2( l, b, tm, cb, kyy, vs, angle, lamda ) {

	const isLessThan45 = angle <= 45 || angle >= 315;

	if ( !isLessThan45 ) {

		return {

			omega: 0,
			omegaBar: 0,
			a1: 0,
			b1: 0,
			d1: 0,
			kawml: 0,
			f1: 0,
			I1: 0,
			K1: 0,
			alpha1: 0,
			kwave: 0

		}

	}

	const Fr = vs * 1852 / 3600 / M.sqrt( g * l );
	const omega = M.sqrt( 2 * pi * g / lamda );

	//motion induced resistance
	const omegaBar = M.sqrt( l / g ) * M.cbrt( kyy ) / ( 1.17 * M.pow( Fr, - 0.143 ) ) * omega;
	const a1 = 60.3 * M.pow( cb, 1.34 );
	const b1 = omegaBar < 1.0 ? 11.0 : - 8.50;
	const d1 = omegaBar < 1.0 ? 14.0 : - 566 * M.pow( l / b, - 2.66 );
	const raw = M.pow( omegaBar, b1 ) * M.exp( b1 / d1 * ( 1 - M.pow( omegaBar, d1 ) ) ) * a1 * M.pow( Fr, 1.50 ) * M.exp( - 3.5 * Fr );

	//wave reflection
	const k = omega ** 2 / g;
	const x = 1.5 * k * tm;
	const I1 = besseli( x, 1 );
	const K1 = besselk( x, 1 );
	const f1 = 0.692 * M.pow( vs * 1852 / 3600 / M.sqrt( tm * g ), 0.769 ) + 1.81 * M.pow( cb, 6.95 );
	const alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 ) * f1;

	// KAW = RAW / ( 4 rho g zetaA ^ 2 b ^ 2 / l )
	return {

		omega: omega,
		omegaBar: omegaBar,
		a1: a1,
		b1: b1,
		d1: d1,
		kawml: raw,
		f1: f1,
		I1: I1,
		K1: K1,
		alpha1: alpha1,
		kwave: raw + alpha1 * 0.125 * l / b

	};

}

function wave2002( l, tm, vs ) {

	const table = document.createElement( 'table' );
	document.body.appendChild( table );
	let row1;
	row1 = table.insertRow();
	row1.insertCell( - 1 ).textContent = "lamda / L";

	for ( let i = 0; i <= 46; i ++ ) {

	const lamdaOverL = 0.2 + 0.05 * i;
	const lamda = lamdaOverL * l;
	const omega = M.sqrt( 2 * pi * g / lamda );
	const k = omega ** 2 / g;

	//long wave
	const k0 = g / ( vs * 1852 / 3600 ) ** 2;


	//short wave
	const x = 1.5 * k * tm;
	const I1 = besseli( x, 1 );
	const K1 = besselk( x, 1 );
	var alpha1 = pi ** 2 * I1 ** 2 / ( pi ** 2 * I1 ** 2 + K1 ** 2 );


	row1 = table.insertRow();
	row1.insertCell( - 1 ).textContent = ( lamda / l ).toFixed( 4 );

	}

	return;

}

//mean resistance increase due to motion (in regular waves) based on the Maruo's theory
function AddResRegular( w, we, V, AmpH, PhaH, AmpP, PhaP, ca, RhoW )
{
    let I1, I2, I3;
	const tau = we * V / g;
    const K = w * w / g;
    const K0 = g / (V * V);

    const m3 = -0.5 * K0 * (1.0 + 2.0 * tau + M.sqrt(1.0 + 4.0 * tau));
    const m4 = -0.5 * K0 * (1.0 + 2.0 * tau - M.sqrt(1.0 + 4.0 * tau));
    if (tau < 0.25)
    {
        const m1 = 0.5 * K0 * (1.0 - 2.0 * tau + M.sqrt(1.0 - 4.0 * tau));
        const m2 = 0.5 * K0 * (1.0 - 2.0 * tau - M.sqrt(1.0 - 4.0 * tau));
    }
    else
    {
        const m1 = 0.5 * K0 * (1.0 - 2.0 * tau);
		const m2 = m1
    }
    const dm = 0.01 * K0;
    const nm = 10;
    const epsilon = dm / (2 * nm - 1);
    const a = nm * nm * epsilon;
	const tiny = 1.0e-10;
    //------------------------------------------------------------------
    // Region 3 - inf
    I3 = 0.0;
    for (let i = 0; i <= nm; i++)
    {
        const m = m3 - i * i * epsilon;
        const [ KR, KI ] = Kochin( m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca );
        let ff = (KR * KR + KI * KI) * M.Pow(m + K0 * tau, 2.0) * (m + K * ca);
        ff /= M.sqrt(M.abs((m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau)));
        if ((i == 0) || (i == nm)) I3 += ff;
        else I3 += 2.0 * ff;
    }
    I3 *= M.sqrt(epsilon);
    for (let i = 0; i < 10000; i++)
    {
        const m = m3 - a - i * dm;
        const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
        let ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
        ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau)));
        if (i == 0) I3 += 0.5 * ff * dm;
        else I3 += ff * dm;
        if (M.abs(ff / I3) < tiny) break;
    }
    I3 *= -4.0 * pi * RhoW;
    if (tau < 0.25)
    {
        aa = (m2 - m4) < 2.0 * a ? 0.5 * ( m2 - m4 ) : a;
        const epsilona = aa / (nm * nm);
        //------------------------------------------------------------------
        // Region 4-2
        let I2 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            const m = m4 + i * i * epsilona;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(M.Abs((m - m3) * (m - m2) * (m - m1)));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        for (let i = 0; i <= nm; i++)
        {
            m = m2 - i * i * epsilona;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(Math.Abs((m - m4) * (m - m3) * (m - m1)));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        I2 *= Math.Sqrt(epsilona);
        const dl = (m2 - m4) - 2.0 * a;
        if (dl > 0.0)
        {
            const nma = dl / dm + 1; // need to convert to integer?
            const dma = dl / nma;
            for (i = 0; i <= nma; i++)
            {
                m = m4 + aa + i * dma;
                const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
                ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
                ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m - m2) * (m - m1)));
                if ((i == 0) || (i == nma)) I2 += 0.5 * ff * dma;
                else I2 += ff * dma;
            }
        }
        I2 *= 4.0 * pi * RhoW;
        //------------------------------------------------------------------
        // Region 1-inf
        I1 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            m = m1 + i * i * epsilon;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt(M.abs((m - m3) * (m - m4) * (m - m2)));
            if ((i == 0) || (i == nm)) I1 += ff;
            else I1 += 2.0 * ff;
        }
        I1 *= M.sqrt(epsilon);
        for (let i = 0; i < 10000; i++)
        {
            m = m1 + a + i * dm;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m - m4) * (m - m2) * (m - m1));
            if (i == 0) I1 += 0.5 * ff * dm;
            else I1 += ff * dm;
            if (M.abs(ff / I1) < tiny) break;
        }
        I1 *= 4.0 * pi * RhoW;
    }
    else
    {
        //------------------------------------------------------------------
        // Region 4-inf
        I2 = 0.0;
        for (let i = 0; i <= nm; i++)
        {
            m = m4 + i * i * epsilon;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau));
            if ((i == 0) || (i == nm)) I2 += ff;
            else I2 += 2.0 * ff;
        }
        I2 *= M.sqrt(epsilon);
        for (let i = 0; i < 10000; i++)
        {
            m = m4 + a + i * dm;
            const [ KR, KI ] = Kochin(m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca);
            ff = (KR * KR + KI * KI) * M.pow(m + K0 * tau, 2.0) * (m + K * ca);
            ff /= M.sqrt((m - m3) * (m - m4) * (m * m - K0 * (1 - 2.0 * tau) * m + K0 * K0 * tau * tau));
            if (i == 0) I2 += 0.5 * ff * dm;
            else I2 += ff * dm;
            if (M.abs(ff / I2) < tiny) break;
        }
        I2 *= 4.0 * pi * RhoW;
        I1 = 0.0;
    }

    return I1 + I2 + I3;

}

//AmpH, PhaH, AmpP, PhaP : HeaveA, HeaveP, PitchA, PitchP
function Kochin( m, w, we, V, AmpH, PhaH, AmpP, PhaP, ca )
{
    let KR, KI;
	const zz = [];
    ci = new Complex(0.0, 1.0);

    const wano = w * w / g;
    // For Depth attenuation
    const tau = we * V / g;
    const K = w * w / g;
    const K0 = g / (V * V);
    const a1 = M.pow((m + K0 * tau), 2.0) / K0;
    // fac_depth = M.exp(-0.75 * m_CVP * m_Draught * a1);
    const fac_depth = M.exp(-m_CBgeom * m_Draught * a1);

    //----------------------
    //  cutting out the high frequancy of m
    const ist = m_DataG.nst / 2;
    const dx = m_DataG.x[ist] - m_DataG.x[ist - 1];
    if ( m > ( pi / dx ) )
    {
        KR = 0.0;
        KI = 0.0;
        // return [ KR, KI ];
    }

    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        zz[ist] = AmpH * ci.mul( PhaH ).exp() - m_DataG.x[ist] * AmpP * ci.mul ( PhaP ).exp() - ci.mul( wano ).mul ( m_DataG.x[ist] ).mul( ca ).exp() * Complex(-m_Draught * wano).exp();  // Wave Attenuation 2
        zz[ist] *= 2.0 * m_DataG.b[ist];
    }
    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        zz[ist] *= -ci / (4.0 * pi) * (we + 1.0 * m * V);
    }

    //---------------------------------
    // Integration along x
    let H = new Complex(0.0, 0.0);
    for (ist = 0; ist < m_DataG.nst; ist++)
    {
        if (ist == 0)
        {
            dx = 1.0 * (m_DataG.x[ist + 1] - m_DataG.x[ist]);
        }
        else if (ist == m_DataG.nst - 1)
        {
            dx = 1.0 * (m_DataG.x[ist] - m_DataG.x[ist - 1]);
        }
        else
        {
            dx = 0.5 * (m_DataG.x[ist + 1] - m_DataG.x[ist - 1]);
        }
        H += zz[ist] * Complex.pow(ci * m * m_DataG.x[ist]) * dx;
    }
    //  Depth attenuation
    H *= fac_depth;

    KR = H.Real;
    KI = H.Imaginary;

	return [ KR, KI ];
}

export { sta2, snnm }
