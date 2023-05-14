from flask import Flask
from flask_cors import CORS
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

app = Flask(__name__)
CORS(app)

g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))

@app.route("/getRoyals")
def getRoyals():
    royals = g.V().has_label("Royals").valueMap('id','name').to_list()
    return {'result': royals}

@app.route("/getCountries")
def getCountries():
    countries = g.V().has_label("Countries").valueMap('id','name').to_list()
    return {'result': countries}