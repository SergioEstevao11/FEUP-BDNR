from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection

g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))


print(g.V().toList())