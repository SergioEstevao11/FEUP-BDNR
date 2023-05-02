from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
import pandas as pd
from progress.bar import Bar


def upload_vertices(data_frame, graph, label):
    vertices = []
    for i,row in data_frame.iterrows():
        vertex = graph.addV(label)
        for col in data_frame.columns:
            vertex = vertex.property(col,row[col])
            
        vertices.append((row['id'], vertex.next()))
    return vertices

def find_vertex(vertices, id):
    
    for vertex in vertices:
        if vertex[0] == id:
            return vertex
    return None

def upload_edges(data_frame, col_in, verts_in, col_out, verts_out, g, label,property):
    edges = []
    bar = Bar(label, max=data_frame.shape[0])
    for i, row in data_frame.iterrows():
        
        bar.next()
        id_in = row[col_in]
        id_out = row[col_out]
        vertex_in = find_vertex(verts_in,id_in)
        vertex_out = find_vertex(verts_out,id_out)

        

        if(vertex_in is None or vertex_out is None):
            continue

        edge = g.addE(label).from_(vertex_out[1]).to(vertex_in[1])

        for col in data_frame.columns:

            if(property != None):
                edge = edge.property(property)
            
            else:

                if col in (col_in, col_out) or pd.isna(row[col]):
                    continue
                edge = edge.property(col,row[col])
        print(edge)

        edges.append(edge.next())
        print(edges)
    bar.finish()
    return edges


def main():

    royals = pd.read_csv('../../data/processed_data/royals_processed.csv')
    countries = pd.read_csv('../../data/processed_data/countries_processed.csv')
    related_with = pd.read_csv('../../data/processed_data/related_with_processed.csv')

    ruled = pd.read_csv('../../data/processed_data/ruled_processed.csv')


    g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))
    
    royals = upload_vertices(royals,g,"royals")

    countries = upload_vertices(countries,g,"Countries")

    fathers = upload_edges(related_with,"father",royals,"child",royals,g,"related_with","father")

    ruled = upload_edges(ruled,"person_id",royals,"country_id",countries,g,"ruled",None)

    print(g.V().toList())

    

if __name__ == '__main__':
    main()