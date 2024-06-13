# The runtime must be configured before clr is imported, otherwise the default runtime will be initialized and used.
from clr_loader import get_netfx #loading runtime .NET Framework (netfx)
runtime = get_netfx()
# print(runtime.info())

from pythonnet import set_runtime
set_runtime( runtime )

# import CLR(Common Language Runtime)
import clr

# Check information on the runtime
from pythonnet import get_runtime_info
print( get_runtime_info() )

#Python.NET allows CLR namespaces to be treated essentially as Python packages.
from System import String, Char, Int32, Int64, Double, DateTime
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
clr.AddReference('./dll/istap/SeaTrialAnalysis')
from SeaTrialAnalysis import SeaTrialAnalysis, InputData
clr.AddReference('./dll/istap/Global')
from Global import Enum, Constants, StatusNotifyEventArgs
clr.AddReference('./dll/istap/Chart')
from Chart import Chart
clr.AddReference('./dll/istap/Helper')
from Helper import Conversion, ObjectCopier, Point, Spline

def inputFromJSON( inp, data ): #istap input from json

    
    
    inp.projectName = data['shipName']
    nTrial = len(data['hdg'])
    nEngineSetting = int( nTrial / 2 )
    nGeometryData = 0
    nLoadCondition = 3 # json['mt']['vsEEDI'] ? 3 : 2
    inp.SetSize( nTrial, nGeometryData, nLoadCondition, 0 )
    inp.nEngineSetting = nEngineSetting
    
    for i in range( nTrial ):
        inp.t[ i ] = DateTime.Parse(data['time'][i])
    for i in range( nTrial ):
        inp.vg[i] = Conversion.KnotToMS(data['sog'][i]) #knot x 1852 / 3600
    for i in range( nTrial ):
        inp.psi0[i] = Conversion.DegreeToRad(data['hdg'][i]) #deg * PI / 180
    inp.vwr = data['wind_v']
    for i in range( nTrial ):
        inp.psiwr[i] = Conversion.DegreeToRad(data['wind_d'][i]) #deg * PI / 180
    inp.tempair = [15.0] * nTrial
    inp.rhoair = [ data['rhoa'] ] * nTrial
    inp.pms = data['power']
    inp.nm = data['rpm']
    inp.hw3 = data['wave']['height']
    inp.dw = data['wave']['angle']
    inp.tw1 = data['wave']['period']
    inp.hs3 = data['swell']['height']
    inp.ds = data['swell']['angle']
    inp.ts1 = data['swell']['period']

    inp.loa = data['l'] #to be revised
    inp.lbp = data['l']
    inp.breadth = data['b']
    inp.s = data['wetted']
    inp.draughtFore = data['tf']
    inp.draughtAft = data['ta']
    inp.cb = data['cb']

    # inp.kyy = data['kxx']
    inp.kyy = data['kyy']
    # inp.kyy = data['kzz']
    
    inp.za = data['Za']
    inp.zref = data['Zref']
    inp.aod = 0
    inp.axv = data['Ax']
    inp.ayv = data['Ax']
    inp.windTunnel = Chart('Wind Tunnel Chart', 1, 37) # Chart
    inp.windTunnel.x = data['wind']['angle']
    for i in range( 37 ):
        inp.windTunnel.y[0,i] = data['wind']['coef'][i]
    inp.windChartType = Enum.WindChartTypes.WindTunnel # Enum
    inp.windProfilePowerLaw = Enum.WindProfilePowerLaws.ISO2015 # Enum
    # inp.isAverage = data['useAverage'] #default: True
    
    inp.lbwl = data['lbwl']
    inp.le = data['le']
    inp.lr = data['lr']
    
    # inp.tempWater = data['']
    inp.rhoWater = data['rhos']
    inp.tempWater0 = 15.0 #data['']
    inp.rhoWater0 = data['rhos0'] # HHI:1025 (1026 ??)
    
    inp.NoCurrent = False
    #inp.etaXi # chart
    
    # inp.airTempType = 0
    inp.displaceSeaTrial = data['disp']
    # inp.displaceModelTest = data['mt']['disp']

    inp.ncr = data['ncr'][0]
    inp.targetPower = data['ncr'][0] / ( 1 + data['sm'] )
    #inp.trialModelTest #chart
    #inp.loadModelTest #array of chart

