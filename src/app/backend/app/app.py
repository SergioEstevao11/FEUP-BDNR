from flask import Flask
from flask_cors import CORS
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.traversal import P, T
from gremlin_python.process.graph_traversal import __, has
import json
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)

g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))

@app.route("/getRoyals")
def getRoyals():
    royals = g.V().hasLabel("Royals").project("id", "name").by(T.id).by("name").limit(10000).toList()
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

@app.route("/getFilteredRoyals/<id>/<filters>")
def getFilteredRoyals(id,filters):
    result = []
    filters = json.loads(filters)
    print(id)
    
    if(filters['ancestors'].get('generation') != None):
        ancestors = g.V(id).hasLabel("Royals").repeat(__.out('related_with').dedup()).times(filters['ancestors'].get('generation')).emit().hasLabel('Royals').project("id", "name", "year_birth", "year_death").by(T.id).by("name").by("year_birth").by("year_death").toList()
        for anc in ancestors: 
            anc['kinship'] = str(filters['ancestors'].get('generation')) + 'º Ancestor'
            if anc not in result: 
                result.append(anc)
    elif(filters['ancestors'].get('year') != None):
        ancestors = g.V(id).hasLabel("Royals").repeat(__.out('related_with').dedup()).until(__.has('year_birth', P.lt(str(filters['ancestors'].get('year')[0])))).emit(__.has('year_death', P.gt(str(filters['ancestors'].get('year')[1])))).valueMap().toList()
        for anc in ancestors: 
            anc['kinship'] = 'Ancestor'
            if anc not in result: 
                result.append(anc)

    if(filters['descendants'].get('generation') != None):
        descendants = g.V(id).hasLabel("Royals").repeat(__.in_('related_with').dedup()).times(filters['descendants'].get('generation')).emit().hasLabel('Royals').project("id", "name", "year_birth", "year_death",).by(T.id).by("name").by("year_birth").by("year_death").toList()
        for desc in descendants:
            desc['kinship'] = str(filters['descendants'].get('generation')) + 'º Descendant' 
            if desc not in result: 
                result.append(desc)

    elif(filters['descendants'].get('year') != None):
        descendants = g.V(id).hasLabel("Royals").repeat(__.in_('related_with').dedup()).until(__.has('year_birth', P.lt(str(filters['descendants'].get('year')[0])))).emit(__.has('year_death', P.gt(str(filters['descendants'].get('year')[1])))).valueMap().toList()
        for desc in descendants:
            desc['kinship'] = 'Descendant' 
            if desc not in result: 
                result.append(desc)

    if(filters['contemporaries'] != []):
        for contemporary in filters['contemporaries']:
            royal = g.V(contemporary['id']).hasLabel("Royals").valueMap("name", "year_birth", "year_death").toList()
            royal[0]['kinship'] = 'Contemporary'

            if royal[0] not in result: 
                result.append(royal[0])


    if(filters['siblings']):
        royal_id = g.V(id).hasLabel("Royals").values("id").toList()
        parents = g.V(id).hasLabel("Royals").out('related_with').project("id").by(T.id).toList()
        for parent in parents:
            siblings = g.V(parent['id']).hasLabel("Royals").in_('related_with').has("id", P.neq(royal_id)).valueMap("name", "year_birth", "year_death").toList()
            for sibling in siblings:
                sibling['kinship'] = 'Sibling'
                if sibling not in result: 
                    result.append(sibling)
        

    return result

@app.route("/getFilteredCountries/<id>/<filters>/")
def getFilteredCountries(id,filters):
    result = []

    filters = unquote(filters)
    filters = json.loads(filters)

    if(filters['country'] != []):
        conflict_ids = g.V(id).hasLabel("Countries").out("participated_in").values("id").toList()
        for conflict in filters['country']:
            conflicts = g.V(conflict['id']).hasLabel("Countries").out("participated_in").project("index", "id", "year", "type").by(T.id).by("id").by("year").by("type").toList()
            for conflit1 in conflicts:
               if(conflit1['id'] in conflict_ids):
                   conflit1['country'] = conflict['name']
                   conflit1['name'] = g.V(conflit1['index']).hasLabel("Conflicts").out("part_of").hasLabel("Wars").values("name").toList()

                   if(conflit1 not in result):
                        result.append(conflit1)

    if(filters['type'] != []):
        for type in filters['type']:
            conflicts = g.V(id).hasLabel("Countries").out("participated_in").has("type", type['name']).project("index", "id", "year", "type").by(T.id).by("id").by("year").by("type").toList()
            for conflit in conflicts:
                conflit['country'] = g.V(id).hasLabel("Countries").values('name').toList()
                conflit['name'] = g.V(conflit['index']).hasLabel("Conflicts").out("part_of").hasLabel("Wars").values("name").toList()
                if(conflit not in result):
                    result.append(conflit)


    if(filters['year'] != []):
        conflicts = g.V(id).hasLabel('Countries').out('participated_in').hasLabel('Conflicts').has('year', P.between(filters['year'][0],filters['year'][1])).project("index", "id", "year", "type").by(T.id).by("id").by("year").by("type").toList()
        for conflit in conflicts:
            conflit['country'] = g.V(id).hasLabel("Countries").values('name').toList()
            conflit['name'] = g.V(conflit['index']).hasLabel("Conflicts").out("part_of").hasLabel("Wars").values("name").toList()
            if(conflit not in result):
                result.append(conflit)

    return result


@app.route("/getMonarchInfo/<id>")
def getMonarchInfo(id):
    country = g.V(id).hasLabel("Royals").out("ruled").hasLabel("Countries").valueMap("name").toList()
    period = g.V(id).hasLabel("Royals").outE("ruled").valueMap().toList()

    result = {'year_end' : period[0]['year_end'], 'year_start' : period[0]['year_start'], 'country' : country[0]['name'][0]} if (country and period) else []

    return result

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
    contemporaries = g.V().hasLabel('Royals').has('year_birth', P.lte(royal['year_death'][0])).has('year_death', P.gte(royal['year_birth'][0])).dedup().project("id", "name").by(T.id).by("name").limit(500).toList()
    return contemporaries