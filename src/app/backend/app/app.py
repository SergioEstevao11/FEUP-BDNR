from flask import Flask
from flask_cors import CORS
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.traversal import P, T
from gremlin_python.process.graph_traversal import __

app = Flask(__name__)
CORS(app)

g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))

@app.route("/getRoyals")
def getRoyals():
    royals = g.V().hasLabel("Royals").project("id", "name").by(T.id).by("name").limit(2000).toList()
    return {'result': royals}

@app.route("/getCountries")
def getCountries():
    countries = g.V().has_label("Countries").project("id", "name").by(T.id).by("name").toList()
    return {'result': countries}

@app.route("/getCountry/<id>")
def getCountry(id):
    country = g.V(id).hasLabel("Countries").valueMap().next()
    return country

@app.route("/getRoyal/<id>")
def getRoyal(id):
    royal = g.V(id).hasLabel("Royals").valueMap().next()
    return royal

# TODO
@app.route("/getMonarchInfo/<id>")
def getMonarchInfo(id):
    return []

@app.route("/getFatalities/<id>")
def getFatalities(id):
    fatalities = g.V(id).hasLabel("Countries").out("participated_in").hasLabel("Conflicts").out("part_of").hasLabel("Wars").values("deaths").toList()
    return {'fatalities': sum(float(f) for f in fatalities if f )}


@app.route("/getConflictTypes")
def getConflictType():
    types = g.V().hasLabel("Conflicts").valueMap('type').dedup().toList()
    result = [{'name' : type_['type'][0] } for type_ in types]
    return result

@app.route("/getContemporaries/<id>")
def getContemporaries(id):
    royal = g.V(id).hasLabel("Royals").valueMap().next()
    contemporaries = g.V().hasLabel('Royals').has('year_birth', P.lte(royal['year_death'][0])).has('year_death', P.gte(royal['year_birth'][0])).dedup().valueMap('name', 'id').limit(500).toList()
    return contemporaries