def resultToJSON( sta, data ):
    wind = sta.windResistance
    # data['rawm'][i] = waveResistance.data.ramsea[i]

    
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
    sta = SeaTrialAnalysis(InputData())
    inputData = sta.inputData
    inputFromJSON( inputData, json )

    try: sta.CheckValidity()
    except Exception as err:
        print( err.Message )
        print( err.contents )

    # temp for wind calc
    clr.AddReference('./dll/istap/WindResistance')
    from WindResistance import WindResistance, WindResistanceData
    windResistance = WindResistance()
    windResistance.data = WindResistanceData()
    windResistance.data.SetSize(inputData.nTrial);
    windResistance.data.zref = inputData.zref;
    windResistance.data.za = inputData.za;
    windResistance.data.aod = inputData.aod;
    windResistance.data.ayv = inputData.ayv;
    windResistance.data.cmc = inputData.cmc;
    windResistance.data.hbr = inputData.hbr;
    windResistance.data.hc = inputData.hc;
    windResistance.data.mu = inputData.mu;
    windResistance.data.isAveraging = inputData.isAveraging;
    windResistance.data.loa = inputData.loa;
    windResistance.data.lbp = inputData.lbp;
    windResistance.data.breadth = inputData.breadth;
    windResistance.data.axv = inputData.axv;
    windResistance.data.windProfilePowerLaw = inputData.windProfilePowerLaw;
    windResistance.data.windChartType = inputData.windChartType;
    windResistance.data.iTTCChartType = inputData.iTTCChartType;
    windResistance.data.windTunnel = inputData.windTunnel;

    for i in range( inputData.nTrial ):
        windResistance.data.vg[i] = inputData.vg[i];
        windResistance.data.psi0[i] = inputData.psi0[i];
        windResistance.data.rhoair[i] = inputData.rhoair[i];
        windResistance.data.vwr[i] = inputData.vwr[i];
        windResistance.data.psiwr[i] = inputData.psiwr[i];
    
    windResistance.CalculateWindResistance();
    
    
    try: windResistance.CalculateWindResistance()
    except Exception as err:
        e = err
        print( err.Message )
        print( err.contents )

    sta.Run()
    
    result = jsonify(vwt = sta.TrueWindVelatAH(),
                     dwt = sta.TrueWindDiratAH(),
                     vwtAve = sta.TrueWindVelatAHAve(),
                     dwtAve = sta.TrueWindDiratAHAve(),
                     vwtRef = sta.TrueWindVelatRH(),
                     vwrRef = sta.RelWindVelatRH(),
                     dwrRef = sta.RelWindDiratRH(),
                     # caa = 
                     raa = sta.ResistanceWind(),
                     wave = jsonify(rawm = sta.ResistanceSeaMotion(),
                                    rawr = sta.ResistanceSeaReflection()),
                     swell = jsonify(rawm = sta.ResistanceSwellMotion(),
                                     rawr = sta.ResistanceSwellReflection()),
                     raw = sta.ResistanceWave(),
                     ras = sta.ResistanceSeaWater(),
                     delr = sta.TotalResistance(),
                     currentCoef = sta.IterativeCoeff(),
                     currentVel = sta.CurrentVel(),
                     # stw = sta.Speed_afterCurrent() MSToKnot
                     # sta.ShallowWater(),
                     # sta.ShallowWaterRaven(),
                     pid = sta.PowerDispCorrected(), # sta.PowerDispNotCorrected()
                     stw = sta.SpeedFinal())
    
    return result # return the result to JavaScript

port = 5000
url = "http://127.0.0.1:{0}".format(port)

if __name__ == '__main__': 
    # Timer(0.5, lambda: webbrowser.open(url) ).start()
    # app.run(port=port, debug=True)
    app.run(port=port, debug=False)
