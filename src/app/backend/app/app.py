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
    royals = g.V().has_label("Royal").valueMap('id','name').to_list()
    return {'result': royals}

@app.route("/getCountries")
def getCountries():
    countries = g.V().has_label("Country").valueMap('id','name').to_list()
    return {'result': countries}

@app.route("/getCountry/<id>")
def getCountry(id):
    country = g.V().hasLabel("Country").has('id', id).valueMap().next()
    return country

@app.route("/getRoyal/<id>")
def getRoyal(id):
    royal = g.V().hasLabel("Royal").has('id', id).valueMap().next()
    return royal

@app.route("/getFatalities/<id>")
def getFatalities(id):
    return {'total_fatalities': 100}