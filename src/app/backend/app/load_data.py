from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
from gremlin_python.process.graph_traversal import __
from gremlin_python.process.strategies import *
from gremlin_python.process.traversal import T
import pandas as pd
from progress.bar import Bar
import sys
import time



def upload_vertices(data_frame, graph, label):
    vertices = []
    bar = Bar(label, max=data_frame.shape[0])
    for i,row in data_frame.iterrows():
        bar.next()
        vertex = graph.addV(label)
        for col in data_frame.columns:
            vertex = vertex.property(col,row[col])
            
        vertices.append((row['id'], vertex.next()))
    bar.finish()
    return vertices

def find_vertex(vertices, id):
    
    for vertex in vertices:
        if vertex[0] == id:
            return vertex
    return None

def upload_edges(data_frame, col_out, verts_out, col_in, verts_in, g, label,property_name,property):
    edges = []
    # bar = Bar(label, max=data_frame.shape[0])
    for i, row in data_frame.iterrows():
        
        # bar.next()
        id_in = row[col_in]
        id_out = row[col_out]

        vertex_in = find_vertex(verts_in,id_in)
        print(vertex_in)
        vertex_out = find_vertex(verts_out,id_out)
        print(vertex_out)

        if(vertex_in is None or vertex_out is None):
            continue
        print("here")
        #edge = g.addE(label).from_(vertex_out[1]).to(vertex_in[1])
        edge = g.V(vertex_out[1]).addE(label).to(vertex_in[1])

        if(property != None):
                        edge = edge.property(property_name,property)

        for col in data_frame.columns:

            if col in [col_in, col_out] or pd.isna(row[col]):
                continue
            else:
                edge = edge.property(col,row[col].item())

        edges.append(edge.iterate())
        
    
    # bar.finish()
    return edges


def main():

    royals = pd.read_csv('../processed_data/royals_processed.csv', na_values=[float('nan')], keep_default_na=False)
    countries = pd.read_csv('../processed_data/countries_processed.csv', na_values=[float('nan')], keep_default_na=False)
    related_with = pd.read_csv('../processed_data/related_with_processed.csv', na_values=[float('nan')], keep_default_na=False)
    conflicts = pd.read_csv('../processed_data/conflicts_processed.csv', na_values=[float('nan')], keep_default_na=False)
    wars = pd.read_csv('../processed_data/wars_processed.csv', na_values=[float('nan')], keep_default_na=False)
    ruled = pd.read_csv('../processed_data/ruled_processed.csv', na_values=[float('nan')], keep_default_na=False)
    participated_in = pd.read_csv('../processed_data/participated_in_processed.csv', na_values=[float('nan')], keep_default_na=False)
    part_of = pd.read_csv('../processed_data/part_of_processed.csv', na_values=[float('nan')], keep_default_na=False)

    try:
        g = traversal().with_remote(DriverRemoteConnection(
            'ws://127.0.0.1:8182/gremlin', 'g'))
    except Exception:
         print("[ERROR] JanusGraph unavailable - cancelling data load")
         sys.exit(1)
    time.sleep(1)
    g.V().drop().iterate()
    print(g.V().toList())
    
    royals = upload_vertices(royals,g,"Royals")

    fathers = upload_edges(related_with,"child",royals,"father",royals,g,"related_with","type","father")
    mothers = upload_edges(related_with,"child",royals,"mother",royals,g,"related_with","type","mother")

    countries = upload_vertices(countries,g,"Countries")
    wars = upload_vertices(wars,g,"Wars")
    conflicts = upload_vertices(conflicts,g,"Conflicts")

    ruled = upload_edges(ruled,"person_id",royals,"country_id",countries,g,"ruled",None,None)
    participated_in = upload_edges(participated_in,'country_id',countries,'conflict_id',conflicts,g,"participated_in",None,None)
    part_of = upload_edges(part_of,'conflict_id',conflicts,'war_id',wars,g,"part_of",None,None)
    

    print('MOTHERS')
    print(mothers != [])

    print('FATHERS')
    print(fathers != [])

if __name__ == '__main__':
    main()