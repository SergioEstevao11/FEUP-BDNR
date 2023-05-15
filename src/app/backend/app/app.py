from flask import Flask
from flask_cors import CORS
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.traversal import P

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

@app.route("/getConflictCountries/<id>")
def getConflictCountries(id):
    return []

@app.route("/getConflictType/<id>")
def getConflictType(id):
    return []

@app.route("/getContemporaries/<id>")
def getContemporaries(id):
    royal = g.V().hasLabel("Royal").has('id', id).valueMap().next()
    contemporaries = g.V().hasLabel('Royal').has('year_birth', P.lte(royal['year_death'][0])).has('year_death', P.gte(royal['year_birth'][0])).dedup().valueMap('name', 'id').toList()
    print(contemporaries)
    return contemporaries