# The runtime must be configured before clr is imported, otherwise the default runtime will be initialized and used.
from clr_loader import get_netfx #loading runtime .NET Framework (netfx)
runtime = get_netfx();
# print(runtime.info())

from pythonnet import set_runtime
set_runtime( runtime )

# import CLR(Common Language Runtime)
import clr

# Check information on the runtime
from pythonnet import get_runtime_info
print( get_runtime_info() )

#Python.NET allows CLR namespaces to be treated essentially as Python packages.
from System import String, Char, Int32, Int64, Double, DateTime, TimeSpan
from System.Collections import *
# str0 = String("Hello")

# Using Hashtable
from System.Collections import Hashtable
# table = Hashtable()
# table["key 1"] = "value 1"
# print( table )

# Using Generics
from System.Collections.Generic import List
# lst = List[Double]()
# lst.Add(1.1)
# lst.Add(1.1)
# print( lst )

#To load an assembly(C# class library, .dll), use the AddReference function in the clr module:
clr.AddReference('./dll/istap/Global')
from Global import Enum, Constants, StatusNotifyEventArgs
clr.AddReference('./dll/istap/Chart')
from Chart import Chart
clr.AddReference('./dll/istap/Helper')
from Helper import Conversion, ObjectCopier, Point, Spline

def inputFromJSON( inp, data ): #istap input from json
    
    inp.hullNo = data['shipNo']
    nTrial = len(data['hdg'])
    nEngineSetting = int( nTrial / 2 )
    nGeometryData = len(data[ 'nmriGeom' ][ 'x' ])
    nLoadCondition = len( data['otherCondition'] )
    inp.SetSize( nTrial, nGeometryData, nLoadCondition, 0 )
    inp.projectName = data['shipName'] # do not assign before inp.SetSize()
    inp.nEngineSetting = nEngineSetting
    import math
    inp.engineSetting = [ math.ceil( (i + 1) / 2 ) for i in range( nTrial ) ] # array of 1 1 2 2 3 3 ...
    inp.runName = [ str(val) + '%' for val in data['load'] ]
    inp.t = [ DateTime.Parse(val) for val in data['time'] ]
    inp.refTime = inp.t[ 0 ];
    inp.duration = [ TimeSpan(0,0,0) for i in range( nTrial ) ]
    inp.vg = [ Conversion.KnotToMS(val) for val in data['sog'] ] #knot x 1852 / 3600
    inp.psi0 = [ Conversion.DegreeToRad(val) for val in data['hdg'] ] #deg * PI / 180
    inp.vwr = data['wind_v']
    inp.psiwr = [ Conversion.DegreeToRad(val) for val in data['wind_d'] ] #deg * PI / 180
    inp.tempair = [ float( data['tempa'] ) ]* nTrial
    inp.rhoair = [ data['rhoa'] ] * nTrial
    inp.pms = [ 1000 * val for val in data['power'] ]
    inp.nm = [ val / 60 for val in data['rpm'] ]
    inp.hw3 = data['wave']['height']
    inp.dw = [ Conversion.DegreeToRad(val) for val in data['wave']['angle'] ] #deg * PI / 180
    inp.tw1 = data['wave']['period']
    inp.hs3 = data['swell']['height']
    inp.ds = [ Conversion.DegreeToRad(val) for val in data['swell']['angle'] ] #deg * PI / 180
    inp.ts1 = data['swell']['period']
    inp.loa = data['l'] #to be revised later
    inp.lbp = data['l']
    inp.breadth = data['b']
    inp.s = data['wetted']
    inp.draughtFore = data['tf']
    inp.draughtAft = data['ta']
    inp.draught = 0.5 * ( data['tf'] + data['ta'] )
    # inp.draughtDeep = 
    inp.cb = data['cb']
    inp.za = data['Za']
    inp.zref = data['Zref']
    inp.aod = 0
    inp.axv = data['Ax']
    inp.ayv = data['Ax']
    inp.windTunnel = Chart('Wind Tunnel Chart', 1, 37)
    inp.windTunnel.x = data['wind']['angle']
    for i in range( 37 ):
        inp.windTunnel.y[0,i] = - data['wind']['coef'][i]
    
    inp.isAverage = data['st']['windAverage']

    match data['st']['guideline']:
        case 'iso2015':
            inp.referenceMethod = Enum.ReferenceMethods.ISO15016_2015
        case 'ittc2017':
            inp.referenceMethod = Enum.ReferenceMethods.ITTC2017
        case 'ittc2021':
            inp.referenceMethod = Enum.ReferenceMethods.ITTC2021

    match data['st']['windMethod']:
        case 'windTunnelTest':
            inp.windChartType = Enum.WindChartTypes.WindTunnel
        case 'cfd':
            inp.windChartType = Enum.WindChartTypes.CFD
        case 'ittc':
            inp.windChartType = Enum.WindChartTypes.ITTC
        case 'formula':
            inp.windChartType = Enum.WindChartTypes.Fujiwara

    # inp.iTTCChartType = Enum.ITTCChartTypes.ContainerLadenContainer ...

    match data['st']['waveMethod']:
        case 'sta1':
            inp.waveMethod = Enum.WaveMethods.STA1
        case 'sta2':
            inp.waveMethod = Enum.WaveMethods.STA2
        case 'nmri':
            inp.waveMethod = Enum.WaveMethods.TheoreticalwithModelTest
        case '': # need to be revised
            inp.waveMethod = Enum.WaveMethods.TheoreticalwithEmpiricalFormula
        case 'test':
            inp.waveMethod = Enum.WaveMethods.SeakeepingModelTests
        case 'snnm':
            inp.waveMethod = Enum.WaveMethods.SNNM

    # Enum.TemperatureInputTypes.Temperature
    inp.waterTempType = Enum.TemperatureInputTypes.Density

    match data['st']['currentMethod']:
        case 'mom':
            inp.currentMethod = Enum.CurrentMethods.MeanofMeans
        case 'iterative':
            inp.currentMethod = Enum.CurrentMethods.Iterative

    inp.shallowMethod = Enum.ShallowMethods.Lackenby

    inp.directPowerMethod = Enum.DirectPowerMethods.LoadVariation #Direct power method (12.2.3, Annex J)
    # Enum.DirectPowerMethods.FullScaleWake #DPM with full scale wake (Annex K)

    if data['lbwl'] != '':
        inp.lbwl = data['lbwl']
    else:
        inp.lbwl = 0
    inp.LE = data['le']
    inp.LR = data['lr']
    inp.sx = data[ 'nmriGeom' ][ 'x' ]
    inp.sb = data[ 'nmriGeom' ][ 'bhalf' ]
    inp.sd = data[ 'nmriGeom' ][ 'draft' ]
    inp.area = data[ 'nmriGeom' ][ 'area' ]
    if data['kroll'] != '':
        inp.kxx = data['kroll']
    else:
        inp.kxx = 0
    if data['kyy'] != '':
        inp.kyy = data['kyy'] #data['kpitch]
    else :
        inp.kyy = 0
    if data['kyaw'] != '':
        inp.kzz = data['kyaw']
    else:
        inp.kzz = 0
    if data['lcg'] != '':
        inp.xG = data['lcg']
    else:
        inp.xG = 0
    if data['tcg'] != '':
        inp.yG = data['tcg']
    else:
        inp.yG = 0
    if data['vcg'] != '':
        inp.zG = data['vcg']
    else:
        inp.zG = 0
    if data['bf'] != '':
        inp.bf = data['bf']
    else:
        inp.bf = 0
    if data['cu'] != '':
        inp.cu = data['cu']
    else:
        inp.cu = 0

    inp.tempWater = data['temps']
    inp.rhoWater = data['rhos']
    inp.tempWater0 = data['temp0']
    inp.rhoWater0 = data['rho0'] # HHI:1025 (1026 ??)
    
    inp.NoCurrent = False
    
    # inp.airTempType = 0
    inp.displaceSeaTrial = data['disp']
    inp.displaceModelTest = data['dispm']

    inp.am = data['Am']
    inp.h = data['h']

    inp.mcr = 1000 * data['mcr'][0]
    inp.ncr = 1000 * data['ncr'][0]
    inp.nLoadCondition = nLoadCondition
    inp.loadConditionName = data['otherCondition']
    inp.targetPower = 1000 * data['contractPower'] #data['ncr'][0] / ( 1 + 0.01 * data['sm'] )
    inp.noShift = False
    
    n = len(data['mt']['trial']['vs'])
    inp.trialModelTest = Chart('Trial Model Test Chart', 2, n)
    inp.trialModelTest.x = data['mt']['trial']['vs']
    for i in range( n ):
        inp.trialModelTest.y[0,i] = data['mt']['trial']['pb'][i]
        inp.trialModelTest.y[1,i] = data['mt']['trial']['rpm'][i]
        
    # conds = [ 'trial' ].extend( inp.loadConditionName )
    conds = inp.loadConditionName
    loadModelTest = []

    for i in range( nLoadCondition ):
        key = conds[ i ]
        vs = data['mt'][key]['vs']
        n = len( vs )
        chart = Chart( key, 1, n )
        loadModelTest.append( chart )
        chart.x = vs
        for i in range( n ):
            chart.y[0,i] = data['mt'][key]['pb'][i]
    
    inp.loadModelTest = loadModelTest
    
    inp.etam = 0.99
    inp.etas = 0.99
    inp.propellarDiameter = 0 # to be revised
    inp.cmc = 0
    inp.hbr = 0
    inp.hc = 0
    inp.mu = 0
    inp.targetPowerName = "NCR with s.m."

    n = len(data['mt']['res']['cts'])
    inp.ct0 = Chart('Ct0 Chart', 1, n)
    inp.ct0.x = data['mt']['res']['vs']
    for i in range( n ):
        inp.ct0.y[0,i] = data['mt']['res']['cts'][i]

    n = len(data['mt']['sp']['vs'])
    inp.etaXi = Chart('EtaXi Chart', 4, n)
    inp.etaXi.x = data['mt']['sp']['vs'] # unit: knots
    for i in range( n ):
        inp.etaXi.y[0,i] = data['mt']['sp']['etad'][i]
        inp.etaXi.y[1,i] = data['mt']['sp']['xip'][i]
        inp.etaXi.y[2,i] = data['mt']['sp']['xiv'][i]
        inp.etaXi.y[3,i] = data['mt']['sp']['xin'][i]
    
    n = len(data['mt']['sp']['etar'])
    inp.etaTW = Chart('EtaXi Chart', 3, n)
    inp.etaTW.x = data['mt']['sp']['vs']
    for i in range( n ):
        inp.etaTW.y[0,i] = data['mt']['sp']['etar'][i]
        inp.etaTW.y[1,i] = data['mt']['sp']['t'][i]
        inp.etaTW.y[2,i] = data['mt']['sp']['wtm'][i]

    n = len(data['mt']['pow']['j'])
    inp.kTKQ = Chart('KTKQ Chart', 2, n)
    inp.kTKQ.x = data['mt']['pow']['j']
    for i in range( n ):
        inp.kTKQ.y[0,i] = data['mt']['pow']['kt'][i]
        inp.kTKQ.y[1,i] = data['mt']['pow']['kq'][i]

    # inp.xiZeta = Chart('XiZeta Chart', 6, n)
    # inp.xiZeta.x = vs
    # for i in range( n ):
    #     inp.xiZeta.y[0,i] = xir[i]
    #     inp.xiZeta.y[1,i] = zetar[i][i]
    #     inp.xiZeta.y[2,i] = xit[i]
    #     inp.xiZeta.y[3,i] = zetat[i][i]
    #     inp.xiZeta.y[4,i] = xiw[i]
    #     inp.xiZeta.y[5,i] = zetaw[i][i]

