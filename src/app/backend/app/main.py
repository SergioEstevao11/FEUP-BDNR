from fastapi import FastAPI
from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.strategies import *
from gremlin_python.process.traversal import T
import time
import nest_asyncio






def init_g():
    g = None
    for _ in range(60):
        if g:
            break
        try:
            g = traversal().with_remote(DriverRemoteConnection(
                'ws://janusgraph:8182/gremlin', 'g'))
        except Exception as e:
            print("Could not connect to JanusGraph")
            print(e)
        finally:
            time.sleep(1)
    return g


g=init_g()

app = FastAPI()




@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/getRoyals")
async def getRoyal():
    
    g.V().toList()
    return {"royals": "royals"}





