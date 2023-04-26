from fastapi import FastAPI
# from gremlin_python.process.anonymous_traversal import traversal
# from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
# from gremlin_python.process.graph_traversal import __
# from gremlin_python.process.strategies import *
# from gremlin_python.process.traversal import T

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}