# use ctypes
from ctypes import *

# Flask app
import webbrowser
from threading import Timer
from flask import Flask, request, render_template, url_for, jsonify

app = Flask(__name__,template_folder='templates',static_folder='static')

@app.route('/') 
def index(): 
    return render_template('index.html')

@app.route('/process', methods=['POST']) 
def process(): 
    json = request.get_json() # retrieve the data sent from JavaScript
    # process the data using Python code

    # HiSTAP process for ISO15016:2002
    class ShipInput:
        x = 0
    shipInput = [ ShipInput() ]
    class ResultOutput:
        x = 0
    resultOutput = [ ResultOutput() ]

    
    # histap = CDLL('./dll/histap/HiSTAP_DLL.dll')
    # ifcoremd = CDLL('./dll/histap/libifcoremd.dll')
    # mmd = CDLL('./dll/histap/libmmd.dll')


    # i-STAP
    clr.AddReference('./dll/istap/SeaTrialAnalysis')
    from SeaTrialAnalysis import SeaTrialAnalysis, InputData
    inputData = InputData()
    inputFromJSON( inputData, json )
    sta = SeaTrialAnalysis()
    sta.inputData = inputData

    # wind
    clr.AddReference('./dll/istap/WindResistance')
    from WindResistance import WindResistance, WindResistanceData
    windResistance = WindResistance()
    windResistance.data = WindResistanceData()
    windResistance.data.SetSize( inputData.nTrial )
    windResistance.data.zref = inputData.zref
    windResistance.data.za = inputData.za
    windResistance.data.aod = inputData.aod
    windResistance.data.ayv = inputData.ayv
    windResistance.data.cmc = inputData.cmc
    windResistance.data.hbr = inputData.hbr
    windResistance.data.hc = inputData.hc
    windResistance.data.mu = inputData.mu
    windResistance.data.isAveraging = inputData.isAveraging
    windResistance.data.loa = inputData.loa
    windResistance.data.lbp = inputData.lbp
    windResistance.data.breadth = inputData.breadth
    windResistance.data.axv = inputData.axv
    windResistance.data.windChartType = inputData.windChartType
    windResistance.data.iTTCChartType = inputData.iTTCChartType
    windResistance.data.windTunnel = inputData.windTunnel
    # windResistance.data.windCFD = inputData.windCFD
    windResistance.data.referenceMethod = inputData.referenceMethod

    for i in range( inputData.nTrial ):
        windResistance.data.vg[i] = inputData.vg[i]
        windResistance.data.psi0[i] = inputData.psi0[i]
        windResistance.data.rhoair[i] = inputData.rhoair[i]
        windResistance.data.vwr[i] = inputData.vwr[i]
        windResistance.data.psiwr[i] = inputData.psiwr[i]
    
    try: windResistance.CalculateWindResistance()
    except Exception as err:
        e = err
        print( err.Message )
        print( err.contents )

    # wave
    clr.AddReference('./dll/istap/WaveResistance')
    from WaveResistance import WaveResistance, WaveResistanceData, WaveSpectrum, TransferFunction
    waveResistance = WaveResistance()
    waveResistance.data = WaveResistanceData()
    waveResistance.data.SetSize(inputData.nTrial, inputData.nGeometryData)
    waveResistance.data.nTrial = inputData.nTrial
    waveResistance.data.deletePrevious = inputData.deletePrevious
    waveResistance.data.waveMethod = inputData.waveMethod
    waveResistance.data.nGeometryData = inputData.nGeometryData
    waveResistance.data.draught = inputData.draught
    waveResistance.data.draughtDeep = inputData.draughtDeep
    waveResistance.data.ta = inputData.draughtAft
    waveResistance.data.tf = inputData.draughtFore
    waveResistance.data.xG = inputData.xG
    waveResistance.data.yG = inputData.yG
    waveResistance.data.zG = inputData.zG
    waveResistance.data.kxx = inputData.kxx
    waveResistance.data.kyy = inputData.kyy
    waveResistance.data.kzz = inputData.kzz
    waveResistance.data.bf = inputData.bf
    waveResistance.data.cu = inputData.cu
    waveResistance.data.cb = inputData.cb
    waveResistance.data.lbwl = inputData.lbwl
    waveResistance.data.dispVol = inputData.displaceSeaTrial
    waveResistance.data.breadth = inputData.breadth
    waveResistance.data.lbp = inputData.lbp
    waveResistance.data.rhoWater = inputData.rhoWater
    # waveResistance.data.transferFunctions = transferFtn //private member
    waveResistance.data.nVExp = inputData.nVExp
    waveResistance.data.nHExp = inputData.nHExp
    waveResistance.data.nLExp = inputData.nLExp
    waveResistance.data.ta = inputData.draughtAft
    waveResistance.data.tf = inputData.draughtFore
    waveResistance.data.le = inputData.LE
    waveResistance.data.lr = inputData.LR
    waveResistance.data.e1 = inputData.E1
    waveResistance.data.e2 = inputData.E2

    for i in range( int(inputData.nTrial / 2)):
        average = (inputData.vg[i * 2] + inputData.vg[i * 2 + 1]) / 2.0
        waveResistance.data.vs[2 * i] = average
        waveResistance.data.vs[2 * i + 1] = average

    for i in range(inputData.nTrial):
        waveResistance.data.hw3[i] = inputData.hw3[i]
        waveResistance.data.dw[i] = inputData.dw[i]
        waveResistance.data.tw1[i] = inputData.tw1[i]
        waveResistance.data.hs3[i] = inputData.hs3[i]
        waveResistance.data.ds[i] = inputData.ds[i]
        waveResistance.data.ts1[i] = inputData.ts1[i]

    for i in range(inputData.nGeometryData):
        waveResistance.data.x[i] = inputData.sx[i]
        waveResistance.data.b[i] = inputData.sb[i]
        waveResistance.data.d[i] = inputData.sd[i]
        waveResistance.data.area[i] = inputData.area[i]
        
    try: waveResistance.CalculateWaveResistance()
    except Exception as err:
        e = err
        print( err )
        print( err.Message )
        print( err.contents )
    
    # temperature
    clr.AddReference('./dll/istap/WaterTempSalinity')
    from WaterTempSalinity import WaterTempSalinity, WaterTempSalinityData
    waterTempSalinity = WaterTempSalinity()
    waterTempSalinity.data = WaterTempSalinityData()
    waterTempSalinity.data.SetSize(inputData.nTrial)
    waterTempSalinity.data.nTrial = inputData.nTrial
    waterTempSalinity.data.s = inputData.s
    waterTempSalinity.data.tempWater = inputData.tempWater
    waterTempSalinity.data.tempWater0 = inputData.tempWater0
    waterTempSalinity.data.rhoWater = inputData.rhoWater
    waterTempSalinity.data.rhoWater0 = inputData.rhoWater0
    waterTempSalinity.data.lbp = inputData.lbp
    waterTempSalinity.data.ct0 = inputData.ct0
    waterTempSalinity.data.referenceMethod = inputData.referenceMethod
    
    for i in range( int(inputData.nTrial / 2)):
        average = (inputData.vg[i * 2] + inputData.vg[i * 2 + 1]) / 2.0
        waterTempSalinity.data.vs[2 * i] = average
        waterTempSalinity.data.vs[2 * i + 1] = average
    
    try: waterTempSalinity.CalculateWaterResistance()
    except Exception as err:
        e = err
        print( err )
        print( err.Message )
        print( err.contents )

    # speed-power
    clr.AddReference('./dll/istap/SpeedPowerEstimate')
    from SpeedPowerEstimate import SpeedPowerEstimate, SpeedPowerEstimateData
    speedPowerEstimate = SpeedPowerEstimate()
    speedPowerEstimate.data = SpeedPowerEstimateData()
    speedPowerEstimate.data.SetSize(inputData.nTrial)
    speedPowerEstimate.data.nTrial = inputData.nTrial
    speedPowerEstimate.data.nEngineSetting = inputData.nEngineSetting
    speedPowerEstimate.data.currentMethod = inputData.currentMethod
    speedPowerEstimate.data.directPowerMethod = inputData.directPowerMethod #Enum.DirectPowerMethods.LoadVariation <= Direct power method (12.2.3, Annex J)
    speedPowerEstimate.data.shallowMethod = inputData.shallowMethod
    speedPowerEstimate.data.h = inputData.h
    speedPowerEstimate.data.am = inputData.am
    speedPowerEstimate.data.propellarDiameter = inputData.propellarDiameter
    speedPowerEstimate.data.rhoWater = inputData.rhoWater
    speedPowerEstimate.data.rhoWater0 = inputData.rhoWater0
    speedPowerEstimate.data.etaXi = inputData.etaXi
    speedPowerEstimate.data.etaTW = inputData.etaTW
    speedPowerEstimate.data.xiZeta = inputData.xiZeta #need to be revised
    speedPowerEstimate.data.kTKQ = inputData.kTKQ
    speedPowerEstimate.data.b = inputData.breadth
    speedPowerEstimate.data.tm = inputData.draught

    for i in range(inputData.nTrial):
        speedPowerEstimate.data.t[i] = Conversion.DateTimeToDays(inputData.t[i], inputData.duration[i], inputData.refTime)
        speedPowerEstimate.data.engineSetting[i] = inputData.engineSetting[i]
        speedPowerEstimate.data.vg[i] = inputData.vg[i]
        speedPowerEstimate.data.deltaR[i] = windResistance.data.raa[i] + waveResistance.data.raw[i] + waterTempSalinity.data.ras[i]
        speedPowerEstimate.data.pdms[i] = inputData.pms[i] * inputData.etas
        speedPowerEstimate.data.nms[i] = inputData.nm[i]


    try: speedPowerEstimate.CalculateSpeedPower()
    except Exception as err:
        for val in speedPowerEstimate.data.lvt1:
            print('vprimeg', val.vprimeg)
            print('vs', val.vs)
            print('pdms', val.pdms)
            print('nms', val.nms)
            print('deltaR', val.deltaR)
            print('etaDid', val.etaDid)
            print('xip', val.xip)
            print('pDid', val.pDid)
            print('deltaV', val.deltaV)
            print('xiv', val.xiv)
            print('xin', val.xin)
            print('nid', val.nid)
        e = err
        print( err )
        print( err.Message )
        print( err.contents )

    # shallow water
    if inputData.shallowMethod != Enum.ShallowMethods.Lackenby:
        clr.AddReference('./dll/istap/ShallowWater')
        from ShallowWater import ShallowWater, ShallowWaterData
        shallowWater = ShallowWater();
        shallowWater.data = ShallowWaterData();
        shallowWater.data.lpp = inputData.lbp;
        shallowWater.data.b = inputData.breadth;
        shallowWater.data.tm = inputData.draught;
        shallowWater.data.cb = inputData.cb;
        shallowWater.data.aw = inputData.aw;
        shallowWater.data.s = inputData.s;
        shallowWater.data.h = inputData.h;
        shallowWater.data.nu = waterTempSalinity.data.nu;
        shallowWater.data.rhoWater = inputData.rhoWater;
        shallowWater.data.shallowMethod = inputData.shallowMethod;
        shallowWater.data.tankTestChart = inputData.tankTest;
        shallowWater.data.etaXi = inputData.etaXi;
        shallowWater.data.displt = inputData.displaceSeaTrial;
        shallowWater.data.SetSize(inputData.nTrial);
        for i in range(inputData.nTrial):
            shallowWater.data.p1[i] = speedPowerEstimate.data.finalpDid[i];
            shallowWater.data.vs[i] = speedPowerEstimate.data.finalvs[i];
        try: shallowWater.ShallowWaterCorrection();
        except Exception as err:
            print('k1', shallowWater.data.k1)
            for val in shallowWater.data.p2:
                print('p2', val)
            e = err
            print( err )
            print( err.Message )
            print( err.contents )
                
    # displacement
    clr.AddReference('./dll/istap/DisplaceTrim')
    from DisplaceTrim import DisplaceTrim, DisplaceTrimData
    displaceTrim = DisplaceTrim();
    displaceTrim.data = DisplaceTrimData();
    displaceTrim.data.SetSize(inputData.nTrial);
    displaceTrim.data.nTrial = inputData.nTrial;
    displaceTrim.data.displaceSeaTrial = inputData.displaceSeaTrial;
    # displaceTrim.data.displaceModelTest = inputData.displaceModelTest;
    for i in range(inputData.nTrial):
        if inputData.shallowMethod != Enum.ShallowMethods.Lackenby:
            displaceTrim.data.p1[i] = shallowWater.data.p2[i];
        else:
            displaceTrim.data.p1[i] = speedPowerEstimate.data.finalpDid[i];

    displaceTrim.DisplaceTrimCorrection();
    
    # Load conversion
    clr.AddReference('./dll/istap/LoadConversion')
    from LoadConversion import LoadConversion, LoadConversionData
    loadConversion = LoadConversion()
    loadConversion.data = LoadConversionData()
    loadConversion.data.SetSize(inputData.nTrial, inputData.nLoadCondition)
    loadConversion.data.nTrial = inputData.nTrial
    loadConversion.data.nLoadConversion = inputData.nLoadCondition
    loadConversion.data.trialModelTest = inputData.trialModelTest
    loadConversion.data.loadConditionName = inputData.loadConditionName
    loadConversion.data.targetPower = inputData.targetPower
    loadConversion.data.noShift = inputData.noShift

    for i in range(inputData.nTrial):
        loadConversion.data.vs[i] = speedPowerEstimate.data.finalvs[i]
        loadConversion.data.pdid[i] = displaceTrim.data.p2[i] / inputData.etam

    for i in range(inputData.nLoadCondition):
        loadConversion.data.loadModelTest[i] = inputData.loadModelTest[i]
    
    try:
        loadConversion.LoadConvert();
        print( 'power: ', loadConversion.data.targetPower )
        print( 'speed trial: ', Conversion.MSToKnot(loadConversion.data.trialvs) )
        for val in loadConversion.data.loadvs:
            print( 'speed loaded: ', Conversion.MSToKnot(val) )
    
    except Exception as err:
        e = err
        print( err )
        print( err.Message )
        print( err.contents )
    


    def UpdateStatus( sender, e ):
        if e.status != "":
            print('status:', e.status)
        if e.message != "":
            print('message:', e.message)

    sta.StatusNotify += SeaTrialAnalysis().StatusNotifyHandler( UpdateStatus )

    outputFileName = inputData.projectName + '_' + inputData.referenceMethod.ToString() + '.xlsx'
    inputData.outputFileName = outputFileName
    saveFileName = inputData.projectName + '_' + inputData.referenceMethod.ToString() + '.isp'
    sta.SaveXml( saveFileName )
    # sta.LoadXml( saveFileName )

    try:
        sta.CheckValidity()
        sta.Run()
    except Exception as err:
        e = err
        print( err )
    
    result = jsonify( {
        'vwr': [ val for val in windResistance.data.vwr ],
        'dwr': [ Conversion.RadToDegree(val) for val in windResistance.data.psiwr ],
        'vwt': [ val for val in windResistance.data.vwt ],
        'dwt': [ Conversion.RadToDegree(val) for val in windResistance.data.psiwt ],
        'vwtAve': [ val for val in windResistance.data.vwtaverage ],
        'dwtAve': [ Conversion.RadToDegree(val) for val in windResistance.data.psiwtaverage ],
        'vwtRef': [ val for val in windResistance.data.vwtref ],
        'vwrRef': [ val for val in windResistance.data.vwref ],
        'dwrRef': [ Conversion.RadToDegree(val) for val in windResistance.data.psiwref ],
        'caa': [ val for val in windResistance.data.caa ],
        'raa': [ val for val in sta.ResistanceWind() ], #[ 0.001 * val for val in windResistance.data.raa ],
        'wave': {
            'rawm': [ 0.001 * val for val in waveResistance.data.ramsea ],
            'rawr': [ 0.001 * val for val in waveResistance.data.rarsea ],
            'total': [ 0.001 * val for val in waveResistance.data.rawsea ],
        },
        'swell': {
            'rawm': [ 0.001 * val for val in waveResistance.data.ramswell ],
            'rawr': [ 0.001 * val for val in waveResistance.data.rarswell ],
            'total': [ 0.001 * val for val in waveResistance.data.rawswell ]
        },
        'raw': [ val for val in sta.ResistanceWave() ], #[ 0.001 * val for val in waveResistance.data.raw ],
        'ras': [ val for val in sta.ResistanceSeaWater() ], #[ 0.001 * val for val in waterTempSalinity.data.ras ],
        'delr': [ val for val in sta.TotalResistance() ], #[ 0.001 * val for val in speedPowerEstimate.data.deltaR ],
    	'pid': [ val for val in sta.PowerDispCorrected() ], #[ 0.001 * val for val in speedPowerEstimate.data.finalpDid ],
        'stw': [ val.x for val in sta.GetCorrectedSpeedPower() ], #[ val for val in speedPowerEstimate.data.finalvc ],
		'pb':  [ val / inputData.etam for val in sta.PowerDispCorrected() ], #[ 0.001 * val / 0.99 for val in speedPowerEstimate.data.finalpDid ],
    } )
    
    return result # return the result to JavaScript

port = 5000
# url = "http://127.0.0.1:{0}".format(port)
url = "http://localhost:{0}".format(port)

if __name__ == '__main__': 
    # Timer(0.5, lambda: webbrowser.open(url) ).start()
    # app.run(port=port, debug=True)
    app.run(port=port, debug=False)
