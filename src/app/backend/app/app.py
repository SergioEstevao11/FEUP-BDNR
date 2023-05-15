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
    royals = g.V().has_label("Royals").valueMap('id','name').limit(2000).toList()
    return {'result': royals}

@app.route("/getCountries")
def getCountries():
    countries = g.V().has_label("Countries").valueMap('id','name').toList()
    return {'result': countries}

@app.route("/getCountry/<id>")
def getCountry(id):
    country = g.V().hasLabel("Countries").has('id', id).valueMap().next()
    return country

@app.route("/getRoyal/<id>")
def getRoyal(id):
    royal = g.V().hasLabel("Royals").has('id', id).valueMap().next()
    print(royal)
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
    royal = g.V().hasLabel("Royals").has('id', id).valueMap().next()
    contemporaries = g.V().hasLabel('Royals').has('year_birth', P.lte(royal['year_death'][0])).has('year_death', P.gte(royal['year_birth'][0])).dedup().valueMap('name', 'id').toList()
    return contemporaries