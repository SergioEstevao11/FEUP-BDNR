from gremlin_python.process.anonymous_traversal import traversal
from gremlin_python.driver.driver_remote_connection import DriverRemoteConnection
import pandas as pd
from progress.bar import Bar


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

def upload_edges(data_frame, col_in, verts_in, col_out, verts_out, g, label,property_name,property):
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
                edge = edge.property(property_name,property)
            
            else:

                if col in (col_in, col_out) or pd.isna(row[col]):
                    continue
                edge = edge.property(col,row[col])
            

        edges.append(edge)
        
    
    bar.finish()
    return edges


def main():

    royals = pd.read_csv('../../data/processed_data/royals_processed.csv')
    countries = pd.read_csv('../../data/processed_data/countries_processed.csv')
    related_with = pd.read_csv('../../data/processed_data/related_with_processed.csv')
    conflicts = pd.read_csv('../../data/processed_data/conflicts_processed.csv')
    wars = pd.read_csv('../../data/processed_data/wars_processed.csv')

    ruled = pd.read_csv('../../data/processed_data/ruled_processed.csv')
    participated_in = pd.read_csv('../../data/processed_data/participated_in_processed.csv')
    part_of = pd.read_csv('../../data/processed_data/part_of_processed.csv')


    g = traversal().with_remote(DriverRemoteConnection(
        'ws://127.0.0.1:8182/gremlin', 'g'))


    print(g.V().toList())
    
    royals = upload_vertices(royals,g,"Royals")

    countries = upload_vertices(countries,g,"Countries")

    wars = upload_vertices(wars,g,"Wars")

    conflicts = upload_vertices(conflicts,g,"Conflicts")

    fathers = upload_edges(related_with,"child",royals,"father",royals,g,"related_with","type","father")
    mothers = upload_edges(related_with,"child",royals,"mother",royals,g,"related_with","type","mother")

    ruled = upload_edges(ruled,"person_id",royals,"country_id",countries,g,"ruled",None,None)

    participated_in = upload_edges(participated_in,'country_id',countries,'conflict_id',conflicts,g,"participated_in",None,None)

    part_of = upload_edges(part_of,'conflict_id',conflicts,'war_id',wars,g,"part_of",None,None)

    

    print(g.V().toList())
    

    

if __name__ == '__main__':
    main()