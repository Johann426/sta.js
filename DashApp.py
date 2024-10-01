from dash import Dash, html, dash_table, dcc, callback
from dash import Input, Output
import pandas as pd
import plotly.express as px

# table data
# particular_table1 = pd.Series( index=["LPP (m)", "B (m)", "S (m²)", "AX (m²)", "Za (m)", "Zref (m)", "CB", "AM (m²)"])

class Particulars:
    def __init__(self):
        self.textInput = 1
        self.tables = [
            {
                "Key": pd.Series(["LPP (m)", "B (m)", "S (m²)", "AX (m²)", "Za (m)", "Zref (m)", "CB", "AM (m²)"]),
                "value": pd.Series(),
            },
            {
                "Key": pd.Series(["MCR Load", "NCR Load", "EEDI Load"]),
                "Power (kW)": pd.Series(),
                "RPM": pd.Series(),
            },
            {
                "Key": pd.Series(["Speed (knots)", "Target power (kW)"]),
                "value": pd.Series(),
            },
            {
                "Key": pd.Series(["Draft F.P. (m)", "Draft A.P. (m)", "∇ (m³)", "Ts (°C)", "ρs (kg/m3)", "Tair (°C)", "ρair (kg/m3)" ]),
                "value": pd.Series(),
            },
        ]

particular = Particulars()
# df = pd.DataFrame(particular.tables[0])
dt = []
for table in particular.tables:
    df = pd.DataFrame(table)
    dt.append( dash_table.DataTable(data=df.to_dict('records'), page_size=10) ) 

# Initialize the app
app = Dash()

# App layout
app.layout = [
    html.H1(children='Particular'),
    # html.Div(children='Div'),
    # html.Hr(),
    # dcc.RadioItems(options=['ISO 15016:2002', 'ISO 15016:2015', 'ITTC 2017', 'ITTC2021'], value='ISO 15016:2015', id='guideline'),
    html.Div(className='table', children=dt),
    html.Div(className='figure', children=[
        dcc.Graph(figure={}, id='figure')
    ]),
]

if __name__ == '__main__':
    app.run(debug=True)
