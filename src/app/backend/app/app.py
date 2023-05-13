from flask import Flask
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

app = Flask(__name__)

g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))

@app.route("/getRoyals")
def getRoyals():
    royals = g.V().has_label("Royals").valueMap('dinasty','name','year_death','year_birth').to_list()
    return {'royals': royals}